import React from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    Alert,
    ListView,
    Animated,
    Platform,
    TouchableOpacity,
    InteractionManager,
    FlatList
} from 'react-native';
import NavigatorBar from '../../components/common/navigatorbar';
import BaseComponent from '../../components/common/baseComponent';
import styles from '../../../assets/css/message';
import TabView from '../../components/common/tabView';
import {
    SYSTEM_MESSAGE,
    SYSTEM_READ_ORNOT,
    STACK_MSG_LIST,
    UPDATE_WEB_MSG,
    CARRIER_DETAIL_INFO
} from '../../constants/api';
import {fetchData, getInitStateFromDB, appendLogToFile} from '../../action/app';
import {
    updateMsgList,
    passSysMessage,
    passWebMessage,
    dispatchRefreshCheckBox,
    refreshList
} from '../../action/message';
import CheckBox from '../../components/common/checkbox';
import Toast from '../../utils/toast';
import {checkedOneOfDatas, isCheckedAll, dispatchClearAllSeclected} from '../../action/message';
import * as RouteType from '../../constants/routeType';
import LoginContainer from '../user/shipperLogin';
import CarLoginContainer from '../user/carLogin';
import {passMsgDetail, dispatchRefreshMessageList} from '../../action/message';

import User from '../../models/user';

let startTime = 0

