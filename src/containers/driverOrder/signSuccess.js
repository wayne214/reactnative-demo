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
        marginRight: 12,
        marginLeft: 12,
        flex: 1,
        justifyContent:'center',
        alignItems:'center'
    },
    buttonView: {
        borderRadius: 1,
        borderColor: StaticColor.GRAY_TEXT_COLOR,
        borderWidth: 0.5,
        paddingTop: 11,
        paddingBottom: 11,
        paddingLeft: 22,
        paddingRight: 22,
    },
    textSize: {
        fontSize: 15,
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
              receiptWay: params.receiptWay,
              orderID: params.orderID,
          };
      }

      render() {
          const navigator = this.props.navigation;
          const buttonView = <View style={{flexDirection:'row',marginTop: 45}}>
              {
                  this.state.receiptWay === '不回单' ? null :
                  <View style={styles.buttonContainer}>
                      <TouchableOpacity
                          onPress={() => {
                              console.log('this.state.receiptWay=',this.state.receiptWay);
                              this.props.navigation.dispatch({
                                  type: RouteType.ROUTE_UPLOAD_RECEIPT_PAGE,
                                  params: {
                                      transCode: this.state.orderID,
                                      receiptWay: this.state.receiptWay
                                  }
                              });
                          }}
                      >
                          <View style={styles.buttonView}>
                              <Text style={styles.textSize}>立即回单</Text>
                          </View>
                      </TouchableOpacity>
                  </View>
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
