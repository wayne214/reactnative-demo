import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import Toast from '@remobile/react-native-toast';
import Button from 'apsl-react-native-button';
import CommonCell from '../../containers/mine/cell/commonCell';
import NavigatorBar from '../../components/common/navigatorbar';
import * as API from '../../constants/api';
import Storage from '../../utils/storage';
import * as StaticColor from '../../constants/colors';
import Loading from '../../utils/loading';
import NoImage from '../../../assets/img/mine/person/noiamgeShow.png';
import {Geolocation} from 'react-native-baidu-map-xzx';
// import ReadAndWriteFileUtil from '../../utils/readAndWriteFileUtil';
import HTTPRequest from '../../utils/httpRequest';
import StorageKey from '../../constants/storageKeys';
import PersonNoInfo from '../../../assets/img/mine/person/personInfo.png';
import {fetchData} from "../../action/app";
import * as RouteType from '../../constants/routeType';


const {width} = Dimensions.get('window');
let imgListTemp = [];
let imgList = [];
let currentTime = 0;
let lastTime = 0;
let locationData = '';

const styles = StyleSheet.create({
    allContainer:{
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    container: {
        marginTop: 10,
        flex: 1,
        backgroundColor: StaticColor.WHITE_COLOR,
    },
    Button: {
        backgroundColor: 'transparent',
        marginLeft: 10,
        marginRight: 10,
        borderWidth: 0,
        height: 40,
        borderRadius: 5,
        marginBottom: 0,
    },
    ButtonText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    separatorLine: {
        height: 10,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    imageStyle: {
        width: 102,
        height: 65,
        borderWidth: 1,
        borderColor: StaticColor.COLOR_VIEW_BACKGROUND,
        borderRadius: 3,
    },
    subImageContainer: {
        borderColor: StaticColor.LIGHT_GRAY_TEXT_COLOR,
        borderWidth: 1,
        width: 112,
        height: 75,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textStyle: {
        color: StaticColor.COLOR_LIGHT_GRAY_TEXT,
        fontSize: 14,
        marginTop: 10,
    },
    subContainer: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
    },
    buttonGround: {
        width: width - 20,
        marginTop: 55,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 0,
        height: 44,
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor: '#0092FF'
    },
});

class PersonInfo extends Component {

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.state = {
            personInfo: null,
            loading: false,
            phone: params.phone,
        };
        this.fetchData = this.fetchData.bind(this);
        this.getPersonInfoSuccessCallback = this.getPersonInfoSuccessCallback.bind(this);
        this.getPersonInfoFailCallback = this.getPersonInfoFailCallback.bind(this);
        this.onClickImage = this.onClickImage.bind(this);
    }
    static navigationOptions = ({navigation}) => {
        const {state, setParams} = navigation
        return {
            tabBarLabel: '个人信息',
            header: <NavigatorBar title='个人信息' hiddenBackIcon={false} router={navigation}/>,
        }
    };
    componentDidMount() {
        const {verifiedState} = this.props;
        imgListTemp = [];
        imgList = [];
        if (verifiedState === 1200) {
            this.setState({
                personInfo: null,
            });
        } else {
            this.setState({
                personInfo: null,
            });
            this.fetchData(this.getPersonInfoSuccessCallback, this.getPersonInfoFailCallback);
        }
       // Storage.get(StorageKey.personInfoResult).then((value) => {
       //      if (value) {
       //          if (value.drivingLicenceHomePage && value.drivingLicenceHomePage !== '') {
       //              imgListTemp.push(value.drivingLicenceHomePage);
       //          }
       //          if (value.drivingLicenceSubPage && value.drivingLicenceSubPage !== '') {
       //              imgListTemp.push(value.drivingLicenceSubPage);
       //          }
       //          if (value.positiveCard && value.positiveCard !== '') {
       //              imgListTemp.push(value.positiveCard);
       //          }
       //          if (value.oppositeCard && value.oppositeCard !== '') {
       //              imgListTemp.push(value.oppositeCard);
       //          }
       //          this.setState({
       //              personInfo: value,
       //          });
       //      } else {
       //          if (verifiedState === 1200) {
       //              this.setState({
       //                  personInfo: null,
       //              });
       //          } else {
       //              this.setState({
       //                  personInfo: null,
       //              });
       //              this.fetchData(this.getPersonInfoSuccessCallback, this.getPersonInfoFailCallback);
       //          }
       //      }
       //  })
    }

    getCurrentPosition() {
        Geolocation.getCurrentPosition().then((data) => {
            console.log('position =',JSON.stringify(data));
            locationData = data;
        }).catch((e) => {
            console.log(e, 'error');
        });
    }
    getPersonInfoFailCallback() {
        const {verifiedState} = this.props;
        if (verifiedState === '1200') {
            this.setState({
                personInfo: null,
            });
        } else {
            this.setState({
                personInfo: null,
            });
        }
    }
    getPersonInfoSuccessCallback(result) {
        lastTime = new Date().getTime();
        // ReadAndWriteFileUtil.appendFile('实名认证详情', locationData.city, locationData.latitude, locationData.longitude, locationData.province,
        //     locationData.district, lastTime - currentTime, '个人信息页面');
        if (result) {
            Storage.save(StorageKey.personInfoResult, result);
            this.setState({
                personInfo: result,
            });
            if (result.drivingLicenceHomePage && result.drivingLicenceHomePage !== '') {
                imgListTemp.push(result.drivingLicenceHomePage);
            }
            if (result.drivingLicenceSubPage && result.drivingLicenceSubPage !== '') {
                imgListTemp.push(result.drivingLicenceSubPage);
            }
            if (result.positiveCard && result.positiveCard !== '') {
                imgListTemp.push(result.positiveCard);
            }
            if (result.oppositeCard && result.oppositeCard !== '') {
                imgListTemp.push(result.oppositeCard);
            }
        } else {
            this.setState({
                personInfo: null,
            });
        }
    }
    fetchData(getPersonInfoSuccessCallback,getPersonInfoFailCallback) {
            if (global.phone) {
                currentTime = new Date().getTime();
                this.props.getPersonInfo({
                    phoneNum: this.state.phone // this.state.phone
                }, getPersonInfoSuccessCallback, getPersonInfoFailCallback);
            }

    }

    onClickImage(imgIndex) {
        if (imgListTemp.length > 0) {
            if (imgIndex > imgListTemp.length) {
                imgIndex = imgListTemp.length - 1;
            }
            imgList = imgListTemp.map((i, index) => {
                return {url: i ? i : ''};
            });
            this.props.navigation.navigate('ImageShow',
                {
                    image: imgList,
                    num: imgIndex,
                });
        }
    }
    render() {
        const person = this.state.personInfo !== null && this.state.personInfo !== '' ? this.state.personInfo : '';

        const showDrivingLicenceHomePage = person.drivingLicenseHomepageThumbnailAddress !== null && person.drivingLicenseHomepageThumbnailAddress !== '' ||
            person.drivingLicenceHomePage && person.drivingLicenceHomePage !== '';
        const showDrivingLicenceSubPage = person.drivingLicenseVicePageThumbnailAddress !== null && person.drivingLicenseVicePageThumbnailAddress !== '' ||
            person.drivingLicenceSubPage && person.drivingLicenceSubPage !== '';
        const showPositiveCard = person.idFaceSideThumbnailAddress !== null && person.idFaceSideThumbnailAddress !== '' ||
            person.positiveCard && person.positiveCard !== '';
        const showOppositeCard = person.idBackSideThumbnailAddress !== null && person.idBackSideThumbnailAddress !== '' ||
            person.oppositeCard && person.oppositeCard !== '';
        return (
            <View style={styles.allContainer}>
                {
                    person == '' ?
                        <View style={{
                            width,
                            alignItems: 'center',
                        }}>
                            <Image
                                style={{
                                    marginTop: 130,
                                }}
                                source={PersonNoInfo}/>
                            <Text
                                style={{
                                    marginTop: 30,
                                    fontSize: 16,
                                    color: '#333333',
                                }}
                            >
                                您的个人信息为空，请先去实名认证吧~
                            </Text>
                            <View style={styles.buttonGround}>
                                <Button
                                    style={styles.Button}
                                    textStyle={styles.ButtonText}
                                    onPress={() => {

                                       Storage.get(StorageKey.changePersonInfoResult).then((value) => {
                                                   if (value) {
                                                       this.props.navigation.dispatch({
                                                           type: RouteType.ROUTE_DRIVER_VERIFIED,
                                                           params: {
                                                               resultInfo: value,
                                                           }
                                                       });
                                                   }else {
                                                       this.props.navigation.dispatch({ type: RouteType.ROUTE_DRIVER_VERIFIED })
                                                   }
                                                });

                                    }}
                                >
                                    立即认证
                                </Button>
                            </View>
                        </View>
                        :
                        <ScrollView>
                            <View style={styles.container}>
                                <CommonCell itemName="姓名"
                                            content={person.idCardName ? person.idCardName : person.driverPhone ? person.driverPhone : ''}/>
                                <CommonCell itemName="手机号码"
                                            content={person.driverPhone !== null ? person.driverPhone : ''}/>
                                <CommonCell itemName="身份证"
                                            content={person.idCard !== null ? person.idCard : ''}/>
                                <CommonCell itemName="身份证有效期至"
                                            content={person.idCardValidity !== null ? person.idCardValidity : ''}/>
                                <CommonCell itemName="驾驶证号"
                                            content={person.driverCard !== null ? person.driverCard : ''}/>
                                <CommonCell itemName="准驾车型"
                                            content={person.quasiCarType !== null ? person.quasiCarType : ''}/>
                                <CommonCell itemName="驾驶证有效期至"
                                            content={person.driverCardExpiry !== null ? person.driverCardExpiry : ''}
                                            hideBottomLine={true}/>
                                <View style={styles.separatorLine}/>
                                <View>
                                    <CommonCell itemName="驾驶证照片"
                                                titleColorStyle={{color: '#333333'}}
                                                content={''}/>
                                    <View style={styles.subContainer}>
                                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                            <TouchableOpacity activeOpacity={0.8} onPress={() => { showDrivingLicenceHomePage ?
                                                this.onClickImage(0) : Toast.showShortCenter('暂无图片'); }}
                                                style={styles.subImageContainer}
                                            >
                                                {
                                                    showDrivingLicenceHomePage ?
                                                        <Image style={styles.imageStyle} source={{uri: person.drivingLicenseHomepageThumbnailAddress ? person.drivingLicenseHomepageThumbnailAddress : person.drivingLicenceHomePage}}/> :
                                                        <Image style={styles.imageStyle} source={NoImage}/>
                                                }
                                            </TouchableOpacity>
                                            <Text style={styles.textStyle}>驾驶证主页</Text>
                                        </View>
                                        <View style={{justifyContent: 'center', alignItems: 'center', marginLeft: 10}}>
                                            <TouchableOpacity activeOpacity={0.8} onPress={() => { showDrivingLicenceSubPage ?
                                                this.onClickImage(1) : Toast.showShortCenter('暂无图片'); }}
                                                style={styles.subImageContainer}
                                            >
                                                {
                                                    showDrivingLicenceSubPage ?
                                                        <Image style={styles.imageStyle} source={{uri: person.drivingLicenseVicePageThumbnailAddress ? person.drivingLicenseVicePageThumbnailAddress : person.drivingLicenceSubPage}}/> :
                                                        <Image style={styles.imageStyle} source={NoImage}/>
                                                }
                                            </TouchableOpacity>
                                            <Text style={styles.textStyle}>驾驶证副页</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.separatorLine}/>
                                <View>
                                    <CommonCell itemName="身份证照片"
                                                titleColorStyle={{color: '#333333'}}
                                                content={''}/>
                                    <View style={styles.subContainer}>
                                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                            <TouchableOpacity activeOpacity={0.8} onPress={() => { showPositiveCard ?
                                                this.onClickImage(2) : Toast.showShortCenter('暂无图片'); }}
                                                style={styles.subImageContainer}
                                            >
                                                {
                                                    showPositiveCard ?
                                                        <Image style={styles.imageStyle} source={{uri: person.idFaceSideThumbnailAddress ? person.idFaceSideThumbnailAddress : person.positiveCard}}/> :
                                                        <Image style={styles.imageStyle} source={NoImage}/>
                                                }
                                            </TouchableOpacity>
                                            <Text style={styles.textStyle}>身份证正面</Text>
                                        </View>
                                        <View style={{justifyContent: 'center', alignItems: 'center', marginLeft: 10}}>
                                            <TouchableOpacity activeOpacity={0.8} onPress={() => { showOppositeCard ?
                                                this.onClickImage(3) : Toast.showShortCenter('暂无图片'); }}
                                                style={styles.subImageContainer}
                                            >
                                                {
                                                    showOppositeCard ?
                                                        <Image style={styles.imageStyle} source={{uri: person.idBackSideThumbnailAddress ? person.idBackSideThumbnailAddress : person.oppositeCard}}/> :
                                                        <Image style={styles.imageStyle} source={NoImage}/>
                                                }
                                            </TouchableOpacity>
                                            <Text style={styles.textStyle}>身份证反面</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                }
                {
                    this.state.loading ? <Loading /> : null
                }
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        verifiedState: state.jpush.get('verifiedState'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getPersonInfo: (params, successCallback, failCallback) => {
            dispatch(fetchData({
                body: params,
                method: 'POST',
                api: API.API_AUTH_REALNAME_DETAIL + params.phoneNum,
                success: data => {
                    successCallback(data);
                },
                fail: ()=> {
                    failCallback();
                }
            }))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonInfo);