class MessageContainer extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            pageNo: 1,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            currentTab: props.navigation.state.params.currentTab,
            isActive: false,
            focusedAnim: new Animated.Value(0),
            rightTitle: '编辑'
        };
        this._editor = this._editor.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._endReached = this._endReached.bind(this);
        this._checkedAll = this._checkedAll.bind(this);
        this._changeTab = this._changeTab.bind(this);
        this._change = this._change.bind(this);
        this.toMsgDetail = this.toMsgDetail.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();
        const {user} = this.props;
        if (!user || !user.userId) {
            InteractionManager.runAfterInteractions(() => {
                this.props.navigation.dispatch({
                    type: 'pop'
                });
            });
        } else {
            if (this.state.currentTab === 1) {
                this._changeTab(1);
            } else {
                this.props.getWebMsgs({
                    pageNum: 1,
                    userId: this.props.user.userId,
                    pageSize: 10,
                    pushType: 1,
                });

            }

            // 	if(user.currentUserRole === 1){
            // 		this.props._getUserInfo();
            // 	}
        }
        this.props.navigation.setParams({navigatePress: this._change, text: this.state.rightTitle})

    }

    componentWillUnmount() {
        super.componentWillUnmount()
    }

    componentWillReceiveProps(props) {
        const {messages, isRefreshMsg} = props;
        if (props) {
            this.setState({dataSource: this.state.dataSource.cloneWithRows(messages.toArray())});

            if (isRefreshMsg) {
                // this.props.getSystemMsg({
                // 	pageNo: 1,
                // 	userId: props.user.userId,
                // });
                this._getMsg(this.state.currentTab);
                this.setState({pageNo: 1});
            }
        }
    }

    static navigationOptions = ({navigation}) => {
        return {
            header: <NavigatorBar firstLevelClick={() => {
                navigation.state.params.navigatePress()
            }} optTitle={
                // navigation.state.params.text
                ''
            } router={navigation}/>
        };
    };

    _change = () => {
        this._editor();
    }


    _endReached() {
        if (this.props.hasMore && !this.props.isEndReached) {
            if (this.state.currentTab === 1) {
                this.props.getSystemMsg({
                    pageNum: this.state.pageNo + 1,
                    pageSize: 10,
                    userId: this.props.user.userId,
                    noteFlag: 1,
                });
            } else {
                this.props.getWebMsgs({
                    pageNum: this.state.pageNo + 1,
                    userId: this.props.user.userId,
                    pageSize: 10,
                    pushType: 1,
                })
            }

            this.setState({pageNo: this.state.pageNo + 1});
        }
    }

    _editor() {
        this._toggle();
        this.props.navigation.setParams({text: this.state.rightTitle === '编辑' ? '取消' : '编辑'});
        this.setState({
            isActive: !this.state.isActive,
            rightTitle: this.state.rightTitle === '编辑' ? '取消' : '编辑',
        });
        this.props.dispatch(dispatchRefreshCheckBox({checkStatus: false}));
        this.props.dispatch(dispatchClearAllSeclected());
    }

    _toggle() {
        Animated.timing(
            this.state.focusedAnim, {
                toValue: this.state.isActive ? 0 : 1,
                duration: 200,
            },
        ).start();
    }

    _delOrReadedMsg(type) {
        if (this.props.ids && this.props.ids.toArray().length === 0) {
            return Toast.show('请选择要操作的信息');
        }
        if (type === 'del') {
            Alert.alert(
                '提示',
                '确定要删除吗',
                [
                    {
                        text: '删除', onPress: () => {
                            this.props.updateMsgStatus({
                                readOrDel: 'del',
                                userId: this.props.user.userId,
                                messageId: this.props.ids.join(','),
                            }, this.state.currentTab);
                            this._editor();
                        }
                    },
                    {text: '取消', onPress: () => console.log('cancel')},
                ]
            );
        } else {
            let hasRead = false;
            let currentIds = [];
            this.props.messages.forEach(item => {
                if (item.isChecked && !item.isRead) {
                    hasRead = true;
                    currentIds.push(item.id);
                }
            })
            if (currentIds.length > 0) {
                let options;
                if (this.state.currentTab === 0) {
                    options = {
                        readOrDel: 'read',
                        userId: this.props.user.userId,
                        messageId: currentIds.join(','),
                    }
                } else {
                    options = {
                        userId: this.props.user.userId,
                        noteId: currentIds.join(','),
                    }
                }
                this.props.updateMsgStatus(options, this.state.currentTab);
                this._editor();
            } else {
                Toast.show('所选消息已为读取状态');
                this._editor();
            }
        }
    }

    _checkedAll() {
        this.props.dispatch(isCheckedAll(!this.props.isCheckedAll));
    }

    _checkedInDatas(selectedIndex) {
        this.props.dispatch(checkedOneOfDatas(selectedIndex));
    }

    toMsgDetail(rowDataa){
        this.props.readMessage({
            messageId: rowDataa.id
        })

        this.props.navigation.dispatch({
            type: RouteType.ROUTE_MESSAGE_DETAIL_MAIN,
            params: {
                title: '消息详情',
                id: rowDataa.id,
                type: '0',
                isRead: rowDataa.isRead,
                contentTitle: '',
                content: rowDataa.content,
                publishTime: rowDataa.createTime,
                linkId:rowDataa.linkId,
            }
        })
    }

    _renderItem(rowData, section, rowIndex) {
        let content;
        if (this.state.currentTab === 0) {
            content = (
                <View style={styles.rightContainer}>
                    <Text style={styles.text} numberOfLines={2}>{rowData.content}</Text>
                </View>)
        } else {
            content = (
                <View style={styles.rightContainer}>
                    <Text
                        style={{fontSize: 15, fontWeight: 'bold', color: '#333', marginTop: 18}}>{rowData.title}</Text>
                    <Text style={[styles.text, {marginTop: 10}]} numberOfLines={2}>{rowData.content}</Text>
                    <Text style={[styles.timeText, {
                        textAlign: 'left',
                        marginTop: 5,
                        marginBottom: 20
                    }]}>{rowData.publishTime}</Text>
                </View>)
        }
        return (
            <View key={rowIndex + rowData.id} style={styles.messageCellContainer}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() =>
                        this.state.currentTab == 0 ?
                            this.toMsgDetail(rowData)
                            :
                            this.props.navigation.dispatch({
                                type: RouteType.ROUTE_MESSAGE_DETAIL,
                                params: {
                                    title: '系统公告',
                                    id: rowData.id,
                                    type: this.state.currentTab,
                                    isRead: rowData.isRead
                                }
                            })

                    }>
                    <View style={this.state.currentTab === 0 ? styles.contentContainer : {flexDirection: 'row'}}>
                        <Animated.View style={[styles.checkContainer, {
                            width: this.state.focusedAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 37],
                            }),
                        }]}>
                            <CheckBox
                                style={{marginTop: 2}}
                                contentStyle={{width: 20}}
                                isChecked={rowData.isChecked}
                                checkedFun={this._checkedInDatas.bind(this, rowIndex)}/>
                        </Animated.View>
                        <View style={styles.iconContainer}>
                            <View style={styles.iconBg}>
                                <Text style={[styles.iconFont, {color: '#666', fontSize: 13}]}>&#xe61d;</Text>
                                {
                                    !rowData.isRead &&
                                    <Text style={[styles.iconFont, styles.unreading]}>&#xe630;</Text>
                                }
                            </View>
                        </View>
                        {content}
                    </View>
                </TouchableOpacity>
                <View style={styles.line}></View>
            </View>
        );
    }

    _getMsg(index) {
        if (index === 0) {
            this.props.getWebMsgs({
                pageNum: 1,
                userId: this.props.user.userId,
                pageSize: 10,
                pushType: 1,
            });
        } else if (index === 1) {
            this.props.getSystemMsg({
                pageNum: 1,
                pageSize: 10,
                userId: this.props.user.userId,
                noteFlag: 1,
            });
        }
    }

    _changeTab(index) {
        this._getMsg(index);
        this.setState({pageNo: 1, currentTab: index});
        this.props.dispatch(dispatchRefreshCheckBox({checkStatus: false}));
    }

    render() {
        return (
            <View style={styles.container}>
                <TabView
                    tabs={['通知消息', '系统公告']}
                    currentTab={this.state.currentTab}
                    changeTab={(index) => this._changeTab(index)}/>

                <ListView
                    enableEmptySections={true}
                    onEndReachedThreshold={100}
                    renderRow={this._renderItem}
                    onEndReached={this._endReached}
                    renderFooter={() => <Text style={styles.footerStyle}></Text>}
                    dataSource={this.state.dataSource}/>

                <Animated.View style={[styles.bottomContainer, {
                    height: this.state.focusedAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 50],
                    }),
                }]}>
                    <View style={[styles.bottomView, {alignItems: 'flex-start'}]}>
                        <View style={styles.bottomLeftView}>
                            <CheckBox
                                style={{marginTop: 2}}
                                isChecked={this.props.isCheckedAll}
                                checkedFun={this._checkedAll}/>
                            <Text style={[styles.bottomText, {marginLeft: 5}]}>全选</Text>
                        </View>
                    </View>
                    <View style={styles.bottomView}>
                        {
                            this.state.currentTab === 0 &&
                            <Text onPress={this._delOrReadedMsg.bind(this, 'read')}
                                  style={styles.bottomText}>标记为已读</Text>
                        }
                    </View>
                    <View style={[styles.bottomView, {alignItems: 'flex-end', marginRight: 15}]}>
                        {
                            this.state.currentTab === 0 &&
                            <Text onPress={this._delOrReadedMsg.bind(this, 'del')}
                                  style={[styles.bottomText,]}>删除</Text>
                        }
                        {
                            this.state.currentTab === 1 &&
                            <Text onPress={this._delOrReadedMsg.bind(this, 'read')}
                                  style={[styles.bottomText,]}>标记为已读</Text>
                        }
                    </View>
                </Animated.View>
                {this.props.loading ? this._renderLoadingView() : null}

                {this._renderUpgrade(this.props)}
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const {app, message, user} = state;
    return {
        user: user.get('userInfo'),
        loading: app.get('loading'),
        hasMore: message.get('hasMore'),
        ids: message.getIn(['msg', 'ids']),
        messages: message.getIn(['msg', 'msgs']),
        isEndReached: message.get('isEndReached'),
        isCheckedAll: message.get('isCheckedAll'),
        isRefreshMsg: message.get('isRefreshMsg'),
        upgrade: app.get('upgrade'),
        upgradeForce: app.get('upgradeForce'),
        upgradeForceUrl: app.get('upgradeForceUrl'),

    };
}

