import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

class driverGoods extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return <View style={styles.container}>
            <Text>司机货源</Text>
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
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(driverGoods);

