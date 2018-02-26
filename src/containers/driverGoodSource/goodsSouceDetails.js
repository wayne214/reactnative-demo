import React, {Component} from 'react';
import {
    Text,
    View,
    ScrollView,
    Dimensions,
    Platform,
    ImageBackground,
    StyleSheet,
} from 'react-native';

import DetailsCell from '../../components/common/source/detailsCell';
// import DetailsUserCell from '../../components/common/source/detailsUserCell';
// import DetailsRedUserCell from '../../components/common/source/detailsRedUserCell';
import DetailsOrdersCell from '../../components/common/source/detailsOrdersCell';
import TitlesCell from '../../components/common/source/titlesCell';
import TotalsItemCell from '../../components/common/source/totalsItemCell';
import OrderProductInfo from './component/goodsDetailInfo';
import * as ConstValue from '../../constants/constValue';
import TaskBackground from '../../../assets/img/good/taskBackground.png';
import * as StaticColor from '../../constants/colors';
const space = 10;
const topSpace = 10;
const topHeight = 40;

const bottomSpace = 45;

const screenWidth = Dimensions.get('window').width - space * 2;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    imageBackground: {
        marginTop: 10,
        alignSelf: 'center',
        ...Platform.select({
            ios: {
                height: 130,
            },
            android: {
                height: 140,
            }
        }),
        width: screenWidth - 20
    },
    constantStyle: {
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 10,
        paddingLeft: 10
    },
    constantIcon: {
        fontFamily: 'iconfont',
        color: StaticColor.COLOR_CONTACT_ICON_COLOR,
        fontSize: 19
    },
    separateLine: {
        height: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
        marginLeft: 10,
        marginRight: 10
    }
});
export default class GoodsSourceDetails extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            showGoodList: false,
        };
    }
    showGoodInfoList(value) {
        this.setState({
            showGoodList: value,
        });
    }
    render() {
        const {deliveryInfo, goodsInfoList, taskInfo, time, transCode, vol, weight, index, isFullScreen, customerOrderCode} = this.props;
        return (
            <View
                style={{
                    backgroundColor: '#f5f5f5',
                    width: screenWidth,
                    marginLeft: space,
                    marginRight: space,
                    overflow: 'hidden',
                    marginTop: topSpace,
                    ...Platform.select({
                        ios:{height: isFullScreen ? screenHeight - topHeight - ConstValue.NavigationBar_StatusBar_Height : screenHeight - topHeight - bottomSpace - ConstValue.NavigationBar_StatusBar_Height - 5},
                        android:{height: isFullScreen ? screenHeight - topHeight - 73 : screenHeight - topHeight - bottomSpace - 73 - 5}
                    })
                }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{
                        backgroundColor: 'white',
                        ...Platform.select({
                            ios:{height: isFullScreen ? screenHeight - topHeight - ConstValue.NavigationBar_StatusBar_Height : screenHeight - topHeight - bottomSpace - ConstValue.NavigationBar_StatusBar_Height - 5},
                            android:{height: isFullScreen ? screenHeight - topHeight - 73 : screenHeight - topHeight - bottomSpace - 73 - 5}
                        }),
                        borderColor: 'white',
                        borderWidth: 1,
                        borderRadius: 10,
                    }}
                >
                    {
                        taskInfo ?
                            <ImageBackground source={TaskBackground} style={styles.imageBackground} resizeMode='stretch'>
                                <View style={styles.constantStyle}>
                                    <Text style={styles.constantIcon}>&#xe66d;</Text>
                                    <Text style={{fontSize: 17, fontWeight: 'bold', marginLeft: 10,}}>
                                        {deliveryInfo.receiveContact}
                                    </Text>
                                </View>
                                <View style={styles.separateLine}/>
                                <View style={{marginHorizontal: 10}}>
                                    <DetailsOrdersCell
                                        ifReceipt={taskInfo.isReceipt}
                                        receiptStyle={taskInfo.receiptWay}
                                        arrivalTime={taskInfo.committedArrivalTime ? taskInfo.committedArrivalTime.replace(/-/g, '/') : ''}
                                    />
                                </View>
                            </ImageBackground> :
                            <View>
                                <View style={[styles.constantStyle, {marginLeft: 5}]}>
                                    <Text style={styles.constantIcon}>&#xe66d;</Text>
                                    <Text style={{fontSize: 17, fontWeight: 'bold', marginLeft: 10}}>
                                        {deliveryInfo.receiveContact}
                                    </Text>
                                </View>
                                <View style={styles.divideLine}/>
                            </View>
                        }
                    <TitlesCell title="配送信息" />
                    <View style={{height: 1, backgroundColor: '#F5F5F5', marginLeft: 10}}/>
                    {/*<DetailsUserCell*/}
                        {/*deliveryInfo={deliveryInfo}*/}
                        {/*onSelectAddr={() => {*/}
                            {/*this.props.addressMapSelect(index, 'departure');*/}
                        {/*}}*/}
                    {/*/>*/}
                    {/*<DetailsRedUserCell*/}
                        {/*deliveryInfo={deliveryInfo}*/}
                        {/*onSelectAddr={() => {*/}
                            {/*this.props.addressMapSelect(index, 'receive');*/}
                        {/*}}*/}
                    {/*/>*/}
                    <View style={{height: 1, backgroundColor: '#F5F5F5'}}/>
                    <TitlesCell
                        title="货品信息"
                        showArrowIcon={true}
                        onPress={(value) => {
                            this.showGoodInfoList(value);
                        }}
                    />
                    {
                        this.state.showGoodList ? goodsInfoList.map((item, index) => {
                            return (
                                <OrderProductInfo
                                    key={index}
                                    orderInfo={item}
                                    isLast={index === goodsInfoList.length - 1}
                                />
                            );
                        }) : null
                    }
                    <View style={{height: 1, backgroundColor: '#F5F5F5'}}/>
                    <TotalsItemCell totalTons={weight} totalSquare={vol}/>
                    <View style={{height: 1, backgroundColor: '#F5F5F5'}}/>
                    <DetailsCell
                        transportNO_={transCode}
                        customerCode={customerOrderCode}
                        transportTime={time}
                    />
                </ScrollView>
            </View>
        );
    }
}
// GoodsSourceDetails.propTypes = {
//     deliveryInfo: React.PropTypes.object,
//     goodsInfoList: React.PropTypes.array,
//     taskInfo: React.PropTypes.object,
//     time: React.PropTypes.string,
//     transCode: React.PropTypes.string,
//     vol: React.PropTypes.number,
//     weight: React.PropTypes.number,
//     index: React.PropTypes.number,
//     addressMapSelect: React.PropTypes.func,
// };
