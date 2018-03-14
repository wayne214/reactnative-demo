/**
 * 企业车主认证详情页面
 * */
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

import NavigatorBar from '../../../components/common/navigatorbar';
import VerifiedGrayTitleItem from '../verifiedIDItem/verifiedGrayTitleItem';
import RealNameItem from '../ownerVerified/ownerVerifiedItem/verifiedCompanyOwnerRealNameItem';
import BusinessLicenseItem from './ownerVerifiedItem/verifiedBusinessLicenseItem';
import VerifiedFailItem from '../verifiedIDItem/verifiedFailItem';
import * as API from '../../../constants/api';
import Storage from '../../../utils/storage';
import Toast from '@remobile/react-native-toast';
import LoadingView from '../../../utils/loading';
import {Geolocation} from 'react-native-baidu-map-xzx';
import ReadAndWriteFileUtil from '../../../utils/readAndWriteFileUtil';
import HTTPRequest from '../../../utils/httpRequest';
import StorageKey from '../../../constants/storageKeys';
const BlueButtonArc = require('../../../../assets/img/verified/blueButtonArc.png');
import Button from 'apsl-react-native-button';
import Line from '../verifiedIDItem/verifiedLineItem';
import * as RouteType from '../../../constants/routeType';
import {fetchData} from '../../../action/app';

const headerImageFail = require('./../images/verifiedFail.png');
const headerImageSuccess = require('./../images/verifiedSuccess.png');
const headerImageLoading = require('./../images/verifieding.png');


