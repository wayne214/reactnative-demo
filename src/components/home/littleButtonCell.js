/**
 * Created by wl on 2017/3/28.
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
} from 'react-native';


export default class LittleButtonCell extends Component {

    // 定义相关属性类型
    static propTypes = {
        color: PropTypes.string,
        buttonWidth: PropTypes.number,
        marginLeft: PropTypes.number,
        title: PropTypes.string
    };


    render() {
        const {color, buttonWidth, title, marginLeft} = this.props;
        return (
            <View
                style={{
                    marginLeft: marginLeft ? marginLeft : 0,
                    borderColor: color,
                    borderWidth: 1,
                    width: buttonWidth,
                    height: 17,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Text
                    style={{
                        fontSize: 10,
                        color: color
                    }}>{title}</Text>
            </View>
        );
    }
}

