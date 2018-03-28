import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    TextInput,
    Keyboard
} from 'react-native';
import * as COLOR from '../../constants/colors'
const {width, height} = Dimensions.get('window');
import Toast from '@remobile/react-native-toast';

const styles = StyleSheet.create({
    container:{
        flex: 1
    },
});

class goodlistdetailMoneyItem extends Component{
    constructor(props) {
        super(props);
        this.state = {
            money: '',
        }
        this._keyboardDidHide = this._keyboardDidHide.bind(this);

    }

    componentWillMount() {
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidHide() {
        this.refs.textInput && this.refs.textInput.blur();
    }


    render() {
        let price = '';

        if (this.props.minPrice && this.props.maxPrice){
            price = String(this.props.minPrice)+'元' + '~' + String(this.props.maxPrice)+'元';
        }


        console.log('this.props.isLoc', this.props.isLocked, this.props.isLocked == '1', this.props.norMoney);
        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{backgroundColor: COLOR.APP_CONTENT_BACKBG,padding: 15, fontWeight: 'bold',color: '#333'}}>我要报价</Text>


                </View>

                <View style={{padding: 20, backgroundColor: 'white',flexDirection:'row'}}>
                    <View style={{borderColor: '#D8D8D8', borderWidth: 0.5,flex: 8,height: 40,flexDirection:'row',justifyContent: 'space-between',alignItems: 'center'}}>
                        <TextInput
                            ref="textInput"
                            style={{flex: 5,height: 30, marginLeft: 10, marginRight: 10, padding: 0}}
                                   value={this.props.isLocked == '1' ? this.props.norMoney + '' : this.state.money}
                                   onChangeText={(money)=>{
                                       this.setState({money});
                                       this.props.moneyChange(money);
                                   }}
                                   underlineColorAndroid="transparent"
                                   keyboardType='decimal-pad'
                                   onBlur={()=>{}}
                                   editable={this.props.isLocked == '1' ? false : true} // 0 不锁定 1 锁定
                        />
                        <Text style={{flex: 1, textAlign: 'center',color: '#999'}}>元</Text>
                    </View>
                <TouchableOpacity style={{flex: 1}} onPress={()=>{
                    if (!this.props.norMoney || this.props.norMoney === 'null') {
                        Toast.showShortCenter('标准运费为空');
                        return;
                    }


                    this.setState({
                        money: String(this.props.norMoney)
                    });
                    this.props.moneyChange(this.props.norMoney);

                }}>
                    <Text style={{textAlign: 'right',lineHeight: 40,color: '#0092FF'}}>标准</Text>
                </TouchableOpacity>
                </View>
                {
                    this.props.businessType === '501' ? null : <View style={{backgroundColor: 'white',paddingHorizontal: 20, paddingBottom: 15}}>
                        <Text style={{paddingVertical: 5,color: 'red',backgroundColor:'#FFF9F9'}}>
                            注：报价范围应该在 {price} 之间
                        </Text>
                    </View>
                }

            </View>
        )
    }
}
goodlistdetailMoneyItem.propTypes = {
    moneyChange:PropTypes.func.isRequired,
    norMoney:PropTypes.string.isRequired
};

export default goodlistdetailMoneyItem;
