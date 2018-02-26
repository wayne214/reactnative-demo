import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import * as RouteType from '../../constants/routeType'

class mine extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return <View style={styles.container}>
            <Text>我的</Text>

            <TouchableOpacity onPress={()=>{
               Storage.get(StorageKey.changePersonInfoResult).then((value) => {
                    if (value) {
                        this.props.navigation.dispatch({
                            type: RouteType.ROUTE_DRIVER_VERIFIED,
                            params: {resultInfo: value}
                        })
                    } else {
                        this.props.navigation.dispatch({
                            type: RouteType.ROUTE_DRIVER_VERIFIED
                        })
                    }
               });
            }} >
                <Text>司机认证</Text>
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
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(mine);

