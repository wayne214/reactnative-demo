
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Image,
    Text,
    Dimensions,
    StyleSheet
} from 'react-native';
import * as StaticColor from '../../constants/colors';
import NavigatorBar from '../../components/common/navigatorbar'

// 图片路径
import AboutUsPng from '../../../assets/img/mine/aboutus.png';
// 获取屏幕宽高尺寸
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    separateLine: {
        height: 1,
        backgroundColor: '#e8e8e8',
    },
});
export default class AboutUs extends Component {
    // 构造
    constructor(props) {
        super(props);
    }

    static navigationOptions = ({navigation}) => {
        const {state, setParams} = navigation;
        return {
            tabBarLabel: '修改密码',
            header: <NavigatorBar title='关于我们' hiddenBackIcon={false} router={navigation}/>,
        }
    };
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.separateLine} />
                <View style={{justifyContent:'center', alignItems:'center'}}>
                    <Image
                        style={{width: width, height: width * 603 / 375}}
                        source={AboutUsPng}
                        // resizeMethod='cover'
                    >
                        {/*<Text style={{color: '#666666', alignSelf: 'center', fontSize: 13, marginTop: width * 140 / 375}}>版本 V{DeviceInfo.getVersion()}</Text>*/}
                    </Image>
                </View>
            </View>
        );
    }
}


