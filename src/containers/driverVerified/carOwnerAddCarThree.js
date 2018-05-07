import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    Image,
    TouchableOpacity,
    DeviceEventEmitter,
    Dimensions,
    TextInput,
    Platform
} from 'react-native';
import TimePicker from 'react-native-picker-custom';
import NavigatorBar from '../../components/common/navigatorbar';
import VerifiedGrayTitleItem from './verifiedIDItem/verifiedGrayTitleItem';
import RealNameItem from './verifiedIDItem/verifiedRealNameItem'
import DriverItem from './verifiedIDItem/verifiedDriverItem';
import VerifiedFailItem from './verifiedIDItem/verifiedFailItem';
import * as API from '../../constants/api';
import Storage from '../../utils/storage';
import Toast from '@remobile/react-native-toast';
import LoadingView from '../../utils/loading';
import {Geolocation} from 'react-native-baidu-map-xzx';
import HTTPRequest from '../../utils/httpRequest';
import StorageKey from '../../constants/storageKeys';
import Button from 'apsl-react-native-button';
import * as RouteType from '../../constants/routeType';
import ImagesItem from './verifiedIDItem/verifiedImagesItem';
import VerifiedTravelInfoItem from './verifiedIDItem/verifiedTravelInfoItem';
import VerifiedDateSources from './verifiedIDItem/verifiedDateSource';
import VierifiedBottomItem from './verifiedIDItem/verifiedBottomItem';
import Line from './verifiedIDItem/verifiedLineItem';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import {fetchData} from '../../action/app';

const headerImageFail = require('./images/verifiedFail.png');
const headerImageSuccess = require('./images/verifiedSuccess.png');
const headerImageLoading = require('./images/verifieding.png');
const BlueButtonArc = require('../../../assets/img/button/blueButtonArc.png');

let currentTime = 0;
let lastTime = 0;
let locationData = '';
let selectDatePickerType = 0; // 0  行驶证有效期  1  交强险有效期   2  车辆类型   3   车长
let carWeightDataSource = {};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#ffffff'
    },
    headStyle:{
        //backgroundColor: '#1b82d1',
        height: 190,
        alignItems: 'center',
    },
    textStyle: {
        fontSize: 20,
        color: 'white',
        position: 'absolute',
        bottom: 10,
        backgroundColor: 'transparent'
    },
    bottomViewStyle: {
        height: 40,
        marginBottom: 0,
        marginHorizontal: 0,
        backgroundColor: '#1b82d1',
        width
    },
    bottomTextStyle: {
        fontSize: 17,
        color: 'white',
        textAlign: 'center',
        marginVertical: 10,
    },
    loginButton: {
        backgroundColor: '#00000000',
        width: width,
        marginBottom: 0,
        height: 44,
        borderWidth: 0,
        borderColor: '#00000000',
    },
    titleStyle:{
        marginTop: 15,
        marginBottom: 15,
        marginLeft: 10,
        fontSize: 15,
        color: '#666666',
        flex: 1,
    },

    textInputStyle:{
        marginTop: 15,
        marginBottom: 15,
        marginRight: 10,
        fontSize: 15,
        color: '#333333',
        flex: 1,
        textAlign: 'right',
    }

});

class carOwnerAddCarThree extends Component{
    constructor(props) {
        super(props);

        const result = this.props.navigation.state.params.result;

        this.state={
            carType: result.vehicleType,
            carWeight: result.load,
            carLength: result.vehicleLength,
            carOwnerName: global.userName,
            carOwnerPhone: global.phone,
            carTwoType: result.carCategory,
            carVolume: result.volumeSize,
            carAllowNumber: result.transportationLicense,
            carNumber: result.gcarNo,
            image1: this.props.navigation.state.params.image1,
            image2: this.props.navigation.state.params.image2,
        };

        this.uploadAddCar = this.uploadAddCar.bind(this);
        this.showBigImage = this.showBigImage.bind(this);
        this.showDatePick = this.showDatePick.bind(this);
        this.getCarLengthWeight = this.getCarLengthWeight.bind(this);
        this.upload = this.upload.bind(this);
        this.carSuccess = this.carSuccess.bind(this);
        this.carFail = this.carFail.bind(this);

    }

    componentDidMount() {

        this.getCarLengthWeight();
        this.getCurrentPosition();

    }

