/**
 * @author:  wangl
 * 订单列表中全部、待发运、待回单item
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions,
    Image,
} from 'react-native';

import * as StaticColor from '../../constants/colors';
import GoodKindUtil from '../../utils/goodKindUtil';
import CommonLabelCell from '../common/commonLabelCell';
import OrderStateNumView from './orderStateNumView';
import carrierIcon from '../../../assets/img/driverOrder/carrierIcon.png';
const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        backgroundColor: StaticColor.WHITE_COLOR,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: StaticColor.WHITE_COLOR,
        borderBottomColor: StaticColor.COLOR_SEPARATE_LINE,
    },
    timeText: {
        fontSize: 14,
        color: StaticColor.GRAY_TEXT_COLOR,
        marginTop: 8,
    },
    transCodeText: {
        fontSize: 14,
        color: StaticColor.GRAY_TEXT_COLOR,
    },
    arriveAndGoodsText: {
        fontSize: 16,
        color: StaticColor.READ_NUMBER_COLOR,
    },
    separateLine: {
        height: 0.5,
        backgroundColor: StaticColor.DEVIDE_LINE_COLOR,
        marginLeft: 10,
    },
    cellStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rejectImg: {
        position: 'absolute',
        marginTop: 10,
        marginLeft: width - 100,
        alignItems: 'flex-end',
    },
    rightArrow: {
        height: 15,
        width: 8,
        marginRight: 20,
    },
    goodsTotal: {
        flexDirection: 'row',
        marginBottom: 15,
        marginTop: 8,
    },
    content: {
        paddingLeft: 10,
        paddingTop: 15,
        paddingBottom: 5,
    },
    title: {
        flexDirection: 'row',
    },
    text: {
        padding: 10,
    },
    rightContainer: {
        paddingTop: 20,
        flex: 1,
        marginLeft: 20,
        marginRight: 20,
    },
    itemFlag: {
        position: 'absolute',
        top: 0,
        right: 10,
    },
    itemFlagText: {
        position: 'absolute',
        color: StaticColor.WHITE_COLOR,
        backgroundColor: 'transparent',
        top: 14,
        right: 2,
        fontSize: 16,
        fontWeight: 'bold',
        transform: [{rotateZ: '45deg'}],
    },
    goodKindStyle: {
        marginLeft: 10,
        marginTop: 20,
    },
    dispatchLineStyle: {
        fontSize: 17,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
    },
    arriveTimeStyle: {
        fontSize: 12,
        color: StaticColor.GRAY_TEXT_COLOR,
    },
    stateText: {
        fontSize: 14,
        color: StaticColor.BLUE_CONTACT_COLOR,
        textAlign: 'right',
    },
    stateView: {
        flex: 1,
        marginRight: 15,
        marginTop: 10,
        marginBottom: 10,
    },
    orderNumView: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    wrapView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    centerView: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    flexDirection: {
        flexDirection: 'row',
    },
    flex: {
        flex: 1,
    },
    carrierText: {
        marginLeft: 5,
        marginRight: 5,
        fontSize: 13,
        color: StaticColor.COLOR_LIGHT_GRAY_TEXT,
        paddingBottom: 12,
        paddingTop: 12,
    },
    carrierView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: StaticColor.TITLE_BACKGROUND_COLOR,
        marginTop: 10,
        marginRight: 15,
    },
    carrierIcon: {
        marginLeft: 6,
        alignSelf: 'center'
    },
    buttonText: {
        color: StaticColor.WHITE_COLOR,
        fontSize: 15,
        backgroundColor: StaticColor.BLUE_BACKGROUND_COLOR,
        paddingTop: 10,
        paddingBottom: 10,
        textAlign:'center',
        paddingLeft: 15,
        paddingRight: 15,
    },
    buttonView: {
        alignItems: 'flex-end',
        marginRight: 15,
        marginTop: 8,
        marginBottom: 8,
    }
});

class OrdersItemCell extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            showStatus: this.props.orderStatus,
        };
    }

    render() {
        const {
            time,
            scheduleCode,
            distributionPoint,
            arrivalTime,
            weight,
            vol,
            onSelect,
            dispatchStatus,
            stateName,
            orderStatus,
            goodKindsNames,
            scheduleRoutes,
            waitBeSureOrderNum,
            beSureOrderNum,
            transCodeNum,
            temperature,
            goodsCount,
            currentStatus,
            carrierPlateNum,
            carrierName,
            bindGPS,
            checkGPS,
        } = this.props;
        const goodIcon = goodKindsNames && goodKindsNames.length === 1 ? goodKindsNames[0] : '其他';
        const statusView = <Text style={styles.stateText}>{stateName}</Text>;
        const orderNumView = <View style={styles.orderNumView}>
            <OrderStateNumView
                fontText={'待回'}
                num={waitBeSureOrderNum}
                unit={'单'}
            />
            <OrderStateNumView
                style={{marginLeft: 5}}
                fontText={'已回'}
                num={beSureOrderNum}
                unit={'单'}
            />
        </View>;
        const bindGPSView = 1 === 1 ? <View>
            <View style={{height: 0.7, backgroundColor:StaticColor.DEVIDE_LINE_COLOR}} />
            <View style={styles.buttonView}>
                <TouchableOpacity
                    onPress={() => {
                        bindGPS();
                    }}>
                    <Text style={styles.buttonText}>绑定GPS设备</Text>
                </TouchableOpacity>
            </View>
        </View> : <View>
            <View style={{height: 0.7, backgroundColor:StaticColor.DEVIDE_LINE_COLOR}} />
            <View style={styles.buttonView}>
                <TouchableOpacity
                    onPress={() => {
                        checkGPS();
                    }}>
                    <Text style={styles.buttonText}>查看GPS设备</Text>
                </TouchableOpacity>
            </View>
        </View>;
        // const signNumView = <View style={styles.orderNumView}>
        //     <OrderStateNumView
        //         fontText={'已签'}
        //         num={waitBeSureOrderNum}
        //         unit={'单'}
        //     />
        // </View>;
        // const carrierView = <View style={styles.carrierView}>
        //     <Image style={styles.carrierIcon} source={carrierIcon}/>
        //     <Text style={styles.carrierText}>承运者：{carrierName}</Text>
        //     <Text style={styles.carrierText}>{carrierPlateNum}</Text>
        // </View>;
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => {
                        onSelect();
                    }}
                    underlayColor={StaticColor.COLOR_SEPARATE_LINE}
                >
                    <View>
                        {
                            this.state.showStatus == 1 ? null :
                                <View>
                                    <View style={styles.stateView}>
                                        {this.state.showStatus === 0 ? statusView : null}
                                        {/*{this.state.showStatus === 2 ? signNumView : null}*/}
                                        {this.state.showStatus === 3 ? orderNumView : null}
                                    </View>
                                    <View style={styles.separateLine} />
                                </View>
                        }
                        <View style={styles.title}>
                            <View style={styles.goodKindStyle}>
                                {
                                    GoodKindUtil.show(goodIcon)
                                }
                            </View>
                            <View style={styles.rightContainer}>
                                <View style={styles.flexDirection}>
                                    <View style={styles.flex}>
                                        <Text
                                            style={styles.dispatchLineStyle}
                                            numberOfLines={2}
                                        >
                                            {scheduleRoutes ? scheduleRoutes : ''}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={[styles.arriveTimeStyle, {marginTop: 8}]}>到仓时间: {arrivalTime}</Text>
                                <View style={styles.wrapView}>
                                    {
                                        goodKindsNames ? goodKindsNames.map((item, index) => {
                                            return (
                                                <CommonLabelCell
                                                    content={item}
                                                    key={index}
                                                />
                                            )
                                        }) : null
                                    }
                                    <CommonLabelCell
                                        content={`订单${transCodeNum}单`}
                                        containerStyle={{backgroundColor: StaticColor.BLUE_ORDER_NUMBER_COLOR}}
                                        textStyle={{color: StaticColor.BLUE_ORDER_TEXT_COLOR}}
                                    />
                                    <CommonLabelCell
                                        content={`配送点${distributionPoint}`}
                                        containerStyle={{backgroundColor: StaticColor.GREEN_POINTER_COLOR}}
                                        textStyle={{color: StaticColor.GREEN_POINTER_TEXT_COLOR}}
                                    />
                                    {
                                        temperature ?
                                            <CommonLabelCell
                                                content={`车厢温度${temperature}`}
                                                containerStyle={{backgroundColor: StaticColor.PINK_TEMPER_COLOR}}
                                                textStyle={{color: StaticColor.PINK_TEMPER_TEXT_COLOR}}
                                            /> : null
                                    }
                                </View>
                                {/*{*/}
                                    {/*/!*currentStatus == 'driver' ? null : carrierView*!/*/}
                                {/*}*/}
                                <View style={styles.goodsTotal}>
                                    <View style={styles.flexDirection}>
                                        <Text style={[styles.arriveAndGoodsText]}>{weight}</Text>
                                        <Text style={[styles.arriveAndGoodsText, {color: StaticColor.READ_UNIT_COLOR, fontSize: 14, marginTop: 2}]}>Kg</Text>
                                    </View>
                                    <View style={styles.centerView}>
                                        <Text style={[styles.arriveAndGoodsText, {marginLeft: 10}]}>{vol}</Text>
                                        <Text style={[styles.arriveAndGoodsText, {color: StaticColor.READ_UNIT_COLOR, fontSize: 14, marginTop: 2}]}>方</Text>
                                    </View>
                                    <Text style={[styles.arriveAndGoodsText, {marginLeft: 10}]}>{goodsCount}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.separateLine} />
                        <View style={styles.text}>
                            <Text style={styles.transCodeText}>调度单号：{scheduleCode}</Text>
                            <Text style={styles.timeText}>调度时间：{time}</Text>
                        </View>
                        {
                            this.state.showStatus === 1 ? bindGPSView : null
                        }
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

export default OrdersItemCell;
