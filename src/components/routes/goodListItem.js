
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
                    goodName+=goods.typeName;
                }else
                    goodName+=goods.typeName+' , '
            }) : null;
        let needDetail = '';
        if (item.carLength && item.carType){
            needDetail = item.carLength + ' , '+ item.carType
        }else if (item.carLength && !item.carType){
            needDetail = item.carLength
        }else if (!item.carLength && item.carType){
            needDetail = item.carType
        }else
            needDetail = ''


        let fromAddress = item.fromProvinceName + item.fromCityName + item.fromAreaName + item.fromAddress;
        let endAddress = item.toProvinceName + item.toCityName + item.toAreaName + item.toAddress;


        return (
            <TouchableOpacity style={styles.container} onPress={()=>{
                this.props.itemClick();
            }}>

                <AddressItem startAddress={fromAddress} endAddress={endAddress}/>

                <View style={{flexDirection: 'row',marginTop: 12,marginLeft: 20}}>

                    {
                        item.loadingAreaVOList && item.loadingAreaVOList.length !== 0 ?
                            <View style={{width: 50, height: 16,backgroundColor: '#0092FF', marginRight: 5}}>
                                <Text style={{textAlign: 'center',padding: 2,fontSize: 10,color: 'white'}}>多点卸货</Text>
                            </View> : null
                    }

                    {
                        item.businessType ? <View style={{borderColor: '#FF6B6B',borderWidth: 1,width: 30}}>
                            <Text style={{textAlign: 'center',padding:2,fontSize: 10,color: '#FF6B6B'}}>
                                {item.businessType == '601' ? '干线' : item.businessType == '602' ? '卡班' : '撮合'}
                            </Text>
                        </View> : null
                    }


                </View>
                <View style={{height: 1,backgroundColor: '#E6EAF2',width: width - space*2,marginTop: 12}}/>


                <View style={{marginTop: 10, flexDirection: 'row'}}>
                    <View style={{width: width - space*2 - 100,flexDirection: 'row'}}>
                        <Image style={{borderRadius: 18,backgroundColor: 'red',width: 36, height: 36}} source={HeadIcon}/>

                        <View>
                            <View style={{flexDirection: 'row'}}>

                                <View style={{width: 16, height: 16,backgroundColor: '#999',marginLeft: 10}}>
                                    <Text style={{textAlign: 'center',padding: 2,fontSize: 10,color: 'white'}}>有</Text>
                                </View>
                                {
                                    goodName || goodName != '' ? <View style={{borderColor: '#999',borderWidth: 1,marginLeft: 5}}>
                                        <Text style={{textAlign: 'center',padding:2,fontSize: 10,color: '#999',paddingHorizontal: 4}}>

                                            {goodName}

                                        </Text>
                                    </View> : null
                                }

                            </View>
                            <View style={{flexDirection: 'row',marginTop: 2}}>

                                <View style={{width: 16, height: 16,backgroundColor: '#0092FF',marginLeft: 10}}>
                                    <Text style={{textAlign: 'center',padding: 2,fontSize: 10,color: 'white'}}>求</Text>
                                </View>
                                {
                                    needDetail !== '' && <View style={{borderColor: '#0092FF',borderWidth: 1,marginLeft: 5}}>
                                        <Text style={{textAlign: 'center',padding:2,fontSize: 10,color: '#0092FF',paddingHorizontal: 4}}>
                                            {needDetail}

                                        </Text>
                                    </View>
                                }
                            </View>
                        </View>
                    </View>
                    {
                        item.configFreight ? <View style={{width: 100,flexDirection: 'row'}}>
                            <View style={{width: 1, height: 36, backgroundColor: '#999'}}/>
                            <View style={{justifyContent: 'center',width: 80}}>
                                <Text style={{textAlign: 'right',fontSize: 20,color: '#FF8500',fontWeight: 'bold'}}>
                                    {item.configFreight}
                                </Text>
                            </View>
                            <View style={{marginLeft: 5,justifyContent: 'center',width: 15}}>
                                <Text style={{}}>元</Text>
                            </View>
                        </View> : null
                    }


                </View>
                <View style={{height: 1,backgroundColor: '#E6EAF2',width: width - space*2,marginTop: 12}}/>
                {
                    item.carrierPrice ? <View style={{flexDirection: 'row',justifyContent: 'flex-end', marginTop: 10}}>
                        <View style={{padding: 10,backgroundColor: '#0092FF'}}>
                            <Text style={{color: 'white',fontWeight: 'bold',fontSize: 17}}>
                                我的报价{item.carrierPrice}
                            </Text>
                        </View>
                    </View> : <View style={{flexDirection: 'row',justifyContent: 'flex-end', marginTop: 10}}>
                        <View style={{padding: 10,backgroundColor: '#0092FF'}}>
                            <Text style={{color: 'white',fontWeight: 'bold',fontSize: 17}}>
                                我要抢单
                            </Text>
                        </View>
                    </View>
                }
                {/*<View style={{flexDirection: 'row',justifyContent: 'flex-end', marginTop: 10}}>*/}
                    {/*<View style={{padding: 10,backgroundColor: '#0092FF'}}>*/}
                        {/*<Text style={{color: 'white',fontWeight: 'bold',fontSize: 17}}>*/}
                           {/*我要抢单*/}
                        {/*</Text>*/}
                    {/*</View>*/}
                {/*</View>*/}

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

export default goodListItem



