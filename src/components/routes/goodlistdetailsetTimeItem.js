import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity
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


    render() {
        const {startTime, endTime} = this.props;
        const Stime = startTime === '' ? '选择时间' : startTime;
        const Etime = endTime === '' ? '选择时间' : endTime;
        return (
            <View style={styles.container}>
                <Text style={{backgroundColor: COLOR.APP_CONTENT_BACKBG,padding: 20}}>预计装货时间</Text>
                <View style={{backgroundColor: 'white',padding: 20,flexDirection: 'row',flex:1 }}>
                    <View style={{flex: 1}}>
                        <TouchableOpacity style={{
                             alignItems: 'center',
                             marginRight: 5,
                             height: 40,
                             borderWidth: 1,
                             borderColor: '#D8D8D8',
                             justifyContent: 'space-between',
                             flexDirection: 'row'
                        }} onPress={()=>{
                            this.props.startaTimeClick();
                        }}>
                            <Text style={{marginLeft: 5,color: Stime.length === 4 ? '#CCCCCC' : '#666'}}>{Stime}</Text>
                            <Text style={{marginRight: 5,fontFamily: 'iconfont',color: '#999999'}}>
                                &#xe63d;
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1}}>
                        <TouchableOpacity style={{
                            alignItems: 'center',
                            marginLeft: 5,
                            height: 40,
                            borderWidth: 1,
                            borderColor: '#D8D8D8',
                            justifyContent: 'space-between',
                            flexDirection: 'row'
                        }} onPress={()=>{
                            this.props.endTimeClick();
                        }}>
                            <Text style={{marginLeft: 5,color: Etime.length === 4 ? '#CCCCCC' : '#666'}}>{Etime}</Text>
                            <Text style={{marginRight: 5,fontFamily: 'iconfont',color: '#999999'}}>
                                &#xe63d;
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{backgroundColor: 'white',paddingHorizontal: 20, paddingBottom: 20}}>
                    <Text style={{backgroundColor: '#FFF9F9',paddingVertical: 5,color: 'red'}}>
                        注：装货时间应该在24小时内，避免造成额外损失
                    </Text>
                </View>
            </View>
        )
    }
}
goodlistdetailsetTimeItem.propTypes = {
    startaTimeClick: PropTypes.func.isRequired,
    endTimeClick: PropTypes.func.isRequired,
    endTime: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,

};
goodlistdetailsetTimeItem.defaultProps = {
};

export default goodlistdetailsetTimeItem;
