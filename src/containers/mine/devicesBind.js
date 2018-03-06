import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';
import NavigatorBar from '../../components/common/navigatorbar';

class devicesBind extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }
    static navigationOptions = ({ navigation }) => {
        return {
            header: <NavigatorBar router={ navigation }/>
        };
    };

    unbindAlert() {
        Alert.alert('温馨提示', '您是否确定要解除当前设备绑定', [
            {text: '取消', onPress: () => {console.log('取消')}},
            {text: '确定', onPress: () => {console.log('下一步')}}
        ])
    }
    render() {
        return <View style={styles.container}>
            <View style={styles.itemContainer}>
                <Text style={styles.leftText}>当前设备</Text>
                <TouchableOpacity onPress={()=> this.unbindAlert()}>
                    <Text style={styles.rightText}>解除绑定</Text>
                </TouchableOpacity>
            </View>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    itemContainer: {
        backgroundColor: '#ffffff',
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    leftText: {
        fontSize: 14,
        color: '#666666'
    },
    rightText: {
        fontSize: 14,
        color: '#0092FF'
    }
});

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(devicesBind);

