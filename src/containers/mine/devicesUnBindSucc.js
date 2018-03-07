import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Modal,
    TextInput
} from 'react-native';
import NavigatorBar from '../../components/common/navigatorbar';

class devicesUnBindSucc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            verifiedCode: '',
            modalVisible: false,
        };
    }

    componentDidMount() {

    }
    static navigationOptions = ({ navigation }) => {
        return {
            header: <NavigatorBar title='设备绑定'
                                  router={ navigation }
                                  optTitle='确定'
                                  hiddenBackIcon={false}
                                  optTitleStyle={{fontSize: 15, color: '#666666'}}
                                  firstLevelClick={() => {
                                      navigation.goBack();
                                  }}/>
        };
    };

    render() {
        return <View style={styles.container}>
            <Text style={styles.iconStyle}>&#xe63e;</Text>
            <Text style={styles.tipStyle}>设备解绑成功</Text>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center'
    },
    iconStyle: {
        fontFamily: 'iconfont',
        fontSize: 50,
        color: '#0092FF',
        marginTop: 100
    },
    tipStyle: {
        fontSize: 18,
        color: '#333333',
        marginTop: 10
    }
});

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(devicesUnBindSucc);

