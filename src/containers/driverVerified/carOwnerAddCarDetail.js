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
    Dimensions
} from 'react-native';

import NavigatorBar from '../../components/common/navigatorbar';
import VerifiedGrayTitleItem from './verifiedIDItem/verifiedGrayTitleItem';
import DriverCardItem from './verifiedIDItem/verifiedDriverCardItem'
import DriverCardInfoItem from './verifiedIDItem/verifiedDriverCardInfoItem';
import VerifiedFailItem from './verifiedIDItem/verifiedFailItem';
import * as API from '../../constants/api';
import Storage from '../../utils/storage';
import LoadingView from '../../utils/loading';
import Toast from '@remobile/react-native-toast';
import StorageKey from '../../constants/storageKeys';
import HTTPRequest from '../../utils/httpRequest';
const BlueButtonArc = require('../../../assets/img/button/blueButtonArc.png');
import {fetchData} from "../../action/app";

import Button from 'apsl-react-native-button';
import GuaCheDetail from './verifiedIDItem/verifiedCarGuaDetail';

const headerImageFail = require('./images/verifiedFail.png');
const headerImageSuccess = require('./images/verifiedSuccess.png');
const headerImageLoading = require('./images/verifieding.png');


import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';

let currentTime = 0;
let lastTime = 0;
let locationData = '';
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

});

class certificationState extends Component{
    constructor(props) {
        super(props);

        this.state={
            resultInfo: {},
            appLoading: false,
            qualifications: '',
        };

        this.getVerifiedDetail = this.getVerifiedDetail.bind(this);
        this.reloadVerified = this.reloadVerified.bind(this);
        this.showBigImage = this.showBigImage.bind(this);

        this.getDetailSuccessCallBack = this.getDetailSuccessCallBack.bind(this);
        this.getDetailFailCallBack = this.getDetailFailCallBack.bind(this);
    }


    componentDidMount(){

        this.getCurrentPosition();

        // this.getVerifiedDetail(global.userInfo.phone, global.plateNumber);
        this.getVerifiedDetail('15534343431', '豫A23090');

    }
    getDetailSuccessCallBack(result){
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('获取司机增加车辆详情详情', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '司机增加车辆详情详情页面');
        this.setState({
            resultInfo: result,
            qualifications: result.certificationStatus,
            appLoading: false,
        });


        DeviceEventEmitter.emit('certificationSuccess');

    }
    getDetailFailCallBack(){
        Toast.showShortCenter('获取详情失败');
        this.setState({
            appLoading: false,
        });
    }
    /*资质详情认证*/
    getVerifiedDetail(phoneNum, plateNumber) {
        currentTime = new Date().getTime();

        this.props.getCarInfo({
            phoneNum: phoneNum,
            plateNumber: plateNumber,
        }, this.getDetailSuccessCallBack, this.getDetailFailCallBack);

    }

    // 获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then((data) => {
            console.log('position =', JSON.stringify(data));
            locationData = data;
        }).catch((e) => {
            console.log(e, 'error');
        });
    }

    /*重新认证*/
    reloadVerified(){
        Storage.get(StorageKey.carOwnerAddCarInfo).then((value) => {

            if (value){
                this.props.navigation.navigate('CertificationPage', {
                    resultInfo: value,
                });
            }else {
                this.props.navigation.navigate('CertificationPage', {
                    resultInfo: this.state.resultInfo,
                });
            }
        });
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


    render() {
        const navigator = this.props.navigation;
        // 1201  认证中   1202 认证通过  1203 认证驳回

        let headView = this.state.qualifications == '1201' ?
            <View style={styles.headStyle}>

                <Image source={headerImageLoading}/>

                <Text style={styles.textStyle}>认证中</Text>
            </View>
            : this.state.qualifications == '1202' ?
                <View style={styles.headStyle}>

                    <Image source={headerImageSuccess}/>

                    <Text style={styles.textStyle}>认证通过</Text>
                </View>
                :
                <View style={styles.headStyle}>

                    <Image source={headerImageFail}/>

                    <Text style={styles.textStyle}>认证驳回</Text>
                </View>;

        let bottomView = this.state.qualifications == '1203' ?
            <View>
                <VerifiedGrayTitleItem title='驳回原因'/>
                <VerifiedFailItem reason={this.state.resultInfo.certificationOpinion}/>

            </View> : null;


        let bottomReloadView = this.state.qualifications == '1203' ?
            <Image style={styles.bottomViewStyle} source ={BlueButtonArc}>
                <Button
                    ref='button'
                    isDisabled={false}
                    style={styles.loginButton}
                    textStyle={{color: 'white', fontSize: 18}}
                    onPress={() => {
                        this.reloadVerified();
                    }}
                >
                    重新上传
                </Button>
            </Image>: null;
        return (
            <View style={styles.container}>
                <NavigatorBar
                    title='车辆详情'
                    router={this.props.navigation}
                    hiddenBackIcon={false} />

                <ScrollView
                    bounces={false}>


                    {headView}
                    <VerifiedGrayTitleItem title="车辆信息"/>
                    <GuaCheDetail resultInfo={this.state.resultInfo}
                                  imageClick={(index)=>{


                                      if (index === 0){
                                          // 挂车行驶证
                                      }
                                      if (index === 1){
                                          // 挂车运营证
                                      }


                                  }}/>

                    <VerifiedGrayTitleItem title="行驶证"/>
                    <DriverCardItem resultInfo={this.state.resultInfo}
                                    imageClick={(index)=>{


                                        if (index === 0){
                                          if (this.state.resultInfo.drivingLicensePic){
                                              this.showBigImage([this.state.resultInfo.drivingLicensePic], 0);
                                          }else
                                              Toast.showShortCenter('暂无图片');
                                      }
                                      if (index === 1){
                                          if (this.state.resultInfo.drivingLicenseSecondaryPic){
                                              this.showBigImage([this.state.resultInfo.drivingLicenseSecondaryPic], 0);
                                          }else
                                              Toast.showShortCenter('暂无图片');
                                      }
                                      if (index === 2){
                                          if (this.state.resultInfo.carHeadPic){
                                              this.showBigImage([this.state.resultInfo.carHeadPic], 0);
                                          }else
                                              Toast.showShortCenter('暂无图片');
                                      }

                                  }}/>

                    <VerifiedGrayTitleItem title="交强险"/>
                    <DriverCardInfoItem resultInfo={this.state.resultInfo}
                                        imageClick={()=>{


                                            if (this.state.resultInfo.insurancePic){
                                                this.showBigImage([this.state.resultInfo.insurancePic], 0);
                                            }else
                                                Toast.showShortCenter('暂无图片');
                                        }}/>

                    {bottomView}

                </ScrollView>

                {bottomReloadView}

                {
                    this.state.loading ? <LoadingView/> : null
                }
            </View>
        )
    }
}
function mapStateToProps(state) {
    return {

    };
}

function mapDispatchToProps(dispatch) {
    return {
        getCarInfo: (params, successCallback, failCallback) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                api: API.API_AUTH_QUALIFICATIONS_DETAIL,
                success: (data) => {
                    successCallback(data);
                },
                fail: ()=> {
                    failCallback();
                }
            }))
        }

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(certificationState);

