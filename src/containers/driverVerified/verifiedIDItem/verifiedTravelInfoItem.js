import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Platform,
} from 'react-native';

import Line from './verifiedLineItem';

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
    },
    titleStyle:{
        marginTop: 15,
        marginBottom: 15,
        marginLeft: 10,
        fontSize: 15,
        color: '#666666',
        flex: 1,
    },
    touchStyle:{
        flex: 2,
    },
    textInputStyle:{
        marginRight: 10,
        fontSize: 15,
        color: '#333333',
        flex: 2,
        textAlign: 'right',
    },
    textStyle:{
        marginTop: 15,
        marginBottom: 15,
        marginRight: 10,
        fontSize: 15,
        color: '#333333',
        flex: 2,
        textAlign: 'right',
    }
});

class verifiedTravelInfoItem extends Component{
    constructor(props) {
        super(props);

        this.state={
            carNumber: this.props.carNumber,
            carVolume: this.props.carVolume,
            allowNumber: this.props.carAllowNumber,
        };

        this.carNumberValueChange = this.carNumberValueChange.bind(this);
        this.allowNumberValueChange = this.allowNumberValueChange.bind(this);
        this.clickCarType = this.clickCarType.bind(this);
        this.clickCarLength = this.clickCarLength.bind(this);

    }

    /*输入车牌号*/
    carNumberValueChange(text){
        this.props.carNumberChange(text);
    }

    /*输入体积*/
    volumeValueChange(text){
        this.props.volumeValueChange(text);
    }

    /*选择车辆类型*/
    clickCarType(){
        this.props.carTypeClick();
    }

    /*选择车辆类别*/
    clickCarTwoType(){
        this.props.carTypeTwoClick();
    }

    /*选择车长*/
    clickCarLength(){
        this.props.carLengthClick();
    }

    /*输入发动机编号*/
    allowNumberValueChange(text){
        this.props.allowNumberValueChange(text);
    }


    render() {

        const {carType, carWeight, carLength, carTypeTwo} = this.props;


        let catString = '请选择车辆类型';
        let carColor = {color : '#666666'};
        if (carType){
            catString = carType;
            carColor = {color: '#333333'}
        }

        let catString1 = '请选择车辆类别';
        let carColor1 = {color : '#666666'};
        if (carTypeTwo){
            catString1 = carTypeTwo;
            carColor1 = {color: '#333333'}
        }

        let carWeightString = '请选择车辆长度';
        let carWeightColor = {color : '#666666'};
        if (carWeight){
            carWeightString = carWeight + '吨';
            carWeightColor = {color: '#333333'}
        }

        let carLengthString = '请选择车辆长度';
        let carLengthColor = {color : '#666666'};
        if (carLength){
            carLengthString = carLength;
            carLengthColor = {color: '#333333'}
        }

        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        车辆类型
                    </Text>
                    <TouchableOpacity style={styles.touchStyle}
                                      onPress={()=>{
                                          this.clickCarType();
                                      }}>
                        <Text style={[styles.textStyle, carColor]}>
                            {catString}
                        </Text>

                    </TouchableOpacity>
                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        车辆类别
                    </Text>
                    <TouchableOpacity style={styles.touchStyle}
                                      onPress={()=>{
                                          this.clickCarTwoType();
                                      }}>
                        <Text style={[styles.textStyle, carColor]}>
                            {catString1}
                        </Text>

                    </TouchableOpacity>
                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        车型长度
                    </Text>
                    <TouchableOpacity style={styles.touchStyle}
                                      onPress={()=>{
                                          this.clickCarLength();
                                      }}>

                        <Text style={[styles.textStyle, carWeightColor]}>
                            {carLengthString}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        实载重量
                    </Text>
                    <TouchableOpacity style={styles.touchStyle}
                                      onPress={()=>{
                                      }}>

                        <Text style={[styles.textStyle, carLengthColor]}>
                            {carWeightString}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        实载体积(m³)
                    </Text>
                    <TextInput style={styles.textInputStyle}
                               maxLength={7}
                               onChangeText={(text) => {
                                   this.setState({
                                       carVolume: text,
                                   });
                                   this.volumeValueChange(text);
                               }}
                               //keyboardType='number-pad'
                               value={this.state.carVolume}
                               placeholder={'请输入实载体积'}
                               underlineColorAndroid={'transparent'}
                               onFocus={()=>{
                                   this.props.textOnFocus();
                               }}
                    />
                </View>
                <Line/>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        运输许可证号
                    </Text>
                    <TextInput style={styles.textInputStyle}
                               onChangeText={(text) => {
                                    this.setState({
                                        allowNumber: text,
                                    });
                                    this.allowNumberValueChange(text);
                               }}
                               underlineColorAndroid={'transparent'}
                               value={this.state.allowNumber}
                               placeholder={'请输入运输许可证号'}
                               onFocus={()=>{
                                   this.props.textOnFocus();
                               }}
                    />
                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        挂车牌号
                    </Text>
                    <TextInput style={styles.textInputStyle}
                               maxLength={10}
                               onChangeText={(text) => {
                                   this.setState({
                                       carNumber: text,
                                   });
                                   this.carNumberValueChange(text);
                               }}
                               onFocus={()=>{
                                   this.props.textOnFocus();
                               }}
                               value={this.state.carNumber}
                               placeholder={'请输入挂车牌号'}
                               underlineColorAndroid={'transparent'}

                    />
                </View>
                <Line />
            </View>
        )
    }
}

export default verifiedTravelInfoItem;
