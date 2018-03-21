/**
 * Created by xizhixin on 2017/10/30.
 * 微信支付界面
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    TouchableOpacity,
    Dimensions,
    Image,
    WebView,
    DeviceEventEmitter
} from 'react-native';
import {Geolocation} from 'react-native-baidu-map-xzx';
import * as StaticColor from '../../constants/colors';
import * as ConstValue from '../../constants/constValue';
import * as API from '../../constants/api';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import finishIcon from '../../../assets/img/driverOrder/finishIcon.png';
import {fetchData} from '../../action/app';

let currentTime = 0;
let lastTime = 0;
let locationData = '';


class WeChatPayment extends Component {
    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.state = {
            orderCode: params.transCode,
            deliveryInfo: params.deliveryInfo,
            customCode: params.customCode,
            accountMoney: params.accountMoney,
            url: '',
            successFlag: false,
        };
        this.getWeChatQrCode = this.getWeChatQrCode.bind(this);
        this.qrCodePayment = this.qrCodePayment.bind(this);
        this.goBackForward = this.goBackForward.bind(this);
    }
    componentDidMount() {
        this.getCurrentPosition();
        this.getWeChatQrCode();
        this.qrCodePayment();

        setTimeout(()=>{
            //WebSocket.onclose = (e) => {};
        }, 1000 * 600);
    }

    componentWillUnmount() {
        //WebSocket.onclose = (e) => {};
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
    // 获取微信二维码
    getWeChatQrCode() {
        currentTime = new Date().getTime();
        this.props._getWeChatQrCodeInfo({
            transCode: this.state.orderCode,
            userId: global.userId
        }, (responseData) => {
            lastTime = new Date().getTime();
            ReadAndWriteFileUtil.appendFile('获取二维码图片', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                locationData.district, lastTime - currentTime, '二维码付款页面');
            console.log('url',responseData);
            this.setState({
                url: responseData
            })
        })
    }

    goBackForward() {
        const routes = this.props.routes;
        let routeKey = routes[routes.length - 2].key;
        this.props.navigation.goBack(routeKey);
    }

    qrCodePayment() {
        const ws = new WebSocket(API.API_WEBSOCKET + this.state.orderCode);

        ws.onopen = () => {
            console.log('===============onopen');
            // ws.send('我是A'); // 发送一个消息
        };

        ws.onmessage = (e) => {
            // 接收到了一个消息
            console.log('onmessage===============',e.data);
            if(e.data === true) {
                this.setState({
                    successFlag: true
                });
                // 如果返回结果  主动断开链接
                WebSocket.onclose = (e) => {};
            }
        };

        ws.onerror = (e) => {
            // 发生了一个错误
            console.log('onerror', e.message);
        };

        ws.onclose = (e) => {
            // 连接被关闭了
            console.log('onclose', e.code, e.reason);
        };
    }
    render() {
        const navigator = this.props.navigation;
        return (
            <View style={styles.allContainer}>
                <View style={styles.container}>
                    <View style={styles.contentContainer}>
                        <View style={styles.leftContainer}>
                            {
                                this.state.successFlag ? null :
                                    <View>
                                        <TouchableOpacity
                                            onPress={() => {
                                                DeviceEventEmitter.emit('refreshSettleState');
                                                navigator.goBack();
                                            }}
                                        >
                                            <Text style={styles.leftTextStyle}>&#xe69f;</Text>
                                        </TouchableOpacity>
                                    </View>
                            }
                        </View>
                        <View style={styles.centerContainer}>
                            <Text style={styles.centerTextStyle}>收款</Text>
                        </View>
                        <View style={styles.rightContainer}>
                            {
                                this.state.successFlag ?
                                    <View>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.goBackForward();
                                            }}
                                        >
                                            <Text style={styles.buttonText}>完成</Text>
                                        </TouchableOpacity>
                                    </View> : null
                            }
                        </View>
                    </View>
                </View>
                <View style={styles.paymentView}>
                    <View style={styles.paymentTitleView}>
                       <View style={styles.flexDirection}>
                           <Text style={styles.paymentIcon}>&#xe698;</Text>
                           <Text style={styles.paymentText}>微信支付</Text>
                       </View>
                    </View>
                        {
                            this.state.successFlag ?
                            <View style={styles.content}>
                                <Image source={finishIcon} />
                                <Text style={styles.success}>支付成功</Text>
                            </View> :
                            <View>
                                <Text style={styles.amountText}>{`￥${parseFloat(this.state.accountMoney).toFixed(2)}`}</Text>
                                <Text style={styles.tip}>二维码有效期是10分钟</Text>
                                <View style={styles.imageView}>
                                    <WebView
                                        style={{
                                            height: 150,
                                            width: 150,
                                            alignItems: 'center',
                                            paddingRight: 10
                                        }}
                                        source={{uri: this.state.url}}
                                        javaScriptEnabled={true}
                                        domStorageEnabled={true}
                                        scalesPageToFit={false}
                                        bounces={false}
                                        mixedContentMode={'always'}
                                        automaticallyAdjustContentInsets={false}
                                        injectedJavaScript="var img = document.getElementsByTagName('img')[0];
                                        img.style.cssText = 'width: 130px; height:130px;'"
                                    />
                                </View>
                                <View style={{alignItems:'center',paddingBottom: 15}}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.getWeChatQrCode();
                                        }}
                                    >
                                        <View style={styles.flexDirection}>
                                            <Text style={styles.tipIcon}>&#xe695;</Text>
                                            <Text style={styles.tipText}>手动刷新二维码</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                </View>
                <View style={styles.bottomView}>
                    <View style={styles.titleView}>
                        <View style={styles.flexDirection}>
                            <Text style={styles.titleIcon}>&#xe68b;</Text>
                            <Text style={styles.titleText}>{this.state.deliveryInfo.receiveContact}</Text>
                        </View>
                    </View>
                    <View style={styles.divideLine} />
                    <View style={styles.titleView}>
                        <Text style={styles.titleText}>收货人：{this.state.deliveryInfo.receiveContactName}</Text>
                    </View>
                    <View style={styles.divideLine} />
                    <View style={styles.orderView}>
                        <Text style={styles.transportTime}>订单编号：{this.state.orderCode}</Text>
                        {this.state.customCode ? <Text style={styles.transportTime}>客户单号：{this.state.customCode}</Text> : null}
                    </View>
                </View>
            </View>
        );
    }
}

const styles =StyleSheet.create({
    allContainer: {
        flex: 1,
        backgroundColor: StaticColor.BLUE_BACKGROUND_COLOR,
    },
    container: {
        ...Platform.select({
            ios: {
                height: ConstValue.NavigationBar_StatusBar_Height,
            },
            android: {
                height: 50,
            },
        }),
        backgroundColor: StaticColor.BLUE_BACKGROUND_COLOR,
    },
    contentContainer: {
        flex: 1,
        ...Platform.select({
            ios: {
                paddingTop: 15,
            },
            android: {
                paddingTop: 0,
            },
        }),
        flexDirection: 'row',
    },
    leftContainer: {
        flex: 1,
        justifyContent: 'center',

    },
    centerContainer: {
        flex: 2,
        justifyContent: 'center',
    },
    rightContainer: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    centerTextStyle: {
        textAlign: 'center',
        color: StaticColor.WHITE_COLOR,
        fontSize: 18,
        marginTop: 10,
        fontWeight: '500'
    },
    leftTextStyle: {
        fontFamily: 'iconfont',
        fontSize: 18,
        color: StaticColor.WHITE_COLOR,
        marginLeft: 10,
        marginTop: 10
    },
    paymentView:{
        backgroundColor: StaticColor.WHITE_COLOR,
        marginLeft: 25,
        marginRight: 25,
        borderRadius: 5,
        ...Platform.select({
            ios: {
                marginTop: 30,
            },
            android: {
                marginTop: 10,
            }
        })
    },
    bottomView: {
        backgroundColor: StaticColor.WHITE_COLOR,
        marginTop: 15,
        marginLeft: 25,
        marginRight: 25,
        borderRadius: 5,
        ...Platform.select({
            ios: {
                marginBottom: 53,
                height: 148,
            },
            android:{
                height: 153,
            }
        }),
    },
    titleView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 10,
        paddingTop: 11,
        paddingBottom: 11,
    },
    orderView: {
        marginLeft: 15,
        paddingTop: 11,
    },
    paymentIcon:{
        fontFamily: 'iconfont',
        color: StaticColor.BLUE_BACKGROUND_COLOR,
        fontSize: 18,
        alignSelf: 'center',
    },
    tipIcon:{
        fontFamily: 'iconfont',
        color: '#A0A0A0',
        fontSize: 15,
        alignSelf: 'center',
    },
    titleIcon:{
        fontFamily: 'iconfont',
        color: '#A0A0A0',
        fontSize: 18,
        alignSelf: 'center',
    },
    titleText: {
        fontSize: 18,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        marginLeft: 8,
    },
    paymentText: {
        fontSize: 16,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        marginLeft: 5,
    },
    flexDirection: {
        flexDirection: 'row',
    },
    divideLine: {
        backgroundColor: StaticColor.DEVIDE_LINE_COLOR,
        height: 1,
        marginLeft: 10,
    },
    transportTime: {
        fontSize: 13,
        color: StaticColor.GRAY_TEXT_COLOR,
        paddingBottom: 5,
    },
    paymentTitleView: {
        paddingTop: 14,
        paddingBottom: 14,
        backgroundColor: StaticColor.TITLE_BACKGROUND_COLOR,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 15,
    },
    amountText: {
        fontSize: 25,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        alignSelf: 'center',
        padding: 15,
    },
    tipText: {
        fontSize: 14,
        color: StaticColor.COLOR_LIGHT_GRAY_TEXT,
        marginLeft: 10,
    },
    tip: {
        fontSize: 14,
        color: StaticColor.COLOR_LIGHT_GRAY_TEXT,
        alignSelf: 'center',
    },
    imageView: {
        marginTop: 10,
        marginBottom: 10,
        width: 150,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    success: {
        fontSize: 16,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        marginTop: 15,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginBottom: 10
    },
    buttonText: {
        fontSize: 16,
        color: StaticColor.WHITE_COLOR,
        textAlign: 'center',
        marginRight: 10,
        marginTop: 10,
    }
});

function mapStateToProps(state){
    return {
        routes: state.nav.routes,
    };
}

function mapDispatchToProps (dispatch){
    return {
        _getWeChatQrCodeInfo: (params, callBack) => {
            dispatch(fetchData({
                body: params,
                showLoading: true,
                api: API.API_AC_GET_WECHAT_QRCODE,
                success: data => {
                    console.log('get wechat qrcode success ',data);
                    callBack && callBack(data)
                },
                fail: error => {
                    console.log('???', error)
                }
            }))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(WeChatPayment);

