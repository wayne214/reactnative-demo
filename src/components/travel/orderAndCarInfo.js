import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    Dimensions
} from 'react-native';
const {width, height} = Dimensions.get('window');
const itemHeight = 40;
import TabBarView from '../common/tabBarView'

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'white',
    },
});

class orderAndCarInfo extends Component{
    constructor(props) {
        super(props);
        this.state={
            currentTab: 0,
        }
    }

    render() {
        const {subcontainer, lineStyle} = this.props;


        let addresses = [];
        this.props.address.map((item)=>{
            item.type == 2 ? addresses.push(item) : null;
        });

        const carInfo = <View>
            <View style={{flexDirection: 'row'}}>
                <Text style={{color: '#ffffff', fontSize: 14}}>车牌号：</Text>
                <Text style={{color: '#ffffff', fontSize: 14}}>{'沪EB7357'}</Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 5}}>
                <Text style={{color: '#ffffff', fontSize: 14}}>司机：</Text>
                <Text style={{color: '#ffffff', fontSize: 14}}>{'张三'}</Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 5}}>
                <Text style={{color: '#ffffff', fontSize: 14}}>车辆类型：</Text>
                <Text style={{color: '#ffffff', fontSize: 14}}>{'单文车'}</Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 5}}>
                <Text style={{color: '#ffffff', fontSize: 14}}>承运商：</Text>
                <Text style={{color: '#ffffff', fontSize: 14}}>{'上海鲜易供应链管理有限公司'}</Text>
            </View>
        </View>;

        const orderInfo = <View>
            <View style={{flexDirection: 'row'}}>
                <Text style={{color: '#ffffff', fontSize: 14}}>创建时间：</Text>
                <Text style={{color: '#ffffff', fontSize: 14}}>{'沪EB7357'}</Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 5}}>
                <Text style={{color: '#ffffff', fontSize: 14}}>发车时间：</Text>
                <Text style={{color: '#ffffff', fontSize: 14}}>{'张三'}</Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 5}}>
                <Text style={{color: '#ffffff', fontSize: 14}}>业务类型：</Text>
                <Text style={{color: '#ffffff', fontSize: 14}}>{'单文车'}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <View style={{flexDirection: 'row', marginTop: 5}}>
                    <Text style={{color: '#ffffff', fontSize: 14}}>配送点：</Text>
                    <Text style={{color: '#ffffff', fontSize: 14}}>{'1'}</Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 5}}>
                    <Text style={{color: '#ffffff', fontSize: 14}}>装载率：</Text>
                    <Text style={{color: '#ffffff', fontSize: 14}}>{'0.6250'}</Text>
                </View>
            </View>
        </View>;

        return (
            <View style={styles.container}>
                <TabBarView tabs={['订单', '车辆']}
                            changeTab={(index) => {
                                console.log('索引是啥：', index);
                                this.setState({
                                    currentTab: index
                                })
                            }}/>
                {
                    this.state.currentTab === 0 ? orderInfo : carInfo
                }

            </View>
        )
    }
}
// goodlistdetailMutilAddress.propTypes = {
//     address:PropTypes.array.isRequired
// };
// goodlistdetailMutilAddress.defaultProps = {
//     address: []
// };


export default orderAndCarInfo;
