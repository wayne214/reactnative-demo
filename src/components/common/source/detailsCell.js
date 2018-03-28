/*
 * @author:  wangl
 * @description:  货源详情 运货单界面
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import * as StaticColor from '../../../constants/colors';

const styles = StyleSheet.create({
    transportNo: {
        fontSize: 17,
        color: StaticColor.COLOR_LIGHT_GRAY_TEXT,
    },
    transportTime: {
        fontSize: 14,
        marginTop: 5,
        color: StaticColor.GRAY_TEXT_COLOR,
    },
});
class DetailsCell extends Component {

    static propTypes = {
        transportNO_: PropTypes.string,
        transportTime: PropTypes.string,
        customerCode: PropTypes.string,
        dispatchTime: PropTypes.string,
        dispatchTimeAgain: PropTypes.string,
        signTime: PropTypes.string,
        receiveTime: PropTypes.string,
        scheduleTime: PropTypes.string,
        scheduleTimeAgain: PropTypes.string,
        transOrderType: PropTypes.string,
        transOrderStatus: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            transportNO_: '',
            transportTime: '',
        };
    }

    render() {
        const {
            transOrderType,
            transOrderStatus,
            transportNO_,
            transportTime,
            customerCode,
            scheduleTime,
            scheduleTimeAgain,
            dispatchTime,
            dispatchTimeAgain,
            signTime,
            receiveTime,
        } = this.props;
        return (
            <View
                style={{
                    backgroundColor: StaticColor.WHITE_COLOR,
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingBottom: 10,
                    paddingTop: 10,
                }}
            >
                <Text style={styles.transportTime}>订单编号：{transportNO_}</Text>
                {customerCode ? <Text style={styles.transportTime}>客户单号：{customerCode}</Text> : null}
                <Text style={styles.transportTime}>创建时间：{transportTime ? transportTime.replace(/-/g,'/'):''}</Text>
                {scheduleTime ? <Text style={styles.transportTime}>调度时间：{scheduleTime.replace(/-/g,'/')}</Text>:null}
                {transOrderType === '606' && scheduleTimeAgain ? <Text style={styles.transportTime}>二次调度时间：{scheduleTimeAgain.replace(/-/g,'/')}</Text> : null}
                {parseInt(transOrderStatus) > 2 && dispatchTime? <Text style={styles.transportTime}>发运时间：{dispatchTime.replace(/-/g,'/')}</Text> : null}
                {transOrderType === '606' && dispatchTimeAgain ? <Text style={styles.transportTime}>二次发运时间：{dispatchTimeAgain.replace(/-/g,'/')}</Text> : null}
                {parseInt(transOrderStatus) > 3 && signTime? <Text style={styles.transportTime}>签收时间：{signTime.replace(/-/g,'/')}</Text> : null}
                {parseInt(transOrderStatus) > 4 && receiveTime ? <Text style={styles.transportTime}>回单时间：{receiveTime.replace(/-/g,'/')}</Text> : null}
            </View>
        );
    }
}

export default DetailsCell;
