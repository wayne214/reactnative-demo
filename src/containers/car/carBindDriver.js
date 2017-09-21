import React from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	ListView,
	TouchableHighlight
} from 'react-native';
import styles from '../../../assets/css/carBindDriver';
import NavigatorBar from '../../components/common/navigatorbar';
import BaseComponent from '../../components/common/baseComponent';
import Button from '../../components/common/button';
import * as RouteType from '../../constants/routeType';
import { QUERY_CAR_LIST, UNBIND_DRIVER } from '../../constants/api';
import { fetchData } from '../../action/app';
import { dispatchCarBindDriverDatas, dispatchRefreshCar } from '../../action/car';

class CarBindDriverContainer extends BaseComponent {

	constructor(props) {
		super(props);
		this.state = {
	  	pageNo: 1,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
		};
		this._endReached = this._endReached.bind(this);
		this._renderItem = this._renderItem.bind(this);
		this._backClick = this._backClick.bind(this);
		// this.title = props.router.getCurrentRouteTitle();
		// this.key = props.router.getLastCurrentRouteKey();
		// this.hiddingBack = (this.key === 'ADD_DRIVER_PAGE' ? true : false);
	}

	static propTypes = {
		router: React.PropTypes.object
	}

	componentDidMount() {
		this.props.getCarList({
			pageNo: this.state.pageNo,
			carrierId: this.props.user.userId,
			certificationStatus: 2,
		});
	}

  componentWillReceiveProps(props) {
    const { cars } = props;
    if (props) {
      this.setState({ dataSource: this.state.dataSource.cloneWithRows(cars.toArray()) });
      if (props.isRefreshCar) {
				this.props.getCarList({
					pageNo: 1,
					carrierId: this.props.user.userId,
					certificationStatus: 2,
				});
				this.setState({ pageNo: 1 });
      }
    }
  }

	_endReached() {
		if (this.props.hasMore && !this.props.isEndReached) {
			this.props.getCarList({
				pageNo: this.state.pageNo + 1,
				carrierId: this.props.user.userId,
				certificationStatus: 2,
			});
			this.setState({ pageNo: this.state.pageNo + 1 });
		}
	}

	_bindOrUnBind(rowData) {
		if (rowData.driverName) {
			this.props.unBindDriver({
				carId: rowData.carId,
				driverId: rowData.driverId,
				carrierId: rowData.carrierId,
			});
		} else {
			this.props.navigation.dispatch({type: RouteType.ROUTE_SELECTED_DRIVER,params:{title:'选择司机',carId: rowData.carId}});
		}
	}

	_renderItem(rowData, section, row) {
		return (
			<View key={ row + section } style={ styles.cellContainer }>
				<View style={ styles.cell }>
					<Text style={ styles.carNoText }>{ rowData.carNo }</Text>
				</View>
				<View style={ styles.cell }>
					<Text style={ styles.dirverName }>{ rowData.driverName ? rowData.driverName : '' }</Text>
				</View>
				<View style={ styles.cell }>
					<Button
						style={ styles.btnStyle }
						textStyle={ styles.btnTextStyle }
						onPress={ this._bindOrUnBind.bind(this, rowData) }
						title={ rowData.driverName ? '解绑司机' : '绑定司机' }/>
				</View>
			</View>
		);
	}

	_backClick(){
		if(this.props.navigation.state.params && this.props.navigation.state.params._refreshCallBack){
			this.props.navigation.state.params._refreshCallBack();
		}
		this.props.navigation.dispatch({type:'pop'});
	}

	static navigationOptions = ({ navigation }) => {
	  return {
	    header: <NavigatorBar  
	    router={ navigation }/>
	  };
	};

	render () {
		const { router } = this.props;
		return (
			<View style={ styles.container }>

				<Text style={ styles.tipText }>温馨提示</Text>
				<Text style={ [styles.infoText, { marginTop: 10 }] }>1.每个司机仅可绑定一台车辆，如需更改需首先解除车辆与司机的绑定管理。</Text>
				<Text style={ [styles.infoText, { marginBottom: 15 }] }>2.运输状态下的司机不可进行绑定/解绑操作。</Text>

				<ListView
					style={ styles.listView }
					renderRow={ this._renderItem }
					enableEmptySections={ true }
					onEndReachedThreshold={ 100 }
					onEndReached={ this._endReached }
					dataSource={ this.state.dataSource }/>

				{ this.props.loading ? this._renderLoadingView() : null }
				{ this._renderUpgrade(this.props.upgrade) }	
			</View>
		);
	}
}

function mapStateToProps(state) {
	const { car, app } = state;
	return {
		user: app.get('user'),
		loading: app.get('loading'),
		hasMore: car.get('hasMore'),
		isRefreshCar: car.get('isRefreshCar'),
		isEndReached: car.get('isEndReached'),
		cars: car.getIn(['car', 'carbindDriverList']),
		upgrade: app.get('upgrade'),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		getCarList: (body) => {
			dispatch(fetchData({
				body,
				method: 'POST',
				api: QUERY_CAR_LIST,
				success: (data) => {
					dispatch(dispatchCarBindDriverDatas({ data, pageNo: body.pageNo }));
				}
			}));
		},
		unBindDriver: (body) => {
			dispatch(fetchData({
				body,
				method: 'POST',
				msg: '解绑成功',
				api: UNBIND_DRIVER,
				successToast: true,
				showLoading: true,
				success: () => {
					dispatch(dispatchRefreshCar());
				}
			}));
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(CarBindDriverContainer);