let currentTime = 0;
let lastTime = 0;
let locationData = '';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    headStyle: {
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

class enterpriseownerVerifiedState extends Component {
    constructor(props) {
        super(props);

        this.state = {
            resultInfo: {},
            appLoading: false,
            qualifications: '',
        };

        this.getRealNameDetail = this.getRealNameDetail.bind(this);
        this.reloadVerified = this.reloadVerified.bind(this);
        this.showBigImage = this.showBigImage.bind(this);

        this.getDetailSuccess = this.getDetailSuccess.bind(this);
        this.getDetailFail = this.getDetailFail.bind(this);

    }

    componentDidMount() {

        this.getCurrentPosition();
        // this.getRealNameDetail(global.phone);
        this.getRealNameDetail('4231');

        /*
         if (this.props.ownerStatus == '21' || this.props.ownerStatus == '23') {

         this.getRealNameDetail(global.phone);

         } else {
         Storage.get(StorageKey.enterpriseownerInfoResult).then((value) => {

         if (value) {
         this.setState({
         resultInfo: value,
         });
         } else {

         this.getRealNameDetail(global.phone);

         }
         });

         }
         */
    }

    // 获取当前位置
    getCurrentPosition() {
        Geolocation.getCurrentPosition().then((data) => {
            locationData = data;
        }).catch((e) => {
            console.log(e, 'error');
        });
    }

    getDetailSuccess(result){
        lastTime = new Date().getTime();
        ReadAndWriteFileUtil.appendFile('企业车主认证详情', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
            locationData.district, lastTime - currentTime, '企业车主认证详情页面');
        if (result) {
            this.setState({
                resultInfo: result,
                qualifications: result.certificationStatus,
            });

            let obj = {

                IDName: result.rmcAnalysisAndContrast.manualLegalIdCardName,
                IDCard: result.rmcAnalysisAndContrast.manualLegalIdCard,
                IDDate: result.rmcAnalysisAndContrast.manualLegalIdCardValidity,

                idCardImage: result.rmcPicAddress.legalPersonPositiveCardThumbnailAddress,
                idCardTrunImage: result.rmcPicAddress.legalPersonOppositeCardThumbnailAddress,

                legalPersonPositiveCard: result.legalPersonPositiveCard, // 身份证正面原图
                legalPersonPositiveCardThumbnail: result.legalPersonPositiveCardThumbnail, // 身份证正面缩略图

                legalPersonOppositeCard: result.legalPersonOppositeCard, // 身份证反面原图
                legalPersonOppositeCardThumbnail: result.legalPersonOppositeCardThumbnail, // 身份证反面缩略图


                companyName: result.rmcAnalysisAndContrast.manualComName,
                companyOwnerName: result.rmcAnalysisAndContrast.manualPerson,
                companyAddress: result.rmcAnalysisAndContrast.manualComAddress,
                companyCode: result.rmcAnalysisAndContrast.manualUnifiedSocialCreditCode,

                businessTrunRightImage: result.rmcPicAddress.businessLicenceThumbnailAddress,
                businessLicence: result.businessLicence, // 营业执照原图
                businessCardPhotoThumb: result.businessLicenceThumbnail, // 营业执照缩略图
                businessLicenseValidUntil: result.rmcAnalysisAndContrast.manualBusinessValidity, // 营业执照有效期

                isChooseCompanyImage: false,
                isChooseBusinessLicenseValidImage: false,
                isChooseBusinessLicenseValidTrunImage: false,

                // 默认
                leadPersonName: result.person, // 法人姓名
                leadPersonCardCode: result.legalIdCard, // 法人身份证号
                leadPersonCardCodeTime: result.legalIdCardValidity, //法 人身份证有效期至
                comName: result.comName, // 解析的公司名称
                person: result.legalIdCardName, // 解析的法人名称
                comAddress: result.comAddress, // 解析的公司地址
                unifiedSocialCreditCode: result.unifiedSocialCreditCode, // 解析的统一社会信用代码
                businessValidity: result.businessValidity, // 营业执照有效期

                isShowCardInfo: true,
                isShowCompanyInfo: true
            };

            //if (result.certificationStatus == '1202'){
            Storage.save(StorageKey.enterpriseownerInfoResult, obj);
            //}
            DeviceEventEmitter.emit('verifiedSuccess');

        }
        this.setState({
            appLoading: false,
        });
    }
    getDetailFail(){
        Toast.showShortCenter('获取详情失败');
        this.setState({
            appLoading: false,
        });
    }
    getRealNameDetail(userPhone) {
        currentTime = new Date().getTime();

        this.setState({
            appLoading: true,
        });

        this.props.ownerVerifiedHomeAction({
            busTel: userPhone,
            companyNature: '企业'
        },this.getDetailSuccess,this.getDetailFail);

    }


    /*重新认证*/
    reloadVerified() {
        Storage.get(StorageKey.enterpriseownerInfoResult).then((value) => {

            if (value) {
                this.props.navigation.navigate('CompanyCarOwnerAuth', {
                    resultInfo: value,
                });
            } else {
                this.props.navigation.navigate('CompanyCarOwnerAuth', {
                    resultInfo: this.state.resultInfo,
                });
            }
        });
    }

    /*显示原图*/
    showBigImage(imageUrls, selectIndex) {

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

        // 21  企业车主认证中   22 企业车主认证通过  23 企业车主认证驳回

        let headView = this.state.qualifications == '1201' ?
            <View style={styles.headStyle}>

                <Image source={headerImageLoading}/>

                <Text style={styles.textStyle}>认证中</Text>
            </View>
            : this.state.qualifications == '1202' ?
                <View style={styles.headStyle}>

                    <Image source={headerImageSuccess} resizeMode='stretch'/>

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
            <Image style={styles.bottomViewStyle} source={BlueButtonArc}>
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
            </Image> : null;

        return (
            <View style={styles.container}>
                <NavigatorBar
                    title={'车主认证'}
                    router={navigator}
                    hiddenBackIcon={false}
                    optTitle='个人车主'
                    optTitleStyle={{fontSize: 16,color: '#333333'}}
                    firstLevelClick={()=>{
                       // 进行个人车主认证
                       //this.props.navigation.navigate('PersonCarOwnerAuth');
                       Storage.get(StorageKey.personownerInfoResult).then((value) => {
                                            if (value) {
                                                this.props.navigation.dispatch({
                                                    type: RouteType.ROUTE_PERSON_CAR_OWNER_AUTH ,
                                                    params: {
                                                        resultInfo: value,
                                                    }}
                                                )
                                            } else {
                                                this.props.navigation.dispatch({ type: RouteType.ROUTE_PERSON_CAR_OWNER_AUTH })
                                            }
                                        });
                    }}
                />

                <ScrollView
                    bounces={false} showsVerticalScrollIndicator={false}>

                    {headView}
                    <View style={{height: 10, width: width, backgroundColor: '#f5f5f5'}}/>
                    <BusinessLicenseItem resultInfo={this.state.resultInfo}
                                         imageClick={(index)=>{
                                             if (!this.state.resultInfo.rmcPicAddress)
                                                return;
                                             if (index === 0){
                                                 if (this.state.resultInfo.rmcPicAddress.businessLicenceAddress){
                                                     this.showBigImage([this.state.resultInfo.rmcPicAddress.businessLicenceAddress], 0);
                                                 }else
                                                     Toast.showShortCenter('暂无图片');
                                             }
                                         }}/>
                    <View style={{height: 10, width: width, backgroundColor: '#f5f5f5'}}/>
                    <VerifiedGrayTitleItem title='法人身份证'/>
                    <Line/>
                    <RealNameItem resultInfo={this.state.resultInfo}
                                  imageClick={(index)=>{
                                       if (!this.state.resultInfo.rmcPicAddress)
                                        return;

                                      if (index === 0){
                                          if (this.state.resultInfo.rmcPicAddress.legalPersonPositiveCardAddress){
                                              this.showBigImage([this.state.resultInfo.rmcPicAddress.legalPersonPositiveCardAddress], 0);
                                          }else 
                                              Toast.showShortCenter('暂无图片');
                                      }
                                      if (index === 1){
                                          if (this.state.resultInfo.rmcPicAddress.legalPersonOppositeCardAddress){
                                              this.showBigImage([this.state.resultInfo.rmcPicAddress.legalPersonOppositeCardAddress], 0);
                                          }else 
                                              Toast.showShortCenter('暂无图片');
                                      }
                                      // if (index === 2){
                                      //     if (this.state.resultInfo.handleIdNormalPhotoAddress){
                                      //         this.showBigImage([this.state.resultInfo.handleIdNormalPhotoAddress], 0);
                                      //     }else
                                      //         Toast.showShortCenter('暂无图片');
                                      // }

                                  }}/>

                    {bottomView}

                </ScrollView>

                {bottomReloadView}

                {
                    this.state.appLoading ? <LoadingView /> : null
                }
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        ownerStatus: state.user.get('ownerStatus'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        ownerVerifiedHomeAction:(params,ownerVerifiedHomeSucCallBack,ownerVerifiedHomeFailCallBack) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                api: API.API_QUERY_COMPANY_INFO,
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

export default connect(mapStateToProps, mapDispatchToProps)(enterpriseownerVerifiedState);
