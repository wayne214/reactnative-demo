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

    /*
    * businessType (string, optional): 委托类型 ,  1自营干线 2自营卡班 3撮合
     carLength (string, optional): 车长 ,
     carType (string, optional): 车辆类型 ,
     freight (number, optional): 期望运费 ,
     fromAddress (string, optional): 起始地详细地址 ,
     fromAreaCode (string, optional): 起始地区编号 ,
     fromAreaName (string, optional): 起始地区名称 ,
     fromCityCode (string, optional): 起始地市编号 ,
     fromCityName (string, optional): 起始地市名称 ,
     fromProvinceCode (string, optional): 起始地省编号 ,
     fromProvinceName (string, optional): 起始地省名称 ,
     fromTownCode (string, optional): 起始地县编号 ,
     fromTownName (string, optional): 起始地县名称 ,
     goodsTotalVolume (number, optional): 货物总体积 ,
     goodsTotalWeight (number, optional): 货物总重量 ,
     loadingAreaVOList (Array[LoadingAreaVO], optional): 卸货点集合 ,
     loadingEndTime (string, optional): 装车结束时间 ,
     loadingStartTime (string, optional): 装车开始时间 ,
     modifyTime (string, optional): 修改时间 ,
     resourceCode (string, optional): 货源id ,
     toAddress (string, optional): 目的地详细地址 ,
     toAreaCode (string, optional): 区编码 ,
     toAreaName (string, optional): 区名称 ,
     toCityCode (string, optional): 市编码 ,
     toCityName (string, optional): 市名称 ,
     toProvinceCode (string, optional): 目的地省编码 ,
     toProvinceName (string, optional): 省名称 ,
     toTownCode (string, optional): 县编码 ,
     toTownName (string, optional): 县名称*/
    render() {
        const {item} = this.props;

        return (
            <TouchableOpacity style={styles.container} onPress={()=>{
                this.props.itemClick();
            }}>

                <AddressItem startAddress={item.fromAddress} endAddress={item.toAddress}/>
                <View style={{flexDirection: 'row',marginTop: 12,marginLeft: 20}}>

                    {
                        item.loadingAreaVOList && item.loadingAreaVOList.length !== 0 ?
                            <View style={{width: 50, height: 16,backgroundColor: '#0092FF', marginRight: 5}}>
                                <Text style={{textAlign: 'center',padding: 2,fontSize: 10,color: 'white'}}>多点卸货</Text>
                            </View> : null
                    }

                    <View style={{borderColor: '#FF6B6B',borderWidth: 1,width: 30}}>
                        <Text style={{textAlign: 'center',padding:2,fontSize: 10,color: '#FF6B6B'}}>
                            {item.businessType === 1 ? '自营干线' : item.businessType === 2 ? '自营卡班' : '撮合'}
                        </Text>
                    </View>

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
                                <View style={{borderColor: '#999',borderWidth: 1,marginLeft: 5}}>
                                    <Text style={{textAlign: 'center',padding:2,fontSize: 10,color: '#999'}}>自营，不自营</Text>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row',marginTop: 2}}>

                                <View style={{width: 16, height: 16,backgroundColor: '#0092FF',marginLeft: 10}}>
                                    <Text style={{textAlign: 'center',padding: 2,fontSize: 10,color: 'white'}}>求</Text>
                                </View>
                                <View style={{borderColor: '#0092FF',borderWidth: 1,marginLeft: 5}}>
                                    <Text style={{textAlign: 'center',padding:2,fontSize: 10,color: '#0092FF'}}>
                                        {item.carLength}，{item.carType}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{width: 100,flexDirection: 'row'}}>
                        <View style={{width: 1, height: 36, backgroundColor: '#999'}}/>
                        <View style={{justifyContent: 'center',width: 80}}>
                            <Text style={{textAlign: 'right',fontSize: 20,color: '#FF8500',fontWeight: 'bold'}}>
                                {item.freight}
                            </Text>
                        </View>
                        <View style={{marginLeft: 5,justifyContent: 'center',width: 15}}>
                            <Text style={{}}>元</Text>
                        </View>
                    </View>

                </View>
                <View style={{height: 1,backgroundColor: '#E6EAF2',width: width - space*2,marginTop: 12}}/>

                <View style={{flexDirection: 'row',justifyContent: 'flex-end', marginTop: 10}}>
                    <TouchableOpacity style={{padding: 10,backgroundColor: '#0092FF'}}>
                        <Text style={{color: 'white',fontWeight: 'bold',fontSize: 17}}>
                           我要抢单
                        </Text>
                    </TouchableOpacity>
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

export default goodListItem