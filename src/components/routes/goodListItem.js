
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
import PropTypes from 'prop-types';
import Helper from '../../utils/helper';
import AddressItem from './goodlistAddressItem';
import HeadIcon from '../../../assets/img/mine/login_avatar.png'
const {height, width} = Dimensions.get('window');
const space = 15;
class goodListItem extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        const {item} = this.props;
        let goodName = '';
        item.supplyInfoList ? item.supplyInfoList.map((goods,index)=>{
                if (index === item.supplyInfoList.length - 1){
                    goodName+=goods.categoryName || '' + goods.typeName || '' + goods.goodsName || '';
                }else
                    goodName+=goods.categoryName || '' + goods.typeName || '' + goods.goodsName || ''+' ';

            }) : null;

        let haveDetail = '';
        if (item.goodsTotalWeight && item.goodsTotalVolume){
            haveDetail = item.goodsTotalWeight+'吨' + ' , '+ item.goodsTotalVolume+'方'
        }else if (item.goodsTotalWeight && !item.goodsTotalVolume){
            haveDetail = item.goodsTotalWeight+'吨'
        }else if (!item.goodsTotalWeight && item.goodsTotalVolume){
            haveDetail = item.goodsTotalVolume+'方'
        }else
            haveDetail = '';

        goodName = goodName.replace('null', '');

        if (goodName == ''){
            haveDetail = '货品 ' + haveDetail;
        }else
            haveDetail = goodName + haveDetail;


        let needDetail = '';
        if (item.carLength && item.carType){
            needDetail = item.carLength + ' , '+ item.carType
        }else if (item.carLength && !item.carType){
            needDetail = item.carLength
        }else if (!item.carLength && item.carType){
            needDetail = item.carType
        }else
            needDetail = '';


        let fromAddress = item.fromProvinceName + item.fromCityName + item.fromAreaName + item.fromAddress;
        let endAddress = item.toProvinceName + item.toCityName + item.toAreaName + item.toAddress;


        return (
            <TouchableOpacity style={styles.container} onPress={()=>{
                this.props.itemClick();
            }}>

                <AddressItem startAddress={fromAddress} endAddress={endAddress}/>

                <View style={{flexDirection: 'row',marginTop: 15,marginLeft: 40}}>

                    {
                        item.loadingAreaVOList && item.loadingAreaVOList.length !== 0 ?
                            <View style={{width: 50, height: 16,backgroundColor: '#0092FF', marginRight: 5}}>
                                <Text style={{textAlign: 'center',padding: 2,fontSize: 10,color: 'white'}}>多点卸货</Text>
                            </View> : null
                    }

                    {
                        item.businessType ? <View style={{borderColor: '#FF6B6B',borderWidth: 1,width: 30,backgroundColor: '#FFF9F9'}}>
                            <Text style={{textAlign: 'center',padding:2,fontSize: 10,color: '#FF6B6B'}}>
                                {item.businessType == '501' ? '撮合' : '自营'}
                            </Text>
                        </View> : null
                    }


                </View>
                <View style={{height: 0.5,backgroundColor: '#E6EAF2',width: width,marginTop: 10}}/>


                <View style={{marginTop: 8, flexDirection: 'row',marginLeft: 20}}>
                    <View style={{width: width - space*2 - 140,flexDirection: 'row'}}>
                        <Image style={{borderRadius: 18,width: 36, height: 36}} source={HeadIcon}/>

                        <View style={{width:width - space*2 - 140,marginTop: 2}}>
                            <View style={{flexDirection: 'row'}}>

                                <View style={{width: 16, height: 16,backgroundColor: '#999',marginLeft: 10,borderRadius: 1}}>
                                    <Text style={{textAlign: 'center',padding: 2,fontSize: 10,color: 'white'}}>有</Text>
                                </View>
                                {
                                    haveDetail !== '' ? <View style={{borderColor: '#999',borderWidth: 0.5,marginLeft: 3,borderRadius: 1}}>
                                        <Text style={{textAlign: 'center',padding:1,fontSize: 10,color: '#999',paddingHorizontal: 4}}>

                                            {haveDetail}

                                        </Text>
                                    </View> : null
                                }

                            </View>
                            <View style={{flexDirection: 'row',marginTop: 2}}>
                                {
                                    needDetail !== '' && <View style={{
                                        width: 16,
                                        height: 16,
                                        backgroundColor: '#0092FF',
                                        marginLeft: 10,
                                        borderRadius: 1
                                    }}>
                                        <Text style={{
                                            textAlign: 'center',
                                            padding: 2,
                                            fontSize: 10,
                                            color: 'white'
                                        }}>求</Text>
                                    </View>
                                }
                                {
                                    needDetail !== '' && <View style={{borderColor: '#0092FF',borderWidth: 0.5,marginLeft: 3,borderRadius: 1}}>
                                        <Text style={{textAlign: 'center',padding:1,fontSize: 10,color: '#0092FF',paddingHorizontal: 4}}>
                                            {needDetail}
                                        </Text>
                                    </View>
                                }
                            </View>
                        </View>
                    </View>
                    {
                        item.configFreight ? <View style={{width: 140,flexDirection: 'row',}}>
                            <View style={{width: 0.5, height: 37, backgroundColor: '#E6EAF2',marginLeft: 10}}/>
                            <View style={{flexDirection: 'row', alignItems: 'center',justifyContent: 'flex-end',flex: 1,marginRight: 10}}>
                                <Text style={{fontSize: 22,color: '#FF8500',fontWeight: 'bold'}}>
                                    {Helper.consignorPrice(null,null,item.configFreight).price}
                                </Text>
                                <Text style={{fontSize: 12,color: '#FF8500',fontWeight: 'bold',alignItems: 'flex-end',width: 25,paddingTop:6}}>
                                    {Helper.consignorPrice(null,null,item.configFreight).unit}
                                </Text>
                                <Text style={{color: '#666'}}>元</Text>
                            </View>
                        </View> : null
                    }


                </View>
                <View style={{height: 0.5,backgroundColor: '#E6EAF2',width: width,marginTop: 8}}/>
                {
                    item.carrierPrice ? <View style={{flexDirection: 'row',justifyContent: 'flex-end', marginTop: 8,borderRadius: 2,marginRight: 20}}>
                        <View style={{padding: 9,backgroundColor: '#0092FF',borderRadius: 1}}>
                            <Text style={{color: 'white',fontWeight: 'bold',fontSize: 15,paddingHorizontal: 5}}>
                                { item.biddingState == '3' ? '抢单失败' : '我的报价' + item.carrierPrice }
                            </Text>
                        </View>
                    </View> : <View style={{flexDirection: 'row',justifyContent: 'flex-end', marginTop: 8,borderRadius: 2,marginRight: 20}}>
                        <View style={{padding: 9,backgroundColor: '#0092FF',borderRadius: 1}}>
                            <Text style={{color: 'white',fontWeight: 'bold',fontSize: 15,paddingHorizontal: 5}}>
                                我要抢单
                            </Text>
                        </View>
                    </View>
                }
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        paddingTop: 12,
        paddingBottom: 8,
        paddingLeft: 0,
        paddingRight: 0
    },

})

export default goodListItem



