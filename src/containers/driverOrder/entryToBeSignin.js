import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Dimensions,
    DeviceEventEmitter,
    Alert,
} from 'react-native';

import NavigationBar from '../../components/common/navigatorbar';
import EntryToBeSignIn from './orderToBeSignInDetail';
import EntryToBeSure from './orderToBeSureDetail';
import EntryToBeWaitSure from './orderToBeWaitSureDetail';
import * as API from '../../constants/api';
import * as RouteType from '../../constants/routeType';
import Storage from '../../utils/storage';
import Toast from '@remobile/react-native-toast';
import ImageViewer from 'react-native-image-zoom-viewer';
import StorageKey from '../../constants/storageKeys';
import * as StaticColor from '../../constants/colors';
import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import {fetchData} from '../../action/app';

let userID = '';
let userName = '';
let currentTime = 0;
let lastTime = 0;
let locationData = '';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    count: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 38,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    countText: {
        color: 'white',
        fontSize: 16,
        backgroundColor: 'transparent',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: {
            width: 0,
            height: 0.5
        },
        textShadowRadius: 0
    },
    text: {
        marginLeft: 10,
        fontSize: 16,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        paddingBottom: 14,
        paddingTop: 14,

    },
    carrierView: {
        flexDirection: 'row',
        backgroundColor: StaticColor.WHITE_COLOR,
        alignItems: 'center'
    },
    rightButton: {
        fontSize: 16,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
    }

});

class entryToBeSignin extends Component {

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.state = {
            datas: [],
            current: 1,
            transOrderList: params.transOrderList,
            isShowRightButton: false,
            showImages: [],
            carrierName: params.carrierName,
            carrierPlateNum: params.carrierPlateNum,
        };
        this.onScrollEnd = this.onScrollEnd.bind(this);
        this.getOrderDetailInfo = this.getOrderDetailInfo.bind(this);
        this.sendOderFailCallBack = this.sendOderFailCallBack.bind(this);
        this.sendOderSuccessCallBack = this.sendOderSuccessCallBack.bind(this);
        this.jumpAddressPage = this.jumpAddressPage.bind(this);
        this.receiptPhoto = this.receiptPhoto.bind(this);
        this.renderTitle = this.renderTitle.bind(this);

