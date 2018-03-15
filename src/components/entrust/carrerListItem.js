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
const {height, width} = Dimensions.get('window');
const space = 15;
class carrerListItem extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        const {bindOrder, dispatchCar, rowData, itemClick} = this.props;
        const loadStartTime = moment(rowData.loadingStartTime).format('YYYY.MM.DD');
        const loadEndTime = moment(rowData.loadingEndTime).format('YYYY.MM.DD');
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
                        <Text style={{color: '#999999', fontSize: 14}}>订单编号：{'123456'}</Text>
                    </View>
                }

                <AddressItem startAddress={rowData.from} endAddress={rowData.to}/>

                {rowData.orderStateStr == '待调度' && <View style={{marginLeft: 20}}>
                      <Text style={{marginTop: 10,color: '#999'}}>装车时间：{loadStartTime + '-' + loadEndTime}</Text>
                    <View style={{borderColor: '#FF6B6B',borderWidth: 1,width: 30, marginTop: 10}}>
                        <Text style={{textAlign: 'center',padding:2,fontSize: 10,color: '#FF6B6B'}}>{rowData.businessType === 1 ? '自营干线' : rowData.businessType === 2 ? '自营卡班' : '撮合'}</Text>
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
                                    <View style={{borderColor: '#999',borderWidth: 1,marginLeft: 5}}>
                                        <Text style={{textAlign: 'center',padding:2,fontSize: 10,color: '#999'}}>{'水饺'}</Text>
                                    </View>
                                </View>
                                <View style={{flexDirection: 'row',marginTop: 2}}>

                                    <View style={{width: 16, height: 16,backgroundColor: '#0092FF',marginLeft: 10}}>
                                        <Text style={{textAlign: 'center',padding: 2,fontSize: 10,color: 'white'}}>求</Text>
                                    </View>
                                    <View style={{borderColor: '#0092FF',borderWidth: 1,marginLeft: 5}}>
                                        <Text style={{textAlign: 'center',padding:2,fontSize: 10,color: '#0092FF'}}>{rowData.carLength}</Text>
                                    </View>
                                    <View style={{borderColor: '#0092FF',borderWidth: 1,marginLeft: 5}}>
                                        <Text style={{textAlign: 'center',padding:2,fontSize: 10,color: '#0092FF'}}>{rowData.carType}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={{width: 100,flexDirection: 'row'}}>
                            <View style={{width: 1, height: 36, backgroundColor: '#999'}}/>
                            <View style={{justifyContent: 'center',width: 80}}>
                                <Text style={{textAlign: 'right',fontSize: 20,color: '#FF8500',fontWeight: 'bold'}}>{rowData.carrierPrice}</Text>
                            </View>
                            <View style={{marginLeft: 5,justifyContent: 'center',width: 15}}>
                                <Text style={{}}>元</Text>
                            </View>
                        </View>

                    </View>
                }


                <View style={{flexDirection: 'row',justifyContent: 'space-between', marginTop: 10}}>
                    {
                        rowData.orderStateStr == '待调度' && <View style={{width: 100,flexDirection: 'row'}}>
                            <View style={{justifyContent: 'center',width: 80}}>
                                <Text style={{textAlign: 'right',fontSize: 20,color: '#FF8500',fontWeight: 'bold'}}>{rowData.freight}</Text>
                            </View>
                            <View style={{marginLeft: 5,justifyContent: 'center',width: 15}}>
                                <Text style={{}}>元</Text>
                            </View>
                        </View>
                    }
                    {rowData.orderStateStr == '待确认' && <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{color: '#666666', fontSize: 14}}>优先抢单倒计时</Text>
                        <Text style={{color: '#003700', fontSize: 14}}>5’24’</Text>
                    </View>}
                    {
                        rowData.orderStateStr == '待确认' ? <TouchableOpacity style={{padding: 10,backgroundColor: '#0092FF'}} onPress={() => {if (bindOrder) {bindOrder(rowData)}}}>
                            <Text style={{color: 'white',fontWeight: 'bold',fontSize: 17}}>
                                我要抢单
                            </Text>
                        </TouchableOpacity> : <TouchableOpacity style={{padding: 10,backgroundColor: '#0092FF'}} onPress={() => {if (dispatchCar){dispatchCar(rowData)}}}>
                            <Text style={{color: 'white',fontWeight: 'bold',fontSize: 17}}>
                                立即调车
                            </Text>
                        </TouchableOpacity>
                    }

                </View>

            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        padding: space
    },

})

export default carrerListItem