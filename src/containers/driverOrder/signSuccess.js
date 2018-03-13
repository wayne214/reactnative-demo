/**
 * Created by xizhixin on 2017/10/27.
 * 签收成功界面
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
        padding: 5,
        width: 112,
        marginRight: 15,
        marginLeft: 15,
    },
    buttonView: {
        borderRadius: 5,
        borderColor: StaticColor.GRAY_TEXT_COLOR,
        borderWidth: 0.5,
        height: 32,
        paddingTop: 8,
        paddingBottom: 8,
    },
    textSize: {
        fontSize: 14,
        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
        textAlign: 'center',
    }
});

class signSuccess extends Component {
    // 构造
      constructor(props) {
          super(props);
          // 初始状态
          const params = this.props.navigation.state.params;
          this.state = {
              isReceipt: params.isReceipt,
              orderID: params.orderID,
          };
      }

      render() {
          const navigator = this.props.navigation;
          const buttonView = <View style={{flexDirection:'row',marginTop: 50}}>
              {
                  this.state.isReceipt === '是' ?
                  <View style={styles.buttonContainer}>
                      <TouchableOpacity
                          onPress={() => {
                              this.props.navigation.dispatch({
                                  type: RouteType.ROUTE_UPLOAD_RECEIPT_PAGE,
                                  params: {
                                      transCode: this.state.orderID
                                  }
                              });
                          }}
                      >
                          <View style={styles.buttonView}>
                              <Text style={styles.textSize}>立即回单</Text>
                          </View>
                      </TouchableOpacity>
                  </View> : null
              }
          </View>;
          return(
              <View style={styles.container}>
                  <NavigationBar
                      title={'签收'}
                      router={navigator}
                      backViewClick={() => {
                          this.props._refreshOrderList(0);
                          this.props._refreshOrderList(2);
                          navigator.dispatch({
                              type: 'pop',
                              key: 'Main'
                          })
                      }}
                  />
                  <View style={{flex:1}}>
                      <EmptyView
                          emptyImage={receiptSuccess}
                          content={'签收成功'}
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
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        _refreshOrderList: (data) => {
            dispatch(refreshDriverOrderList(data));
        }
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(signSuccess);
