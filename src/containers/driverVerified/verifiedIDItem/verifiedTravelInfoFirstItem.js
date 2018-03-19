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
            owner: this.props.carOwner,
            engineNumber: this.props.carEngineNumber,
            carType: this.props.carType,
            carVin: this.props.carVin,
        };

        this.carNumberValueChange = this.carNumberValueChange.bind(this);
        this.ownValueChange = this.ownValueChange.bind(this);
        this.carTypeChange = this.carTypeChange.bind(this);
        this.carVINChange = this.carVINChange.bind(this);
        this.textOnFocus = this.textOnFocus.bind(this);

    }

    /*输入车牌号*/
    carNumberValueChange(text){
        this.props.carNumberChange(text);
    }

    /*输入所有人*/
    ownValueChange(text){
        this.props.carOwnerChange(text);
    }

    /*输入车辆类型*/
    carTypeChange(text){
        this.props.carTypeChange(text);
    }

    /*输入代码VIN*/
    carVINChange(text){
        this.props.carVINChange(text);
    }

    /*输入发动机编号*/
    codeValueChange(text){
        this.props.carEngineNumberChange(text);
    }

    /*获得焦点*/
    textOnFocus(){
        this.props.textOnFocus();
    }
    render() {
        return (
            <View style={styles.container}>

                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        车牌号
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
                                   this.textOnFocus();
                               }}
                               value={this.state.carNumber}
                               placeholder={'请输入车牌号'}
                               underlineColorAndroid={'transparent'}

                    />
                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        所有人
                    </Text>
                    <TextInput style={styles.textInputStyle}
                               onChangeText={(text) => {
                                    this.setState({
                                        owner: text,
                                    });
                                    this.ownValueChange(text);

                               }}
                               onFocus={()=>{
                                   this.textOnFocus();
                               }}
                               value={this.state.owner}
                               placeholder={'请输入所有人'}
                               underlineColorAndroid={'transparent'}

                    />
                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        车辆识别
                    </Text>
                    <TextInput style={styles.textInputStyle}
                               onChangeText={(text) => {
                                    this.setState({
                                        carType: text,
                                    });
                                    this.carTypeChange(text);
                               }}
                               onFocus={()=>{
                                   this.textOnFocus();
                               }}
                               underlineColorAndroid={'transparent'}
                               value={this.state.carType}
                               placeholder={'请输入车辆识别'}
                    />
                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        代码（VIN）
                    </Text>
                    <TextInput style={styles.textInputStyle}
                               onChangeText={(text) => {
                                    this.setState({
                                        carVin: text,
                                    });
                                    this.carVINChange(text);
                               }}
                               onFocus={()=>{
                                   this.textOnFocus();
                               }}
                               underlineColorAndroid={'transparent'}
                               value={this.state.carVin}
                               placeholder={'请输入代码（VIN）'}
                    />
                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        发动机号码
                    </Text>
                    <TextInput style={styles.textInputStyle}
                               onChangeText={(text) => {
                                    this.setState({
                                        engineNumber: text,
                                    });
                                    this.codeValueChange(text);
                               }}
                               onFocus={()=>{
                                   this.textOnFocus();
                               }}
                               underlineColorAndroid={'transparent'}
                               value={this.state.engineNumber}
                               placeholder={'请输入发动机编号'}
                    />
                </View>
            </View>
        )
    }
}

export default verifiedTravelInfoItem;
