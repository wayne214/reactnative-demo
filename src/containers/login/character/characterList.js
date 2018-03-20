/**
 * 角色选择界面
 * by：wl
 * OUTSIDEDRIVER  外部司机
 * Personalowner  个人车主
 * Enterpriseowner  企业车主
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
    Text,
    View,
    BackAndroid,
    StyleSheet,
    Dimensions,
    Platform,
    Alert
} from 'react-native';
import {NavigationActions} from 'react-navigation';
import Storage from '../../../utils/storage';
import StorageKey from '../../../constants/storageKeys';
import NavigatorBar from '../../../components/common/navigatorbar';
import CharacterCell from '../../../components/login/characterCell';
import Drivericon from '../../../../assets/img/character/drivericon.png';
import PersonalOwner from '../../../../assets/img/character/personalOwner.png';
import BusinessOwners from '../../../../assets/img/character/businessOwners.png';
import {
    clearUser,
    setDriverCharacterAction,
    setOwnerCharacterAction,
} from '../../../action/user';
import * as RouteType from "../../../constants/routeType";

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
});

class CharacterList extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    onBackAndroid = () => {
        return true;
    };

    static navigationOptions = ({navigation}) => {
        const {state, setParams} = navigation
        return {
            tabBarLabel: '选择身份',
            header: <NavigatorBar
                title='选择身份'
                hiddenBackIcon={false}
                router={navigation}/>,
        }
    };

    render() {
        const navigator = this.props.navigation;

        return (
            <View style={styles.container}>
                <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
                    {/*<NavigatorBar*/}
                    {/*title={'选择身份'}*/}
                    {/*navigator={navigator}*/}
                    {/*leftButtonHidden={true}*/}
                    {/*rightButtonConfig={{*/}
                    {/*type: 'string',*/}
                    {/*title: '退出',*/}
                    {/*onClick: () => {*/}
                    {/*this.props.removeUserInfoAction();*/}
                    {/*const resetAction = NavigationActions.reset({*/}
                    {/*index: 0,*/}
                    {/*actions: [*/}
                    {/*NavigationActions.navigate({ routeName: 'LoginSms'}),*/}
                    {/*]*/}
                    {/*});*/}
                    {/*this.props.navigation.dispatch(resetAction);*/}
                    {/*},*/}
                    {/*}}*/}
                    {/*/>*/}

                    <CharacterCell
                        textAbout={'司机'}
                        imageAbout={Drivericon}
                        onClick={() => {
                            Alert.alert(
                                '司机',
                                '\n司机可在鲜易通接物流订单，同时接收与其有挂靠关系的个人车主或企业车主分配的运输订单，请确认您的选择无误！',
                                [
                                    {
                                        text: '再看看', onPress: () => {
                                            //this.props.navigation.navigate('Main');
                                        }
                                    },
                                    {
                                        text: '确认', onPress: () => {
                                            Storage.get(StorageKey.changePersonInfoResult).then((value) => {
                                                if (value) {
                                                    this.props.navigation.dispatch({
                                                        type: RouteType.ROUTE_DRIVER_VERIFIED,
                                                        params: {
                                                            resultInfo: value,
                                                            type: 'login'
                                                        }
                                                    });
                                                } else {
                                                    this.props.navigation.dispatch({ type: RouteType.ROUTE_DRIVER_VERIFIED,
                                                     params:{
                                                        type: 'login'
                                                     }})
                                                }
                                            })
                                        }
                                    },
                                ]
                            )
                        }}
                    />

                    <CharacterCell
                        textAbout={'个人车主'}
                        imageAbout={PersonalOwner}
                        onClick={() => {
                            Alert.alert(
                                '个人车主',
                                '\n个人车主可在鲜易通接物流订单，同时转发给司机运输，但必须车辆所有人为注册本人，请确认您的选择误！',
                                [{
                                        text: '再看看', onPress: () => {
                                        }},
                                    {
                                        text: '确认', onPress: () => {
                                            Storage.get(StorageKey.personownerInfoResult).then((value) => {
                                                if (value) {
                                                    this.props.navigation.dispatch({
                                                        type: RouteType.ROUTE_PERSON_CAR_OWNER_AUTH ,
                                                        params: {
                                                            resultInfo: value,
                                                        }}
                                                    )
                                                } else {
                                                    this.props.navigation.dispatch({ type: RouteType.ROUTE_PERSON_CAR_OWNER_AUTH })
                                                }
                                            });
                                        }
                                    },
                                ])
                        }}
                    />

                    <CharacterCell
                        textAbout={'企业车主'}
                        imageAbout={BusinessOwners}
                        onClick={() => {
                            Alert.alert(
                                '企业车主',
                                '\n企业车主可在鲜易通接物流订单，同时转发给司机运输，但必须具有企业资质，请确认您的选择无误！',
                                [{
                                    text: '再看看', onPress: () => {
                                    }
                                },
                                    {
                                        text: '确认', onPress: () => {
                                            Storage.get(StorageKey.enterpriseownerInfoResult).then((value) => {
                                                if (value) {
                                                    this.props.navigation.dispatch({
                                                        type: RouteType.ROUTE_COMPANY_CAR_OWNER_AUTH ,
                                                        params: {
                                                            resultInfo: value,
                                                        }}
                                                    )
                                                } else {
                                                    this.props.navigation.dispatch({ type: RouteType.ROUTE_COMPANY_CAR_OWNER_AUTH })
                                                }
                                            });
                                        }
                                    },])
                        }}
                    />
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        // driver: state.user.get('driver'),
        // owner: state.user.get('owner'),
        driverStatus: state.user.get('driverStatus'),
        ownerStatus: state.user.get('ownerStatus'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        removeUserInfoAction: () => {
            dispatch(clearUser());
        },
        setCharacter: (data) => {
            dispatch(setCharacterAction(data));
        },
        setDriverCharacterAction: (result) => {
            dispatch(setDriverCharacterAction(result));
        },
        setOwnerCharacterAction: (result) => {
            dispatch(setOwnerCharacterAction(result));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CharacterList);
