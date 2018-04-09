/**
 * 添加车辆
 * by：wl
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
    View,
    Text,
    Image,
    StyleSheet,
    DeviceEventEmitter,
    Dimensions,
    TextInput,
    FlatList,
    TouchableOpacity,
    Platform,
} from 'react-native';
import * as ConstValue from '../../../../constants/constValue';
import CarAvatar from '../../../../../assets/img/mine/character/carAvatar.png';
import * as API from '../../../../constants/api';
import HTTPRequest from '../../../../utils/httpRequest';
import Toast from '../../../../utils/toast';
import emptyData from '../../../../../assets/img/mine/car/carInfo.png';
import Button from 'apsl-react-native-button';
import Storage from '../../../../utils/storage';
import StorageKey from '../../../../constants/storageKeys';
import Loading from '../../../../utils/loading';
import {fetchData} from "../../../../action/app";
const {height, width} = Dimensions.get('window');
import * as RouteType from '../../../../constants/routeType';

const styles = StyleSheet.create({
    icon: {
        height: 22,
        width: 22,
        resizeMode: 'contain'
    },
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    textInputStyle: {
        flex: 1,
        marginLeft: 5,
        fontSize: 13,
        color: '#666666',
        ...Platform.select({
            ios: {},
            android: {
                padding: 0,
            },
        }),
    },
});

class AddCarPage extends Component {

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.onChanegeTextKeyword.bind(this);
        this.queryAllCarList = this.queryAllCarList.bind(this);
        this.queryAllCarListCallback = this.queryAllCarListCallback.bind(this);
        this.state = {
            NumberArr: '',
            carList: [
                // {
                //     carId: "f594c68f99414b139f5630bb3fb7d322",
                //     carLen: null,
                //     carNum: "京Aaaaaa",
                //     carPhone: null,
                //     carStatus: 20,
                //     carryCapacity: null,
                //     certificationStatus: null,
                //     companionId: null,
                //     drivers: null
                // }
            ],
            text: '',
            index: null,
            line: true,
            clickLine: 'a',
            haveDate: true,
            loading: false,
        }
    }

    //改变搜索的文本
    onChanegeTextKeyword(text) {
        this.timeA(text);
    }

    //利用防抖方式防止数据过大造成卡顿现象
    timeA(text) {
        if (this.time) {
            clearTimeout(this.time)
        }

        this.time = setTimeout(() => {
            if (text === '') {
                this.setState({
                    carList: this.state.NumberArr,
                });
                return;
            } else {
                this.setState({
                    carList: [],
                });
                for (var i = 0; i < this.state.NumberArr.length; i++) {
                    if (this.state.NumberArr[i].branchBank.indexOf(text) > -1) {
                        this.setState({
                            carList: this.state.carList.concat(this.state.NumberArr[i]),
                        });
                        // return;
                    } else {

                    }
                }
            }
        }, 500);

    }
    queryAllCarListCallback(result) {
        if(result == null){
            this.setState({
                haveDate: false,
                loading: false,
            })
        } else {
            this.setState({
                loading: false,
                haveDate: true,
                carList: result,
            })
        }
    }
    queryAllCarList(carNum, callback) {
        if (!carNum) {
            Toast.show('请输入车牌号');
            return;
        }
        this.props._queryAllCarList({
            carNum: carNum,
        }, callback);
    }

    bindRelieveCar(item) {
        this.props._bindRelieveCar({
            bindRelieveFlag: 1, // 1是绑定  其余是解除
            carId: item.carId,
            carNum: item.carNum,
            companionId: item.companionId,
            companionPhone: global.phone, //车主手机号
            driverIds: [],
            driverPhone: '' // 司机时手机号
        });
    }

    cityClicked(item) {
        console.log('item', item);
        // this.props.navigation.goBack();
        this.bindRelieveCar(item);
    }

    //列表的每一行
    renderItemView({item, index}) {
        return (

            <TouchableOpacity onPress={() => {

            }}>

                <View style={{
                    paddingLeft: 10,
                    backgroundColor: '#ffffff',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingTop: 16,
                    paddingBottom: 16
                }}>
                    <Image
                        style={{height: 36, width: 36}}
                        source={CarAvatar}/>

                    <View style={{flexDirection: 'column'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center',}}>

                            <Text style={{
                                marginLeft: 10,
                                color: '#333333',
                                fontSize: 17,
                                height: 24,
                            }}>{item.carNum}</Text>

                            {item.carStatus != '10' ?
                                <TouchableOpacity onPress={() => {
                                    this.cityClicked(item);
                                }}>
                                    <View
                                        style={{
                                            height: 30,
                                            width: 75,
                                            marginLeft: width - 220,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 20,
                                            borderColor: '#0071FF',
                                            borderWidth: 0.5,
                                        }}>
                                        < Text style={{color: '#0071FF'}}>+添加</Text>
                                    </View>
                                </TouchableOpacity>
                                : null
                            }
                        </View>
                        {item.carStatus == '10' ?
                            <Text style={{
                                marginLeft: 10,
                                color: '#CCCCCC',
                                fontSize: 12,
                                height: 18,
                                marginTop: 3,
                            }}>平台已禁用此司机，有疑问请联系平台客服人员。</Text>
                            : null}
                    </View>

                </View>

                <View style={{backgroundColor: '#E8E8E8', height: 1}}/>

            </TouchableOpacity>


        );
    }

    //去除警告
    extraUniqueKey(item, index) {
        return index + item;
    }


    render() {
        const navigator = this.props.navigation;
        const {params} = this.props.navigation.state;
        const {text} = this.state;
        console.log('params', params)

        return (
            <View style={{
                backgroundColor: '#FFFFFF',
                position: 'relative',
                flex: 1
            }}>

                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: ConstValue.StatusBar_Height,
                        marginBottom: 7,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <TouchableOpacity
                        onPress={()=>{
                            navigator.goBack();
                    }}>
                    <Text
                        style={{
                            marginLeft: 10,
                            fontFamily: 'iconfont',
                            fontSize: 16,
                            color: '#999999'
                        }}>&#xe69f;
                    </Text>
                    </TouchableOpacity>
                    <View style={{
                        flexDirection: 'row',
                        backgroundColor: '#F4F4F4',
                        marginLeft: 10,
                        flex: 1,
                        height: 30,
                        alignItems: 'center',
                    }}>
                        <Text
                            style={{
                                marginLeft: 10,
                                fontFamily: 'iconfont',
                                fontSize: 16,
                                color: '#999999'
                            }}>&#xe618;
                        </Text>
                        <TextInput
                            style={styles.textInputStyle}
                            underlineColorAndroid="transparent"
                            maxLength={20}
                            returnKeyLabel={'search'}
                            returnKeyType={'search'}
                            blurOnSubmit={true}
                            onSubmitEditing={(event) => {
                                // this.queryAllCarList(event.nativeEvent.text);
                            }}
                            value={text}
                            placeholder={'车牌号'}
                            onChangeText={(text) => {
                                this.setState({
                                    text: text
                                })
                                this.onChanegeTextKeyword(text)
                            }}>
                        </TextInput>
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                text: ''
                            })
                        }}>
                            <Text
                                style={{
                                    marginLeft: 10,
                                    fontFamily: 'iconfont',
                                    fontSize: 16,
                                    marginRight: 10,
                                    color: '#CCCCCC'
                                }}>&#xe664;
                            </Text>
                        </TouchableOpacity>

                    </View>
                    <TouchableOpacity onPress={() => {
                        this.queryAllCarList(this.state.text, this.queryAllCarListCallback);
                    }}>
                        <Text
                            style={{color: '#0071FF', fontSize: 16, width: 49, textAlign: 'center'}}
                        >搜索
                        </Text>
                    </TouchableOpacity>
                </View>
                {/*{this.state.haveDate ?*/}
                {/*<View style={{backgroundColor: '#F4F4F4', height: 45, justifyContent: 'center',}}>*/}
                    {/*<Text style={{color: '#666666', fontSize: 15, marginLeft: 10}}>添加车辆</Text>*/}
                {/*</View> : null}*/}
                {
                    this.state.haveDate ?
                        <FlatList
                            style={{backgroundColor: '#F4F4F4', flex: 1}}
                            data={this.state.carList}
                            renderItem={this.renderItemView.bind(this)}
                            keyExtractor={this.extraUniqueKey}//去除警告
                        >
                        </FlatList> :
                        <View style={{marginTop: 120,alignItems:'center',}}>
                            <Image
                                source={emptyData}/>
                            <Text style={{marginTop:10,fontSize: 16,color:'#666666'}}>
                                您搜索的车辆不存在
                            </Text>
                            <Button
                                ref='button'
                                isDisabled={false}
                                style={{
                                    backgroundColor: '#0083FF',
                                    width: width-20,
                                    marginBottom: 0,
                                    height: 38,
                                    borderWidth: 0,
                                    borderColor: '#0083FF',
                                    borderRadius:5,
                                    marginLeft:10,
                                    marginTop:55,

                                }}
                                textStyle={{color: 'white', fontSize: 18}}
                                onPress={() => {
                                    Storage.get(StorageKey.carOwnerAddCarInfo).then((value) => {
                                            if (value){
                                                this.props.navigation.dispatch({ type: RouteType.ROUTE_CAR_OWNER_ADD_CAR, params: {
                                                    resultInfo: value,
                                                } });

                                            }else {
                                                this.props.navigation.dispatch({ type: RouteType.ROUTE_CAR_OWNER_ADD_CAR });
                                            }

                                        });
                                }}
                            >
                                创建车辆
                            </Button>
                        </View>
                }

                {
                    this.state.loading ? <Loading/> : null
                }
            </View>

        );
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        _queryAllCarList: (params, successCallback) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                // showLoading: true,
                api: API.API_QUERY_CAR_INFO_BY_PHONE_NUM_DRIVER,
                success: data => {
                    successCallback(data);
                },
            }))
        },
        _bindRelieveCar: (params) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                // showLoading: true,
                api: API.API_BIND_RELIEVE_CAR_COMPANION,
                success: data => {
                    Toast.show('添加成功');
                    DeviceEventEmitter.emit('addCarPage');
                    this.props.navigation.goBack();
                },
            }))
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCarPage);


