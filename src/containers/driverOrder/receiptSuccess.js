/**
 * Created by xizhixin on 2017/10/27.
 * 回单成功界面
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    DeviceEventEmitter,
    Platform,
    Alert
} from 'react-native';
import * as StaticColor from '../../constants/colors';
import NavigationBar from '../../components/common/navigatorbar';
import EmptyView from '../../components/common/emptyView';
import receiptSuccess from '../../../assets/img/driverOrder/receipt_success.png';
import * as RouteType from '../../constants/routeType';
import {refreshDriverOrderList} from '../../action/driverOrder';
import {fetchData} from '../../action/app';
import * as API from '../../constants/api';
import Toast from '@remobile/react-native-toast';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StaticColor.COLOR_VIEW_BACKGROUND,
    },
    contentStyle: {
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        fontSize: 17,
    },
    buttonContainer: {
        width: 112,
        marginRight: 12,
        marginLeft: 12,
    },
    leftButtonView: {
        borderRadius: 1,
        backgroundColor: StaticColor.BLUE_BACKGROUND_COLOR,
        borderColor: StaticColor.BLUE_BACKGROUND_COLOR,
        borderWidth: 0.5,
        paddingTop: 11,
        paddingBottom: 11,
    },
    buttonView: {
        borderRadius: 1,
        borderColor: StaticColor.GRAY_TEXT_COLOR,
        borderWidth: 0.5,
        paddingTop: 11,
        paddingBottom: 11,
    },
    leftTextSize: {
        fontSize: 15,
        color: StaticColor.WHITE_COLOR,
        textAlign: 'center',
    },
    textSize: {
        fontSize: 15,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        textAlign: 'center',
    }
});

class ReceiptSuccess extends Component {
    // 构造
      constructor(props) {
          super(props);
          // 初始状态
          const params = this.props.navigation.state.params;
          this.state = {
              transportNos: params.transportNos,
              flag: params.flag,
          };
          this.uploadFinished = this.uploadFinished.bind(this);
      }

      uploadFinished(){
          this.props._uploadImageFinished({
              transportNos: this.state.transportNos,
              userId: this.props.userInfo.userId,
              userName : this.props.userInfo.userName,
          },(result) => {
              if(this.state.flag === 'sign'){
                  this.props._refreshOrderList(2);
              }else {
                  this.props._refreshOrderList(3);
              }
              this.props.navigation.dispatch({
                  type: 'pop',
                  key: 'Main',
              });
          },(error) => {
              console.log('error==',error);
              Toast.showShortCenter(error);
          })
      }

      render() {
          const navigator = this.props.navigation;
          const buttonView = <View style={{flexDirection:'row',marginTop: 45}}>
                  <View style={styles.buttonContainer}>
                      <TouchableOpacity
                          onPress={() => {
                              this.props.navigation.state.params.callBack();
                              navigator.dispatch({type: 'pop'})
                          }}
                      >
                          <View style={styles.leftButtonView}>
                              <Text style={styles.leftTextSize}>继续上传</Text>
                          </View>
                      </TouchableOpacity>
                  </View>
              <View style={styles.buttonContainer}>
                  <TouchableOpacity
                      onPress={() => {
                          this.uploadFinished();
                      }}
                  >
                      <View style={styles.buttonView}>
                          <Text style={styles.textSize}>上传完成</Text>
                      </View>
                  </TouchableOpacity>
              </View>
          </View>;
          return(
              <View style={styles.container}>
                  <NavigationBar
                      title={'回单'}
                      router={navigator}
                      backViewClick={() => {
                          this.props.navigation.state.params.callBack();
                          navigator.dispatch({
                              type: 'pop',
                          })
                      }}
                  />
                  <View style={{flex:1}}>
                      <EmptyView
                          emptyImage={receiptSuccess}
                          content={'回单成功'}
                          contentStyle={styles.contentStyle}
                          comment={buttonView}
                      />
                  </View>
              </View>
          );
      }
}

function mapStateToProps(state) {
    return {
        routes: state.nav.routes,
        userInfo: state.user.get('userInfo'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        _refreshOrderList: (data) => {
            dispatch(refreshDriverOrderList(data));
        },
        _uploadImageFinished: (params, callBack, failCallBack) => {
            dispatch(fetchData({
                body: params,
                showLoading: true,
                api: API.API_UPLOAD_RECEIPT_IMAGE_FINISHED,
                success: data => {
                    console.log('upload finished success ',data);
                    callBack && callBack(data);
                },
                fail: error => {
                    console.log('???', error);
                    failCallBack && failCallBack(error);
                }
            }))
        },
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ReceiptSuccess);