const mapDispatchToProps = dispatch => {
    return {
        dispatch,
        getSystemMsg: (body) => {
            startTime = new Date().getTime()
            dispatch(fetchData({
                body,
                method: 'POST',
                failToast: false,
                api: SYSTEM_MESSAGE,
                success: (data) => {
                    dispatch(passSysMessage({data, pageNo: body.pageNum}));
                    dispatch(appendLogToFile('消息列表', '获取站内公告', startTime))
                },
                fail: (error) => {
                    dispatch(refreshList([]));
                    Toast.show(error.message);
                }
            }));
        },
        updateMsgStatus: (body, currentTab) => {
            startTime = new Date().getTime()
            dispatch(fetchData({
                body,
                method: 'POST',
                successToast: true,
                showLoading: true,
                msg: body.readOrDel === 'del' ? '删除成功' : '标记成功',
                api: currentTab === 0 ? UPDATE_WEB_MSG : SYSTEM_READ_ORNOT,
                success: () => {
                    dispatch(updateMsgList());
                    dispatch(appendLogToFile('消息列表', (body.readOrDel === 'del' ? '删除成功' : '标记成功'), startTime))
                }
            }));
        },
        getWebMsgs: (body) => {
            startTime = new Date().getTime()
            dispatch(fetchData({
                body,
                method: 'POST',
                failToast: false,
                api: STACK_MSG_LIST,
                success: (data) => {
                    dispatch(passWebMessage({data, pageNo: body.pageNum}));
                    dispatch(appendLogToFile('消息列表', '获取站内信', startTime))
                },
                fail: (error) => {
                    dispatch(refreshList([]));
                    Toast.show(error.message);
                }
            }));
        },
        _getUserInfo: (body) => {
            dispatch(fetchData({
                body,
                method: 'GET',
                api: CARRIER_DETAIL_INFO,
                success: (data) => {
                    if (!data) return;
                    const user = new User({
                        carId: data.carId,
                        carrierType: data.carrierType,
                        certificationStatus: data.certificationStatus,
                        certificationTime: data.certificationTime,
                        companyName: data.companyName,
                        phoneNumber: data.phoneNumber,
                        username: data.username,
                        carrierId: data.carrierId,
                        driverName: data.driverName,
                        userId: data.id,
                        driverNumber: data.driverNumber,
                        currentUserRole: 1,
                        corporation: data.corporation,
                    });
                    user.save();
                    dispatch(getInitStateFromDB());
                }
            }));
        },
        readMessage: (body) => {
            dispatch(fetchData({
                body,
                method: 'POST',
                api: UPDATE_WEB_MSG + '?messageIds=' + body.messageId,
                success: (data) => {
                    dispatch(dispatchRefreshMessageList());
                }
            }));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageContainer);
