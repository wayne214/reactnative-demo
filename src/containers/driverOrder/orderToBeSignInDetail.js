/**
 * Created by mymac on 2017/4/13.
 */
import React, {Component, PropTypes} from 'react';

import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    DeviceEventEmitter,
    Platform,
    ImageBackground,
    StyleSheet
} from 'react-native';

import DetailsCell from '../../components/common/source/detailsCell';
import DetailsUserCell from '../../components/common/source/detailsUserCell';
import DetailsRedUserCell from '../../components/common/source/detailsRedUserCell';
import DetailsOrdersCell from '../../components/common/source/detailsOrdersCell';

import TitlesCell from '../../components/common/source/titlesCell';
import TotalsItemCell from '../../components/common/source/totalsItemCell';
import ProductShowItem from '../../components/common/source/OrderDetailProShowItemCell';
import * as StaticColor from '../../constants/colors';
import * as ConstValue from '../../constants/constValue';
import BottomButton from '../../components/driverOrder/bottomButtonComponent';
import TaskBackground from '../../../assets/img/driverGood/taskBackground.png';
import TaskInfoCell from '../driverGoodSource/component/taskInfoCell';
import CommonCell from '../mine/cell/commonCell';

const space = 10;
const topSpace = 10;
const topHeight = 40;
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

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
    },
    divideLine: {
        height: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    taskInfoDivideLine: {
        height: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
        marginBottom: 15,
    }
});

export default class orderToBeSignInDetail extends Component {

    static propTypes = {
        signIn: PropTypes.func,
        payment: PropTypes.func,
        taskInfo: PropTypes.object,
        orderSource: PropTypes.number,
        time: PropTypes.string,
        deliveryInfo: PropTypes.object,
        chooseResult: PropTypes.func,
        transCode: PropTypes.string,
        vol: PropTypes.number,
        weight: PropTypes.number,
        transOrderType: React.PropTypes.string,
        transOrderStatus: React.PropTypes.string,
        goodsInfoList: React.PropTypes.array,
        addressMapSelect: React.PropTypes.func,
        index: React.PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.state = {
            showGoodList: false,
            buttonDisabled: false,
        };
    }

    componentWillUnmount() {
        this.listener.remove();
    }

    showGoodInfoList(value) {
        this.setState({
            showGoodList: value,
        });
    }
    render() {
        this.listener = DeviceEventEmitter.addListener('changeState', () => {
            this.setState({
                buttonDisabled: true,
            });
        });

        const {
            deliveryInfo,
            goodsInfoList,
            taskInfo,
            time,
            transCode,
            vol,
            weight,
            index,
            transOrderType,
            transOrderStatus,
            settlementMode,
            isEndDistribution,
            customerOrderCode,
            dispatchTime,
            scheduleTime,
            dispatchTimeAgain,
            scheduleTimeAgain,
            payState,
            settleMethod,
            amount,
            currentStatus,
            num,
            orderSource,
        } = this.props;

        const  buttonView = orderSource === 1 || settlementMode === '20' || (isEndDistribution === 'N' && transOrderType === '606') || payState === '1' || settleMethod !== '20' || amount === '0.00' ?
            <BottomButton
                text={'签收'}
                onClick={() => {
                    this.props.signIn();
                }}
                buttonDisabled={this.state.buttonDisabled}
            /> : <BottomButton
                text={'收款'}
                onClick={() => {
                    this.props.payment();
                }}
                buttonDisabled={this.state.buttonDisabled}
            />;

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
                        taskInfo && orderSource === 1 ?
                            <View>
                                <TitlesCell title="任务信息"/>
                                <View style={{marginLeft: 20}}>
                                    <View style={styles.taskInfoDivideLine}/>
                                    <TaskInfoCell itemName="是否签单返回: " content={taskInfo.receiptWay}
                                                  titleColorStyle={{fontSize: 15,color: StaticColor.COLOR_LIGHT_GRAY_TEXT}}
                                                  contentColorStyle={{fontSize: 15,color: StaticColor.LIGHT_BLACK_TEXT_COLOR}}
                                    />
                                    <View style={[styles.taskInfoDivideLine, {marginTop: 5}]}/>
                                    <TaskInfoCell itemName="是否需要代收款项:  " content={'不需要'}
                                                  titleColorStyle={{fontSize: 15,color: StaticColor.COLOR_LIGHT_GRAY_TEXT}}
                                                  contentColorStyle={{fontSize: 15,color: StaticColor.LIGHT_BLACK_TEXT_COLOR}}
                                    />
                                    <View style={[styles.taskInfoDivideLine, {marginTop: 5}]}/>
                                    <TaskInfoCell itemName="要求到达时间:  " content={taskInfo.committedArrivalTime ? taskInfo.committedArrivalTime.replace(/-/g, '/') : ''}
                                                  titleColorStyle={{fontSize: 15,color: StaticColor.COLOR_LIGHT_GRAY_TEXT}}
                                                  contentColorStyle={{fontSize: 15,color: StaticColor.LIGHT_BLACK_TEXT_COLOR}}
                                    />
                                </View>
                                <View style={[styles.divideLine, {marginTop: 5}]}/>
                            </View> : taskInfo && orderSource === 2 ?
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
                                ]}
                                resizeMode='stretch'>
                                <View style={styles.constantStyle}>
                                    <Text style={styles.constantIcon}>&#xe68b;</Text>
                                    <Text style={{fontSize: 18, fontWeight: 'bold', marginLeft: 10,}}>
                                        {deliveryInfo.receiveContact}
                                    </Text>
                                </View>
                                <View style={styles.separateLine}/>
                                <View style={{marginHorizontal: 10}}>
                                    <DetailsOrdersCell
                                        carrFeePayer={taskInfo.carrFeePayer}
                                        ifReceipt={taskInfo.isReceipt}
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
                    <TitlesCell title="配送信息"/>
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
                    <TitlesCell title="货品信息"
                                showArrowIcon={true}
                                onPress={(value) => {
                                    if(goodsInfoList.length > 0) {
                                        this.showGoodInfoList(value);
                                    }
                                }}/>
                    {
                        this.state.showGoodList && orderSource === 1 ?
                            goodsInfoList.map((item, indexRow) => {
                                return(
                                    <View style={{marginLeft: 5, marginRight: 5}}>
                                        <CommonCell titleColorStyle={{fontSize: 15}} contentColorStyle={{fontSize: 15}}
                                                    itemName={item.categoryName} content={item.typeName} hideBottomLine={'true'}/>
                                    </View>
                                );
                            }) : this.state.showGoodList && orderSource === 2 ?
                            goodsInfoList.map((item, indexRow) => {
                                return (
                                    <ProductShowItem
                                        key={indexRow}
                                        orderInfo={item}
                                        isSign={true}
                                        isLast={indexRow === goodsInfoList.length - 1}
                                    />
                                );
                            }) : null
                    }
                    <View style={{height: 1, backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND}} />
                    <TotalsItemCell totalTons={weight} totalSquare={vol} totalCount={num}/>
                    <View style={{height: 1, backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND}} />
                    <DetailsCell
                        transportNO_={transCode}
                        transportTime={time}
                        customerCode={customerOrderCode}
                        transOrderType={transOrderType}
                        transOrderStatus={transOrderStatus}
                        scheduleTime={scheduleTime}
                        scheduleTimeAgain={scheduleTimeAgain}
                        dispatchTime={dispatchTime}
                        dispatchTimeAgain={dispatchTimeAgain}
                    />
                </ScrollView>
            </View>
                {buttonView}
            </View>
        );
    }
}

