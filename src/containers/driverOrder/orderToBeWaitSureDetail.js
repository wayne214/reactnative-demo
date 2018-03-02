/**
 * Created by mymac on 2017/4/13.
 */
// 待回单页面
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Platform,
    DeviceEventEmitter,
    StyleSheet,
    ImageBackground
} from 'react-native';
import DetailsCell from '../../components/common/source/detailsCell';
import DetailsUserCell from '../../components/common/source/detailsUserCell';
import DetailsRedUserCell from '../../components/common/source/detailsRedUserCell';
import DetailsOrdersCell from '../../components/common/source/detailsOrdersCell';
import TitlesCell from '../../components/common/source/titlesCell';
import TotalsItemCell from '../../components/common/source/totalsItemCell';
import ProductShowItem from '../../components/common/source/OrderDetailProShowItemCell';
import Storage from '../../utils/storage';
import * as API from '../../constants/api';
import Loading from '../../utils/loading';
import * as StaticColor from '../../constants/colors';
import prventDoubleClickUtil from '../../utils/prventMultiClickUtil'
import * as ConstValue from '../../constants/constValue';
import StorageKey from '../../constants/storageKeys';
import BottomButton from '../../components/driverOrder/bottomButtonComponent';
import TaskBackground from '../../../assets/img/driverGood/taskBackground.png';
import * as RouteType from '../../constants/routeType';

const space = 10;
const topSpace = 10;
const topHeight = 40;
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
let userID = '';
let userName = '';

const styles = StyleSheet.create({
    imageBackground: {
        marginTop: 10,
        alignSelf: 'center',
        width: screenWidth - 40,
        ...Platform.select({
            ios: {
                height: 156,
            },
            android: {
                height: 166,
            }
        }),
    },
    constantStyle: {
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 10,
        paddingLeft: 10
    },
    constantIcon: {
        fontFamily: 'iconfont',
        color: StaticColor.COLOR_CONTACT_ICON_COLOR,
        fontSize: 19
    },
    separateLine: {
        height: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
        marginLeft: 10,
        marginRight: 10
    }
});

class orderToBeWaitSureDetail extends Component {

    constructor(props) {
        super(props);
        this.uploadReceipt = this.uploadReceipt.bind(this);
        this.state = {
            showGoodList: false,
            loading: false,
            buttonDisabled: false,
        };
    }

    componentDidMount() {
        Storage.get(StorageKey.USER_INFO).then((userInfo) => {
            if(userInfo) {
                userID = userInfo.userId;
                userName = userInfo.userName;
            }
        });
    }

    // 上传回单界面
    uploadReceipt() {
        this.props.navigation.dispatch({
            type: RouteType.ROUTE_UPLOAD_RECEIPT_PAGE,
            params: {
                transCode: this.props.transCode,
            }
        });
    }

    showGoodInfoList(value) {
        this.setState({
            showGoodList: value,
        });
    }

