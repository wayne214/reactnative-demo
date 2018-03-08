import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    TextInput
} from 'react-native';
import * as COLOR from '../../constants/colors'
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container:{
        flex: 1
    },
});

class goodlistdetailMoneyItem extends Component{
    constructor(props) {
        super(props);
        this.state = {
            money: ''
        }
    }

    static propTypes = {
        style: PropTypes.object,
    };
    componentDidMount(){

    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={{backgroundColor: COLOR.APP_CONTENT_BACKBG,padding: 20}}>我要报价</Text>

                <View style={{padding: 20, backgroundColor: 'white',flexDirection:'row'}}>
                    <View style={{borderColor: '#E6EAF2', borderWidth: 1,flex: 5,height: 40,flexDirection:'row',justifyContent: 'space-between',alignItems: 'center'}}>
                        <TextInput style={{flex: 5,height: 30, marginLeft: 10, marginRight: 10}} value={this.state.money}
                                   onChangeText={(money)=>{
                                       this.setState({money});
                                   }}
                        />
                        <Text style={{flex: 1, textAlign: 'center',color: '#999'}}>元</Text>
                    </View>
                <TouchableOpacity style={{flex: 1}}>
                    <Text style={{textAlign: 'right',lineHeight: 40,color: '#0092FF'}}>标准</Text>
                </TouchableOpacity>
                </View>

            </View>
        )
    }
}

export default goodlistdetailMoneyItem;
