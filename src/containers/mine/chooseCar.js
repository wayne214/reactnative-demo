/**
 * 切换车辆页面
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    StyleSheet,
    Alert,
    Dimensions,
    DeviceEventEmitter,
    BackHandler,
    FlatList,
    TouchableOpacity,
    Text,
    Image
} from 'react-native';
import {Geolocation} from 'react-native-baidu-map-xzx';
import {NavigationActions} from 'react-navigation';

import {
    setUserCarAction,
} from '../../action/user';

// import {
//     getHomePageCountAction,
// } from '../../action/app';

import NavigatorBar from '../../components/common/navigatorbar';
import * as ConstValue from '../../constants/constValue';
import * as StaticColor from '../../constants/colors';
import * as API from '../../constants/api';
import CarIcon from '../../../assets/img/mine/carIcon.png';

import HTTPRequest from '../../utils/httpRequest';
import Storage from '../../utils/storage';
// import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import StorageKeys from '../../constants/storageKeys';

const screenHeight = Dimensions.get('window').height;
const {width} = Dimensions.get('window');

let currentTime = 0;
let lastTime = 0;
let locationData = '';


let tempArray = [{
    "carNum": "京LPL001",
    "carStatus": 20
}, {
    "carNum": "京LPL001",
    "carStatus": 20
}, {
    "carNum": "京LPL001",
    "carStatus": 20
},];
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND
    },
    content: {
        marginTop: 10,
        backgroundColor: 'white',
        height: screenHeight - ConstValue.NavigationBar_StatusBar_Height - ConstValue.Tabbar_Height - 10 - 44,
    },
    // 按钮
    buttonView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonStyle: {
        flex: 1,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 17,
        color: StaticColor.BLUE_CONTACT_COLOR,
        textAlign: 'center',
    },
    separatorLine: {
        height: 1,
        backgroundColor: StaticColor.DEVIDE_LINE_COLOR,
        marginLeft: 20
    },
    itemContainer: {
        height: 55,
        backgroundColor: StaticColor.WHITE_COLOR,
        paddingLeft: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemText: {
        fontSize: 16,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        marginLeft: 15,
    }
});
class chooseCar extends Component {
    constructor(props) {
        super(props);
        const carList = this.props.navigation.state.params.carList;
        const flag = this.props.navigation.state.params.flag;
        const currentCar = this.props.navigation.state.params.currentCar;
        let seletCarObj = {};
        for (let i = 0; i < carList.length; i++) {
            if (currentCar === carList[i].carNum) {
                seletCarObj = carList[i];
                break;
            } else {
                seletCarObj = carList[0];
            }
        }
        this.select = seletCarObj;
        this.state = {
            dataSource: carList,
            plateNumber: '',
            flag: flag,
            currentCar: currentCar,
            plateNumberObj: {},
        };
        this.setUserCar = this.setUserCar.bind(this);
        this.saveUserCarInfo = this.saveUserCarInfo.bind(this);
        this.setUserCarSuccessCallBack = this.setUserCarSuccessCallBack.bind(this);
        // this.clearHomePageCount = this.clearHomePageCount.bind(this);
    }

    static navigationOptions = ({navigation}) => {
        const {state, setParams} = navigation
        return {
            tabBarLabel: '选择车辆',
            header: <NavigatorBar title='选择车辆' hiddenBackIcon={false} router={navigation}/>,
        }
    };
    componentDidMount() {
        this.getCurrentPosition();
        BackHandler.addEventListener('hardwareBackPress', this.handleBack);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
    }

    handleBack = () => {
        // const current = this.props.navigation.state;
        // if (this.props.navigator && this.props.navigator.getCurrentRoutes().length > 1) {
        //     if (current.key === RouteType.CHOOSE_CAR_PAGE) {
        //         return true;
        //     }
        // }
        // return false;
    };

    // 获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then(data => {
            console.log('position =',JSON.stringify(data));
            locationData = data;
        }).catch(e =>{
            console.log(e, 'error');
        });
    }

    // 跳转界面并重置路由栈
    resetTo(index = 0, routeName) {
        const resetAction = NavigationActions.reset({
            index: index,
            actions: [
                NavigationActions.navigate({ routeName: routeName}),
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }
    renderItem = (item) => {
        console.log('item', item);
        return (
            <TouchableOpacity onPress={() => {

                this.props.navigation.goBack();
            }}>
                <View style={styles.itemContainer}>
                    <Image source={CarIcon} style={{width: 31, height: 31}}/>
                    <Text style={styles.itemText}>{item.item.carNum}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    // 选中车辆
    onSelect(data) {
        console.log('selectedCar= ', data);
        this.setUserCar(data, this.setUserCarSuccessCallBack);
    }

    // 保存设置车辆
    setUserCar(plateNumber) {
        currentTime = new Date().getTime();
        Storage.get(StorageKeys.USER_INFO).then((value) => {
            console.log('va----',value);
            if(value) {
                HTTPRequest({
                    url: API.API_SET_USER_CAR,
                    params: {
                        plateNumber: plateNumber,
                        phoneNum: value.phone,
                    },
                    loading: ()=>{},
                    success: (responseData)=>{

                        this.setUserCarSuccessCallBack(responseData.result);
                    },
                    error: (errorInfo)=>{
                        console.log('eerronfFinf',errorInfo);
                    },
                    finish:()=>{}
                });
            }
        });
    }
    setUserCarSuccessCallBack(result) {
        lastTime = new Date().getTime();
        // ReadAndWriteFileUtil.appendFile('绑定车辆', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
        //     locationData.district, lastTime - currentTime, '设置车辆页面');
        const {userInfo} = this.props;
        console.log('设置车辆成功了', this.state.plateNumber, userInfo.phone, this.state.plateNumberObj);
        Storage.save('setCarSuccessFlag', '3');
        this.saveUserCarInfo(this.state.plateNumberObj);
        Storage.remove('carInfoResult');
        if (this.state.flag){
            this.resetTo(0, 'Main');
        } else {
            this.props.navigation.goBack();
            DeviceEventEmitter.emit('updateOrderList');
            DeviceEventEmitter.emit('resetGood');
        }
    }
    // 保存车牌号对象
    saveUserCarInfo(plateNumberObj) {

        this.props.saveUserSetCarSuccess(plateNumberObj);
    }

    // clearHomePageCount() {
    //     this.props.reloadHomePageNum();
    // }

    separatorComponent() {
        return (
            <View style={styles.separatorLine}/>
        );
    };
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <FlatList
                        keyExtractor={ () => Math.random(2) }
                        data={tempArray}
                        renderItem={this.renderItem}
                        ItemSeparatorComponent={this.separatorComponent}
                    />
                </View>
                <View style={{flex: 1}} />
                <View>
                    {/*<CommonButton*/}
                        {/*backgroundImg={StaticImage.BlueButtonSquare}*/}
                        {/*containerStyle={{marginRight:0, marginLeft:0}}*/}
                        {/*buttonStyle={{width: width}}*/}
                        {/*onClick={() => {*/}
                            {/*this.clearHomePageCount();*/}
                            {/*console.log('this.select',this.select);*/}
                            {/*if (JSON.stringify(this.select) == '{}') {*/}
                                {/*Alert.alert('提示', '请选择车辆');*/}
                                {/*return;*/}
                            {/*}*/}
                            {/*this.setState({*/}
                                {/*plateNumber: JSON.stringify(this.select) == '{}' ? dataSource[0].carNum : this.select.carNum,*/}
                                {/*plateNumberObj: JSON.stringify(this.select) == '{}' ? dataSource[0] : this.select,*/}
                            {/*});*/}
                            {/*this.onSelect(JSON.stringify(this.select) == '{}' ? dataSource[0].carNum : this.select.carNum);*/}
                        {/*}}*/}
                        {/*buttonText="确认"*/}
                    {/*/>*/}
                </View>

            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        userInfo: state.user.get('userInfo'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        saveUserSetCarSuccess: (plateNumberObj) => {
            dispatch(setUserCarAction(plateNumberObj));
        },
        // reloadHomePageNum:()=>{
        //     dispatch(getHomePageCountAction(null));
        // }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(chooseCar);

