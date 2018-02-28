import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
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
    render() {
        return <View style={styles.container}>
            <View style={styles.itemContainer}>
                <Text style={styles.leftText}>当前设备</Text>
                <TouchableOpacity onPress={()=> console.log('解除设备绑定')}>
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

