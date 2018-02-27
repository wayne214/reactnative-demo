/**
 * Created by xizhixin on 2017/10/26.
 * 底部按钮组件
 */

import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    ImageBackground,
    StyleSheet
} from 'react-native';

import * as StaticColor from '../../constants/colors';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        height: 45,
        backgroundColor: 'transparent',
        alignSelf: 'center',
    },
    tip:{
        color: StaticColor.WHITE_COLOR,
        fontSize: 17,
    }
});
export default class BottomButton extends Component {
    static propTypes = {
        onClick: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired,
        buttonStyle: View.propTypes.style,
        textStyle: Text.propTypes.style,
        buttonDisabled: PropTypes.bool,
    };
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    render() {
        const {
            onClick,
            text,
            buttonStyle,
            textStyle,
            buttonDisabled
        } = this.props;
        return (
            <TouchableOpacity
                disabled={buttonDisabled}
                onPress={() => {
                    onClick();
                }}
            >
                <View style={[styles.button, buttonStyle]}>
                    <Text style={[styles.tip, textStyle]}>{text}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}
