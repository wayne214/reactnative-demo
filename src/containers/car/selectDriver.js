import React from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	Alert,
	ListView,
	TouchableHighlight
} from 'react-native';
import styles from '../../../assets/css/carBindDriver';
import NavigatorBar from '../../components/common/navigatorbar';
import Button from '../../components/common/button';
import { DRIVER_LIST, BIND_DRIVER } from '../../constants/api';
import { fetchData } from '../../action/app';
import { dispatchSelectDrivers } from '../../action/driver';
import { dispatchRefreshCar } from '../../action/car';
import BaseComponent from '../../components/common/baseComponent';

class SelectDriverContainer extends BaseComponent {

	constructor(props) {
		super(props);
		this.state = {
	  	pageNo: 1,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
		};
		this.carId = props.navigation.state.params.carId;
		// this.title = props.router.getCurrentRouteTitle();
		this._endReached = this._endReached.bind(this);
		this._renderItem = this._renderItem.bind(this);
	}

	static propTypes = {
		router: React.PropTypes.object
	}

	componentDidMount() {
		super.componentDidMount();
		this.props.getDrivers({
			pageNo: this.state.pageNo,
			carrierId: this.props.user.userId,
			driverFlag: 1,
		});
	}

  componentWillReceiveProps(props) {
    const { drivers } = props;
    if (props) {
      this.setState({ dataSource: this.state.dataSource.cloneWithRows(drivers.toArray()) });
    }
  }	

	_endReached() {
		if (this.props.hasMore && !this.props.isEndReached) {
			this.props.getDrivers({
				pageNo: this.state.pageNo + 1,
				carrierId: this.props.user.userId,
				driverFlag: 1,
			});
			this.setState({ pageNo: this.state.pageNo + 1 });
		}
	}

	_bindDriver(rowData) {
		Alert.alert(
			'提示',
			`确认绑定${ rowData.get('driverName') }为该车司机吗`,
			[
				{ text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
				{ text: '绑定', onPress: () => {
					this.props.bindDriver({
						carId: this.carId,
						carrierId: rowData.get('carrierId'),
						driverId: rowData.get('driverId')
					}, this.props.navigation);
				} },				
			]
		);
	}

  _renderItem(rowData, section, row) {
		return (
			<TouchableHighlight
				underlayColor='#e6eaf2'
				key={ rowData.carrierId }
				style={ styles.driverContainer }
				onPress={ this._bindDriver.bind(this, rowData) }>
				<View style={styles.driverContent}>
					<View style={styles.driverTextLeftView}>
						<Text style={ styles.driverText }>{ rowData.get('driverName') }</Text>
					</View>
					<View style={styles.driverTextRightView}>
						<Text style={ styles.driverText }>{ rowData.get('phoneNumber') }</Text>
					</View>
				</View>
			</TouchableHighlight>
		);
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
				<ListView
					style={ styles.listView }
					renderRow={ this._renderItem }
					enableEmptySections={ true }
					onEndReachedThreshold={ 100 }
					onEndReached={ this._endReached }
					dataSource={ this.state.dataSource }/>
									
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
		drivers: driver.getIn(['driver', 'selectDriverList']),
	}
}

const mapDispatchToProps = dispatch => {
	return {
		bindDriver: (body, navigation) => {
			dispatch(fetchData({
				body,
				method: 'POST',
				api: BIND_DRIVER,
				successToast: true,
				showLoading: true,
				msg: '绑定成功',
				success: () => {
					dispatch(dispatchRefreshCar());
					navigation.dispatch({type:'pop'});
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
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectDriverContainer);
