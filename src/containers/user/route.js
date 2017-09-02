import React from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	ListView,
	TouchableHighlight,
	Alert,
	Image,
} from 'react-native';
import styles from '../../../assets/css/route';
import NavigatorBar from '../../components/common/navigatorbar';
import * as RouteType from '../../constants/routeType';
import {ROUTE_LIST, DELETE_ROUTE } from '../../constants/api';
import { fetchData, getInitStateFromDB } from '../../action/app';
import { dispatchRouteList } from '../../action/route';
import Button from '../../components/common/button';
import editRoute from './editRoute';
import { dispatchRefreshDeleteRoute, dispatchClearRouteInfo } from '../../action/route';
import BaseComponent from '../../components/common/baseComponent';
import Toast from '../../utils/toast';
import AddressFromTo from '../../components/common/addressFromTo'
import FromPoint from '../../../assets/img/routes/from_point.png';
import ToPoint from '../../../assets/img/routes/to_point.png';

class RouteContainer extends BaseComponent {

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
		this._pushAddRoute = this._pushAddRoute.bind(this);
	}

	componentDidMount() {
		super.componentDidMount();
		this.props.getRouteList({
			pageNo: this.state.pageNo,
			// carrierId: this.props.user.userId
		});
		this.props.navigation.setParams({ navigatePress: this._pushAddRoute })  
	}

	componentWillUnmount() {
		super.componentWillUnmount()
	}

	componentWillReceiveProps(props) {
    const { routes, isRefreshAddRoute, isRefreshDeleteRoute} = props;
    if (props) {
      this.setState({ dataSource: this.state.dataSource.cloneWithRows(routes) });
      if( isRefreshAddRoute || isRefreshDeleteRoute){
      	this.props.getRouteList({
      		pageNo : 1,
      		// carrierId: this.props.user.userId,
      	});
      }
      this.setState({ pageNo: 1 });
    }
  }	

	_endReached() {
		if (this.props.hasMore && !this.props.isEndReached) {
			this.props.getRouteList({
				pageNo: this.state.pageNo + 1,
				// carrierId: this.props.user.userId
			});
			this.setState({ pageNo: this.state.pageNo + 1 });
		}
	}	

  _renderItem(rowData, section, row) {
		return (
			<View style={ styles.itemContainer }>
				<View style={ [styles.addressView, { paddingTop: 10 }] }>
					<Image source={ FromPoint } style={ styles.iconAddress } />
					<Text style={ [styles.contentText] }>{ (rowData.fromProvinceName + rowData.fromCityName + rowData.fromAreaName)}</Text>
				</View>
				<View style={ [styles.addressView, { marginTop: 15, paddingBottom: 10 }] }>
					<Image source={ ToPoint } style={ styles.iconAddress }/>
					<Text style={ [styles.contentText] }>{ (rowData.toProvinceName + rowData.toCityName + rowData.toAreaName)}</Text>
				</View>
				<View style={ styles.line }></View>
				<View style={ styles.optContainer }>
					<TouchableHighlight
						underlayColor='#e6eaf2'
						style={ styles.optView }
						onPress = { this.deleteAlert.bind(this, rowData.id) }>
						<View style={ styles.optView }>
							<Text style={ styles.iconFontOpt }>&#xe61c;</Text>						
							<Text style={ styles.optText }>删除</Text>
						</View>
					</TouchableHighlight>
					<View style={ styles.lineVertical }></View>
					<TouchableHighlight
						underlayColor='#e6eaf2'
						style={ styles.optView }
						onPress = { () => this.props.navigation.dispatch({type: RouteType.EDIT_ROUNT_PAGE,params: {title:'编辑路线', data: rowData }}) }>
						<View style={ styles.optView }>
							<Text style={ styles.iconFontOpt }>&#xe617;</Text>
							<Text style={ styles.optText }>编辑</Text>
						</View>
					</TouchableHighlight>
				</View>
			</View>
		);
  }

  deleteAlert(id){
  	Alert.alert('提示', '确定删除吗', [
  		{ text: '取消', onPress: () => console.log('取消') },
  		{ text: '确定', onPress: () => {
  			this.props.deleteRouteList({
  				id: id
  			});
  		} },
  	]);
	} 
	_pushAddRoute = () =>{
  	// const { user } = this.props;
		// if(user.certificationStatus === 3){
		// 	Toast.show('您的认证被驳回');
		// }else{	
			this.props.navigation.dispatch({type:RouteType.ROUTE_ADD_ROUTE, params: {title:'新增路线'}});
		// }
	}
	static navigationOptions = ({ navigation }) => {
	  return {
	    header: <NavigatorBar firstLevelClick={ () => {
	    	navigation.state.params.navigatePress()
	    }} firstLevelIconFont='&#xe7bf;' router={ navigation }/>
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
				{ this.props.loading ? this._renderLoadingView() : null }
			</View>
		);
	}
}

const mapStateToProps = state => {
	const { app, routes } = state;
	return {
		user: app.get('user'),	
		routes: routes.get('routeList'),		
		isRefreshAddRoute: routes.get('isRefreshAddRoute'),
		isRefreshDeleteRoute: routes.get('isRefreshDeleteRoute'),
		loading: app.get('loading')

	}
}

const mapDispatchToProps = dispatch => {
	return {
		dispatch,
		getRouteList: (body) => {
			dispatch(fetchData({
				body,
				method: 'GET',
				api: ROUTE_LIST,
				success: (data) => {
					dispatch(dispatchRouteList({ data, pageNo: body.pageNo }));
				}
			}));
		},

		deleteRouteList: (body, router) => {
			dispatch(fetchData({
				body,
				method: 'POST',
				api: DELETE_ROUTE,
				successToast: true,
				msg: '删除成功',
				showLoading: true,
				success:(data) => {
					dispatch(dispatchRefreshDeleteRoute());

				}

			}));

		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(RouteContainer);