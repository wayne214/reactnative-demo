'use strict'

import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native';
import AddressItem from './../routes/goodlistAddressItem';
import moment from 'moment';
import LoginAvatar from '../../../assets/img/mine/login_avatar.png';
import CountDownReact from '../../components/order/countDownReact';

const {height, width} = Dimensions.get('window');
const space = 15;
class carrerListItem extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        const {bindOrder, dispatchCar, rowData, itemClick} = this.props;
        let loadStartTime = '';
        if (rowData.loadingStartTime) {
            loadStartTime = moment(rowData.loadingStartTime).format('YYYY.MM.DD');
        } else {
            loadStartTime = '';
        }

        // const loadStartTime = moment(rowData.loadingStartTime).format('YYYY.MM.DD');
        // // const loadEndTime = moment(rowData.loadingEndTime).format('YYYY.MM.DD');

        const timeSecond = rowData.pushTime - new Date().getTime();
        var seconds = parseInt(timeSecond / 1000 % 60, 10);//计算剩余的秒数

        const endTime = moment(rowData.pushTime).format('YYYY-MM-DD HH:mm:ss');
        // const endTime = '2018-03-21 18:40:00';

        const countDown = <CountDownReact
                date={endTime}
                days={{plural: '天 ', singular: '天 '}}
                hours=":"
                mins=":"
                // segs=":"
                tip=""
                daysStyle={styles.time}
                hoursStyle={styles.time}
                minsStyle={styles.time}
                secsStyle={styles.time}
                firstColonStyle={styles.colon}
                secondColonStyle={styles.colon}
                tipStyle={styles.tip}
                onEnd={() => {
                    // this.setState({
                    //     isEnd: true,
                    // });
                    // onEnded();
                }}
            />;



        console.log('timeSecond', seconds);
        // 货品名称
        let goodName = '';
        rowData.supplyInfoList ? rowData.supplyInfoList.map((goods,index)=>{
            let categoryName = (goods.categoryName && goods.categoryName != 'null') ? goods.categoryName : '';
            let typeName = (goods.typeName && goods.typeName != 'null') ? goods.typeName : '';
            if (index === rowData.supplyInfoList.length - 1){
                goodName+=categoryName + typeName;
            }else
                goodName+=categoryName + typeName+' , '
        }) : null;



            let fromProvinceName = rowData.fromProvinceName ? rowData.fromProvinceName : '';
            let fromCityName = rowData.fromCityName ? rowData.fromCityName : '';
            let fromAreaName = rowData.fromAreaName ? rowData.fromAreaName : '';
            let fromTownName = rowData.fromTownName ? rowData.fromTownName : '';
            let fromAddress1 = rowData.fromAddress ? rowData.fromAddress : '';

        let fromAddress = fromProvinceName +fromCityName +fromAreaName +fromTownName + fromAddress1



        let toProvinceName = rowData.toProvinceName ? rowData.toProvinceName : '';
        let toCityName = rowData.toCityName ? rowData.toCityName : '';
        let toAreaName = rowData.toAreaName ? rowData.toAreaName : '';
        let toTownName = rowData.toTownName ? rowData.toTownName : '';
        let toAddress = rowData.toAddress ? rowData.toAddress : '';

        let endAddress = toProvinceName+toCityName +toAreaName +toTownName+toAddress



        return (
            <TouchableOpacity style={styles.container} onPress={()=>{
                if (itemClick) {itemClick(rowData)};
            }}>
                {
                    rowData.orderStateStr == '待调度' && <View
                        style={{justifyContent: 'center',
                        borderBottomColor: '#f5f5f5',
                        borderBottomWidth: 1,
                        backgroundColor: '#fff',
                        paddingBottom: 10,
                        marginBottom: 10
                        }}>
                        <Text style={{color: '#999999', fontSize: 14}}>订单编号：{rowData.resourceCode}</Text>
                    </View>
                }

                <AddressItem startAddress={fromAddress} endAddress={endAddress}/>

                {rowData.orderStateStr == '待调度' && <View style={{marginLeft: 20}}>
                    {
                        loadStartTime != '' ? <Text style={{marginTop: 10,color: '#999'}}>装车时间：{loadStartTime}</Text> : null
                    }
                    <View style={{borderColor: '#FF6B6B',borderWidth: 1,width: 30, marginTop: 10,borderRadius: 2,backgroundColor: '#FFF9F9'}}>
                        <Text style={{textAlign: 'center',padding:2,fontSize: 10,color: '#FF6B6B'}}>{rowData.businessType == '501' ? '撮合' : '自营'}</Text>
                    </View>
                </View>}

                <View style={{height: 1,backgroundColor: '#E6EAF2',width: width - space*2,marginTop: 12}}/>


                {
                    rowData.orderStateStr == '待确认' && <View style={{marginTop: 10, flexDirection: 'row'}}>
                        <View style={{width: width - space*2 - 100,flexDirection: 'row'}}>
                            <Image style={{borderRadius: 18,backgroundColor: 'red',width: 36, height: 36}} source={LoginAvatar}/>

                            <View>
                                <View style={{flexDirection: 'row'}}>

                                    <View style={{width: 16, height: 16,backgroundColor: '#999',marginLeft: 10}}>
                                        <Text style={{textAlign: 'center',padding: 2,fontSize: 10,color: 'white'}}>有</Text>
                                    </View>
                                    {
                                        goodName && goodName !== '' ?  <View style={{borderColor: '#999',borderWidth: 1,marginLeft: 5}}>
                                            <Text style={{textAlign: 'center',padding:2,fontSize: 10,color: '#999'}}>{goodName}</Text>
                                        </View> :  <View style={{borderColor: '#999',borderWidth: 1,marginLeft: 5}}>
                                            <Text style={{textAlign: 'center',padding:2,fontSize: 10,color: '#999'}}>货品</Text>
                                        </View>
                                    }

                                </View>
                                <View style={{flexDirection: 'row',marginTop: 2}}>

                                    <View style={{width: 16, height: 16,backgroundColor: '#0092FF',marginLeft: 10}}>
                                        <Text style={{textAlign: 'center',padding: 2,fontSize: 10,color: 'white'}}>求</Text>
                                    </View>
                                    {
                                        rowData.carLength ? <View style={{borderColor: '#0092FF',borderWidth: 1,marginLeft: 5}}>
                                            <Text style={{textAlign: 'center',padding:2,fontSize: 10,color: '#0092FF'}}>{rowData.carLength}</Text>
                                        </View> : null
                                    }
                                    {
                                        rowData.carType ? <View style={{borderColor: '#0092FF',borderWidth: 1,marginLeft: 5}}>
                                            <Text style={{textAlign: 'center',padding:2,fontSize: 10,color: '#0092FF'}}>{rowData.carType}</Text>
                                        </View> : null
                                    }
                                </View>
                            </View>
                        </View>
                        {
                            rowData.configFreight ? <View style={{width: 100,flexDirection: 'row'}}>
                                <View style={{width: 1, height: 36, backgroundColor: '#999'}}/>
                                <View style={{justifyContent: 'center',width: 80}}>
                                    <Text style={{textAlign: 'right',fontSize: 20,color: '#FF8500',fontWeight: 'bold'}}>{rowData.configFreight}</Text>
                                </View>
                                <View style={{marginLeft: 5,justifyContent: 'center',width: 15}}>
                                    <Text style={{}}>元</Text>
                                </View>
                            </View> : null
                        }
                    </View>
                }


                <View style={{flexDirection: 'row',justifyContent: 'space-between', marginTop: 10}}>
                    {
                        (rowData.orderStateStr == '待调度' && rowData.configFreight) ?  <View style={{width: 100,flexDirection: 'row'}}>
                            <View style={{justifyContent: 'center',width: 80}}>
                                <Text style={{textAlign: 'right',fontSize: 20,color: '#FF8500',fontWeight: 'bold'}}>{rowData.configFreight}</Text>
                            </View>
                            <View style={{marginLeft: 5,justifyContent: 'center',width: 15}}>
                                <Text style={{}}>元</Text>
                            </View>
                        </View> : null
                    }
                    {rowData.orderStateStr == '待确认' &&  seconds > 0 ? <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{color: '#666666', fontSize: 14}}>优先抢单倒计时</Text>
                        {/*<Text style={{color: '#003700', fontSize: 14}}>{0}’{0}’</Text>*/}
                        {
                            countDown
                        }
                    </View> : <View/>}
                    {
                        rowData.orderStateStr == '待确认' ? (
                            rowData.carrierPrice ?  <TouchableOpacity style={{padding: 10,backgroundColor: '#0092FF',borderRadius: 2}} onPress={() => console.log('点击')}>
                                <Text style={{color: 'white',fontWeight: 'bold',fontSize: 17}}>
                                    我的报价{rowData.carrierPrice}
                                </Text>
                            </TouchableOpacity> : <TouchableOpacity style={{padding: 10,backgroundColor: '#0092FF',borderRadius: 2}} onPress={() => {if (bindOrder) {bindOrder(rowData)}}}>
                                <Text style={{color: 'white',fontWeight: 'bold',fontSize: 17}}>
                                    我要抢单
                                </Text>
                            </TouchableOpacity>
                        ) : (rowData.orderState == '60' ? <TouchableOpacity style={{padding: 10,backgroundColor: '#0092FF',borderRadius: 2}} onPress={() => {if (dispatchCar){dispatchCar(rowData)}}}>
                            <Text style={{color: 'white',fontWeight: 'bold',fontSize: 17}}>
                                重新调车
                            </Text>
                        </TouchableOpacity> : <TouchableOpacity style={{padding: 10,backgroundColor: '#0092FF',borderRadius: 2}} onPress={() => {if (dispatchCar){dispatchCar(rowData)}}}>
                            <Text style={{color: 'white',fontWeight: 'bold',fontSize: 17}}>
                                立即调车
                            </Text>
                        </TouchableOpacity>
                        )
                    }

                </View>

            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        padding: space,
        paddingBottom: 8
    },
    time: {
        paddingHorizontal: 2,
        fontSize: 14,
        color: '#FF8500',
        textAlign: 'center',
        lineHeight: 17,
        fontWeight: 'bold',
    },
    // 冒号
    colon: {
        fontSize: 14,
        color: '#FF8500',
        textAlign: 'center',
        lineHeight: 17,
        fontWeight: 'bold',
    },
    tip: {
        color: '#FF8500',
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 17,
        fontWeight: 'bold',
    },
})

export default carrerListItem