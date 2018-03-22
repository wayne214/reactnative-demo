/**
 * 司机管理
 * by：wl
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    Dimensions,
    TextInput,
    FlatList,
    TouchableOpacity,
    Platform,
    DeviceEventEmitter,
} from 'react-native';
import * as ConstValue from '../../../../constants/constValue';
import DriverAvatar from '../../../../../assets/img/mine/character/driverAvatar.png';
import Swipeout from 'react-native-swipeout';
import Button from 'apsl-react-native-button';
import * as API from '../../../../constants/api';
import HTTPRequest from '../../../../utils/httpRequest';
import Loading from '../../../../utils/loading';
import * as RouteType from '../../../../constants/routeType';
import {fetchData} from "../../../../action/app";
const {height, width} = Dimensions.get('window');

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
        fontSize: 16,
        color: '#666666',
        ...Platform.select({
            ios: {},
            android: {
                padding: 0,
            },
        }),
    },
});

class DriverManagement extends Component {

    constructor(props) {
        super(props);
        this.onChanegeTextKeyword.bind(this);
        this.queryDriverList = this.queryDriverList.bind(this);
        this.queryDriverOne = this.queryDriverOne.bind(this);
        this.unBindRelieveDriver = this.unBindRelieveDriver.bind(this);
        this.queryDriverList();
        this.unBindSucCallback = this.unBindSucCallback.bind(this);
        this.queryDriverListCallback = this.queryDriverListCallback.bind(this);
        this.state = {

            NumberArr: '',
            driverList: [
                //     {
                //     driverName: '车车1',
                //     certificationStatus: 'null',
                //     stauts: '20',
                //     carNums: '京A12345，京B12345，京A12345，京B12345，京A12345，京B12345，京A12345，京B12345'
                // }
            ],
            text: '',
            index: null,
            line: true,
            clickLine: 'a',
            buttonShow:false,
            numberOfLines:null,
        }
        this.numberOfLines = props.numberOfLines;
    }

    componentDidMount() {
        this.queryDriverList(this.queryDriverListCallback);
        this.bindCarListener = DeviceEventEmitter.addListener('bindCarPage', () => {
            this.queryDriverList(this.queryDriverListCallback);
        });
        this.addDriverListener = DeviceEventEmitter.addListener('addDriverPage', () => {
            this.queryDriverList(this.queryDriverListCallback);
        });
    }

    componentWillUnmount() {
        this.bindCarListener.remove();
        this.addDriverListener.remove();
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
                    driverList: this.state.NumberArr,
                });
                return;
            } else {
                this.setState({
                    driverList: [],
                });
                for (var i = 0; i < this.state.NumberArr.length; i++) {
                    if (this.state.NumberArr[i].branchBank.indexOf(text) > -1) {
                        this.setState({
                            driverList: this.state.driverList.concat(this.state.NumberArr[i]),
                        });
                        // return;
                    } else {

                    }
                }
            }
        }, 500);

    }
    queryDriverListCallback(result) {
        this.setState({
            loading: false,
            driverList: result,
        });
    }
    queryDriverList(callback) {
        this.props._queryDriverList({
            driverName: '',
            phoneNum: global.phone
        }, callback);
    }

    queryDriverOne(text, callback) {
        this.props._queryDriverList({
            driverName: text,
            phoneNum: global.phone
        }, callback);
    }

    unBindSucCallback() {
        this.queryDriverList(this.queryDriverListCallback);
    }

    /* 解除司机绑定 */
    unBindRelieveDriver(item, callback) {
        this.props._unBindRelieveDriver({
            driverId: item.id,
            driverPhone: '',
            phoneNum: global.phone
        }, callback);
    }

    //点击城市cell
    cityClicked(item) {
        console.log('item', item);
        // this.props.navigation.goBack();
        this.props.navigation.dispatch({ type: RouteType.ROUTE_BIND_CAR, params: {drManID: item.id} });
    }

    _onTextLayout(event){

    }

    //列表的每一行
    renderItemView({item, index}) {
        // Buttons
        const swipeoutBtns = [
            {
                text: '删除',
                backgroundColor: 'red',
                onPress: () => {
                    this.unBindRelieveDriver(item, this.unBindSucCallback);
                },

            }
        ];
        const carList = item.carNums;
        let carContent = '';
        if (carList) {
            for (let i = 0; i < carList.length; i++) {
                if (i < carList.length - 1) {
                    carContent = carContent.concat(carList[i]+'、');
                } else {
                    carContent = carContent.concat(carList[i]);
                }
            }
        }


        return (
            item.companyType == 1 ?
                <TouchableOpacity onPress={()=>{


                    this.props.navigation.dispatch({ type: RouteType.ROUTE_DRIVER_VERIFIED_DETAIL, params: {
                                                phone: item.driverPhone,
                                            } })




                }}>
                    <View style={{paddingLeft: 10, backgroundColor: '#ffffff'}}>
                        <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: 50,
                        justifyContent: 'space-between'
                    }}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image
                                    style={{height: 36, width: 36}}
                                    source={DriverAvatar}/>
                                <Text style={{marginLeft: 10, color: '#333333', fontSize: 14}}>{item.driverName}</Text>
                            </View>
                            <View style={{
                            justifyContent: 'center',
                            width: 90,
                            alignItems: 'center',
                        }}>
                                {item.status == 10 ?
                                    <Text style={{fontSize: 14, color: '#FA5741'}}>
                                        禁用
                                    </Text> :
                                    item.certificationStatus == '1202' ?
                                        <Text style={{fontSize: 14, color: '#0071FF'}}>
                                            认证通过
                                        </Text>
                                        : item.certificationStatus == '1201' ?
                                            <Text style={{fontSize: 14, color: '#0071FF'}}>
                                                认证中
                                            </Text>
                                            : item.certificationStatus == '1203' ?
                                                <Text style={{fontSize: 14, color: '#0071FF'}}>
                                                    认证驳回
                                                </Text>
                                                :
                                                <Text style={{fontSize: 14, color: '#0071FF'}}>
                                                    未认证
                                                </Text>
                                }
                            </View>
                        </View>
                        <View style={{marginLeft: 45}}>
                            {this.state.line && this.state.clickLine == index ?
                                <Text
                                    style={{fontSize: 14, lineHeight: 24, color: '#3F3F3F'}}
                                >
                                    关联车辆：{carContent}</Text>
                                : <Text
                                    numberOfLines={1}
                                    style={{fontSize: 14, lineHeight: 24, color: '#3F3F3F'}}>关联车辆：{carContent}</Text>
                            }

                            {carContent.length * (10 * width / 375) < (width - 95) ? null : this.state.line && this.state.clickLine == index ?
                                    <TouchableOpacity onPress={() => {
                                this.setState({
                                    clickLine: 'a',
                                })
                            }}>
                                        <Text style={{color: '#008AFF', fontSize: 12, lineHeight: 24}}>收起</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={() => {
                                this.setState({
                                    clickLine: index,
                                })
                            }}>
                                        <Text style={{color: '#008AFF', fontSize: 12, lineHeight: 24}}>全部</Text>
                                    </TouchableOpacity>

                            }
                        </View>
                        <View style={{marginBottom: 10,}}>
                            {item.status != '10' ?
                                <TouchableOpacity onPress={() => {
                                this.cityClicked(item);
                            }}>
                                    <View
                                        style={{
                                        height: 30,
                                        width: 85,
                                        marginTop: 1,
                                        marginLeft: width - 100,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 20,
                                        borderColor: '#999999',
                                        borderWidth: 0.5,
                                    }}>
                                        < Text style={{color: 'black'}}>绑定车辆</Text>
                                    </View>
                                </TouchableOpacity>
                                : null
                            }
                        </View>
                        <View style={{backgroundColor: '#E8E8E8', height: 1}}/>
                    </View>
                </TouchableOpacity>
                :
                <Swipeout
                    autoClose={false}
                    close={!(this.state.index === index)}
                    right={swipeoutBtns}
                    rowID={index}
                    sectionID={index}
                    onOpen={(index) => {
                        this.setState({
                            index,
                        });
                    }}
                    onClose={() => console.log('===close')}
                    scroll={event => console.log('scroll event')}
                >
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.dispatch({ type: RouteType.ROUTE_DRIVER_VERIFIED_DETAIL, params:{
                            qualifications: this.state.verifiedState,
                            phone: global.phone
                        } });
                    }}>

                        <View style={{paddingLeft: 10, backgroundColor: '#ffffff'}}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                height: 50,
                                justifyContent: 'space-between'
                            }}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Image
                                        style={{height: 36, width: 36}}
                                        source={DriverAvatar}/>
                                    <Text style={{
                                        marginLeft: 10,
                                        color: '#333333',
                                        fontSize: 14
                                    }}>{item.driverName}</Text>
                                </View>
                                <View style={{
                                    justifyContent: 'center',
                                    width: 90,
                                    alignItems: 'center',
                                }}>
                                    {item.status == 10 ?
                                        <Text style={{fontSize: 14, color: '#FA5741'}}>
                                            禁用
                                        </Text> :
                                        item.certificationStatus == '1202' ?
                                            <Text style={{fontSize: 14, color: '#0071FF'}}>
                                                认证通过
                                            </Text>
                                            : item.certificationStatus == '1201' ?
                                            <Text style={{fontSize: 14, color: '#0071FF'}}>
                                                认证中
                                            </Text>
                                            : item.certificationStatus == '1203' ?
                                                <Text style={{fontSize: 14, color: '#0071FF'}}>
                                                    认证驳回
                                                </Text>
                                                :
                                                <Text style={{fontSize: 14, color: '#0071FF'}}>
                                                    未认证
                                                </Text>
                                    }
                                </View>
                            </View>
                            <View style={{marginLeft: 45}}>

                                {this.state.line && this.state.clickLine == index ?
                                    <Text
                                        style={{fontSize: 14, lineHeight: 24, color: '#3F3F3F'}}
                                    >
                                        关联车辆：{carContent}</Text>
                                    : <Text
                                        numberOfLines={1}
                                        onLayout={this._onTextLayout.bind(this)}
                                        style={{
                                            fontSize: 14,
                                            lineHeight: 24,
                                            color: '#3F3F3F'
                                        }}>关联车辆：{carContent}</Text>
                                }


                                {carContent.length * (10 * width / 375) < (width - 95) ? null : this.state.line && this.state.clickLine == index ?
                                    <TouchableOpacity onPress={() => {
                                        this.setState({
                                            clickLine: 'a',
                                        })
                                    }}>
                                        <Text style={{color: '#008AFF', fontSize: 12, lineHeight: 24}}>收起</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={() => {
                                        this.setState({
                                            clickLine: index,
                                        })
                                    }}>
                                        <Text style={{color: '#008AFF', fontSize: 12, lineHeight: 24}}>全部</Text>
                                    </TouchableOpacity>

                                }
                            </View>
                            <View style={{marginBottom: 10,}}>
                                {item.status != '10' ?
                                    <TouchableOpacity onPress={() => {
                                        this.cityClicked(item);
                                    }}>
                                        <View
                                            style={{
                                                height: 30,
                                                width: 85,
                                                marginTop: 1,
                                                marginLeft: width - 100,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderRadius: 20,
                                                borderColor: '#999999',
                                                borderWidth: 0.5,
                                            }}>
                                            < Text style={{color: 'black'}}>绑定车辆</Text>
                                        </View>
                                    </TouchableOpacity>
                                    : null
                                }
                            </View>
                            <View style={{backgroundColor: '#E8E8E8', height: 1}}/>
                        </View>
                    </TouchableOpacity>

                </Swipeout>




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
                            value={text}
                            returnKeyLabel={'search'}
                            returnKeyType={'search'}
                            blurOnSubmit={true}
                            onSubmitEditing={(event) => {
                                // this.queryDriverOne(event.nativeEvent.text);
                            }}
                            placeholder={'司机姓名'}
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
                        this.queryDriverOne(this.state.text, this.queryDriverListCallback);
                    }}>
                        <Text
                            style={{color: '#0071FF', fontSize: 16, width: 49, textAlign: 'center'}}
                        >搜索
                        </Text>
                    </TouchableOpacity>
                </View>
                {
                    this.state.driverList.length > 0 ? <FlatList
                        style={{backgroundColor: '#F4F4F4', flex: 1, paddingTop: 10}}
                        data={this.state.driverList}
                        renderItem={this.renderItemView.bind(this)}
                        keyExtractor={this.extraUniqueKey}//去除警告
                    >
                    </FlatList> : <View style={{backgroundColor: '#F4F4F4', flex: 1}}/>
                }

                <Button
                    ref='button'
                    isDisabled={false}
                    style={{
                        backgroundColor: '#0083FF',
                        width: width,
                        marginBottom: 0,
                        height: 44,
                        borderRadius: 0,
                        borderWidth: 0,
                        borderColor: '#0083FF',
                    }}
                    textStyle={{color: 'white', fontSize: 18}}
                    onPress={() => {
                        this.props.navigation.dispatch({ type: RouteType.ROUTE_ADD_DRIVER2 });


                    }}
                >
                    添加司机
                </Button>
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
        _queryDriverList: (params, successCallback) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                // showLoading: true,
                api: API.API_QUERY_CAR_LIST_BY_PHONE_NUM,
                success: data => {
                    successCallback(data);
                },
            }))
        },
        _unBindRelieveDriver: (params, successCallback) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                // showLoading: true,
                api: API.API_DEL_DRIVER_COMPANION_RELATION,
                success: data => {
                    successCallback(data);
                },
            }))
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DriverManagement);


