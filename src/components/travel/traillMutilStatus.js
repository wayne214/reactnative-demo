import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    Dimensions,
    ScrollView
} from 'react-native';
const {width, height} = Dimensions.get('window');
const itemHeight = 40;
import HelpUtils from '../../utils/helper';

const styles = StyleSheet.create({
    container: {
        height: 250,
        width:width
    }
})

class traillMutilStatus extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        const {container, lineStyle, addresses} = this.props;
        // let addresses = [];
        // this.props.address.map((item)=>{
        //     item.type == 2 ? addresses.push(item) : null;
        // });


        return (
            <ScrollView style={[styles.container, container]}>
                {/*<View style={[{height: 1,backgroundColor: '#E6EAF2',width: width - 20*2,marginLeft: 20}, lineStyle]}/>*/}

                <View style={[{paddingLeft: 15, width: width}, container]}>
                    <View style={[{flexDirection: 'row', backgroundColor: 'white', width: width}, container]}>
                        <View style={{height: addresses.length * itemHeight, backgroundColor: 'white'}}>
                            {
                                addresses.map((item,index)=>{
                                    return(
                                        <View key={index} style={{marginTop: 5}}>
                                            {
                                                index === 0 ? <Text style={{fontFamily:'iconfont', color: '#0092FF', fontSize: 17}}>&#xe63e;</Text> :
                                                    <View style={{borderRadius: 8.5, backgroundColor: '#E4E4E4',width: 17,height: 17}}/>
                                            }

                                            {
                                                index === addresses.length - 1 ? null : <View style={{marginLeft: 6,marginTop: 2,width: 2, height: itemHeight, backgroundColor: '#E6EAF2'}}/>
                                            }
                                        </View>
                                    )
                                })
                            }
                        </View>
                        <View style={{marginLeft: 10, backgroundColor: 'white'}}>
                            {
                                addresses.map((item,index)=>{
                                    console.log('item-data', item);
                                    const discribe = item.discribe ? item.discribe : '未调度';
                                    const operator = item.operator ? item.operator : '';
                                    const operatorUnitName = item.operatorUnitName ? item.operatorUnitName : '';
                                    const discribeContent = discribe + '    操作人：' + operator;
                                    return(
                                        <View key={index} >
                                            {
                                                index === 0 ?
                                                    <View style={{flexDirection: 'row', alignItems:'center', justifyContent: 'space-between', width: width - 10 - 17 - 30}}>
                                                        <Text style={{fontSize: 15, color: '#0092FF'}}>{HelpUtils.getTransOrderStatus(item.state)}</Text>
                                                        <Text style={{fontSize: 15, color: '#0092FF'}}>{item.traceTime}</Text>
                                                    </View>:
                                                    <View style={{flexDirection: 'row', alignItems:'center', justifyContent: 'space-between', width: width - 10 - 17 - 30}}>
                                                        <Text style={{fontSize: 15, color: '#999999'}}>{HelpUtils.getTransOrderStatus(item.state)}</Text>
                                                        <Text style={{fontSize: 15, color: '#999999'}}>{item.traceTime}</Text>
                                                    </View>
                                            }
                                            {
                                                index === 0 ? <Text style={{height: itemHeight, marginTop: 10, color: '#0092FF',fontSize: 14}}>
                                                {discribeContent}
                                                </Text> : <Text style={{height: itemHeight, marginTop: 10, color: '#999999',fontSize: 14}}>
                                                    {discribeContent}
                                                </Text>
                                            }

                                        </View>

                                    )
                                })
                            }

                        </View>
                    </View>



                </View>


            </ScrollView>
        )
    }
}
// goodlistdetailMutilAddress.propTypes = {
//     address:PropTypes.array.isRequired
// };
// goodlistdetailMutilAddress.defaultProps = {
//     address: []
// };


export default traillMutilStatus;
