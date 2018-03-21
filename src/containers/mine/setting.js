import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Text,
    View,
    StyleSheet,
    Switch,
    TouchableOpacity,
    DeviceEventEmitter,
    NativeAppEventEmitter,
    Platform
} from 'react-native';
import {fetchData,getHomePageCountAction} from "../../action/app";
import Storage from '../../utils/storage';
import NavigatorBar from '../../components/common/navigatorbar'
import {
    clearUser,
} from '../../action/user';
import {
    refreshDriverOrderList
} from '../../action/driverOrder';
import * as API from '../../constants/api';
import JPushModule from 'jpush-react-native';
// import {Geolocation} from 'react-native-baidu-map-xzx';
// import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import { NavigationActions } from 'react-navigation';
// import {ImageCache} from "react-native-img-cache";
import * as StaticColor from '../../constants/colors';
import * as RouteType from '../../constants/routeType';
import {
    voiceSpeechAction,
} from '../../action/app'

let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',

    },
    contentView: {
        flexDirection: 'row',
        height: 44,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    contentItemView: {
        flexDirection: 'row',
        height: 44,
        backgroundColor: '#FFF',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'space-between',
    },
    contentItemText: {
        fontSize: 16,
        color: '#333333',
    },
    contentText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
    },
    separateLine: {
        height: 0.5,
        backgroundColor: StaticColor.COLOR_SEPARATE_LINE,
        marginLeft: 10,
    },
});

class setting extends Component {

    constructor(props) {
        super(props);
        this.state = {
            switchIsOn: true,
            speechSwitch: this.props.speechSwitchStatus,
        };
        this.loginChangeAcceptMessage = this.loginChangeAcceptMessage.bind(this);
        this.press = this.press.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.getPushStatusAction = this.getPushStatusAction.bind(this);
        this.loginOut = this.loginOut.bind(this);
        this.speechValueChange = this.speechValueChange.bind(this);
        this.getPushStatusCallback = this.getPushStatusCallback.bind(this);
    }
    static navigationOptions = ({navigation}) => {
        const {state, setParams} = navigation;
        return {
            tabBarLabel: '设置',
            header: <NavigatorBar title='设置' hiddenBackIcon={false} router={navigation}/>,
        }
    };
    componentDidMount() {
        // this.getCurrentPosition();

        this.getPushStatusAction(this.getPushStatusCallback);

    }
    componentWillUnmount() {
        if (this.subscription)
            this.subscription.remove();
    }
    getPushStatusCallback(result) {
        this.setState({
            switchIsOn: result,
        });
    }
    /*获取通知状态*/
    getPushStatusAction(callback) {
        currentTime = new Date().getTime();
        this.props.getJPushStatus({}, callback);
    }

    // 获取当前位置
    // getCurrentPosition() {
    //     Geolocation.getCurrentPosition().then(data => {
    //         console.log('position =',JSON.stringify(data));
    //         locationData = data;
    //     }).catch(e =>{
    //         console.log(e, 'error');
    //     });
    // }

    /*退出登录请求*/
    loginOut(){
        this.props.loginOut({});
    }

    /*退出登录*/
    press() {
        this.props.getHomoPageCountAction({});
        console.log('homePageState=',this.props.homePageState);
        this.loginOut();
        this.props._refreshOrderList(0);
        this.props._refreshOrderList(1);
        this.props._refreshOrderList(2);
        this.props._refreshOrderList(3);
        this.props.removeUserInfoAction();
        // ImageCache.get().clear();

        // 清空存储数据
        // Storage.clear();
        JPushModule.setAlias('', ()=>{}, ()=>{});
        this.props.navigation.dispatch({ type: RouteType.ROUTE_LOGIN_WITH_PWD_PAGE, mode: 'reset', params: { title: '' } })


    }

    /*语音播报开关状态改变*/
    speechValueChange(value) {
        this.setState({
            speechSwitch: value,
        });
        this.props.speechSwitchAction(value);
    }
    /*通知开关状态改变*/
    valueChange(value) {
        this.setState({
            switchIsOn: value,
        });
        this.loginChangeAcceptMessage( value );
    }
    loginChangeAcceptMessage(value) {
        let body = {};
        if (value) {
                body = {
                    id: global.userId,
                    status: 0,
                }
        } else {
                body = {
                    id: global.userId,
                    status: 1,
                }
        }
        this.props.changeStatus({body});
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{height: 10}}/>

                <View style={styles.contentItemView}>
                    <Text style={styles.contentItemText}>
                        接收新消息通知
                    </Text>
                    <Switch
                        onTintColor={'#0083FF'}
                        onValueChange={(value) => {
                            this.valueChange(value);
                        }}
                        style={{marginBottom: 10, marginTop: 10}}
                        value={this.state.switchIsOn}
                    />
                </View>
                <View style={styles.separateLine}/>
                <View style={styles.contentItemView}>
                    <Text style={styles.contentItemText}>
                        语音播报
                    </Text>
                    <Switch
                        onTintColor={'#0083FF'}
                        onValueChange={(value) => {
                            this.speechValueChange(value);
                        }}
                        style={{marginBottom: 10, marginTop: 10}}
                        value={this.state.speechSwitch}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => {
                        this.press();
                    }}
                >
                    <View style={styles.contentView}>
                        <Text style={styles.contentText}>退出登录</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        speechSwitchStatus: state.user.get('speechSwitchStatus'),
        homePageState: state.app.get('getHomePageCount'),
        currentStatus: state.user.get('currentStatus'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        removeUserInfoAction:()=>{
            dispatch(clearUser());
        },
        speechSwitchAction:(data)=>{
            dispatch(voiceSpeechAction(data));
        },
        // reloadHomePageNum:()=>{
        //     dispatch(getHomePageCountAction(null));
        // },
        // reloadCarrierHomePageNum: () => {
        //     dispatch(getCarrierHomoPageCountAction(null));
        // },
        loginOut: (params) => {
            dispatch(fetchData({
                body: params,
                method: 'post',
                api: API.API_USER_LOGOUT + global.phone,
                success: data => {
                },
                fail: error => {
                }
            }))
        },
        getJPushStatus: (params, successCallback) => {
            dispatch(fetchData({
                body: params,
                method: 'post',
                api: API.API_NEW_GET_PUSHSTATUS_WITH_DRIVERID + global.userId,
                success: data => {
                    successCallback(data);
                },
                fail: error => {
                }
            }))
        },
        changeStatus: (params) => {
            dispatch(fetchData({
                body: params,
                method: 'post',
                api: API.API_CHANGE_ACCEPT_MESSAGE,
                success: data => {
                },
                fail: error => {
                }
            }))
        },
        getHomoPageCountAction: (response) => {
            dispatch(getHomePageCountAction(response));
        },
        _refreshOrderList: (data) => {
            dispatch(refreshDriverOrderList(data));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(setting);
