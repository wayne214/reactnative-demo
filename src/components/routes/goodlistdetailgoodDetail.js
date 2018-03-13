import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions
} from 'react-native';
const { height,width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 20
    },
});

class goodlistdetailgoodDetail extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{width: 80,color: '#999'}}>货物详情：</Text>
                    <Text style={{width: width - 20 -20 -80, color: '#666'}}>
                        有冻品 18吨 求 4.2-7.8米 冷藏车
                    </Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                    <Text style={{width: 80,color: '#999'}}>装货时间：</Text>
                    <Text style={{width: width - 20 -20 -80, color: '#666'}}>
                        从2017-09-09到2018-0909
                    </Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                    <Text style={{width: 80,color: '#999'}}>到货时间：</Text>
                    <Text style={{width: width - 20 -20 -80, color: '#666'}}>
                        从2017-09-09到2018-0909
                    </Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                    <Text style={{width: 80,color: '#999'}}>温度要求：</Text>
                    <Text style={{width: width - 20 -20 -80, color: '#666'}}>
                        -20° 至 -10°
                    </Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                    <Text style={{width: 80,color: '#999'}}>备        注：</Text>
                    <Text style={{width: width - 20 -20 -80, color: '#666'}}>
                        佛爱的发哦批地方爬都放假啊；打飞机打飞机按揭贷款大家发空如他
                    </Text>
                </View>
            </View>
        )
    }
}

export default goodlistdetailgoodDetail;