    render() {
        const {
            deliveryInfo,
            goodsInfoList,
            taskInfo,
            time,
            transCode,
            transOrderStatus,
            transOrderType,
            vol,
            weight,
            index,
            signTime,
            scheduleTime,
            dispatchTime,
            customerCode,
            dispatchTimeAgain,
            scheduleTimeAgain,
        } = this.props;

        const buttonView = taskInfo && taskInfo.isReceipt === '是' ?
            <BottomButton
                text={'回单'}
                onClick={() => {
                    this.uploadReceipt();
                }}
                buttonDisabled={this.state.buttonDisabled}
            /> : null;

        return (
            <View style={{
                ...Platform.select({
                    ios:{height: screenHeight - topHeight - ConstValue.NavigationBar_StatusBar_Height},
                    android:{height: screenHeight - topHeight - 73}
                })
            }}>
                <View
                    style={{
                        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
                        width: screenWidth,
                        paddingLeft: space,
                        paddingRight: space,
                        overflow: 'hidden',
                        marginTop: topSpace,
                        ...Platform.select({
                            ios:{height: screenHeight - topHeight - ConstValue.NavigationBar_StatusBar_Height - 45},
                            android:{height: screenHeight - topHeight - 73 - 45}
                        })
                    }}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{
                            backgroundColor: StaticColor.WHITE_COLOR,
                            ...Platform.select({
                                ios:{height: screenHeight - topHeight - ConstValue.NavigationBar_StatusBar_Height},
                                android:{height: screenHeight - topHeight - 73}
                            }),
                            borderColor: StaticColor.WHITE_COLOR,
                            borderWidth: 1,
                            borderRadius: 5,
                        }}
                    >
                        {
                            taskInfo ?
                                <ImageBackground
                                    source={TaskBackground}
                                    style={[
                                        styles.imageBackground,
                                        taskInfo.committedArrivalTime ? {} : {
                                            ...Platform.select({
                                                ios: {
                                                    height: 128,
                                                },
                                                android: {
                                                    height: 138,
                                                }
                                            }),
                                        }
                                    ]}                                    resizeMode='stretch'>
                                    <View style={styles.constantStyle}>
                                        <Text style={styles.constantIcon}>&#xe68b;</Text>
                                        <Text style={{fontSize: 17, fontWeight: 'bold', marginLeft: 10,}}>
                                            {deliveryInfo.receiveContact}
                                        </Text>
                                    </View>
                                    <View style={styles.separateLine}/>
                                    <View style={{marginHorizontal: 10}}>
                                        <DetailsOrdersCell
                                            ifReceipt={taskInfo.isReceipt?taskInfo.isReceipt:''}
                                            receiptStyle={taskInfo.receiptWay}
                                            arrivalTime={taskInfo.committedArrivalTime ? taskInfo.committedArrivalTime.replace(/-/g, '/') : ''}
                                        />
                                    </View>
                                </ImageBackground> :
                                <View>
                                    <View style={[styles.constantStyle, {marginLeft: 5}]}>
                                        <Text style={styles.constantIcon}>&#xe68b;</Text>
                                        <Text style={{fontSize: 17, fontWeight: 'bold', marginLeft: 10}}>
                                            {deliveryInfo.receiveContact}
                                        </Text>
                                    </View>
                                    <View style={styles.divideLine}/>
                                </View>
                        }
                        <TitlesCell title="配送信息" />
                        <View style={{height: 1, backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND, marginLeft: 10}}/>
                        <DetailsUserCell
                            deliveryInfo={deliveryInfo}
                            onSelectAddr={() => {
                                this.props.addressMapSelect(index, 'departure');
                            }}
                            isShowContactAndPhone={true}
                        />
                        <DetailsRedUserCell
                            deliveryInfo={deliveryInfo}
                            onSelectAddr={() => {
                                this.props.addressMapSelect(index, 'receive');
                            }}
                            isShowContactAndPhone={true}
                        />
                        <View style={{height: 1, backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND}} />
                        <TitlesCell title="货品信息" showArrowIcon={true} onPress={(value) => { this.showGoodInfoList(value); }}/>
                        {
                            this.state.showGoodList ? goodsInfoList.map((item, indexRow) => {
                                return (
                                    <ProductShowItem
                                        key={indexRow}
                                        orderInfo={item}
                                        isLast={indexRow === goodsInfoList.length - 1}
                                    />
                                );
                            }) : null
                        }
                        <View style={{height: 1, backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND}} />
                        <TotalsItemCell totalTons={weight} totalSquare={vol} />
                        <View style={{height: 1, backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND}} />
                        <DetailsCell
                            transportNO_={transCode}
                            transportTime={time}
                            customerCode={customerCode}
                            transOrderType={transOrderType}
                            transOrderStatus={transOrderStatus}
                            scheduleTime={scheduleTime}
                            scheduleTimeAgain={scheduleTimeAgain}
                            dispatchTime={dispatchTime}
                            dispatchTimeAgain={dispatchTimeAgain}
                            signTime={signTime}
                        />

                    </ScrollView>
                    <View style={{backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND, height: 13}} />
                </View>
                {buttonView}
                {this.state.loading ? <Loading/> : null}
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        userInfo: state.user.get('userInfo'),
        currentStatus: state.user.get('currentStatus'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(orderToBeWaitSureDetail);
