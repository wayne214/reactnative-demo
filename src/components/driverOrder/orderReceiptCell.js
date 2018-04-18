/**
 * @author:  xizhixin
 * @description: 待回单列表item
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions,
    Image,
    Alert,
} from 'react-native';

import * as StaticColor from '../../constants/colors';
import Communications from 'react-native-communications';
import OrderStateNumView from './orderStateNumView';
import receiveBottomArrow from '../../../assets/img/driverOrder/receive_bottom_arrow.png';
import upArrow from '../../../assets/img/driverOrder/upArrow.png';
import Contact from '../../../assets/img/driverOrder/contact.png';
import locationRedIcon from '../../../assets/home/locationRed.png';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.WHITE_COLOR,
    },
    subContainer: {
        paddingLeft: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 10,
    },
    contactView:{
        fontSize: 15,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        paddingTop: 15,
        paddingBottom: 15,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
    },
    // 分割线
    separateLine: {
        height: 1,
        backgroundColor: '#e8e8e8',
        marginLeft: 20,
    },
    contactText: {
        fontSize: 14,
        color: StaticColor.BLUE_CONTACT_COLOR,
        alignSelf: 'center',
        marginLeft: 3,
    },
    orderDetailText: {
        flexDirection: 'column',
        marginTop: 13,
        marginBottom: 13
    },
    orderDetailCell: {
        flexDirection: 'row',
        height: 24,
        marginLeft: 15,
        alignItems: 'center',
        width: width - 55,
        justifyContent: 'space-between'
    },
    textSizeNum: {
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        fontSize: 15,
    },
    textSizeWeight: {
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        fontSize: 15,
        marginLeft: 35,
    },
    orderDeatailAll: {
        paddingRight: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FAFAFA',
    },
    orderNumView: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginRight: 10
    },
    titleView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 10,
        paddingTop: 13,
        paddingBottom: 13,
    },
    titleIcon:{
        fontFamily: 'iconfont',
        color: '#A0A0A0',
        fontSize: 18,
        alignSelf: 'center',
    },
    titleText: {
        fontSize: 18,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        alignSelf: 'center',
        marginLeft: 8,
    },
    flexDirection: {
        flexDirection: 'row',
    },
    addressView: {
        flexDirection: 'row',
        paddingTop: 12,
        paddingBottom: 12,
        paddingRight: 10,
        paddingLeft: 11,
    },
    addressText: {
        fontSize: 15,
        color: StaticColor.COLOR_LIGHT_GRAY_TEXT,
        marginLeft: 10,
        marginRight: 15,
        lineHeight: 21,
    },
    divideLine: {
        height: 10,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    batchSignView: {
        // borderRadius: 15,
        // borderColor: StaticColor.GRAY_TEXT_COLOR,
        // borderWidth: 0.5,,
    },
    batchSignContainer: {
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        marginBottom: 10,
    },
    arrowStyle:{
        height: 45,
        justifyContent: 'center',
        paddingLeft: 15,
        position: 'absolute',
        top: 5,
        right: 15,
    },
    orderTimeStyle: {
        marginLeft: 15,
        marginTop: 10,
        color: StaticColor.GRAY_TEXT_COLOR,
        fontSize: 13
    },
    buttonText: {
        fontSize: 17,
        color: StaticColor.WHITE_COLOR,
        backgroundColor: StaticColor.BLUE_BACKGROUND_COLOR,
        paddingTop: 10,
        paddingBottom: 10,
        textAlign: 'center'
    }
});

class orderReceiptCell extends Component {

    static propTypes = {
        style: View.propTypes.style,
        receiveContact: React.PropTypes.string,
        receiveAddress: React.PropTypes.string,
        receiveContactName: React.PropTypes.string,
        receiptTotalNumber: React.PropTypes.number,
        notReceiptNumber: React.PropTypes.number,
        phoneNum: React.PropTypes.string,
        transCodeList: React.PropTypes.array,
        onSelected: React.PropTypes.func,
        onButton: React.PropTypes.func,
        isBatchReceipt: React.PropTypes.bool,
        isZp: React.PropTypes.string,
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isUnfolded: this.props.isBatchSign,
            transCodeArray: this.props.transCodeList,
        };
    }

    renderList(list) {
        return list.map((item, i) => this.renderItem(item, i));
    }

    renderItem(item, i) {
        return (
            <View key={i} style={{marginTop: 13}}>
                <View style={styles.orderDetailCell}>
                    <Text
                        style={styles.textSizeNum}>单号：{item.customerOrderCode ? item.customerOrderCode : item.transCode}</Text>
                    {
                        item.weight ?
                            <Text style={styles.textSizeWeight}>{item.weight}Kg</Text> :
                            <Text style={styles.textSizeWeight}>0Kg</Text>
                    }
                </View>
                <Text style={styles.orderTimeStyle}>订单时间：{item.time ? item.time.replace(/-/g,'/').substring(0, item.time.length - 3) : ''}</Text>
                {
                    i === this.state.transCodeArray.length - 1  ? null : <View style={[styles.separateLine, {width: width, marginLeft: 15, marginTop: 13}]}/>
                }
            </View>
        );
    }

    render() {
        const {
            receiveContact,
            receiveAddress,
            receiveContactName,
            onSelected,
            phoneNum,
            transCodeList,
            notReceiptNumber,
            isBatchReceipt,
            onButton,
            receiptTotalNumber,
            isZp
        } = this.props;
        let transport = transCodeList[0];
        let transport1;
        if(receiptTotalNumber > 1){
            transport1 = transCodeList[1];
        }
        const batchReceiptView = <View>
                <View style={{height: 0.5, backgroundColor: StaticColor.DEVIDE_LINE_COLOR}}/>
                <View style={styles.batchSignContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            onButton();
                        }}
                    >
                        <View style={styles.batchSignView}>
                            <Text style={styles.buttonText}>批量回单</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>;
        const transOrderView = <View style={styles.orderDeatailAll}>
            <View style={styles.orderDetailText}>
                <View style={styles.orderDetailCell}>
                    <Text style={styles.textSizeNum}>单号：{transport.customerOrderCode ? transport.customerOrderCode : transport.transCode}</Text>
                    {
                        transport.weight ?
                            <Text style={styles.textSizeWeight}>{transport.weight}Kg</Text> :
                            <Text style={styles.textSizeWeight}>0Kg</Text>

                    }
                </View>
                <Text style={styles.orderTimeStyle}>订单时间：{transport.time ? transport.time.replace(/-/g,'/').substring(0, transport.time.length - 3) : ''}</Text>
            </View>
        </View>;
        const transOrderViews = this.state.isUnfolded ?
            <View style={styles.orderDeatailAll}>
                <View style={styles.orderDetailText}>
                    <View>
                        <View style={styles.orderDetailCell}>
                            <Text style={styles.textSizeNum}>单号：{transport.customerOrderCode ? transport.customerOrderCode : transport.transCode}</Text>
                            {
                                transport.weight ?
                                    <Text style={styles.textSizeWeight}>{transport.weight}Kg</Text> :
                                    <Text style={styles.textSizeWeight}>0Kg</Text>

                            }
                        </View>
                        <Text style={styles.orderTimeStyle}>订单时间：{transport.time ? transport.time.replace(/-/g,'/').substring(0, transport.time.length - 3) : ''}</Text>
                    </View>
                    <View style={[styles.separateLine, {width: width, marginLeft: 15, marginTop: 13, marginBottom: 13}]}/>
                    {
                        transport1 ?
                            <View>
                            <View style={styles.orderDetailCell}>
                                <Text style={styles.textSizeNum}>单号：{transport1.customerOrderCode ? transport1.customerOrderCode : transport1.transCode}</Text>
                                {
                                    transport1.weight ?
                                        <Text style={styles.textSizeWeight}>{transport1.weight}Kg</Text> :
                                        <Text style={styles.textSizeWeight}>0Kg</Text>
                                }
                            </View>
                            <Text style={styles.orderTimeStyle}>订单时间：{transport1.time ? transport1.time.replace(/-/g,'/').substring(0, transport1.time.length - 3) : ''}</Text>
                        </View> : null
                    }
                </View>
                <TouchableOpacity
                    style={styles.arrowStyle}
                    onPress={() => {
                        this.setState({
                            isUnfolded: false
                        });
                        console.log('this.state', this.state.isUnfolded)
                    }}>
                    <Image source={receiveBottomArrow} />
                </TouchableOpacity>
            </View> : <View style={styles.orderDeatailAll}>
                <View style={[styles.orderDetailText, {marginTop: 0, marginBottom: 13}]}>
                    {this.renderList(transCodeList)}
                </View>
                <TouchableOpacity
                    style={styles.arrowStyle}
                    onPress={() => {
                        this.setState({
                            isUnfolded: true
                        });
                        console.log('this.state', this.state.isUnfolded)
                    }}>
                    <Image source={upArrow} />
                </TouchableOpacity>
            </View>;

        return (
            <View style={styles.container}>
                <TouchableOpacity
                    underlayColor={StaticColor.COLOR_SEPARATE_LINE}
                    onPress={() => {
                        onSelected();
                    }}
                >
                    <View>
                        <View style={styles.titleView}>
                            <View style={styles.flexDirection}>
                                <Text style={styles.titleIcon}>&#xe68b;</Text>
                                <Text style={styles.titleText}>{receiveContact}</Text>
                            </View>
                            <View style={styles.orderNumView}>
                                <OrderStateNumView
                                    fontText={'共'}
                                    num={receiptTotalNumber}
                                    unit={'单'}
                                />
                                <OrderStateNumView
                                    style={{marginLeft: 5}}
                                    fontText={'待回'}
                                    num={notReceiptNumber}
                                    unit={'单'}
                                />
                            </View>
                        </View>
                        <View style={styles.separateLine}/>
                        <View style={styles.addressView}>
                            <Image source={locationRedIcon}/>
                            <Text style={styles.addressText}>
                                {receiveAddress}
                            </Text>
                        </View>
                        {receiptTotalNumber > 1 ? transOrderViews : transOrderView}
                        <View style={styles.subContainer}>
                            <Text style={styles.contactView}>联系人: {receiveContactName}</Text>
                            <TouchableOpacity
                                style={{
                                    paddingTop: 15,
                                    paddingBottom: 15,
                                }}
                                onPress={() => {
                                    Communications.phonecall(phoneNum, true);
                                }}
                            >
                                <View style={styles.flexDirection}>
                                    <Image source={Contact}/>
                                    <Text style={styles.contactText}>联系对方</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {isBatchReceipt && isZp === 'Y' ? batchReceiptView : null}
                </TouchableOpacity>
                <View style={styles.divideLine} />
            </View>
        );
    }
}

export default orderReceiptCell;
