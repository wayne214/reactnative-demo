import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text
} from 'react-native';
import ItemIcon from '../../../assets/home/goodlistitem_icon.png';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
    container:{
        flex: 1,
        marginLeft: 20,
    },
});

class goodlistAddressItem extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row',marginTop:10}}>
                    <Image source={ItemIcon} style={{marginTop: 5}}/>
                    <View style={{marginLeft: 10, marginRight: 20}}>
                        <Text style={{fontSize: 15, fontWeight: 'bold',color: '#333'}}>{this.props.startAddress}</Text>
                        <Text style={{fontSize: 15, fontWeight: 'bold', marginTop: 8,color: '#333'}}>{this.props.endAddress}</Text>
                    </View>
                </View>
            </View>
        )
    }
}
goodlistAddressItem.propTypes = {
    startAddress: PropTypes.string.isRequired,
    endAddress: PropTypes.string.isRequired
};
goodlistAddressItem.defaultProps = {
    startAddress:'起始位置',
    endAddress: '终点位置'
};


export default goodlistAddressItem;
