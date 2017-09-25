import React from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	ListView,
	TouchableHighlight,
	Alert,
} from 'react-native';
import styles from '../../../assets/css/route';
import NavigatorBar from '../../components/common/navigatorbar';
import Button from '../../components/common/button';
import * as RouteType from '../../constants/routeType';
import { DRIVER_LIST, BIND_DRIVER, DELETE_DRIVER_INFO } from '../../constants/api';
import { fetchData } from '../../action/app';
import { dispatchSelectDrivers, dispatchClearDriverInfo } from '../../action/driver';
import { dispatchRefreshCar } from '../../action/car';
import { dispatchRefreshDriver } from '../../action/driver';
import BaseComponent from '../../components/common/baseComponent';
import Toast from '../../utils/toast';

class DriverManagerContainer extends BaseComponent {

	constructor(props) {
		super(props);
    this.title = props.navigation.state.params.title;
		this.state = {
	  	pageNo: 1,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
		};
		this._endReached = this._endReached.bind(this);
		this._renderItem = this._renderItem.bind(this);
		this._deleteDriver = this._deleteDriver.bind(this); 
		this._jumpToAddDriver = this._jumpToAddDriver.bind(this);
	}

	componentDidMount() {
		super.componentDidMount();
		this.props.getDrivers({
			pageNo: this.state.pageNo,
			carrierId: this.props.user.userId
		});
		this.props.navigation.setParams({ navigatePress: this._jumpToAddDriver })  
	}

	componentWillUnmount() {
		super.componentWillUnmount()
	}

  componentWillReceiveProps(props) {
    const { drivers, isRefreshDriver } = props;
    if (props) {
      this.setState({ dataSource: this.state.dataSource.cloneWithRows(drivers.toArray()) });
      if (isRefreshDriver) {
				this.props.getDrivers({
					pageNo: 1,
					carrierId: this.props.user.userId
				});
				this.setState({ pageNo: 1 });
      }
    }
  }	
  static navigationOptions = ({ navigation }) => {
	  return {
	    header: <NavigatorBar firstLevelClick={ () => {
	    	navigation.state.params.navigatePress()
	    }} firstLevelIconFont='&#xe7bf;' router={ navigation }/>
	  };
	};
  _deleteDriver(driverId){
  	this.props.deleteDriver({
  		carrierId: this.props.user.userId,
  		driverId: driverId
  	},this.props.router, this.hiddingBack);

  }

	_endReached() {
		if (this.props.hasMore && !this.props.isEndReached) {
			this.props.getDrivers({
				pageNo: this.state.pageNo + 1,
				carrierId: this.props.user.userId
			});
			this.setState({ pageNo: this.state.pageNo + 1 });
		}
	}

  _renderItem(rowData, section, row) {
		return (
			<TouchableHighlight
				underlayColor='#e6eaf2'
				key={ section + row }
				style={ styles.statusContainer }
				onPress={() => {this.props.navigation.dispatch({type: RouteType.ROUTE_DRIVER_INFO_DETAIL, params: { title: '司机详细信息', driverId:  rowData.get('driverId'), carrierId: rowData.get('carrierId')}})}}>
				<View style={ styles.statusContainer }>
					<View style={ styles.statusCell }>
						<Text style={ styles.contentTexts }>{ rowData.get('driverName') }</Text>
					</View>
					<View style={ [styles.statusCell, { flex: 1.5 }] }>
						<Text style={ styles.contentTexts }>{ rowData.get('phoneNumber') }</Text>
					</View>
					<View style={ styles.statusCell }>
						<Text style={ styles.contentTexts }>{ rowData.get('carNo') ? rowData.get('carNo') : '暂无绑定' }</Text>
					</View>
					<View style={ styles.statusCell }>
						{
							!!!rowData.get('carId') &&
								<Button
									title='移除'
									style={ styles.removeBtn }
									textStyle={ styles.removeText }
									onPress={ this.deleteAlert.bind(this, rowData.get('driverId'))}/>
						}
					</View>
				</View>
			</TouchableHighlight>
		);
  }
  deleteAlert(driverId){
  	Alert.alert('提示', '确定删除吗', [
  		{ text: '取消', onPress: () => console.log('取消') },
  		{ text: '确定', onPress: () => {
  			this.props.deleteDriver({
  				carrierId: this.props.user.userId,
  				driverId: driverId
  			});
  		} },
  	]);
  }

  _jumpToAddDriver = () =>{
  	const { user } = this.props;
		// if(user.certificationStatus !== 3){
			this.props.navigation.dispatch({type: RouteType.ROUTE_ADD_DRIVER, params: {title: '新增司机'}});
			this.props.dispatch(dispatchClearDriverInfo());
		// }else{
		// 	Toast.show('您的认证被驳回！');
		// }
		
  }

	render () {

		const { navigation } = this.props;
		return (
			<View style={ styles.container }>
				<View style={ styles.statusContainer }>
					<View style={ styles.statusCell }>
						<Text style={ styles.statusText }>司机</Text>
					</View>
					<View style={ [styles.statusCell, { flex: 1.5 }] }>
						<Text style={ styles.statusText }>联系电话</Text>
					</View>
					<View style={ styles.statusCell }>
						<Text style={ styles.statusText }>绑定车牌号</Text>
					</View>
					<View style={ styles.statusCell }>
						<Text style={ styles.statusText }>司机管理</Text>
					</View>					
				</View>

				<ListView
					style={ styles.listView }
					renderRow={ this._renderItem }
					enableEmptySections={ true }
					onEndReachedThreshold={ 100 }
					onEndReached={ this._endReached }
					dataSource={ this.state.dataSource }/>
					{ this.props.loading ? this._renderLoadingView() : null }

					{ this._renderUpgrade(this.props) }

			</View>
		);
	}
}

const mapStateToProps = state => {
	const { app, driver } = state;
	return {
		user: app.get('user'),
		hasMore: driver.get('hasMore'),
		isEndReached: driver.get('isEndReached'),		
		isRefreshDriver: driver.get('isRefreshDriver'),
		drivers: driver.getIn(['driver', 'selectDriverList']),
		loading: app.get('loading'),
		upgrade: app.get('upgrade'),
		upgradeForce: app.get('upgradeForce'),
    upgradeForceUrl: app.get('upgradeForceUrl'),
	}
}

const mapDispatchToProps = dispatch => {
	return {
		dispatch,
		bindDriver: (body, router) => {
			dispatch(fetchData({
				body,
				method: 'POST',
				api: BIND_DRIVER,
				successToast: true,
				showLoading: true,
				msg: '解绑成功',
				success: () => {
					router.pop();
					dispatch(dispatchRefreshCar());
				}
			}));
		},
		getDrivers: (body) => {
			dispatch(fetchData({
				body,
				method: 'POST',
				api: DRIVER_LIST,
				success: (data) => {
					dispatch(dispatchSelectDrivers({ data, pageNo: body.pageNo }));
				}
			}));
		},
		deleteDriver: (body) => {
			dispatch(fetchData({
				body,
				method: 'POST',
				api: DELETE_DRIVER_INFO,
				showLoading: true,
				success: () => {
					dispatch(dispatchRefreshDriver());
				}
			}));
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(DriverManagerContainer);
