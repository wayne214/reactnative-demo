import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
    loginSuccessAction,
    setUserNameAction,
    setDriverCharacterAction,
    setOwnerCharacterAction,
    setCurrentCharacterAction,
    setCompanyCodeAction,
    setOwnerNameAction
} from '../../action/user';

import { changeTab, showFloatDialog, logout, appendLogToFile } from '../../action/app';
class driverHome extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return <View style={styles.container}>
            <Text>司机首页</Text>
            <TouchableOpacity onPress={()=> {
                this.props.setCurrentCharacterAction('owner');
                this.props.dispatch(changeTab('route'));
            }}>
                <Text>切换身份</Text>
            </TouchableOpacity>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'orange',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        setCurrentCharacterAction: (result) => {
            dispatch(setCurrentCharacterAction(result));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(driverHome);