        this.getOrderPictureList = this.getOrderPictureList.bind(this);
        this.getOrderPictureSuccessCallBack = this.getOrderPictureSuccessCallBack.bind(this);

    }

    componentDidMount() {
        this.getCurrentPosition();
        this.getOrderDetailInfo();
        Storage.get(StorageKey.USER_INFO).then((userInfo) => {
            if(userInfo) {
                userID = userInfo.userId;
                userName = userInfo.userName;
            }
        });
        DeviceEventEmitter.addListener('changeStateReceipt',() => {
            this.props.navigation.goBack();
        });
        this.listener = DeviceEventEmitter.addListener('refreshDetails',() => {
            this.getOrderDetailInfo();
        });
        // // 返回上一级
        // this.listener1 = DeviceEventEmitter.addListener('changeStateReceipt', () => {
        //     this.props.navigator.pop();
        // });
    }

    componentWillUnmount() {
        this.timeout && clearTimeout(this.timeout);
        this.listener.remove();
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
    onScrollEnd(event) {
        // 得出滚动的位置
        const index = event.nativeEvent.contentOffset.x / screenWidth + 1;

        if (index < 1 || index > this.state.datas.length) {
            return;
        }
        this.setState({
            current: parseInt(index),
        });

        let position  = parseInt(index) - 1;
        this.renderTitle(position, this.state.datas);
    }

    renderTitle (index, array) {
        if (array[index].transOrderStatsu === '5' && array[index].isEndDistribution === 'Y'){
            // || (array[index].isEndDistribution === 'N' && array[index].statusCode === '32')
            // || (array[index].isEndDistribution === 'N' && array[index].statusCode === '34')
            // || (array[index].isEndDistribution === 'N' && array[index].statusCode === '38')
            // || (array[index].isEndDistribution === 'N' && array[index].statusCode === '40')) {
            this.setState({
                isShowRightButton: true
            });
        }else {
            this.setState({
                isShowRightButton: false
            });
        }
    }

    getSignIn(orderID){
        currentTime = new Date().getTime();
        this.props._signIn({
            userId: userID,
            userName,
            transCode: orderID,
            goodsInfo: null,
            lan: locationData.latitude ? locationData.latitude : '',
            lon: locationData.longitude ? locationData.longitude : '',
            realTimeAddress: locationData.address ? locationData.address : ''
        }, (responseData) => {
            this.getSignInSuccessCallBack(responseData.result);
        }, () => {
            this.getSignInFailCallBack();
        })
    }

    // 获取数据成功回调
    getSignInSuccessCallBack() {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('签收', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '签收页面');
        // DeviceEventEmitter.emit('changeToWaitSign');
        this.props.navigation.goBack();
    }

    // 获取数据失败回调
    getSignInFailCallBack() {
        Toast.showShortCenter('签收失败!');
    }

    /*
     * 获取列表详情调用接口
     *
     */

    getOrderDetailInfo() {
        currentTime = new Date().getTime();
        this.props._getOrderDetail({
            transCodeList: this.state.transOrderList,
            plateNumber: '京LPL001'
            // plateNumber: this.props.plateNumber
        }, (responseData) => {
            this.sendOderSuccessCallBack(responseData);
        })
    }
    // 获取数据成功回调
    sendOderSuccessCallBack(result) {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('获取订单详情', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '待签收订单详情页面');
        const array = [];
        for (let i = 0; i < result.length; i++) {
            const obj = result[i];
            array.push(obj);
        }
        this.setState({
            datas: array,
        });
        this.renderTitle(0, array);
    }
    // 获取数据失败回调
    sendOderFailCallBack() {
        Toast.showShortCenter('获取订单详情失败!');
    }

    jumpAddressPage(index, type, item) {
        let typeString = '';
        if (type === 'departure') {
            // 发货方
            typeString = 'send';
        } else {
            // 收货方
            typeString = 'receiver';
        }

        this.props.navigation.navigate(
            'BaiduMap',
            {
                sendAddr: item.deliveryInfo.departureAddress,
                receiveAddr: item.deliveryInfo.receiveAddress,
                clickFlag: typeString,
            },
        );
    }
    // 回单照片
    receiptPhoto(){
        this.getOrderPictureList();
    }

    getOrderPictureList() {
        currentTime = new Date().getTime();
        let transCode = this.state.datas[this.state.current-1].transCode;
        if(transCode.indexOf('-') > -1){
            transCode = transCode.split('-')[0];
        }
        console.log('transCode==',transCode);
        this.props._getOrderPictureInfo({
            refNo: transCode,
        }, (result) => {
            this.getOrderPictureSuccessCallBack(result);
        })
    }

    getOrderPictureSuccessCallBack(result) {
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('获取回单照片',locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '回单照片页面');
        if (result) {
            if (result.urlList && result.urlList.length !== 0) {

                this.setState({
                    showImages : result.urlList.map(i => {
                        console.log('received image', i);
                        return {url: i ? i : ''};
                    }),
                });
            }else{
                Toast.showShortCenter('暂无回单照片');
            }
        }
    }


    render() {
        const navigator = this.props.navigation;
        console.log('this.state.datas=====',this.state.datas);
        const subOrderPage = this.state.datas.map((item, index) => {
            if (item.transOrderStatsu === '5' && item.isEndDistribution === 'Y'
                || (item.isEndDistribution === 'N' && item.arriveFlag === true)) { // 已回单5
                return (
                    <EntryToBeSure
                        key={index}
                        style={{ overflow: 'hidden' }}
                        deliveryInfo={item.deliveryInfo}
                        goodsInfoList={item.goodsInfo}
                        taskInfo={item.taskInfo}
                        time={item.time}
                        transCode={item.transCode}
                        customerOrderCode={item.customerOrderCode}
                        transOrderStatus={item.transOrderStatsu}
                        transOrderType={item.transOrderType}
                        vol={item.vol}
                        weight={item.weight}
                        signer={item.signer}
                        signTime={item.signTime}
                        scheduleTime={item.scheduleTime}
                        scheduleTimeAgain={item.twoScheduleTime}
                        dispatchTime={item.dispatchTime}
                        dispatchTimeAgain={item.twoDispatchTime}
                        receiveTime={item.receiveTime}
                        isEndDistribution={item.isEndDistribution}
                        index={index}
                        addressMapSelect={(indexRow, type) => {
                            this.jumpAddressPage(indexRow, type, item);
                        }}
                    />
                );
            }

            if (item.transOrderStatsu === '4' && item.isEndDistribution === 'Y') { // 待回单4
                return (
                    <EntryToBeWaitSure
                        {...this.props}
                        key={index}
                        style={{ overflow: 'hidden' }}
                        deliveryInfo={item.deliveryInfo}
                        goodsInfoList={item.goodsInfo}
                        taskInfo={item.taskInfo}
                        time={item.time}
                        transCode={item.transCode}
                        customerOrderCode={item.customerOrderCode}
                        transOrderStatus={item.transOrderStatsu}
                        transOrderType={item.transOrderType}
                        vol={item.vol}
                        weight={item.weight}
                        signer={item.signer}
                        signTime={item.signTime}
                        scheduleTime={item.scheduleTime}
                        scheduleTimeAgain={item.twoScheduleTime}
                        dispatchTime={item.dispatchTime}
                        dispatchTimeAgain={item.twoDispatchTime}
                        isEndDistribution={item.isEndDistribution}
                        index={index}
                        addressMapSelect={(indexRow, type) => {
                            this.jumpAddressPage(indexRow, type, item);
                        }}
                        recepitSuccess={()=>{
                            //this.props.navigator.pop();
                        }}
                    />
                );
            }

            if (item.transOrderStatsu === '3' && item.isEndDistribution === 'Y'
            || (item.isEndDistribution === 'N' && item.arriveFlag === false)) { // 待签收3
                return (
                    <EntryToBeSignIn
                        key={index}
                        style={{ overflow: 'hidden' }}
                        deliveryInfo={item.deliveryInfo}
                        goodsInfoList={item.goodsInfo}
                        taskInfo={item.taskInfo}
                        time={item.time}
                        transCode={item.transCode}
                        customerOrderCode={item.customerOrderCode}
                        transOrderStatus={item.transOrderStatsu}
                        transOrderType={item.transOrderType}
                        vol={item.vol}
                        weight={item.weight}
                        settlementMode={item.settleType} // 结算方式：10 按单结费 20 按车结费
                        settleMethod={item.settleMethod} // 结费方式；10 现金 20 到付 30 回付 40 月付
                        scheduleTime={item.scheduleTime}
                        scheduleTimeAgain={item.twoScheduleTime}
                        dispatchTime={item.dispatchTime}
                        dispatchTimeAgain={item.twoDispatchTime}
                        isEndDistribution={item.isEndDistribution}
                        payState={item.payState} // 付款状态：0 未付款 1 已付款
                        amount={item.amount}
                        index={index}
                        currentStatus={this.props.currentStatus}
                        addressMapSelect={(indexRow, type) => {
                            this.jumpAddressPage(indexRow, type, item);
                        }}
                        signIn={() => {
                            if(item.taskInfo) {
                                // 跳转到具体的签收页面
                                this.props.navigation.dispatch({
                                    type: RouteType.ROUTE_SIGN_IN_PAGE,
                                    params: {
                                        transCode: item.transCode,
                                        goodsInfoList: item.goodsInfo,
                                        taskInfo: item.taskInfo,
                                    }
                                })
                            }else {
                                this.getSignIn(item.transCode);
                            }
                        }}
                        payment={() => {
                            this.props.navigation.dispatch({
                                type: RouteType.ROUTE_MAKE_COLLECTIONS_PAGE,
                                params: {
                                    orderCode: item.orderCode,
                                    deliveryInfo: item.deliveryInfo,
                                    customCode: item.customerOrderCode,
                                }
                            })
                        }}
                    />
                );
            }
            return null;
        });

        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'订单详情'}
                    router={navigator}
                    hiddenBackIcon={false}
                    optTitle={ this.state.isShowRightButton ? '回单照片' : null}
                    optTitleStyle={styles.rightButton}
                    firstLevelClick={this.state.isShowRightButton ? () => {
                        this.receiptPhoto();
                    } : {}}
                />
                <Text style={{textAlign: 'center', marginTop: 10, height: 20, fontSize: 16, color:'#666'}}>
                    {this.state.current}/{this.state.datas.length}
                </Text>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    style={styles.container}
                    horizontal={true}
                    pagingEnabled={true}
                    onScroll={() => {
                    }}
                    scrollEventThrottle={200}
                    onMomentumScrollEnd={this.onScrollEnd}
                    onScrollEndDrag={this.onScrollEnd}
                >
                    {subOrderPage}
                </ScrollView>
                {
                    this.state.showImages && this.state.showImages.length !==0 ?
                        <ImageViewer
                            style={{position: 'absolute', top: 0, left: 0, width: screenWidth, height: screenHeight}}
                            imageUrls={this.state.showImages}
                            enableImageZoom={true}
                            index={0}
                            renderIndicator={(currentIndex, allSize) => {
                                return React.createElement(View, { style: styles.count }, React.createElement(Text, { style: styles.countText }, allSize + '-' + currentIndex));
                            }}
                            onChange={(index) => {
                            }}
                            onClick={() => {
                                this.setState({
                                    showImages : [],
                                });
                            }}
                            saveToLocalByLongPress={false}
                        /> : null
                }

            </View>
        );
    }
}
function mapStateToProps(state) {
    return {
        plateNumber: state.user.get('plateNumber'),
        currentStatus: state.user.get('currentStatus'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        // 获取订单详情
        _getOrderDetail: (params, callBack) => {
            dispatch(fetchData({
                body: params,
                showLoading: true,
                api: API.API_NEW_GET_GOODS_SOURCE,
                success: data => {
                    console.log('get order details success ',data);
                    callBack && callBack(data)
                },
                fail: error => {
                    console.log('???', error)
                }
            }))
        },
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
        },
        _getOrderPictureInfo: (params, callBack) => {
            dispatch(fetchData({
                body: params,
                showLoading: true,
                api: API.API_ORDER_PICTURE_SHOW,
                success: data => {
                    console.log('get receipt img success ',data);
                    callBack && callBack(data)
                },
                fail: error => {
                    console.log('???', error);
                }
            }))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(entryToBeSignin);
