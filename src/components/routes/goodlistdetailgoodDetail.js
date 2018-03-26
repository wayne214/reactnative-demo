import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
} from 'react-native';
const { height,width } = Dimensions.get('window');
import moment from 'moment';

const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 20
    },
});

class goodlistdetailgoodDetail extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        console.log('new Date()= ', new Date());

        let startDate = '';
        let endDate = '';

        if (this.props.beginTime != '' && this.props.beginTime) {
            startDate = moment(this.props.beginTime).format('YYYY-MM-DD HH:mm');
        } else {
            startDate = '';
        }

        if (this.props.endTime != '' && this.props.endTime) {
            endDate = moment(this.props.endTime).format('YYYY-MM-DD HH:mm');
        } else {
            endDate = '';
        }

        let loadTime = '';
        if (startDate !== '' && endDate !== '') {
            loadTime = startDate + '-' + endDate;
        } else {
            loadTime = '';
        }

        let arriveTime = this.props.arriveTime ? this.props.arriveTime : '';

        // {item.businessType == '501' ? '撮合' : '自营'}

        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{width: 80,color: '#999'}}>货物详情：</Text>
                    <Text style={{width: width - 20 -20 -80, color: '#666'}}>
                        {this.props.goodDetail}
                    </Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                    <Text style={{width: 80,color: '#999'}}>装货时间：</Text>
                    <Text style={{width: width - 20 -20 -80, color: '#666'}}>
                        {loadTime != '' ? loadTime : ''}
                    </Text>
                </View>
                {
                    this.props.businessType != '501' ? <View>
                            <View style={{flexDirection: 'row', marginTop: 10}}>
                                <Text style={{width: 80,color: '#999'}}>到货时间：</Text>
                                <Text style={{width: width - 20 -20 -80, color: '#666'}}>

                                    {arriveTime != '' ? moment(arriveTime).format('YYYY-MM-DD HH:mm') : ''}

                                </Text>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 10}}>
                                <Text style={{width: 80,color: '#999'}}>温度要求：</Text>
                                <Text style={{width: width - 20 -20 -80, color: '#666'}}>
                                    {this.props.hot}
                                </Text>
                            </View>
                        </View> : null
                }
                <View style={{flexDirection: 'row', marginTop: 10}}>
                    <Text style={{width: 80,color: '#999'}}>备        注：</Text>
                    <Text style={{width: width - 20 -20 -80, color: '#666'}}>
                        {this.props.remark}
                    </Text>
                </View>
            </View>
        )
    }
}
goodlistdetailgoodDetail.propTypes = {
    goodDetail:PropTypes.string.isRequired,
    beginTime:PropTypes.string.isRequired,
    endTime:PropTypes.string.isRequired,
    hot:PropTypes.string.isRequired,
    remark:PropTypes.string.isRequired,
    businessType: PropTypes.string.isRequired,
};

goodlistdetailgoodDetail.defaultProps = {

};



export default goodlistdetailgoodDetail;
