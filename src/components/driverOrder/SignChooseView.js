/**
 * Created by mymac on 2017/4/7.
 * 签收界面拒收原因及数量组件
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Modal,
    Dimensions,
    Platform,
    TextInput,
} from 'react-native';

import Picker from 'react-native-picker-custom';
import * as StaticColor from '../../constants/colors';
import receiveDeleteUnselect from '../../../assets/img/driverOrder/receive_delete_unselected.png';
import receiveDelete from '../../../assets/img/driverOrder/receive_delete.png';
import receiveAddUnselect from '../../../assets/img/driverOrder/receive_add_unselected.png';
import receiveAdd from '../../../assets/img/driverOrder/receive_add.png';
import receiveBottomArrow from '../../../assets/img/driverOrder/receive_bottom_arrow.png';
import receiveRightArrow from '../../../assets/img/driverOrder/receive_right_arrow.png';

const {width, height} = Dimensions.get('window');
let count = 0;

const data = ['损坏', '解冻', '收货方拒收'];

const style = StyleSheet.create({
    chooseNumStyle: {
        height: 33,
        flexDirection: 'row', // 确保水平布局
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 5,
        marginRight: 15,
    },
    viewStyle: {
        ...Platform.select({
            android: {
                marginTop: height - 122,
                height: 122,
            },
            ios: {
                marginTop: height - 252,
                height: 252,
            },
        }),
        backgroundColor: StaticColor.WHITE_COLOR,
    },
    viewSty: {
        width: 120,
        height: 33,
        borderWidth: 1,
        borderColor: StaticColor.LIGHT_GRAY_TEXT_COLOR,
        marginLeft: 8,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between', // 确保水平布局间距一样
    },
    viewSty1: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginLeft: 5,
    },
    refuseReasonView: {
        flexDirection: 'row',
        height: 33,
        marginTop: 10,
        marginBottom: 5,
        alignItems: 'center',
        marginLeft: 8,
    },
});

export default class SignChooseView extends Component {
    constructor(props) {
        super(props);
        // console.log('num......',this.props.num);
        this.state = {
            selectReason: '解冻',
            text: this.props.num,
        };
        this.outNumber = this.outNumber.bind(this);
        this.addComponent = this.addComponent.bind(this);
        this.add = this.add.bind(this);
        this.subtract = this.subtract.bind(this);
        this.showDatePicker = this.showDatePicker.bind(this);
    }

    // 加
    add() {

        console.log('refuseNum:',this.props.refuseNum);
        console.log('maxNum:',this.props.maxNum);
        console.log('this.state.text :',this.state.text );


        if (this.props.maxNum - this.props.refuseNum < 1) {
            return;
        }
        this.props.addNumCallback(this.props.componentID, this.props.indexRow, ++this.state.text, this.state.selectReason);


        /*
        // 将增加操作传给上一级，让上一级操作state，进而改变当前组件的值
        if (this.state.text >= this.props.maxNum) {
            return;
        }
        this.props.addNumCallback(this.props.componentID, this.props.indexRow, ++this.state.text, this.state.selectReason);
        */
    }

    // 减
    subtract() {
        // 将删除操作传给上一级，让上一级操作state，进而改变当前组件的值
        if (this.state.text === 0) {
            return;
        }
        this.props.subtractNumCallback(this.props.componentID, this.props.indexRow, --this.state.text, this.state.selectReason);
    }

    // 点击选择拒收原因
    chooseReason() {
        this.showDatePicker();
    }

    selectReasonFun() {
        this.props.chooseReasonCallbackFun(this.props.componentID, this.props.indexRow, this.props.num, this.state.selectReason);
    }

    // 子组件向父组件传值
    outNumber(number) {
    }

    addComponent() {
        if (this.props.componentType) {
            this.props.addComponenet();
        } else {
            this.props.deleteComponenet(this.props.componentID);
        }
    }

    showDatePicker() {
        Picker.init({
            pickerData: data,
            pickerToolBarFontSize: 18,
            pickerFontSize: 20,
            pickerFontColor: [51, 51,51, 1],
            pickerBg: [255, 255, 255, 1],
            pickerConfirmBtnColor: [0, 132, 255, 1],
            pickerCancelBtnColor: [102, 102, 102, 1],
            pickerToolBarBg: [245, 245, 246, 1],
            selectedValue:[data[1]],
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '请选择拒收原因',
            onPickerConfirm: (pickedValue, pickedIndex) => {
               if (pickedValue){
                   this.setState({
                       selectReason: pickedValue[0],
                   });
                   console.log('reason', pickedValue[0], pickedIndex);
                   this.selectReasonFun();
               }
            },
            onPickerCancel: (pickedValue, pickedIndex) => {
                console.log('reason', pickedValue, pickedIndex);
            },
            onPickerSelect: (pickedValue, pickedIndex) => {
                // this.setState({
                //     selectReason: pickedValue,
                // });
                console.log('reason', pickedValue, pickedIndex);
            }
        });
        Picker.show();
    }

    render() {
        // 接收传过来的值，
        const {componentID, indexRow, componentType, num, refuseNum, maxNum, reason} = this.props;
        return (
            <View style={{flexDirection:'row',justifyContent:'space-between',}}>
                <View style={style.refuseReasonView}>
                    <TouchableOpacity
                        style={style.viewSty1}
                        onPress={() => {
                            this.addComponent();
                        }}
                    >
                        <Image source={componentType ? receiveAdd : receiveDelete}/>
                    </TouchableOpacity>
                    <Text style={{fontSize: 16, color: StaticColor.LIGHT_BLACK_TEXT_COLOR, marginLeft: 8}}>拒收</Text>
                        <TouchableOpacity
                            style={style.viewSty}
                            onPress={() => {
                                this.chooseReason();
                            }}
                        >
                            <Text style={{marginLeft: 10, fontSize: 16, color: StaticColor.COLOR_LIGHT_GRAY_TEXT}}>{reason}</Text>
                            <Image style={{marginRight:10}} source={this.state.modalVisible ? receiveBottomArrow : receiveRightArrow}/>
                        </TouchableOpacity>
                </View>
                <View style={style.chooseNumStyle}>
                    <TouchableOpacity
                        onPress={() => {
                            this.subtract();
                        }}
                    >
                        <Image
                            source={num === 0 ? receiveDeleteUnselect : receiveDelete}
                        />
                    </TouchableOpacity>
                    {/*<TextInput*/}
                    {/*style={{width: 48, textAlign: 'center'}}*/}
                    {/*underlineColorAndroid={'transparent'}*/}
                    {/*value={this.state.text + ''}*/}
                    {/*onFocus={() => {*/}
                    {/*this.props.itemSignFocus();*/}
                    {/*}}*/}
                    {/*onBlur={() => {*/}
                    {/*this.props.itemSignBlur();*/}
                    {/*}}*/}
                    {/*onChangeText={(value) => {*/}

                    {/*console.log('value:'+value);*/}

                    {/*this.setState({*/}
                    {/*text: value,*/}
                    {/*});*/}
                    {/*this.add();*/}


                    {/*/**/}
                    {/*if (value.length == 0) {*/}
                    {/*count = 0;*/}
                    {/*this.setState({*/}
                    {/*text: ''*/}
                    {/*});*/}
                    {/*} else {*/}
                    {/*value >= parseInt(maxNum) ?*/}
                    {/*this.setState({*/}
                    {/*text: maxNum*/}
                    {/*})*/}
                    {/*:*/}
                    {/*this.setState({*/}
                    {/*text: value*/}
                    {/*});*/}
                    {/*if (value >= parseInt(maxNum)) {*/}
                    {/*count = maxNum*/}
                    {/*} else {*/}
                    {/*count = parseInt(value);*/}
                    {/*}*/}
                    {/*}*/}
                    {/*console.log('refuseNum:'+refuseNum);*/}

                    {/*this.props.addNumCallback(this.props.componentID, this.props.indexRow, count, this.state.selectReason);*/}

                    {/*}}*/}
                    {/*keyboardType='number-pad'*/}
                    {/*/>*/}
                    <Text style={{width: 50, textAlign: 'center', fontSize: 15}}>{num}</Text>
                    <TouchableOpacity
                        onPress={() => {
                            this.add();
                        }}
                    >
                        <Image source={num == maxNum ? receiveAddUnselect : receiveAdd}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

SignChooseView.propTypes = {
    num: React.PropTypes.number.isRequired,
    maxNum: React.PropTypes.string.isRequired,
    addNumCallback: React.PropTypes.func.isRequired,
    componentID: React.PropTypes.string.isRequired,
    indexRow: React.PropTypes.number.isRequired,
    subtractNumCallback: React.PropTypes.func.isRequired,
    chooseReasonCallbackFun: React.PropTypes.func.isRequired,
    componentType: React.PropTypes.bool.isRequired,
    addComponenet: React.PropTypes.func.isRequired,
    deleteComponenet: React.PropTypes.func.isRequired,
    reason: React.PropTypes.string.isRequired,
    itemSignFocus: React.PropTypes.func,
    itemSignBlur: React.PropTypes.func,
};

