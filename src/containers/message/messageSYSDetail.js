import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity, Dimensions,
} from 'react-native';
import styles from '../../../assets/css/message';
import {fetchData} from '../../action/app';
import NavigatorBar from '../../components/common/navigatorbar';
import {SYSTEM_READ_ORNOT} from '../../constants/api';
import BaseComponent from '../../components/common/baseComponent';
import * as RouteType from '../../constants/routeType';

const {height, width} = Dimensions.get('window')

class MessageSYSDetailContainer extends BaseComponent {
    constructor(props) {
        super(props);
        this.title = props.navigation.state.params.title;
        this.isRead = props.navigation.state.params.isRead;
        this.id = props.navigation.state.params.id;
        this.type = props.navigation.state.params.type;
        this.contentTitle = props.navigation.state.params.contentTitle;
        this.content = props.navigation.state.params.content;
        this.publishTime = props.navigation.state.params.publishTime;
        this.linkId = props.navigation.state.params.linkId;
    }

    componentDidMount() {
        super.componentDidMount();
    }

    static navigationOptions = ({navigation}) => {
        return {
            header: <NavigatorBar router={navigation}/>
        };
    };

    componentWillUnmount() {
        super.componentWillUnmount()
    }

    static navigationOptions = ({ navigation }) => {
        return {
            header: <NavigatorBar router={ navigation }/>
        };
    };

    render() {
        const {navigation, user, upgrade, msg} = this.props;

        let mLinkId = '';
        let resourceCode = '';
        let businessType = '';
        if (this.linkId) {
            mLinkId = this.linkId.split(":")[0];
            resourceCode = this.linkId.split(":")[1];
            businessType = this.linkId.split(":")[2];
            // 1:认证驳回，2:修改价格，3:匹配车辆，4:订单驳回，5:订单到达 , 6:货源详情 ， 7：我的承运 ， 8:货源列表

        }

        return (
            <View style={{flex: 1, backgroundColor: '#FFF'}}>
                <NavigatorBar
                    title={this.title}
                    router={this.props.navigation}
                    hiddenBackIcon={false}
                />
                <ScrollView
                    style={{}}
                    showsVerticalScrollIndicator={false}>
                    <Text style={{fontSize: 20, color: '#333333', marginTop: 27,marginLeft: 20, marginRight: 20}}>{this.contentTitle}</Text>
                    <Text style={{fontSize: 14, color: '#999999', marginTop: 13,marginLeft: 20, marginRight: 20}}>{this.publishTime}</Text>
                    <Text style={{fontSize: 14, color: '#666666', marginTop: 25, lineHeight: 26,marginLeft: 20, marginRight: 20}}>{this.content}</Text>

                    {
                        mLinkId != '' && this.title === '消息详情' ?
                            <TouchableOpacity onPress={() => {
                                this.props.navigation.dispatch({
                                    type: RouteType.ROUTE_CONFIGNOR_DETAIL,
                                    params: {
                                        title: '货源详情',
                                        resourceCode: resourceCode,
                                        businessType: businessType
                                    }
                                })
                            }}>
                                <View style={{marginTop: 40}}>
                                    <View style={{height: 0.5, width, backgroundColor: '#e5e5e5'}}/>
                                    <View style={{
                                        flexDirection:'row',
                                        justifyContent:'space-between',
                                        alignItems: 'center',
                                        height: 44,
                                    }}>
                                        <Text style={{marginLeft: 20, marginRight: 20}}>
                                            货源详情
                                        </Text>
                                        <Text style={ styles.arrowRight }>&#xe60d;</Text>
                                    </View>
                                    <View style={{height: 0.5, width, backgroundColor: '#e5e5e5'}}/>
                                </View>
                            </TouchableOpacity>
                            : null
                    }

                </ScrollView>


            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const {app, message, order} = state;
    return {
        user: app.get('user'),
        msg: message.get('msgDetail'),
        currentTab: app.get('currentTab'),
        activeTab: app.get('activeTab'),
        upgrade: app.get('upgrade'),
        upgradeForce: app.get('upgradeForce'),
        upgradeForceUrl: app.get('upgradeForceUrl'),
        noteContent: message.get('noteContent'),

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageSYSDetailContainer);
