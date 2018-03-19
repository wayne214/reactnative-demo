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

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'white',
    },
});

class goodlistdetailMutilAddress extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        const {subcontainer, lineStyle} = this.props;
        return (
            <View style={styles.container}>
                <View style={[{height: 1,backgroundColor: '#E6EAF2',width: width - 20*2,marginLeft: 20}, lineStyle]}/>

                <View style={[{padding: 20}, subcontainer]}>
                    <Text style={{color: '#999'}}>卸货点</Text>
                    <View style={{flexDirection: 'row', marginTop: 20}}>
                        <View style={{width: 10,height: this.props.address.length * itemHeight}}>
                            {
                                this.props.address.map((item,index)=>{
                                    return(
                                        <View style={{marginTop: 5}}>
                                            <View style={{borderRadius: 4,borderWidth: 2, borderColor: '#0092FF',width: 8,height: 8}}/>
                                            {
                                                index === this.props.address.length - 1 ? null : <View style={{marginLeft: 3,marginTop: 2,width: 2, height: itemHeight - 8 - 5 - 2, backgroundColor: '#AFDDFF'}}/>
                                            }
                                        </View>
                                    )
                                })
                            }
                        </View>
                        <View>
                            {
                                this.props.address.map((item,index)=>{
                                    return(
                                        <Text style={{height: itemHeight,marginLeft: 5,color: '#999'}}>D{index + 1}</Text>

                                    )
                                })
                            }

                        </View>
                        <View>
                            {
                                this.props.address.map((item,index)=>{
                                    return(
                                        <Text style={{height: itemHeight, marginLeft: 5, width: width - 20 - 10 - 5 - 20 - 10,color: '#666'}}>
                                            {item.address}
                                        </Text>

                                    )
                                })
                            }

                        </View>
                    </View>



                </View>


            </View>
        )
    }
}
goodlistdetailMutilAddress.propTypes = {
    address:PropTypes.array.isRequired
};
goodlistdetailMutilAddress.defaultProps = {
    address: []
};


export default goodlistdetailMutilAddress;
