import React, { Component } from 'react';
import {
    View,
    Dimensions,
    Animated,
    TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
// import Picker from 'react-native-picker';
import Picker from 'react-native-picker-custom';
const { width, height } = Dimensions.get('window')

class CommonPicker extends Component {
    constructor(props) {
        super(props);
        this.state= {
            data: this.props.data,
            defaultValue: this.props.defaultValue,
        }
    }
    componentDidMount() {
        const {data,defaultValue} = this.state;
        const {onPickerConfirm,onPickerCancel,onPickerSelect} = this.props;
        setTimeout(()=>{
            Picker.init({
                pickerConfirmBtnText: '确定',
                pickerCancelBtnText: '取消',
                pickerTitleText: '',
                pickerData: data,
                pickerFontSize: 22,
                pickerBg: [225,225,225,1],
                selectedValue: defaultValue || [],
                onPickerConfirm: data => {
                    if (onPickerConfirm) {
                        this.props.onPickerConfirm(data);
                    };
                },
                onPickerCancel: data => {
                    if (onPickerCancel) {
                        this.props.onPickerCancel(data);
                    };
                },
                onPickerSelect: data => {
                    if (onPickerSelect) {
                        this.props.onPickerSelect(data);
                    };
                }
            });
            Picker.show();
        },100);

    }
    render() {
        return null;
        // return (
        // 	<TouchableOpacity onPress={()=>{
        // 		Picker.hide();
        // 		this.props.touchClose()
        // 	}} activeOpacity={ 0.9 }>
	       //      <View style={{flex: 1,backgroundColor: 'rgba(0, 0, 0, 0.4)',height}} >
	       //      </View>
	       //  </TouchableOpacity>
        // )
    }
}

CommonPicker.propTypes = {
    defaultValue: PropTypes.array,
    onPickerConfirm: PropTypes.func.isRequired,
    onPickerCancel: PropTypes.func,
    onPickerSelect: PropTypes.func,
}
export default CommonPicker
