/**
 * 签收界面
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    DeviceEventEmitter,
    Platform,
    Alert
} from 'react-native';

import ProductInfoView from '../../components/driverOrder/SignProductInfoView';
import NavigationBar from '../../components/common/navigatorbar';
import {SignInAction} from '../../action/order';
import * as API from '../../constants/api';
import Storage from '../../utils/storage';
import computationUtil from '../../utils/computationUtil';
import prventDoubleClickUtil from '../../utils/prventMultiClickUtil';
import * as StaticColor from '../../constants/colors';
import Toast from '@remobile/react-native-toast';
import BottomButton from '../../components/driverOrder/bottomButtonComponent';
import {fetchData} from '../../action/app';
import * as RouteType from '../../constants/routeType';

let userID = '';
let userName = '';
const {height} = Dimensions.get('window');

import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import * as ConstValue from '../../constants/constValue';
import StorageKey from '../../constants/storageKeys';

let currentTime = 0;
let lastTime = 0;
let locationData = '';

class signPage extends Component {
    constructor(props) {
        super(props);
        // 得到上一级传过来的值，把值放进state中，this.state.xxx取值
        const params = this.props.navigation.state.params;

        this.state = {
            products: params.goodsInfoList,
            orderID: params.transCode,
            receiptWay: params.taskInfo.receiptWay,
        };
        this.productInfo = this.productInfo.bind(this);
        this.getSignIn = this.getSignIn.bind(this);
        this.getSignInSuccessCallBack = this.getSignInSuccessCallBack.bind(this);
        this.getSignInFailCallBack = this.getSignInFailCallBack.bind(this);
        this.deleteComponent = this.deleteComponent.bind(this);
    }

    componentDidMount() {
        this.getCurrentPosition();
        Storage.get(StorageKey.USER_INFO).then((userInfo) => {
            if(userInfo) {
                userID = userInfo.userId;
                userName = userInfo.userName;
            }
        });
    }

    componentWillUnmount() {
        this.setState({
            products: null,
            orderID: null,
        });
    }

    // 获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then(data => {
            console.log('position =',JSON.stringify(data));
            locationData = data;
        }).catch(e =>{
            console.log(e, 'error');
        });
    }

    // 签收
    getSignIn() {
        // 传递参数
        const datas = [];
        for (let i = 0; i < this.state.products.length; i++) {
            const obj = this.state.products[i];
            if (obj.refuseNum === null || obj.refuseNum === '0' || !obj.refuseNum || obj.signNum === null || !obj.signNum) {
                datas.push(
                    {
                        goodsId: obj.goodsId,
                        goodsName: obj.goodsName,
                        goodsSpce: obj.goodsSpce,
                        arNums: obj.arNums,
                        signNum: obj.shipmentNum,
                        shipmentNum: obj.shipmentNum,
                        refuseNum: '0',
                        goodsUnit: obj.goodsUnit,
                        refuseReason: '',
                    },
                );
            } else {
                datas.push(
                    {
                        goodsId: obj.goodsId,
                        goodsName: obj.goodsName,
                        goodsSpce: obj.goodsSpce,
                        arNums: obj.arNums,
                        signNum: obj.signNum,
                        shipmentNum: obj.shipmentNum,
                        refuseNum: obj.refuseNum,
                        refuseDetailDtoList: obj.refuseDetailDtoList,
                        goodsUnit: obj.goodsUnit,
                        refuseReason: obj.refuseReason,
                    },
                );
            }
        }
        // 获取签收需要上传的数据格式
        const goodsInfo = [];
        for (let i = 0; i < this.state.products.length; i++) {
            const productInfo = this.state.products[i];
            if (productInfo.refuseDetailDtoList) {
                goodsInfo.push({
                    goodsId: productInfo.goodsId,
                    signNum: productInfo.signNum ? productInfo.signNum : productInfo.shipmentNum,
                    refuseNum: productInfo.refuseNum,
                    refuseDetail: productInfo.refuseDetailDtoList,
                    paasLineNo: productInfo.paasLineNo, // 货品行号
                });
            } else {
                goodsInfo.push({
                    goodsId: productInfo.goodsId,
                    signNum: productInfo.signNum ? productInfo.signNum : productInfo.shipmentNum,
                    refuseNum: productInfo.refuseNum,
                    paasLineNo: productInfo.paasLineNo, // 货品行号
                });
            }
        }
        console.log('goodsInfo:'+JSON.stringify(goodsInfo));
        currentTime = new Date().getTime();
        this.props._signIn({
            userId: userID,
            userName,
            transCode: this.state.orderID,
            goodsInfo,
            lan: locationData.latitude ? locationData.latitude : '',
            lon: locationData.longitude ? locationData.longitude : '',
            realTimeAddress: locationData.address ? locationData.address : ''
        }, (responseData) => {
            this.getSignInSuccessCallBack();
        }, () => {
            this.getSignInFailCallBack();
        })
    }


    // 获取数据成功回调
    getSignInSuccessCallBack() {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('签收', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '签收页面');
        if (this.state.receiptWay !== '不回单') {
            this.props.navigation.dispatch({
                type: RouteType.ROUTE_SIGN_SUCCESS_PAGE,
                params: {
                    receiptWay: this.state.receiptWay,
                    orderID: this.state.orderID,
                }
            });
        }else {
            this.props._refreshOrderList(2);
            this.props.navigation.dispatch({type: 'pop', key: 'Main'});
        }
    }

    // 获取数据失败回调
    getSignInFailCallBack() {
        Toast.showShortCenter('签收失败!');
    }

    deleteComponent(componentID ,index , numbers){
        console.log('number:'+JSON.stringify(numbers));
        this.productInfo(componentID,index,numbers);
    }

    productInfo(proID, index, number) {

        console.log('number:'+JSON.stringify(number));
        let refuseNumber = 0;
        let refuseDetailDtoList = [];
        // 遍历得到拒收的总数  refuseType-拒收类型（1-解冻，2-损坏，3-收货方拒收）


        for (let i = 0; i < number.length; i++) {

            let aaaa = number[i];

            if (number[i].reason === '收货方拒收') {

                if (number[i].num === 0){
                }else {
                    const obj = {detailNum: number[i].num, refuseType: '3'};
                    refuseDetailDtoList.push(obj);
                }
            } else if (number[i].reason === '损坏') {

                if (number[i].num === 0){
                }else {
                    const obj = {detailNum: number[i].num, refuseType: '2'};
                    refuseDetailDtoList.push(obj);
                }
            } else if (number[i].reason === '解冻') {

                if (number[i].num === 0){
                }else {
                    const obj = {detailNum: number[i].num, refuseType: '1'};
                    refuseDetailDtoList.push(obj);
                }
            }
            refuseNumber += parseInt(number[i].num);
        }
        let refuseDetailDtoList1=[];
        let num1=[];
        let num2=[];
        let num3=[];
        for (let i=0;i<refuseDetailDtoList.length;i++){
            const obj=refuseDetailDtoList[i];
            if (obj.refuseType === '1'){
                num1.push(obj.detailNum);
            }
            if (obj.refuseType === '2'){
                num2.push(obj.detailNum);
            }
            if (obj.refuseType === '3'){
                num3.push(obj.detailNum);
            }
        }

        console.log('num1:'+JSON.stringify(num1));
        console.log('num2:'+JSON.stringify(num2));
        console.log('num3:'+JSON.stringify(num3));

        if (num1.length === 0){
        }else {
            let number = 0;
            for (let i=0;i<num1.length;i++) {
                number = number + num1[i];
            }
            const obj = {detailNum: number, refuseType: '1'};
            refuseDetailDtoList1.push(obj);
        }
        if (num2.length === 0){
        }else {
            let number = 0;
            for (let i=0;i<num2.length;i++) {
                number = number + num2[i];
            }
            const obj = {detailNum: number, refuseType: '2'};
            refuseDetailDtoList1.push(obj);
        }
        if (num3.length === 0){
        }else {
            let number = 0;
            for (let i=0;i<num3.length;i++) {
                number = number + num3[i];
            }
            const obj = {detailNum: number, refuseType: '3'};
            refuseDetailDtoList1.push(obj);
        }


        refuseDetailDtoList = refuseDetailDtoList1;
        const array = this.state.products;
        console.log('=====array', array);
        // 取出对应的item
        const item = array[index];
        // 改变签收的值
        //const getnumber = parseFloat(item.shipmentNum) - parseFloat(refuseNumber);
        const a1 = parseFloat(item.shipmentNum);
        const a2 = parseFloat(refuseNumber);
        const getnumber = computationUtil.accSub(a1,a2);

        if (getnumber === 0) {
            array[index] = {
                goodsId: item.goodsId,
                goodsName: item.goodsName,
                goodsSpce: item.goodsSpce,
                arNums: item.arNums && item.arNums !== '' &&  item.arNums !== '0' ? item.arNums : item.weight,
                signNum: '0',
                shipmentNum: item.shipmentNum,
                refuseNum: item.shipmentNum, // 等于0为全部发运的拒收
                refuseDetailDtoList,
                goodsUnit: item.arNums && item.arNums !== '' &&  item.arNums !== '0' ? item.goodsUnit : 'Kg',
                refuseReason: item.refuseReason,
            };
        }else if (refuseNumber === 0) {
            array[index] = {
                goodsId: item.goodsId,
                goodsName: item.goodsName,
                goodsSpce: item.goodsSpce,
                arNums: item.arNums && item.arNums !== '' &&  item.arNums !== '0' ? item.arNums : item.weight,
                signNum: item.shipmentNum,
                shipmentNum: item.shipmentNum,
                refuseNum: '0',
                goodsUnit: item.arNums && item.arNums !== '' &&  item.arNums !== '0' ? item.goodsUnit : 'Kg',
                refuseReason: item.refuseReason,
            };
        }
        else if (refuseNumber > item.shipmentNum) {
            return;
        } else {
            array[index] = {
                goodsId: item.goodsId,
                goodsName: item.goodsName,
                goodsSpce: item.goodsSpce,
                arNums: item.arNums && item.arNums !== '' &&  item.arNums !== '0' ? item.arNums : item.weight,
                signNum: getnumber.toString(),
                shipmentNum: item.shipmentNum,
                refuseNum: refuseNumber.toString(),
                refuseDetailDtoList,
                goodsUnit: item.arNums && item.arNums !== '' &&  item.arNums !== '0' ? item.goodsUnit : 'Kg',
                refuseReason: item.refuseReason,
                paasLineNo: item.paasLineNo,
            };
        }

        // 更新state里面的数据
        this.setState({
            products: array,
        });

    }

    render() {
        const navigator = this.props.navigation;
        return (
            <View style={{backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND}}>
                <NavigationBar
                    title={'签收'}
                    router={navigator}
                    hiddenBackIcon={false}
                />

                <ScrollView keyboardDismissMode="on-drag" style={{
                    marginBottom: 0,
                     ...Platform.select({
                        ios:{height: height - ConstValue.NavigationBar_StatusBar_Height - 45},
                        android:{height: height - 73 - 45}
                     })

                }}>
                    <View style={{height: 10, backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND}}/>
                    {
                        this.state.products.map((item, indexRow) => {
                            return (
                                <View key={indexRow}>
                                    <ProductInfoView
                                        key={indexRow}
                                        indexRow={indexRow}
                                        productID={item.goodsId}
                                        title={item.goodsName}
                                        Specifications={item.goodsSpce}
                                        arNums={item.arNums && item.arNums !== '' &&  item.arNums !== '0' ? item.arNums : item.weight} // 应收
                                        shipmentNum={item.shipmentNum} // 发运
                                        getNum={!item.refuseNum || item.refuseNum == 0 ? item.shipmentNum : item.signNum} // 默认等于发运 item.signNum
                                        refuseNum={item.refuseNum ? item.refuseNum : 0} // 拒收
                                        goodsUnit={item.arNums && item.arNums !== '' &&  item.arNums !== '0' ? item.goodsUnit : 'Kg'} // 单位
                                        sendValueCallBack={(proID, _index, number) => {
                                            this.productInfo(proID, _index, number);
                                        }}
                                        deleteComponent={(componentID, _index , numbers)=>{
                                            this.deleteComponent(componentID, _index, numbers);
                                        }}
                                    />
                                    <View style={{height: 10, backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND}}/>
                                </View>
                            );
                        })
                    }
                </ScrollView>
                <BottomButton
                    text={'提交'}
                    onClick={() => {
                        if (prventDoubleClickUtil.onMultiClick()) {
                            this.getSignIn();
                        }
                    }}
                />
            </View>
        );
    }

}


function mapStateToProps(state) {
    return {
        routes: state.nav.routes,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        _signIn: (params, callBack, failCallBack) => {
            dispatch(fetchData({
                body: params,
                showLoading: true,
                api: API.API_NEW_SIGN,
                success: data => {
                    console.log('sign in success ',data);
                    callBack && callBack(data)
                },
                fail: error => {
                    console.log('???', error);
                    failCallBack && failCallBack()
                }
            }))
        }
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(signPage);
