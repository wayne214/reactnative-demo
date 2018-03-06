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
import Validator from '../../utils/validator';
import Toast from '../../utils/toast';

class devicesBind extends Component {
    constructor(props) {
        super(props);
        this.state = {
            verifiedCode: '',
            modalVisible: false,
        };
        // this.unbindDevice = this.unbindDevice.bind(this);
    }

    componentDidMount() {

    }
    static navigationOptions = ({ navigation }) => {
        return {
            header: <NavigatorBar router={ navigation }/>
        };
    };

    unbindAlert() {
        Alert.alert('', '您是否确定要解除当前设备绑定', [
            {text: '取消', onPress: () => {console.log('取消')}},
            {text: '确定', onPress: () => {this.setState({modalVisible: true})}}
        ])
    }
    unbindDevice() {
        console.log('哈哈');
        this.setState({
            modalVisible: false
        })
        // TODO 请求接口解除设备绑定
    }
    render() {
        return <View style={styles.container}>
            <View style={styles.itemContainer}>
                <Text style={styles.leftText}>当前设备</Text>
                <TouchableOpacity onPress={()=> this.unbindAlert()}>
                    <Text style={styles.rightText}>解除绑定</Text>
                </TouchableOpacity>
            </View>
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.modalVisible}>
                <View style={styles.outContainer}>
                    <View style={styles.subContainer}>
                        <Text style={styles.textStyle}>验证码已经发送至{Validator.newPhone('13321218414')}手
                            机中，请注意查收</Text>
                        <TextInput
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            secureTextEntry={true}
                            value={this.state.verifiedCode}
                            onChangeText={(value) => {
                                this.setState({verifiedCode: value});
                            }}
                        />
                        <View style={{height: 1, width: 270, backgroundColor: '#e8e8e8'}}/>
                        <TouchableOpacity onPress={()=> this.unbindDevice()}>
                        <Text style={{fontSize: 17, color: '#0071FF', marginTop: 10}}>下一步</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    },
    textStyle: {
        fontSize: 16,
        color: '#333333',
    },
    textInput: {
        fontSize: 16,
        width: 230,
        height: 44,
        backgroundColor: '#F2F2F2',
        marginTop: 10,
        marginBottom: 10,
    },
    outContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    subContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        height: 169,
        width: 270,
        borderRadius: 10,
        paddingHorizontal: 20,
    }
});

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(devicesBind);

