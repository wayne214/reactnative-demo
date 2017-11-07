import React, {Component} from 'react';
import {StyleSheet, View, TextInput, Text, TouchableHighlight, Platform} from 'react-native';

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: 42 * 4,
        flexDirection: 'row',
        // borderWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderColor: '#B6B6B6',
        backgroundColor: '#fff',
    },
    inputItem: {
        height: 39,
        width: 42,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputItemBorderLeftWidth: {
        borderLeftWidth: 1,
        borderColor: '#ccc',
    },
    iconStyle: {
        width: 16,
        height: 16,
        backgroundColor: '#222',
        borderRadius: 8,
    },
});

export default class PasswordBord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ''
        }
        this._onPress = this._onPress.bind(this);
    }

    _onPress() {
        this._input.focus();
    }

    render() {
        return (

            <TouchableHighlight onPress={this._onPress} activeOpacity={1} underlayColor='transparent'>
                {Platform.OS === 'ios' ?
                    <View style={[styles.container, this.props.style]}>
                        <TextInput ref={(c) => this._input = c}
                                   underlineColorAndroid={'transparent'}
                                   maxLength={this.props.maxLength}
                                   autoFocus={true}
                                   autoCorrect = {false}
                                   keyboardType = 'numbers-and-punctuation'
                                   onChangeText={(text) => {
                                       this.setState({text});
                                       this.props.onChange(text)
                                   }}
                        />
                        {
                            this._getInputItem()
                        }
                    </View>
                    :
                    <View style={[styles.container, this.props.style]}>
                        <TextInput ref={(c) => this._input = c}
                                   style={{height:45,zIndex:99,position:'absolute',width:42*4,opacity:0}}
                                   underlineColorAndroid={'transparent'}
                                   maxLength={this.props.maxLength}
                                   keyboardType = 'numbers-and-punctuation'
                                   autoFocus={true}
                                   autoCorrect = {false}
                                   onChangeText={(text) => {
                                       this.setState({text});
                                       this.props.onChange(text)
                                   }}
                        />
                        {
                            this._getInputItem()
                        }
                    </View>
                }

            </TouchableHighlight>
        )

    }

    _getInputItem() {
        let inputItem = [];
        let {text} = this.state;
        for (let i = 0; i < parseInt(this.props.maxLength); i++) {
            if (i == 0) {
                inputItem.push(
                    <View
                        key={i}
                        style={[styles.inputItem, this.props.inputItemStyle]}>
                        {i < text.length ?
                            <View style={[styles.iconStyle, this.props.iconStyle]}>
                            </View> : null}
                    </View>)
            }
            else {
                inputItem.push(
                    <View
                        key={i}
                        style={[styles.inputItem, styles.inputItemBorderLeftWidth, this.props.inputItemStyle]}>
                        {i < text.length ?
                            <View style={[styles.iconStyle, this.props.iconStyle]}>
                            </View> : null}
                    </View>)
            }
            ;
        }
        return inputItem;
    }
}