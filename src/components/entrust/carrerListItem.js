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

const {height, width} = Dimensions.get('window');
const space = 15;
class carrerListItem extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        const {bindOrder} = this.props;
        return (
            <TouchableOpacity style={styles.container} onPress={()=>{
                this.props.itemClick();
            }}>

                <AddressItem startAddress='北京市海淀区' endAddress='中华人民共和国首都'/>
                {false && <View style={{marginTop: 12,marginLeft: 20}}>
                    <View style={{width: 50, height: 16,backgroundColor: '#0092FF'}}>
                        <Text style={[styles.orderCodeText, {marginLeft: 18, marginTop: 10}]}>装车时间：{'2017.04.18-2017.04.22'}</Text>
                    </View>
                    <View style={{borderColor: '#FF6B6B',borderWidth: 1,width: 30,marginLeft: 5}}>
                        <Text style={{textAlign: 'center',padding:2,fontSize: 10,color: '#FF6B6B'}}>自营</Text>
                    </View>
                </View>}

                <View style={{height: 1,backgroundColor: '#E6EAF2',width: width - space*2,marginTop: 12}}/>


                {
                    true && <View style={{marginTop: 10, flexDirection: 'row'}}>
                        <View style={{width: width - space*2 - 100,flexDirection: 'row'}}>
                            <Image style={{borderRadius: 18,backgroundColor: 'red',width: 36, height: 36}}/>

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
                                        <Text style={{textAlign: 'center',padding:2,fontSize: 10,color: '#0092FF'}}>4.3米-7.2米车，冷藏车</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={{width: 100,flexDirection: 'row'}}>
                            <View style={{width: 1, height: 36, backgroundColor: '#999'}}/>
                            <View style={{justifyContent: 'center',width: 80}}>
                                <Text style={{textAlign: 'right',fontSize: 20,color: '#FF8500',fontWeight: 'bold'}}>123456</Text>
                            </View>
                            <View style={{marginLeft: 5,justifyContent: 'center',width: 15}}>
                                <Text style={{}}>元</Text>
                            </View>
                        </View>

                    </View>
                }

                <View style={{height: 1,backgroundColor: '#E6EAF2',width: width - space*2,marginTop: 12}}/>

                <View style={{flexDirection: 'row',justifyContent: 'space-between', marginTop: 10}}>
                    {
                        false && <View style={{width: 100,flexDirection: 'row'}}>
                            <View style={{width: 1, height: 36, backgroundColor: '#999'}}/>
                            <View style={{justifyContent: 'center',width: 80}}>
                                <Text style={{textAlign: 'right',fontSize: 20,color: '#FF8500',fontWeight: 'bold'}}>123456</Text>
                            </View>
                            <View style={{marginLeft: 5,justifyContent: 'center',width: 15}}>
                                <Text style={{}}>元</Text>
                            </View>
                        </View>
                    }
                    {true && <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{color: '#666666', fontSize: 14}}>优先抢单倒计时</Text>
                        <Text style={{color: '#003700', fontSize: 14}}>5’24’</Text>
                    </View>}
                    <TouchableOpacity style={{padding: 10,backgroundColor: '#0092FF'}} onPress={{bindOrder}}>
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

export default carrerListItem