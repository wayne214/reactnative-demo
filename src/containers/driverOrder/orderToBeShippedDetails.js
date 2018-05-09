// 待发运界面
import React, {Component} from 'react';
import {
    View,
    ScrollView,
    Dimensions,
    Platform,
    Keyboard,
    DeviceEventEmitter,
    Text,
    ImageBackground,
    StyleSheet
} from 'react-native';
import DetailsCell from '../../components/common/source/detailsCell';
import DetailsUserCell from '../../components/common/source/detailsUserCell';
import DetailsRedUserCell from '../../components/common/source/detailsRedUserCell';
import DetailsOrdersCell from '../../components/common/source/detailsOrdersCell';
import TitlesCell from '../../components/common/source/titlesCell';
import TotalsItemCell from '../../components/common/source/totalsItemCell';
import OrderProductInfo from '../../components/driverOrder/orderProductItemInfo';
import * as StaticColor from '../../constants/colors';
import * as ConstValue from '../../constants/constValue';
import TaskBackground from '../../../assets/img/driverGood/taskBackground.png';
import TaskInfoCell from '../driverGoodSource/component/taskInfoCell';
import CommonCell from '../mine/cell/commonCell';

const space = 10;
const topSpace = 10;
const topHeight = 40;
const bottomViewHeight = 44;
let carrierViewHeight = 0;
const screenWidth = Dimensions.get('window').width - space * 2;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    imageBackground: {
        marginTop: 10,
        alignSelf: 'center',
        ...Platform.select({
            ios: {
                height: 156,
            },
            android: {
                height: 166,
            }
        }),
        width: screenWidth - 20
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

export default class OrderDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showGoodList: false,
        };
        this.textInputID = null;
        this.receiveAllNumInfo = this.receiveAllNumInfo.bind(this);
    }
    componentWillMount() {

        if(Platform.OS === 'ios') {
            // Keyboard events监听
            this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
            this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide);
        }

    }

    componentWillUnmount() {
        if(Platform.OS === 'ios') {
            this.keyboardDidShowListener.remove();
            this.keyboardDidHideListener.remove();
        }
    }

    // 键盘弹起后执行
    keyboardDidShow = (e) => {
        if(Platform.OS === 'ios') {
            this.scrollView.scrollTo({x: 0, y: 350 + this.textInputID * 120, animated: true});
        }
    };

    // 键盘收起后执行
    keyboardDidHide = () => {
        if(Platform.OS === 'ios') {
            this.scrollView.scrollToEnd();
        }
    };


    // 货品信息->选择发运的数量
    receiveAllNumInfo(componentID, number, index) {
        // 更新state，改变组件的数量

        const array = this.props.goodsInfoList;

        const item = array[index];
        array[index] = {
            arNums: item.arNums && item.arNums !== '' && item.arNums !== '0' ? item.arNums : item.weight,
            goodsId: item.goodsId,
            goodsName: item.goodsName,
            goodsSpce: item.goodsSpce,
            goodsUnit: item.arNums && item.arNums !== '' &&  item.arNums !== '0' ? item.goodsUnit : 'Kg',
            // refuseDetailDtoList:item.refuseDetailDtoList,没有可不填
            refuseNum: '0',
            refuseReason: '',
            shipmentNum: number,
            signNum: '0',
            paasLineNo: item.paasLineNo,
        };

        this.setState({
            products: array,
        });


        // 获取 发运 的数据格式
        const goodsInfo = [];
        for (let i = 0; i < array.length; i++) {
            const subitem = array[i];

            goodsInfo.push({
                goodsId: subitem.goodsId,
                shipmentNums: subitem.shipmentNum,
                refuseDetail: [
                    {
                        detailNum: null,
                        refuseType: '',
                    },
                ],
                refuseNum: null,
                signNum: null,
                paasLineNo: subitem.paasLineNo,
            });
        }
        const transOrderInfo = {
            transCode: this.props.transCode,
            goodsInfo,
        };
        this.props.chooseResult(this.props.index, transOrderInfo);

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
            chooseResult,
            scheduleTime,
            customerOrderCode,
            isEndDistribution,
            scheduleTimeAgain,
            currentStatus,
            num,
            orderSource
        } = this.props;

        if(currentStatus != 'driver') {
            carrierViewHeight = 44;
        }else {
            carrierViewHeight = 0;
        }

        return (
            <View
                style={{
                    backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
                    width: screenWidth,
                    marginLeft: space,
                    marginRight: space,
                    overflow: 'hidden',
                    marginTop: topSpace,
                    ...Platform.select({
                        ios:{height: screenHeight - topHeight - ConstValue.NavigationBar_StatusBar_Height - bottomViewHeight - carrierViewHeight},
                        android:{height: screenHeight - topHeight - 73 - bottomViewHeight - carrierViewHeight}
                    }),
                }}
            >
                <ScrollView
                    ref={component => this.scrollView = component}
                    showsVerticalScrollIndicator={false}
                    returnKeyType='done'
                    style={{
                        backgroundColor: StaticColor.WHITE_COLOR,
                        ...Platform.select({
                            ios:{height: screenHeight - topHeight - ConstValue.NavigationBar_StatusBar_Height - bottomViewHeight},
                            android:{height: screenHeight - topHeight - 73 - bottomViewHeight,}
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
                                    <Text style={{fontSize: 18, fontWeight: 'bold', marginLeft: 10}}>
                                        {deliveryInfo.receiveContact}
                                    </Text>
                                </View>
                                <View style={styles.divideLine}/>
                            </View>
                        }
                    <TitlesCell title="配送信息"/>
                    <View style={{height: 1, backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND, marginLeft: 20}}/>
                    <DetailsUserCell
                        deliveryInfo={deliveryInfo}
                        onSelectAddr={() => {
                            this.props.addressMapSelect(index, 'departure');
                        }}
                        isShowContactAndPhone={false}
                    />
                    <DetailsRedUserCell
                        deliveryInfo={deliveryInfo}
                        onSelectAddr={() => {
                            this.props.addressMapSelect(index, 'receive');
                        }}
                        isShowContactAndPhone={false}
                    />
                    <View style={{height: 1, backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND}}/>
                    <TitlesCell title="货品信息"
                                showArrowIcon={true}
                                onPress={(value) => {
                                    if(goodsInfoList.length > 0) {
                                        this.showGoodInfoList(value);
                                    }
                                }}
                    />
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
                                        <OrderProductInfo
                                            key={indexRow}
                                            componentID={item.goodsId}
                                            title={item.goodsName}
                                            Specifications={item.goodsSpce}
                                            unit={item.arNums && item.arNums !== '' && item.arNums !== '0' ? item.goodsUnit : 'Kg'}
                                            receiveNum={item.arNums && item.arNums !== '' && item.arNums !== '0' ? item.arNums : item.weight }
                                            arNum={item.arNums && item.arNums !== '' && item.arNums !== '0' ? item.arNums : item.weight}
                                            indexRow={indexRow}
                                            receiveAllNum={(componentID, number, _index) => {
                                                this.receiveAllNumInfo(componentID, number, _index);
                                            }}
                                            itemFocus={()=> {
                                                this.textInputID = indexRow;
                                            }}
                                            itemBlur={()=> {
                                            }}
                                        />
                                    );
                            }) : null
                    }
                    <View style={styles.divideLine}/>
                    <TotalsItemCell totalTons={weight} totalSquare={vol} totalCount={num}/>
                    <View style={styles.divideLine}/>
                    <DetailsCell
                        transportNO_={transCode}
                        transportTime={time}
                        customerCode={customerOrderCode}
                        transOrderType={transOrderType}
                        transOrderStatus={transOrderStatus}
                        scheduleTime={scheduleTime}
                        scheduleTimeAgain={scheduleTimeAgain}
                    />
                </ScrollView>
            </View>

        );
    }
}

OrderDetails.propTypes = {
    index: React.PropTypes.number,
    orderSource: React.PropTypes.number,
    deliveryInfo: React.PropTypes.object,
    chooseResult: React.PropTypes.func,
    transCode: React.PropTypes.string,
    vol: React.PropTypes.number,
    weight: React.PropTypes.number,
    taskInfo: React.PropTypes.object,
    time: React.PropTypes.string,
    transOrderType: React.PropTypes.string,
    transOrderStatus: React.PropTypes.string,
    goodsInfoList: React.PropTypes.array,
    addressMapSelect: React.PropTypes.func,
};

