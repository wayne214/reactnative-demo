import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Modal,
    DeviceEventEmitter,
    Alert
} from 'react-native';
import NavigatorBar from '../../components/common/navigatorbar';
import * as COLOR from '../../constants/colors'
const { height,width } = Dimensions.get('window')
import AddressItem from '../../components/routes/goodlistAddressItem';
import ItemTop from '../../components/routes/goodlistdetailTopItem';
import MutilAddress from '../../components/routes/goodlistdetailMutilAddress';
import GoodsDetail from '../../components/routes/goodlistdetailgoodDetail';
import GoodsDetailTime from '../../components/routes/goodlistdetailsetTimeItem';
import GoodsDetailMoney from '../../components/routes/goodlistdetailMoneyItem';
import DateHandler from '../../utils/dateHandler'
import Picker from '../../utils/picker';
import moment from 'moment';
import { fetchData } from '../../action/app.js'
import * as API from '../../constants/api.js'
// import Toast from '@remobile/react-native-toast';
import Toast from '../../utils/toast';
import * as RouteType from '../../constants/routeType'
import TimePicker from 'react-native-picker-custom';



let startTime = 0;


class goodListDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 0,
            pickerDataType: '',
            pickerDateSource: [],

            installDateStart: '',
            installDateEnd: '',
            installTimeStart: '',
            installTimeEnd: '',
            arrivalDate: '',
            result: {},
            money: ''
        };

        this.getDetailSuccess = this.getDetailSuccess.bind(this);
        this.sendOrderSuccess = this.sendOrderSuccess.bind(this);
        this.sendOrderFail = this.sendOrderFail.bind(this);
        this.sendPrice = this.sendPrice.bind(this);
        this.showTimePick = this.showTimePick.bind(this);

    }
    componentDidMount() {
         const uri = API.RESOURCE_DETAIL + this.props.navigation.state.params.goodID;
         // const uri = API.RESOURCE_DETAIL + 'WT180321000084';
        this.props.getGoodsDetail(uri,this.getDetailSuccess)
    }
    getDetailSuccess(result){
        this.setState({
            result
        });

        if (this.props.navigation.state.params.type == '1'){
            this.setState({money: result.configFreight});
        }

    }

    // 抢单成功
    sendOrderSuccess(){
        Toast.show('抢单成功');
        DeviceEventEmitter.emit('resetCarrierGoods');
        DeviceEventEmitter.emit('reloadDispatchList');
        this.props.navigation.dispatch({type: 'pop'})
    }
    sendOrderFail(data){

        if (data.message.search('承运商名称为空') != -1){
            // 认证
            if (this.props.currentStatus === 'personalOwner'){
                this.props.navigation.dispatch({ type: RouteType.ROUTE_PERSON_CAR_OWNER_AUTH })
            }

            if (this.props.currentStatus === 'businessOwner'){
                this.props.navigation.dispatch({ type: RouteType.ROUTE_COMPANY_CAR_OWNER_AUTH })
            }
        }else {
            // Toast.show(data.message);
        }




    }
    _showPickerView(type){

        const {installDateStart,installTimeStart,installDateEnd,installTimeEnd,arrivalDate} = this.state

        const overTimeStamp = Date.parse(moment(installDateStart, 'YYYY-MM-DD').format())
        const tomorrowStamp = overTimeStamp + 24 * 60 * 60 * 1000
        const tomorrowDate = moment.unix(tomorrowStamp/1000).format('YYYY-MM-DD');


        switch(type){
            case 'installDateStart':
                this.setState({pickerDateSource: DateHandler.createDateData()});
                break;
            case 'installTimeStart':
                this.setState({pickerDateSource: DateHandler.createInstallStartTimeData(installDateStart)});
                break;
            case 'installDateEnd':
                if (installDateStart) {
                    this.setState({pickerDateSource: [installDateStart,tomorrowDate]})
                }else{
                    this.setState({pickerDateSource: DateHandler.createDateData(installDateStart && installDateStart.split('-'))});
                }
                break;
            case 'installTimeEnd':

                if (installTimeStart) {
                    if (installDateStart == installDateEnd) {
                        //同一天 installTimeStart ~ 23:59
                        this.setState({pickerDateSource: DateHandler.createTimeData(installTimeStart)});
                    }else{
                        // 不是同一天  0:0 ~ installTimeStart
                        this.setState({pickerDateSource: DateHandler.createTimeData(null,installTimeStart)});
                    }
                }else{
                    this.setState({pickerDateSource: DateHandler.createTimeData('0:0')});
                }


                break;
            case 'arrivalDate':
                this.setState({pickerDateSource: DateHandler.createDateData(installDateStart && installDateStart.split('-'))});
                break;
            default:
                console.warn("type is error ");
        }
        this.setState({
            pickerDataType: type,
        });

        this.showTimePick();
    }
    _onPickerConfirm(data){

        const { pickerDataType, pickerDateSource } = this.state;
        if (data && data.length > 0) {
            switch(pickerDataType){
                case 'installDateStart':
                    this.setState({
                        installDateStart: DateHandler.dateNumberFormat(`${data[0]}-${data[1]}-${data[2]}`),
                        installTimeStart: '',
                        installDateEnd: '',
                        installTimeEnd: '',
                        arrivalDate: ''
                    })
                    break;
                case 'installTimeStart':
                    this.setState({
                        installTimeStart: `${data[0]}:${data[1]}`.replace('时','').replace('分',''),
                        installTimeEnd: ''
                    })
                    break;
                case 'installDateEnd':
                    this.setState({
                        // installDateEnd: DateHandler.dateNumberFormat(`${data[0]}-${data[1]}-${data[2]}`),
                        installDateEnd: DateHandler.dateNumberFormat(`${data[0]}`),
                        installTimeEnd:''
                    })
                    break;
                case 'installTimeEnd':
                    this.setState({
                        installTimeEnd: `${data[0]}:${data[1]}`.replace('时','').replace('分','')
                    })
                    break;
                case 'arrivalDate':
                    this.setState({
                        arrivalDate: DateHandler.dateNumberFormat(`${data[0]}-${data[1]}-${data[2]}`)
                    })
                    break;
                default:
                    console.warn("none type is matched ");
            }

        }
    }

    sendPrice(){

        Alert.alert(
            '提示',
            '确认此报价？',
            [
                { text: '确认', onPress: () => {


                    if (this.props.navigation.state.params.type == '1') {
                        this.props.sendOrder({
                            biddingPrice: this.state.result.isLock == '1' ? this.state.result.configFreight : this.state.money,
                            carrierId: global.companyCode, // 承运商code
                            carrierName: global.ownerName, // 承运商名字
                            entrustType: this.state.result.businessType == '501' ? 2 : 1, // 委托类型
                            expectLoadingTime: this.state.installDateStart + ' ' + this.state.installTimeStart + ':00', // 时分秒
                            resourceCode: this.props.navigation.state.params.goodID, // 货源id
                            type: this.props.navigation.state.params.type // 报价类型
                        },this.sendOrderSuccess,this.sendOrderFail);
                    } else {
                        this.props.sendOrder({
                            biddingPrice: this.state.money,
                            carrierId: global.companyCode, // 承运商code
                            carrierName: global.ownerName, // 承运商名字
                            entrustType: this.state.result.businessType == '501' ? 2 : 1, // 委托类型
                            expectLoadingTime: this.state.installDateStart + ' ' + this.state.installTimeStart + ':00', // 时分秒
                            resourceCode: this.props.navigation.state.params.goodID, // 货源id
                            type: this.props.navigation.state.params.type // 报价类型
                        },this.sendOrderSuccess,this.sendOrderFail);
                    }

                    }
                },
                { text: '取消', onPress: () => console.log('cancel') },
            ]
        );
    }


    showTimePick(){
        setTimeout(()=>{
            TimePicker.init({
                pickerConfirmBtnText: '确定',
                pickerCancelBtnText: '取消',
                pickerTitleText: '',
                pickerData: this.state.pickerDateSource,
                pickerFontSize: 22,
                pickerBg: [225,225,225,1],
                onPickerConfirm: data => {
                    this._onPickerConfirm(data)

                },
                onPickerCancel: data => {

                },
                onPickerSelect: data => {

                }
            });
            TimePicker.show();
        },100);
    }


    render() {
        let goodName = '';
        this.state.result.supplyInfoList ? this.state.result.supplyInfoList.map((goods,index)=>{
                if (index === this.state.result.supplyInfoList.length - 1){
                    goodName+=goods.categoryName || '' + goods.typeName || '' + goods.goodsName || '';
                }else
                    goodName+=goods.categoryName || '' + goods.typeName || '' + goods.goodsName || '' +' ';

        }) : null;

        let qiuS = '';
        if (!this.state.result.carLength && !this.state.result.carType) {
        }else {
            qiuS = '   求 ' + (this.state.result.carLength || '') + ' ' + (this.state.result.carType || '')
        }

        let fromAddress = this.state.result.fromProvinceName + this.state.result.fromCityName + this.state.result.fromAreaName + this.state.result.fromAddress;
        let endAddress = this.state.result.toProvinceName + this.state.result.toCityName + this.state.result.toAreaName + this.state.result.toAddress;

        let hot = '';
        if ( String(this.state.result.temperatureMin) && String(this.state.result.temperatureMax) ){
            hot = String(this.state.result.temperatureMin)+ '℃ - '  + String(this.state.result.temperatureMax) + '℃';
        }

        return (

            <View style={styles.container}>
                <NavigatorBar
                    title='货源详情'
                    router={this.props.navigation}
                    hiddenBackIcon={false}
                />
                <ScrollView keyboardDismissMode={'on-drag'}>

                    <ItemTop price={this.state.result.configFreight}/>
                    <View style={{paddingTop: 12,paddingBottom: 8,backgroundColor: 'white'}}>
                        <AddressItem startAddress={fromAddress}
                                     endAddress={endAddress}/>
                    </View>

                    {
                        this.state.result.loadingAreaVOList && this.state.result.loadingAreaVOList.length > 0 ?
                            <MutilAddress address={this.state.result.loadingAreaVOList}/> : null
                    }


                    <View style={{backgroundColor: 'white', marginTop: 10}}>
                        <GoodsDetail goodDetail={'有 '+((goodName && goodName !== 'null' && goodName !== '') ? goodName : '货品')+' ' +(this.state.result.goodsTotalWeight || "")+
                        'KG '+(this.state.result.goodsTotalVolume || "")+'方'+qiuS}
                                     beginTime={this.state.result.loadingStartTime || ''}
                                     endTime={this.state.result.loadingEndTime || ''}
                                     hot={hot}
                                     remark={this.state.result.remark || ''}
                                     businessType={this.state.result.businessType}
                                     arriveTime={this.state.result.arrivalStartTime ? this.state.result.arrivalStartTime : ''}
                        />
                    </View>

                    <GoodsDetailTime startTime={this.state.installDateStart}
                                     endTime={this.state.installTimeStart}
                                     startaTimeClick={()=>{
                                         this._showPickerView('installDateStart')
                                     }}
                                     endTimeClick={()=>{
                                         this._showPickerView('installTimeStart')
                                     }}/>

                    <GoodsDetailMoney norMoney={this.state.result.configFreight}
                                      minPrice={this.state.result.priceMin}
                                      maxPrice={this.state.result.priceMax}
                                      moneyChange={(money)=>{

                                         this.setState({money});
                                     }}
                                      businessType={this.state.result.businessType}
                                      isLocked={this.props.navigation.state.params.type == '1' ? this.state.result.isLock : '0'}/>

                    <TouchableOpacity style={{padding: 15, backgroundColor: '#0092FF',margin: 20, borderRadius: 3}}
                                      onPress={()=>{

                                if (!this.state.biddingState) {

        //ownerStatus ： 11 个人车主认证中 12 个人车主认证通过 13 个人车主认证驳回  14 个人车主被禁用
        //               21 企业车主认证中 22 企业车主认证通过 23 企业车主认证驳回  24 企业车主被禁用
        // currentStatus ： driver 司机  personalOwner 个人车主 businessOwner 企业车主

        switch (this.props.ownerStatus){
            case '11':
            case '21':
                Toast.show('车主身份正在认证中，如需帮助请联系客服');
                return;
                break;
            case '13' :
            case '23' :
                Toast.show('车主身份认证驳回，请重新上传');

                if (this.props.currentStatus === 'personalOwner'){
                    this.props.navigation.dispatch({ type: RouteType.ROUTE_PERSON_CAR_OWNER_AUTH })
                }

                if (this.props.currentStatus === 'businessOwner'){
                    this.props.navigation.dispatch({ type: RouteType.ROUTE_COMPANY_CAR_OWNER_AUTH })
                }
                return;

                break;
            case '14':
            case '24':
                Toast.show('车主身份已经被禁用，如需帮助请联系客服');
                return;
                break;
            case '12':
            case '22':
                break
            default:
                return;
                break
        }




                                          if (this.state.installDateStart === ''){
                                              Toast.show('请选择预计装货时间');
                                              return
                                          }
                                          if (this.state.installTimeStart === ''){
                                              Toast.show('请选择预计装货时间');
                                              return
                                          }
                                          if (this.state.money === ''){
                                              Toast.show('请输入报价金额');
                                              return
                                          }


                                          if (parseInt(this.state.money) < parseInt(this.state.result.priceMin)){
                                              Toast.show('报价金额不能少于最低标准运费');
                                              return;
                                          }
                                          if (parseInt(this.state.money) > parseInt(this.state.result.priceMax)){
                                              Toast.show('报价金额不能高于最高标准运费');
                                              return;
                                          }

                                          this.sendPrice();
                                }
                                else {
                                              Toast.show('已经报价成功，请勿重复报价');
                                }
                                      }}>
                        <Text style={{textAlign: 'center', fontSize: 17,color: 'white',fontWeight: 'bold'}}>立即抢单</Text>
                    </TouchableOpacity>
                </ScrollView>

           </View>
        )

    }
}

const styles =StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.APP_CONTENT_BACKBG
    },
});

function mapStateToProps(state){
    return {
        currentStatus: state.user.get('currentStatus'),
        ownerStatus: state.user.get('ownerStatus'),

    };
}

function mapDispatchToProps (dispatch){
    return {
        getGoodsDetail: (uri,getGoodListSuccess)=>{
            startTime = new Date().getTime();
            dispatch(fetchData({
                api: uri,
                method: 'POST',
                success: (data) => {

                    getGoodListSuccess(data)
                }
            }))
        },
        sendOrder: (params,getGoodListSuccess,getGoodListFail)=>{
            startTime = new Date().getTime();
            dispatch(fetchData({
                api: API.BIDORDER,
                method: 'POST',
                body: params,
                success: (data) => {

                    getGoodListSuccess(data)
                },
                fail:(data)=>{
                    getGoodListFail(data)
                }
            }))
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(goodListDetail);

