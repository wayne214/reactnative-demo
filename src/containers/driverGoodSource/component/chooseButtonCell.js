/**
 * Created by wangl on 2017/5/2.
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
import * as StaticColor from '../../../constants/colors';
import BlueButtonSmall from '../../../../assets/img/button/blueButtonSmall.png'

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: width / 2,
        height: 45,
        backgroundColor: 'transparent',
        alignSelf: 'center'
    },
});

class ChooseButtonCell extends Component {
    static propTypes = {
        leftClick: PropTypes.func.isRequired,
        rightClick: PropTypes.func.isRequired,
        leftContent: PropTypes.string,
        rightContent: PropTypes.string,
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    render() {
        const {leftClick, rightClick, leftContent, rightContent} = this.props;
        return (
            <View style={{backgroundColor: StaticColor.WHITE_COLOR, width}}>
                <View
                    style={{
                        flexDirection: 'row',
                        height: 45,
                        width: width,
                    }}
                >
                    <TouchableOpacity
                        style={{
                            backgroundColor: 'white',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: width / 2,
                        }}
                        onPress={() => {
                            leftClick();
                        }}
                    >
                        <Text
                            style={{fontSize: 16, color: '#333333'}}
                        >
                            {leftContent ? leftContent : '拒绝'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            rightClick();
                        }}
                    >
                        <ImageBackground source={BlueButtonSmall} style={styles.button} resizeMode='stretch'>
                        <Text
                            style={{fontSize: 16, color: StaticColor.WHITE_COLOR}}
                        >
                            {rightContent ? rightContent : '接单'}
                        </Text>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default ChooseButtonCell;
