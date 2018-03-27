import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text
} from 'react-native';
import ItemIcon from '../../../assets/home/goodlistitem_icon.png';

const styles = StyleSheet.create({
    container:{
        flex: 1
    },
});

class goodlistAddressItem extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row'}}>
                    <Image source={ItemIcon} style={{marginTop: 5}}/>
                    <View style={{marginLeft: 10}}>
                        <Text style={{fontSize: 17, fontWeight: 'bold'}}>{this.props.startAddress}</Text>
                        <Text style={{fontSize: 17, fontWeight: 'bold', marginTop: 10}}>{this.props.endAddress}</Text>
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
