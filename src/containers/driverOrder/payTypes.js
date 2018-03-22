import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    Dimensions,
    TouchableOpacity,
    Alert,
    DeviceEventEmitter,
    Platform
} from 'react-native';
import moment from 'moment';
import {Geolocation} from 'react-native-baidu-map-xzx';
import * as StaticColor from '../../constants/colors';
import * as API from '../../constants/api';
import NavigationBar from '../../components/common/navigatorbar';
import Toast from '@remobile/react-native-toast';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import RadioGroup from '../../components/driverOrder/radioGroup';
import RadioButton from '../../components/driverOrder/radioButton';
import PayBackground from '../../../assets/img/driverOrder/payTypeBackground.png';
import Button from 'apsl-react-native-button';
import * as RouteType from '../../constants/routeType';
import {fetchData} from '../../action/app';


const {width, height} = Dimensions.get('window');

let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.WHITE_COLOR,
    },
    subContainer: {
        flex: 1,
        backgroundColor: StaticColor.WHITE_COLOR,
    },
    backgroundImg: {
        width: width,
        marginTop: 10,
        backgroundColor: 'transparent',
        ...Platform.select({
            ios: {
                height: width * 300 / 710,
            },
            android : {
                height: width * 300 / 650,

            }
        })
    },
    contactContainer: {
        flexDirection: 'row',
        padding: 10,
    },
    addressIcon: {
        fontFamily: 'iconfont',
        color: StaticColor.COLOR_CONTACT_ICON_COLOR,
        fontSize: 19
    },
    address: {
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        fontSize: 15
    },
    separateLine: {
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
        height: 10,
        width: width
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    amountLine: {
        backgroundColor: StaticColor.WHITE_COLOR,
        height: 1,
        width: 33,
        opacity: 0.5
    },
    amountTitle: {
        fontSize: 13,
        color: StaticColor.WHITE_COLOR,
        marginLeft: 10,
        marginRight: 10
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: width - 20,
        height: 44,
        backgroundColor: StaticColor.BLUE_BACKGROUND_COLOR,
        alignSelf: 'center',
        marginTop: 20
    },
    buttonText: {
        fontSize: 18,
        color: StaticColor.WHITE_COLOR,
    },
    moneyStyle: {
        fontSize: 40,
        color: StaticColor.WHITE_COLOR
    },
    codeStyle: {
        fontSize: 12,
        color: StaticColor.WHITE_COLOR,
        opacity: 0.8
    },
    cashAndWeChatStyle: {
        fontSize: 16,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR
    },
    rightButton: {
        fontSize: 16,
        color: StaticColor.BLUE_BACKGROUND_COLOR,
    }
});

