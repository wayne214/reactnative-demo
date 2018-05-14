import React, {Component,} from 'react';
import {
    View,
    StyleSheet,
    ImageBackground,
    Text,
    Dimensions
} from 'react-native';
import topImg from '../../../assets/img/routes/goodlistdetailtop.png';
const { height,width } = Dimensions.get('window');
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
    container:{
        flex: 1
    },
});

class goodlistdetailTopItem extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <ImageBackground style={{width: width, height: 166}} source={topImg}>
                    <View style={{marginLeft: 110, marginTop: 60,width: width - 130}}>

                        <Text style={{backgroundColor: 'transparent', color: '#FF8500',fontSize: 25,fontWeight: 'bold'}}>{this.props.price || ''}</Text>
                        <Text style={{backgroundColor: 'transparent', color: '#999',fontSize: 12, marginTop: 5}}>标准运费（元）</Text>
                    </View>
                </ImageBackground>
            </View>
        )
    }
}
goodlistdetailTopItem.propTypes = {
    price: PropTypes.string.isRequired,
};
goodlistdetailTopItem.defaultProps = {
    price:'费用',
};


export default goodlistdetailTopItem;
