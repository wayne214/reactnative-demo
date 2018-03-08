import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions
} from 'react-native';
import * as COLOR from '../../constants/colors'
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container:{
        flex: 1,

    },
});

class goodlistdetailsetTimeItem extends Component{
    constructor(props) {
        super(props);
    }

    static propTypes = {
        style: PropTypes.object,
    };
    componentDidMount(){

    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={{backgroundColor: COLOR.APP_CONTENT_BACKBG,padding: 20}}>预计装货时间</Text>
                <View style={{backgroundColor: 'white',padding: 20,flexDirection: 'row',flex:1 }}>
                    <View style={{flex: 1}}>
                        <View style={{alignItems: 'center',marginRight: 5,height: 40,borderWidth: 1, borderColor: '#D8D8D8',justifyContent: 'space-between',flexDirection: 'row'}}>
                            <Text style={{marginLeft: 5,color: '#CCCCCC'}}>选择日期</Text>
                            <Text style={{marginRight: 5}}>1</Text>
                        </View>
                    </View>
                    <View style={{flex: 1}}>
                        <View style={{alignItems: 'center',marginLeft: 5,height: 40,borderWidth: 1, borderColor: '#D8D8D8',justifyContent: 'space-between',flexDirection: 'row'}}>
                            <Text style={{marginLeft: 5,color: '#CCCCCC'}}>选择日期</Text>
                            <Text style={{marginRight: 5}}>1</Text>
                        </View>
                    </View>
                </View>
                <View style={{backgroundColor: 'white',paddingHorizontal: 20, paddingBottom: 20}}>
                    <Text style={{backgroundColor: '#FFF9F9',paddingVertical: 5,textAlign: 'center',color: 'red'}}>
                        注：装货时间应该在24小时内，避免造成额外损失
                    </Text>
                </View>
            </View>
        )
    }
}

export default goodlistdetailsetTimeItem;