class payTypes extends Component {
    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.state = {
            payTypes: '现金',
            orderCode: params.orderCode,
            amount: '0',
            deliveryInfo: params.deliveryInfo,
            customCode: params.customCode,
            disable: true,
        };
        this.confirmPayment = this.confirmPayment.bind(this);
        this.getSettleState = this.getSettleState.bind(this);
    }

    componentDidMount() {
        this.getSettleState();
        this.getCurrentPosition();
        this.getSettleAmount();
        DeviceEventEmitter.addListener('refreshSettleState', () => {
            this.getSettleState();
        })
    }
    // 获取支付状态
    getSettleState() {
        currentTime = new Date().getTime();
        this.props._getSettleStateInfo(this.state.orderCode, (responseData) => {
            lastTime = new Date().getTime();
            ReadAndWriteFileUtil.appendFile('获取付款状态', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                locationData.district, lastTime - currentTime, '获取付款状态');
            if(responseData){
                let flag = responseData === 'true';
                console.log('flag===',flag);
                this.updateStatus(flag);
            }
        })
    }
    updateStatus(value){
        this.setState({
            disable: value,
        });
    }
    // 获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then((data) => {
            console.log('position =', JSON.stringify(data));
            locationData = data;
        }).catch((e) => {
            console.log(e, 'error');
        });
    }
    getSettleAmount() {
        currentTime = new Date().getTime();
        this.props._getSettleAmountInfo(this.state.orderCode, (responseData) => {
            lastTime = new Date().getTime();
            ReadAndWriteFileUtil.appendFile('付款方式', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                locationData.district, lastTime - currentTime, '付款方式选择页面');
            this.setState({
                amount: responseData,
            });
        })
    }

    onSelect(index, value){
        this.setState({
            payTypes: value
        });
    }
    confirmPayment() {
        currentTime = new Date().getTime();
        this.props._confirmPaymentWay({
            amount: this.state.amount,
            transCode: this.state.orderCode,
            userId: global.userId,
            paymentTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        }, () => {
            lastTime = new Date().getTime();
            ReadAndWriteFileUtil.appendFile('现金确认支付', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                locationData.district, lastTime - currentTime, '付款方式选择页面');
            Toast.showShortCenter('收款成功');
            DeviceEventEmitter.emit('refreshDetails');
            this.props.navigation.dispatch({ type: 'pop' })
        }, (error) => {
            Toast.showShortCenter(error.message);
        })
    }
    submit() {
        if (this.state.payTypes === '现金') {
            Alert.alert('','本次收款方式为:现金收款,确认后无' +
                '法修改，是否确认收款?', [
                {text: '取消',
                    onPress: () => {
                    },
                },
                {text: '确认',
                    onPress: () => {
                        this.confirmPayment();
                    },
                },
            ], {cancelable: false});
        } else {
            this.props.navigation.dispatch({
                type: RouteType.ROUTE_WECHAT_PAYMENT_PAGE,
                params: {
                    transCode: this.state.orderCode,
                    deliveryInfo: this.state.deliveryInfo,
                    customCode: this.state.customCode,
                    accountMoney: this.state.amount,
                }
            });
        }
    }
    //this.state.amount  Math.floor(parseFloat(this.state.amount) * 100) / 100
    render() {
        const navigator = this.props.navigation;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'收款'}
                    router={navigator}
                    hiddenBackIcon={false}
                    optTitle={'微信支付'}
                    optTitleStyle={styles.rightButton}
                    firstLevelClick={() => {
                        this.props.navigation.dispatch({
                            type: RouteType.ROUTE_WECHAT_PAYMENT_PAGE,
                            params: {
                                transCode: this.state.orderCode,
                                deliveryInfo: this.state.deliveryInfo,
                                customCode: this.state.customCode,
                                accountMoney: this.state.amount,
                            }
                        });
                    }}
                />
                <View style={styles.subContainer}>
                    <ImageBackground source={PayBackground} style={styles.backgroundImg} resizeMode='stretch'>
                        <View style={styles.amountContainer}>
                            <View style={styles.amountLine}/>
                            <Text style={styles.amountTitle}>收款金额</Text>
                            <View style={styles.amountLine}/>
                        </View>
                        <View style={{justifyContent: 'center', flexDirection: 'row', marginTop: 20}}>
                            <Text style={styles.moneyStyle}>+</Text>
                            <Text style={styles.moneyStyle}>{parseFloat(this.state.amount).toFixed(2)}</Text>
                        </View>
                        <View style={{justifyContent: 'space-between', flexDirection: 'row', marginTop: 20, paddingLeft: 20, paddingRight: 20}}>
                            <Text style={styles.codeStyle}>订单号：{this.state.orderCode}</Text>
                            {
                                this.state.customCode ? <Text style={styles.codeStyle}>客户单号：{this.state.customCode}</Text> : null
                            }
                        </View>
                    </ImageBackground>
                    <View style={styles.contactContainer}>
                        <Text style={styles.addressIcon}>&#xe68b;</Text>
                        <Text style={[styles.address, {flex: 1, marginLeft: 5}]}>{this.state.deliveryInfo.receiveContact}</Text>
                        <Text style={styles.address}>{this.state.deliveryInfo.receiveContactName}</Text>
                    </View>
                    <View style={styles.separateLine} />
                    <View>
                        <Text style={[styles.address, {fontSize: 16, marginBottom: 15, marginTop: 15, marginLeft: 10}]}>选择收款方式</Text>
                        <View style={[styles.separateLine, {height: 1}]} />
                        <RadioGroup
                            onSelect = {(index, value) => this.onSelect(index, value)}
                            selectedIndex={0}
                            thickness={2}
                            style={{paddingLeft: 10}}
                        >
                            <RadioButton value={'现金'} imageUrl="&#xe69b;" color={'#36ABFF'}>
                                <Text style={styles.cashAndWeChatStyle}>现金</Text>
                            </RadioButton>

                            <RadioButton value={'微信'} imageUrl="&#xe693;" color={'#41B035'}>
                                <Text style={styles.cashAndWeChatStyle}>微信</Text>
                            </RadioButton>
                        </RadioGroup>
                        <View style={styles.separateLine} />
                    </View>
                    <View style={styles.button} >
                        <Button
                            ref='button'
                            isDisabled={!this.state.disable}
                            style={{borderWidth: 0, marginBottom: 0,}}
                            textStyle={styles.buttonText}
                            onPress={() => {
                                this.submit();
                            }}
                        >
                            确认支付
                        </Button>
                    </View>
                </View>
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        _confirmPaymentWay: (params, callBack, failCallBack) => {
            dispatch(fetchData({
                body: params,
                showLoading: true,
                api: API.API_AC_COMFIRM_PAYMENT,
                success: data => {
                    console.log('confirm payment success ',data);
                    callBack && callBack(data)
                },
                fail: error => {
                    console.log('???', error)
                    failCallBack && failCallBack(error);
                }
            }))
        },
        _getSettleAmountInfo: (orderCode, callBack) => {
            dispatch(fetchData({
                body: {},
                showLoading: true,
                api: API.API_AC_GET_SETTLE_AMOUNT + orderCode,
                success: data => {
                    console.log('get settle amount success ',data);
                    callBack && callBack(data)
                },
                fail: error => {
                    console.log('???', error)
                }
            }))
        },
        _getSettleStateInfo: (orderCode, callBack) => {
            dispatch(fetchData({
                body: {},
                showLoading: true,
                api: API.API_AC_GET_SETTLE_STATE + orderCode,
                success: data => {
                    console.log('get settle state success ',data);
                    callBack && callBack(data)
                },
                fail: error => {
                    console.log('???', error)
                }
            }))
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(payTypes);

