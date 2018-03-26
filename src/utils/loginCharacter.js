/*
    登录提取方法
*/
import {
    loginSuccessAction,
    setCompanyCodeAction,
    setCurrentCharacterAction,
    setDriverCharacterAction,
    setOwnerCharacterAction,
    setOwnerNameAction,
    setUserNameAction,
    saveCompanyInfoAction,
    saveUserTypeInfoAction
} from "../action/user";
import {connect} from "react-redux";
import * as RouteType from '../constants/routeType';
import Toast from '@remobile/react-native-toast';
import JPushModule from "jpush-react-native";
import {appendLogToFile} from "../action/app";

class LoginCharacter {

    setCharacter(props, result, type) {

        console.log("------账号角色信息:", result);
        if (result) {
            if (result.length == 0) {
                props.navigation.dispatch({
                    type: RouteType.ROUTE_CHARACTER_LIST,
                })
                return;
            }
            if (result.length == 1) {
                if (result[0].owner == 1) {
                    // 车主
                    if (result[0].companyNature == '个人') {
                        // 确认个人车主
                        if (result[0].status != 10) {
                            result[0].certificationStatus == '1201' ?
                                props.setOwnerCharacterAction('11')
                                : result[0].certificationStatus == '1202' ?
                                props.setOwnerCharacterAction('12') :
                                props.setOwnerCharacterAction('13')
                            props.setCurrentCharacterAction('personalOwner');
                            props.setOwnerNameAction(result[0].name);
                        } else {
                            Toast.show('个人车主身份被禁用，请联系客服人员');
                            return
                        }
                    } else {
                        // 确认企业车主
                        if (result[0].status != 10) {
                            result[0].certificationStatus == '1201' ?
                                props.setOwnerCharacterAction('21')
                                : result[0].certificationStatus == '1202' ?
                                props.setOwnerCharacterAction('22') :
                                props.setOwnerCharacterAction('23')
                            props.setCurrentCharacterAction('businessOwner');
                            props.setOwnerNameAction(result[0].name);
                        } else {
                            Toast.show('企业车主身份被禁用，请联系客服人员');
                            return
                        }
                    }
                    // 保存承运商编码
                    props.setCompanyCodeAction(result[0].companyCode);
                    props.saveCompanyInfoAction(result[0]);

                }

                if (result[0].owner == 2) {
                    // 司机
                    if (result[0].status != 10) {
                        result[0].certificationStatus == '1201' ?
                            props.setDriverCharacterAction('1')
                            : result[0].certificationStatus == '1202' ?
                            props.setDriverCharacterAction('2') :
                            props.setDriverCharacterAction('3')
                        props.setCurrentCharacterAction('driver')
                    } else {
                        Toast.show('司机身份被禁用，请联系客服人员');
                        return
                    }
                }
            }

            if (result.length == 2) {

                if (result[0].owner == 1) {
                    // 保存承运商编码
                    // props.getCompanyCodeAction(responseData.result[0].companyCode);
                    // 先是车主
                    if (result[0].companyNature == '个人') {
                        // 确认个人车主
                        if (result[0].status != 10) {
                            result[0].certificationStatus == '1201' ?
                                props.setOwnerCharacterAction('11')
                                : result[0].certificationStatus == '1202' ?
                                props.setOwnerCharacterAction('12') :
                                props.setOwnerCharacterAction('13')
                        } else {
                            props.setOwnerCharacterAction('14')
                        }
                    } else {
                        // 确认企业车主
                        if (result[0].status != 10) {
                            result[0].certificationStatus == '1201' ?
                                props.setOwnerCharacterAction('21')
                                : result[0].certificationStatus == '1202' ?
                                props.setOwnerCharacterAction('22') :
                                props.setOwnerCharacterAction('23')
                        } else {
                            props.setOwnerCharacterAction('24')
                        }
                    }

                    // 后是司机
                    if (result[1].status != 10) {
                        result[1].certificationStatus == '1201' ?
                            props.setDriverCharacterAction('1')
                            : result[1].certificationStatus == '1202' ?
                            props.setDriverCharacterAction('2') :
                            props.setDriverCharacterAction('3')
                    } else {
                        props.setDriverCharacterAction('4')
                    }

                    if (result[0].status == 10 && result[1].status == 10) {
                        Toast.show('司机车主身份均被禁用，请联系客服人员')
                        return
                    }
                    if (result[0].status == 10) {
                        props.setCurrentCharacterAction('driver');
                    }

                    if (result[1].status == 10) {
                        props.saveCompanyInfoAction(result[1]);
                        if (result[0].companyNature == '个人') {
                            props.setCurrentCharacterAction('personalOwner');
                            props.setOwnerNameAction(result[0].name);
                        } else {
                            props.setCurrentCharacterAction('businessOwner');
                            props.setOwnerNameAction(result[0].name);
                        }
                    } else {
                        props.setCurrentCharacterAction('driver');
                        props.setOwnerNameAction(result[0].name);
                        props.setCompanyCodeAction(result[0].companyCode);
                    }
                }

                if (result[0].owner == 2) {
                    // 先是司机
                    if (result[0].status != 10) {
                        result[0].certificationStatus == '1201' ?
                            props.setDriverCharacterAction('1')
                            : result[0].certificationStatus == '1202' ?
                            props.setDriverCharacterAction('2') :
                            props.setDriverCharacterAction('3')
                    } else {
                        props.setDriverCharacterAction('4')
                    }

                    // 后是车主
                    if (result[1].companyNature == '个人') {

                        // 确认个人车主
                        if (result[1].status != 10) {
                            result[1].certificationStatus == '1201' ?
                                props.setOwnerCharacterAction('11')
                                : result[1].certificationStatus == '1202' ?
                                props.setOwnerCharacterAction('12') :
                                props.setOwnerCharacterAction('13')
                        } else {
                            props.setOwnerCharacterAction('14')
                        }
                    } else {

                        // 确认企业车主
                        if (result[1].status != 10) {
                            result[1].certificationStatus == '1201' ?
                                props.setOwnerCharacterAction('21')
                                : result[1].certificationStatus == '1202' ?
                                props.setOwnerCharacterAction('22') :
                                props.setOwnerCharacterAction('23')
                        } else {
                            props.setOwnerCharacterAction('24')
                        }
                    }


                    if (result[0].status == 10 && result[1].status == 10) {
                        Toast.show('司机车主身份均被禁用，请联系客服人员')
                        return
                    }
                    if (result[1].status == 10) {
                        props.setCurrentCharacterAction('driver');
                    }

                    if (result[0].status == 10) {
                        props.saveCompanyInfoAction(result[1]);
                        if (result[0].companyNature == '个人') {
                            props.setOwnerNameAction(result[1].name);
                            props.setCurrentCharacterAction('personalOwner');
                        } else {
                            props.setOwnerNameAction(result[1].name);
                            props.setCurrentCharacterAction('businessOwner');
                        }
                    } else {
                        props.setCurrentCharacterAction('driver');
                        props.setOwnerNameAction(result[1].name);
                        props.setCompanyCodeAction(result[1].companyCode);
                    }

                }
            }

            if(type === 'main'){
            }else {

                JPushModule.setAlias(global.phone, () => {
                    console.log("Set alias succeed ! tag: ", user.phoneNumber);
                    dispatch(appendLogToFile('登录', '设置推送别名成功', startTime))
                }, () => {
                    console.warn("Set alias failed");
                    dispatch(appendLogToFile('登录', '设置推送别名失败', startTime))
                });

                props.navigation.dispatch({
                    type: 'Main',
                    mode: 'reset',
                    params: {title: '', currentTab: 'Home', insiteNotice: '123'}
                })

            }
        }

    }
}

function mapStateToProps(state) {
    return {
        driverStatus: state.user.get('driverStatus'),
        ownerStatus: state.user.get('ownerStatus'),
    };

}

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        /*登录成功发送Action，全局保存用户信息*/
        sendLoginSuccessAction: (result) => {
            dispatch(loginSuccessAction(result));
            dispatch(setUserNameAction(result.userName ? result.userName : result.phone))
        },
        setDriverCharacterAction: (result) => {
            dispatch(setDriverCharacterAction(result));
        },
        setOwnerCharacterAction: (result) => {
            dispatch(setOwnerCharacterAction(result));
        },
        setCurrentCharacterAction: (result) => {
            dispatch(setCurrentCharacterAction(result));
        },
        setCompanyCodeAction: (result) => {
            dispatch(setCompanyCodeAction(result));
        },
        setOwnerNameAction: (data) => {
            dispatch(setOwnerNameAction(data));
        },
        saveCompanyInfoAction: (result) => {
            dispatch(saveCompanyInfoAction(result));
        },
        saveUserTypeInfoAction: (result) => {
            dispatch(saveUserTypeInfoAction(result));
        },
    };
}

connect(mapStateToProps, mapDispatchToProps)(LoginCharacter);

export default new LoginCharacter;

