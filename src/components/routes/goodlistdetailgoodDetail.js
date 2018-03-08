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
        flex: 1
    },
});

class goodlistdetailgoodDetail extends Component{
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
                <View style={{flexDirection: 'row', flex: 1, padding: 5}}>
                    <Text>货物详情：</Text>
                    <Text>阿斯蒂芬阿道夫是打发的萨芬收到了放款静安寺的房间奥凯电缆发</Text>
                </View>
            </View>
        )
    }
}

export default goodlistdetailgoodDetail;
