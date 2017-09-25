import React from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	ListView,
	TouchableOpacity,
	navigator,
	Alert,
} from 'react-native';
import styles from '../../../assets/css/setting';
import NavigatorBar from '../../components/common/navigatorbar';
import * as RouteType from '../../constants/routeType';
import { CARRIER_INFO_LIST, SAVE_CHANGE_CARRIER } from '../../constants/api';
import { fetchData, mergeUser, refreshTravel } from '../../action/app';
import BaseComponent from '../../components/common/baseComponent';
import { dispatchCompanyList } from '../../action/carrier';
import User from '../../models/user';

class CompanyListContainer extends BaseComponent {

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
		this._getChangeCarrier = this._getChangeCarrier.bind(this);
	}

	componentDidMount() {
		super.componentDidMount();
		this.props.getCompanyList({
			pageNo: this.state.pageNo,
			driverId: this.props.user.userId
		});
	}

	componentWillUnmount() {
		super.componentWillUnmount()
	}

	componentWillReceiveProps(props) {
    const { companyList } = props;
    if (props) {
      this.setState({ dataSource: this.state.dataSource.cloneWithRows(companyList) });
    }
  }	

	_endReached() {
		if (this.props.hasMore && !this.props.isEndReached) {
			this.props.getCompanyList({
				pageNo: this.state.pageNo + 1,
				driverId: this.props.user.userId
			});
			this.setState({ pageNo: this.state.pageNo + 1 });
		}
	}

  _renderItem(rowData, section, row) {
		return (
			<TouchableOpacity
				underlayColor='#e6eaf2'
				key={ section + row }
				style={ styles.statusContainer }
				onPress = {() => this._getChangeCarrier(rowData) }>
				<View style={ [styles.cellContainer, {alignItems: 'center'} ] }>
					<Text style= { styles.companyText }>{ rowData.companyName || rowData.corporation }</Text>
				</View>
			</TouchableOpacity>
		);
  }

  _getChangeCarrier(data){
  	Alert.alert('提示', '确定更改承运商吗', [
  		{ text: '取消', onPress: () => console.log('取消') },
  		{ text: '确定', onPress: () => {
  			this.props.getChangeCarrier({
		  		driverPhone:this.props.user.phoneNumber,
		  		carrierId: data.id,
		  	},this.props.navigation,data);
  		} },
  	]);
	} 
	static navigationOptions = ({ navigation }) => {
	  return {
	    header: <NavigatorBar router={ navigation }/>
	  };
	};
	render () {
		return (
			<View style={ styles.container }>
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
	const { app, carrier } = state;
	return {
		user: app.get('user'),	
		companyList: carrier.get('companyList')	,	
		loading: app.get('loading'),
		upgrade: app.get('upgrade'),
		upgradeForce: app.get('upgradeForce'),
    upgradeForceUrl: app.get('upgradeForceUrl'),
	}
}

const mapDispatchToProps = dispatch => {
	return {
		dispatch,
		getCompanyList: (body) => {
			dispatch(fetchData({
				body,
				method: 'POST',
				api: CARRIER_INFO_LIST,
				success: (data) => {
					dispatch(dispatchCompanyList({data:data}));
				}
			}));
		},
		getChangeCarrier:(body,navigation,data) =>{
			dispatch(fetchData({
				body,
				method: 'GET',
				api: SAVE_CHANGE_CARRIER,
				success: () => {
					const users = {
						companyName: data.companyName,
						corporation: data.corporation,
						carrierId: data.id,
						carId: data.carId,
					};
					new User().merge(users);
					dispatch(mergeUser(users));
					navigation.dispatch({ type: 'pop' });
					if(data.carId){
						dispatch(refreshTravel());
					}
				}
			}))
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyListContainer);