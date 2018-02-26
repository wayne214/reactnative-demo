import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as ConstValue from '../../constants/constValue';
import Carousel from 'react-native-snap-carousel';
import HomeCell from '../../components/home/homeCell';
import {fetchData} from '../../action/app';
import {saveWeather} from '../../action/home';
import {API_GET_WEATHER} from '../../constants/api';

import NavigatorBar from '../../components/common/navigatorbar';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    ScrollView,
    Image,
    DeviceEventEmitter,
} from 'react-native';
import {
    loginSuccessAction,
    setUserNameAction,
    setDriverCharacterAction,
    setOwnerCharacterAction,
    setCurrentCharacterAction,
    setCompanyCodeAction,
    setOwnerNameAction
} from '../../action/user';
import {
    WHITE_COLOR,
    BLUE_CONTACT_COLOR,
    DEVIDE_LINE_COLOR,
    COLOR_SEPARATE_LINE,
    LIGHT_GRAY_TEXT_COLOR,
    LIGHT_BLACK_TEXT_COLOR,
    COLOR_VIEW_BACKGROUND,
    COLOR_LIGHT_GRAY_TEXT,
    REFRESH_COLOR,
} from '../../constants/staticColor';
import locationIcon from '../../../assets/home/location.png';
import bannerImage1 from '../../../assets/home/banner1.png';
import bannerImage2 from '../../../assets/home/banner2.png';
import signIcon from '../../../assets/home/sign_icon.png';
import receiptIcon from '../../../assets/home/receipt_icon.png';
import dispatchIcon from '../../../assets/home/despatch_icon.png';
import receiveIcon from '../../../assets/home/receive_icon.png';
import roadIcon from '../../../assets/home/road_abnormality.png';
import WeatherCell from '../../components/home/weatherCell';


import { changeTab, showFloatDialog, logout, appendLogToFile } from '../../action/app';
const images = [
    bannerImage1,
    bannerImage2,
];

function wp(percentage) {
    const value = (percentage * width) / 100;
    return Math.round(value);
}
import {width,height} from '../../constants/dimen';

const slideWidth = wp(75);
const itemHorizontalMargin = 28;
const itemWidth = slideWidth + itemHorizontalMargin * 2;
const itemHeight = 125 * itemWidth / 335;

class driverHome extends Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.location !== nextProps.location) {
            this.props.getWeather({city:nextProps.location});
        }
    }

    componentDidMount() {

    }

    getCurrentWeekday(day) {
        let weekday = new Array(7);
        weekday[0] = "周日";
        weekday[1] = "周一";
        weekday[2] = "周二";
        weekday[3] = "周三";
        weekday[4] = "周四";
        weekday[5] = "周五";
        weekday[6] = "周六";
        return weekday[day];
    }

    renderImg(item, index) {
        console.log('------item-----', item);
        return (
            <Image
                style={{
                    width: itemWidth,
                    height: itemHeight,
                }}
                resizeMode='contain'
                source={item.item}
            />
        );
    }


    render() {
        const limitView = true ?
            <View style={styles.limitViewStyle}>
                <Text style={{
                    fontSize: 14,
                    color: LIGHT_BLACK_TEXT_COLOR,
                    alignSelf: 'center'
                }}>{'2todo'}</Text>
            </View> : null;
        let date = new Date();

        const driverView = <View style={{marginTop: 10, backgroundColor: WHITE_COLOR, width: width,}}>
            <HomeCell
                title="接单"// 文字
                describe="方便接单，快速查看"
                padding={10}// 文字与文字间距
                imageStyle={styles.imageView}
                backgroundColor={{backgroundColor: WHITE_COLOR}}// 背景色
                // badgeText={homePageState === null ? 0 : homePageState.pendingCount}// 消息提示
                renderImage={() => <Image source={receiptIcon}/>}// 图标
                clickAction={() => { // 点击事件
                    if (this.props.driverStatus == 2) {
                        DeviceEventEmitter.emit('resetGood');
                        this.props.navigation.navigate('GoodsSource');
                    } else {
                        DeviceEventEmitter.emit('certification');
                    }
                }}
            />
            <View style={styles.line}/>
            <HomeCell
                title="发运"
                describe="一键发运，安全无忧"
                padding={10}
                imageStyle={styles.imageView}
                backgroundColor={{backgroundColor: WHITE_COLOR}}
                // badgeText={homePageState === null ? 0 : homePageState.notYetShipmentCount}
                renderImage={() => <Image source={dispatchIcon}/>}
                clickAction={() => {
                    if (this.props.driverStatus == 2) {
                        this.changeOrderTab(1);
                        DeviceEventEmitter.emit('changeOrderTabPage', 1);
                        this.props.navigation.navigate('Order');
                    } else {
                        DeviceEventEmitter.emit('certification');
                    }
                }}
            />
            <View style={styles.line}/>
            <HomeCell
                title="签收"
                describe="签收快捷，免去后顾之忧"
                padding={10}
                imageStyle={styles.imageView}
                backgroundColor={{backgroundColor: WHITE_COLOR}}
                badgeText={0}
                renderImage={() => <Image source={signIcon}/>}
                clickAction={() => {
                    if (this.props.driverStatus == 2) {
                        this.changeOrderTab(2);
                        DeviceEventEmitter.emit('changeOrderTabPage', 2);
                        this.props.navigation.navigate('Order');
                    } else {
                        DeviceEventEmitter.emit('certification');
                    }
                }}
            />
            <View style={styles.line}/>
            <HomeCell
                title="回单"
                describe="接收回单，方便快捷"
                padding={8}
                imageStyle={styles.imageView}
                backgroundColor={{backgroundColor: WHITE_COLOR}}
                badgeText={0}
                renderImage={() => <Image source={receiveIcon}/>}
                clickAction={() => {
                    if (this.props.driverStatus == 2) {
                        this.changeOrderTab(3);
                        DeviceEventEmitter.emit('changeOrderTabPage', 3);
                        this.props.navigation.navigate('Order');
                    } else {
                        DeviceEventEmitter.emit('certification');
                    }
                }}
            />
            <View style={styles.line}/>
            <HomeCell
                title="道路异常"
                describe="道路异常，上传分享"
                padding={8}
                imageStyle={styles.imageView}
                backgroundColor={{backgroundColor: WHITE_COLOR}}
                badgeText={0}
                renderImage={() => <Image source={roadIcon}/>}
                clickAction={() => {
                    console.log('dianjile ma')
                    this.props.getWeather({city:'北京'});
                    // if (this.props.driverStatus == 2) {
                    //     this.props.navigation.navigate('UploadAbnormal');
                    // } else {
                    //     DeviceEventEmitter.emit('certification');
                    // }
                }}
            />
        </View>;

        const carrierView = <View style={{marginTop: 10, backgroundColor: WHITE_COLOR, width: width,}}>
            <HomeCell
                title="接单"// 文字
                describe="方便接单，快速查看"
                padding={10}// 文字与文字间距
                imageStyle={styles.imageView}
                backgroundColor={{backgroundColor: WHITE_COLOR}}// 背景色
                // badgeText={carrierHomePageState === null ? 0 : carrierHomePageState.notYetReceiveCount}// 消息提示
                renderImage={() => <Image source={receiptIcon}/>}// 图标
                clickAction={() => { // 点击事件
                    if (this.props.ownerStatus == 12 || this.props.ownerStatus == 22) {
                        this.props.navigation.navigate('GoodsSource');
                        DeviceEventEmitter.emit('resetGood');
                    } else {
                        DeviceEventEmitter.emit('certification');
                    }
                }}
            />
            <View style={styles.line}/>
            <HomeCell
                title="调度"
                describe="一键调度，快捷无忧"
                padding={10}
                imageStyle={styles.imageView}
                backgroundColor={{backgroundColor: WHITE_COLOR}}
                // badgeText={carrierHomePageState === null ? 0 : carrierHomePageState.noDispatchCount}
                renderImage={() => <Image source={dispatchIcon}/>}
                clickAction={() => {
                    if (this.props.ownerStatus == 12 || this.props.ownerStatus == 22) {
                        this.changeOrderTab(1);
                        DeviceEventEmitter.emit('changeOrderTabPage', 1);
                        this.props.navigation.navigate('Order');
                    } else {
                        DeviceEventEmitter.emit('certification');
                    }
                }}
            />
        </View>;

        return <View style={styles.containerView}>

            <ScrollView>
                <View style={styles.locationStyle}>
                    <Image source={locationIcon}/>
                    <Text
                        style={styles.locationText}>{this.props.location ? '您所在的位置：' + this.props.location : '定位失败'}</Text>
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            top: 10,
                            right: 0,
                        }}
                        onPress={() => {
                            this.getCurrentPosition(0);
                        }}
                    >
                        <Text style={styles.icon}>&#xe66b;</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <Carousel
                        data={images}
                        renderItem={this.renderImg}
                        sliderWidth={width}
                        itemWidth={itemWidth}
                        hasParallaxImages={true}
                        firstItem={1}
                        inactiveSlideScale={0.94}
                        inactiveSlideOpacity={0.8}
                        enableMomentum={true}
                        loop={true}
                        loopClonesPerSide={2}
                        autoplay={true}
                        autoplayDelay={500}
                        autoplayInterval={3000}
                        removeClippedSubviews={false}
                    />
                </View>
                <View style={styles.weather}>
                    <View style={styles.date}>
                        <Text style={styles.day}>
                            {date.getUTCDate()}
                        </Text>
                        <Text style={styles.week}>
                            {this.getCurrentWeekday(date.getDay())}
                        </Text>
                    </View>
                    <View style={{flexDirection: 'row', marginLeft: 20}}>
                        <View style={{
                            marginRight: 15,
                            justifyContent: 'center',
                        }}>

                            <WeatherCell weatherIcon={'晴todo'}/>
                        </View>
                        <Text style={{
                            marginRight: 10,
                            fontSize: 14,
                            color: LIGHT_BLACK_TEXT_COLOR,
                            alignSelf: 'center'
                        }}> {'天气todo'}</Text>

                        <Text style={{
                            marginRight: 10,
                            fontSize: 14,
                            color: LIGHT_BLACK_TEXT_COLOR,
                            alignSelf: 'center'
                        }}>{-99}℃/{99}℃</Text>
                    </View>
                    {limitView}
                </View>
                {this.props.currentStatus == 'driver' ? driverView : carrierView}
            </ScrollView>
        </View>
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'orange',
        justifyContent: 'center',
        alignItems: 'center',
    },
    line: {
        backgroundColor: DEVIDE_LINE_COLOR,
        height: 0.5,
        marginLeft: 50,
    },
    imageView: {
        paddingRight: 15,
        paddingLeft: 5,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    subView: {
        marginLeft: 45,
        marginRight: 45,
        backgroundColor: WHITE_COLOR,
        alignSelf: 'stretch',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: LIGHT_GRAY_TEXT_COLOR,
    },
    modalTitle: {
        fontSize: 17,
        color: LIGHT_BLACK_TEXT_COLOR,
        marginTop: 25,
        marginBottom: 20,
        alignSelf: 'center',
    },
    // 水平的分割线
    horizontalLine: {
        height: 1,
        backgroundColor: COLOR_SEPARATE_LINE,
    },
    // 按钮
    buttonView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonStyle: {
        flex: 1,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 17,
        color: BLUE_CONTACT_COLOR,
        textAlign: 'center',
    },
    dot: {
        width: 6,
        height: 6,
        backgroundColor: WHITE_COLOR,
        borderRadius: 3,
        marginLeft: 3,
        marginRight: 3,
        marginBottom: 10,
    },
    activeDot: {
        width: 6,
        height: 6,
        backgroundColor: BLUE_CONTACT_COLOR,
        borderRadius: 3,
        marginLeft: 3,
        marginRight: 3,
        marginBottom: 10,
    },
    container: {
        ...Platform.select({
            ios: {
                height: ConstValue.NavigationBar_StatusBar_Height,
            },
            android: {
                height: 50,
            },
        }),
        backgroundColor: WHITE_COLOR,
        width: width,
    },
    titleContainer: {
        flex: 1,
        ...Platform.select({
            ios: {
                paddingTop: ConstValue.StatusBar_Height,
            },
            android: {
                paddingTop: 0,
            },
        }),
        flexDirection: 'row',
    },
    leftContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    centerContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 7,
    },
    rightContainer: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        color: LIGHT_BLACK_TEXT_COLOR,
    },
    icon: {
        fontFamily: 'iconfont',
        fontSize: 15,
        color: REFRESH_COLOR,
        alignSelf: 'center',
        paddingRight: 15,
    },
    weather: {
        height: 50,
        width: width,
        backgroundColor: WHITE_COLOR,
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 10,
    },
    day: {
        fontSize: 22,
        color: LIGHT_BLACK_TEXT_COLOR,
    },
    date: {
        marginLeft: 20,
    },
    week: {
        fontSize: 13,
        color: LIGHT_BLACK_TEXT_COLOR,
    },
    containerView: {
        flex: 1,
        backgroundColor: COLOR_VIEW_BACKGROUND,
    },
    limitViewStyle: {
        position: 'absolute',
        right: 0,
        marginRight: 20,
    },
    locationStyle: {
        padding: 10,
        flexDirection: 'row',
    },
    locationText: {
        fontSize: 14,
        color: COLOR_LIGHT_GRAY_TEXT,
        marginLeft: 10,
    },
    divideLine: {
        height: 1,
        backgroundColor: LIGHT_GRAY_TEXT_COLOR,
    },
});


function mapStateToProps(state) {
    return {
        location: state.home.get('locationData'),
    };
}

const mapDispatchToProps = dispatch => {
    return {
        dispatch,
        getWeather:(city) => {
            dispatch(fetchData({
                body:{},
                method: 'POST',
                api: API_GET_WEATHER+ '?city=' + city.city,
                success: (data) => {
                    console.log('city=',data);
                    dispatch(saveWeather({ data}));
                },
                fail: (data) => {
                    console.log('city=',data);
                }
            }));
        },

        setCurrentCharacterAction: (result) => {
            dispatch(setCurrentCharacterAction(result));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(driverHome);

