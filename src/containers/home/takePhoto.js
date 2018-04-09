/**
 * 拍照界面
 * Created by xizhixin on 2017/12/14.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
    Platform,
    Alert
} from 'react-native';
import Camera from 'react-native-camera';
import * as StaticColor from '../../constants/colors';
import * as RouteType from '../../constants/routeType';
import hollowCircle from '../../../assets/home/hollowCircle.png';
import solidCircle from '../../../assets/home/solidCircle.png';
import PermissionsManagerAndroid from '../../utils/permissionManagerAndroid';

const {width, height} = Dimensions.get('window');

class takePhoto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openFlash: false,
        };
        this.takePicture = this.takePicture.bind(this);
    }
    componentDidMount() {

    }

    /*
     * 点击拍照
     * */
    takePicture() {
        // jpegQuality 1-100, 压缩图片
        const options = {jpegQuality: 80};
        this.camera.capture({})
            .then((data) =>{
                console.log('takePicture===',data);
                this.props.navigation.dispatch({
                    type: RouteType.ROUTE_TAKE_PHOTO_FINISHED_PAGE,
                    params: {
                        imagePath: data.path,
                        mediaType: 'photo',
                    }
                });
            })
            .catch(err => console.error(err));

    }
    render() {
        const navigator = this.props.navigation;
        return (
            <View style={styles.container}>
                <Camera
                    ref={(cam) => {
                        this.camera = cam;
                    }}
                    style={styles.cameraStyle}
                    type={Camera.constants.Type.back}
                    captureTarget={Camera.constants.CaptureTarget.disk}
                    mirrorImage={false}
                    //"high" (default),"medium",  "low",  "photo", "1080p",  "720p",  "480p".
                    captureQuality="medium"
                    orientation={Camera.constants.Orientation.portrait}
                >
                    <View style={styles.bottomView}>
                        <Text style={styles.text}>轻触拍照</Text>
                        <View style={styles.photoView}>
                            <View style={{width: width / 2 - 39,}}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.dispatch({ type: 'pop' })
                                    }}
                                >
                                    <Text style={styles.backIcon}>&#xe674;</Text>
                                </TouchableOpacity>
                            </View>
                            <Image
                                style={styles.hollowCircle}
                                source={hollowCircle}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.75}
                                    onPress={() => {
                                        if(Platform.OS === 'ios') {
                                            this.takePicture();
                                        }else {
                                            PermissionsManagerAndroid.photoPermission().then(data=>{
                                                this.takePicture();
                                            }).catch(err=>{
                                                // Toast.showShortCenter(err.message);
                                                Alert.alert(null,'请到设置-应用-授权管理设置读写权限')
                                            });
                                        }
                                    }}
                                >
                                    <Image
                                        style={{width: 54,height: 54,}}
                                        source={solidCircle}
                                    />
                                </TouchableOpacity>
                            </Image>
                        </View>
                    </View>
                </Camera>
            </View>
        );
    }
}

const styles =StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    cameraStyle: {
        alignSelf: 'center',
        width,
        height,
    },
    bottomView: {
        width: width,
        position: 'absolute',
        left: 0,
        bottom: 0,
        marginBottom: 40,
    },
    backIcon: {
        fontFamily: 'iconfont',
        fontSize: 20,
        color: StaticColor.WHITE_COLOR,
        marginLeft: 50,
    },
    hollowCircle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: StaticColor.WHITE_COLOR,
        fontSize: 15,
        alignSelf: 'center'
    },
    photoView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 25,
    }
});

function mapStateToProps(state){
    return {
        routes: state.nav.routes,
    };
}

function mapDispatchToProps (dispatch){
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(takePhoto);