    // 获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then((data) => {
            locationData = data;
        }).catch((e) => {
            console.log(e, 'error');
        });
    }

    /*增加车辆*/
    uploadAddCar(userPhone) {


    }

    /*显示原图*/
    showBigImage(imageUrls, selectIndex){
        this.props.navigation.dispatch({
            type: RouteType.ROUTE_SHOW_BIG_IMAGE,
            params: {
                imageUrls: imageUrls,
                selectIndex: selectIndex,
            }
        });

    }
    /*获取车长载重数据*/
    getCarLengthWeight() {
        currentTime = new Date().getTime();

        HTTPRequest({
            url: API.API_LENGTH_AND_WEIGHT_COMMIT,
            params: {},
            loading: () => {

            },
            success: (responseData) => {

                lastTime = new Date().getTime();
                ReadAndWriteFileUtil.appendFile('获取车长载重', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
                    locationData.district, lastTime - currentTime, '司机增加车辆页面');
                for (let i = 0; i < responseData.result.length; i++) {

                    let key = responseData.result[i].carLen;
                    let valu = responseData.result[i].carryCapacity;

                    carWeightDataSource[key] = valu;
                }
            },
            error: (errorInfo) => {

            },
            finish: () => {
            }
        });
    }

    /*显示日期选取器*/
    showDatePick(showLongTime, data, type) {
        let date = new Date();

        let selectValue = [];
        let title = '有效期至';
        if (type === 'carType') {
            selectValue = [data[0]];
            title = '车辆类型';
        }
        if (type === 'carTwoType') {
            selectValue = [data[0]];
            title = '车辆类别';
        }

        if (type === 'carLength') {
            selectValue = [data[0]];
            title = '车长';
        }

        TimePicker.init({
            selectedValue: selectValue,
            isShowLongTime: showLongTime,
            pickerLongTimeText: '长期',
            pickerData: data,
            pickerToolBarFontSize: 16,
            pickerLongTimeFontSize: 16,
            pickerFontSize: 17,
            pickerFontColor: [0, 0, 0, 1],
            pickerBg: [255, 255, 255, 1],
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: title,
            pickerConfirmBtnColor: [0, 121, 251, 1],
            pickerCancelBtnColor: [137, 137, 137, 1],
            pickerTitleColor: [20, 20, 20, 1],
            pickerLongTimeFontColor: [51, 51, 51, 1],
            pickerToolBarBg: [238, 238, 239, 1],
            pickerLongTimeBg: [255, 255, 255, 1],

            onPickerConfirm: (pickedValue, pickedIndex) => {
                console.log('onPickerConfirmdate', pickedValue, pickedIndex);


                if (selectDatePickerType === 2) {
                    this.setState({
                        carType: pickedValue[0],
                    });
                }
                if (selectDatePickerType === 4) {
                    this.setState({
                        carTwoType: pickedValue[0],
                    });
                }
                if (selectDatePickerType === 3) {
                    this.setState({
                        carLength: pickedValue[0],
                        carWeight: carWeightDataSource[pickedValue[0]],
                    });
                }

            },
            onPickerCancel: (pickedValue, pickedIndex) => {
                console.log('onPickerCanceldate', pickedValue, pickedIndex);
            },
            onPickerSelect: (pickedValue, pickedIndex) => {
                console.log('onPickerSelectdate', pickedValue, pickedIndex);
            }
        });

        TimePicker.show();
    }


    // 增加车辆
    upload(){

        if (this.state.phoneNumber === '') {
            Toast.showShortCenter('请输入车主电话');
            return;
        }
        if (this.state.userName === '') {
            Toast.showShortCenter('请输入车主姓名');
            return;
        }
        const result = this.props.navigation.state.params.result;

        result.fileNum =  '';//档案编号
        result.phoneNumber = this.state.carOwnerPhone;//车主电话
        result.userName= this.state.carOwnerName;// 车主姓名

        let carCategoryInt = 0;
        switch (result.carCategory){
            case '厢式货车':
                carCategoryInt = 1;
                break;
            case '集装箱挂车':
                carCategoryInt = 2;
                break;
            case '集装箱车':
                carCategoryInt = 3;
                break;
            case '箱式挂车':
                carCategoryInt = 4;
                break;
        }

        result.carCategory = carCategoryInt;
        result.volumeSize = parseInt(result.volumeSize);

        this.props.carVerifiedAction({
            ...result
        },this.carSuccess,this.carFail);

    }

    carSuccess(data){
        console.log('carSuccess=',data);
        if (this.props.currentStatus === 'driver'){
            this.props.navigation.dispatch({type: 'pop', key: 'Main'})
        }else {
            const result = this.props.navigation.state.params.result;

            this.props.navigation.dispatch({ type: RouteType.ROUTE_CAR_OWNER_VERIFIED_MSG_CODE,
            params:{
                result : result
            }})

        }



    }
    carFail(data){
        Toast.showShortCenter(data.message);

    }
    render() {

        return (
            <View style={styles.container}>
                <NavigatorBar
                    title='车辆信息'
                    router={this.props.navigation}
                    hiddenBackIcon={false}
                />
                <ScrollView
                    bounces={true}
                    ref="scrollView"
                    keyboardDismissMode='on-drag'
                >
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.titleStyle}>
                            车主姓名
                        </Text>
                        <TextInput style={styles.textInputStyle}
                                   maxLength={7}
                                   onChangeText={(text) => {
                                       this.setState({
                                           carOwnerName: text,
                                       });
                                   }}
                                   onFocus={()=>{
                                   }}
                                   value={this.state.carOwnerName}
                                   placeholder={'请输入车主姓名'}
                                   underlineColorAndroid={'transparent'}

                        />
                    </View>
                    <Line/>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.titleStyle}>
                            车主电话
                        </Text>
                        <TextInput style={styles.textInputStyle}
                                   maxLength={7}
                                   onChangeText={(text) => {
                                       this.setState({
                                           carOwnerPhone: text,
                                       });
                                   }}
                                   onFocus={()=>{
                                   }}
                                   value={this.state.carOwnerPhone}
                                   placeholder={'请输入车主电话'}
                                   underlineColorAndroid={'transparent'}

                        />
                </View>
                    <VerifiedTravelInfoItem carType={this.state.carType}
                                            carTypeTwo={this.state.carTwoType}
                                            carWeight={this.state.carWeight}
                                            carLength={this.state.carLength}
                                            carVolume= {this.state.carVolume}
                                            carAllowNumber={this.state.carAllowNumber}
                                            carNumber={this.state.carNumber}
                                            carNumberChange={(text)=>{
                                                    this.setState({
                                                        carNumber: text
                                                    })
                                            }}
                                            volumeValueChange={(text)=>{
                                                    this.setState({
                                                        carVolume: text
                                                    })
                                            }}
                                            allowNumberValueChange={(text)=>{
                                                    this.setState({
                                                        carAllowNumber: text
                                                    })
                                            }}
                                            carTypeClick={()=>{
                                                     //selectDatePickerType = 2;
                                                     //this.showDatePick(false, VerifiedDateSources.createCarTypeDate(), 'carType');
                                            }}
                                            carTypeTwoClick={()=>{
                                                     //selectDatePickerType = 4;
                                                     //this.showDatePick(false, VerifiedDateSources.createCarTypeTwoDate(), 'carTwoType');
                                            }}
                                            carLengthClick={()=>{

                                                     selectDatePickerType = 3;

                                                     this.showDatePick(false, VerifiedDateSources.createCarLengthDate(carWeightDataSource), 'carLength');
                                            }}
                                            textOnFocus={(value)=>{
                                                    if (Platform.OS === 'ios'){
                                                        this.refs.scrollView.scrollTo({x: 0, y: value, animated: true});
                                                     }
                                            }}

                    />
                    <VerifiedGrayTitleItem title="图片列表"/>
                    <ImagesItem firstName ="挂车行驶证"
                                secondName="挂车运营证"
                                firstImagePath={this.state.image1}
                                secondImagePath={this.state.image2}
                                imageClick={(index)=>{
                                    this.showBigImage([this.state.image1, this.state.image2], index);
                                }}
                    />

                    <VierifiedBottomItem btnTitle="确认提交" clickAction={()=>{
                        this.upload()
                    }}/>
                </ScrollView>


            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        currentStatus: state.user.get('currentStatus'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        carVerifiedAction:(params,ownerVerifiedHomeSucCallBack,ownerVerifiedHomeFailCallBack) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                api: API.API_AUTH_QUALIFICATIONS_COMMIT,
                success: (data) => {
                    ownerVerifiedHomeSucCallBack(data);
                },
                fail:(data) => {
                    ownerVerifiedHomeFailCallBack(data);
                }
            }))
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(carOwnerAddCarThree);
