import React from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	TouchableHighlight,
	ListView,
	Platform
} from 'react-native';
import styles from '../../../assets/css/bargain';
import NavigatorBar from '../../components/common/navigatorbar';
import BaseComponent from '../../components/common/baseComponent';
import { fetchData } from '../../action/app';
import TabView from '../../components/common/tabView';
import * as RouteType from '../../constants/routeType';
import { GET_CARRIR_BARGAIN_LIST } from '../../constants/api';
import { dispatchBargainList } from '../../action/carrier';
import DateFormat from 'moment';
import Toast from '../../utils/toast';


class BargainContainer extends BaseComponent {

	constructor(props) {
		super(props);
		// this.title = props.router.getCurrentRouteTitle();
		this.state = {
			pageNo: 1,
			index: 0,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
		};
		this._endReached = this._endReached.bind(this);
		this._changeTab = this._changeTab.bind(this);
		this._renderItem = this._renderItem.bind(this); 
		this._jumpToDetails = this._jumpToDetails.bind(this);
		this._jumpToBargainDetails = this._jumpToBargainDetails.bind(this);
		this._jumpToESignUpdate = this._jumpToESignUpdate.bind(this);

	}

	componentDidMount() {
		super.componentDidMount();
		this.props.navigation.setParams({ navigatePress: this._jumpToESignUpdate })  
		this._changeTab(this.state.index);
	}

	componentWillUnmount() {
		super.componentWillUnmount();
	}
	
	componentWillReceiveProps(props) {
		const { bargainList } = props;
    // console.log('lqq--will-bargainList-',bargainList.toArray());
    if (props) {
    	switch(this.state.index){
    		case 0:
    		  this.setState({ dataSource: this.state.dataSource.cloneWithRows(bargainList.toArray()) });
    			break;
    		case 1:
    		  this.setState({ dataSource: this.state.dataSource.cloneWithRows(bargainList.toArray()) });
    			break;
    		case 2:
    			this.setState({ dataSource: this.state.dataSource.cloneWithRows(bargainList.toArray()) });
    			break;
    		default:
    			break;
    	}
      }
	}
	
	_changeTab(index){
		// console.log('lqq---index--',index);
		switch(index){
			case 0:
				this.setState({
					index: 0,
					pageNo: 1,
				});
				this.props.getBarginList({
					state: 1,
					pageNo: 1,
				});
				break;
			case 1:
				this.setState({
					index: 1,
					pageNo: 1,
				});
				this.props.getBarginList({
					state: 2,
					pageNo: 1,
				});
				break;
			case 2:
				this.setState({
					index: 2,
					pageNo: 1,
				});
				this.props.getBarginList({
					state: 3,
					pageNo: 1,
				});
				break;
			default:
				break;
		}
	}
	_endReached() {
		if (this.props.hasMore && !this.props.isEndReached) {
			switch(this.state.index){
				case 0:
					this.props.getBarginList({
						pageNo: this.state.pageNo + 1,
						state: 1
					});
					break;
				case 1:
					this.props.getBarginList({
						pageNo: this.state.pageNo + 1,
						state: 2
					});
					break;
				case 2:
					this.props.getBarginList({
						pageNo: this.state.pageNo + 1,
						state: 3
					});
					break;
				default:
					break;
			}
			
			this.setState({ pageNo: this.state.pageNo + 1 });
		}
	}	
	_jumpToDetails(orderNo){

	}
	_jumpToBargainDetails(orderNo,companyContractNo){
		this.props.navigation.dispatch({type:RouteType.ROUTE_CONTRACT_DETAIL,params:{
													title:'合同详情',
													orderNo: orderNo,
													contractNo: companyContractNo
												}});
	}
	_jumpToESignUpdate(){
		const { user } = this.props;
		if(user.certificationStatus === 2){
			this.props.navigation.dispatch({type:RouteType.ROUTE_UPDATE_ESIGN_INFO,params:{title:'电子签章'}});
			// this.props.router.push(RouteType.ROUTE_UPDATE_ESIGN_INFO);
		}else{
			Toast.show('您暂未认证成功！');
		}
	}

	static navigationOptions = ({ navigation }) => {
		const {state, setParams} = navigation;
	  return {
	    header: <NavigatorBar 
	    firstLevelClick={ () => { navigation.state.params.navigatePress() } } 
	    optTitle='签章设置'
	    router={ navigation }/>
	  };
	};


	render () {
		const { router } = this.props;
		return (
			<View style={ styles.container }>
				<TabView
					tabs={ ['全部', '进行中', '已完成'] }
					changeTab={ (index) => this._changeTab(index) }/>
				<ListView
					style={ [styles.listView,{ marginTop: 5 }] }
					renderRow={ this._renderItem }
					enableEmptySections={ true }
					onEndReachedThreshold={ 100 }
					onEndReached={ this._endReached }
					dataSource={ this.state.dataSource }/>
							
			</View>
		);
	}

	

	_renderItem(rowData, section, row) {
		return (
		<TouchableHighlight
				underlayColor='#e6eaf2'
				key={ section + row }
				onPress={ () => this._jumpToDetails(rowData.get('orderNo')) }>
				<View style={ styles.cellContainer }>
					<TouchableHighlight
					underlayColor='#e6eaf2'
					onPress={ () => this._jumpToBargainDetails(rowData.get('orderNo'),rowData.get('companyContractNo')) }>
						<View style={ styles.bargainNoContainer }>
							<View style={ styles.bargainNoCell }>
								<Text style={ styles.bargainText }>合同编号：</Text>
								<Text style={ styles.bargainTextNo }>{rowData.get('companyContractNo')}</Text>
							</View>
							<View style={ styles.arrowCell }>
								<Text style={ styles.bargainRight }>查看合同</Text>
								<Text style={ styles.iconFont }>&#xe60d;</Text>
							</View>
						</View>
					</TouchableHighlight>
					<View style={ styles.contentContainer }>
						<View style={ styles.leftContainer }>
							<Text style={ [styles.orderNoText, { marginTop: 10 }] }>订单编号：<Text style={ styles.bargainTextNo }>{rowData.get('orderNo')}</Text></Text>
							<Text style={ styles.orderNoText }>承运时间：<Text style={ styles.bargainTextNo }>{DateFormat(rowData.get('loadingStartDate')).format('YYYY-MM-DD')}</Text></Text>
							<Text style={ styles.orderNoText }>承运车辆：<Text style={ styles.bargainTextNo }>{rowData.get('carNo')}</Text></Text>
						</View>
						<View style={ styles.rightContainer }>
						
							<View style={ styles.statusView }>
								{
									(() => {
										if(rowData.get('orderState') < 12 && rowData.get('orderState') >= 1){
											return (<Text style={ styles.statusText }>{'进行中'}</Text>);
										}else if(rowData.get('orderState') === 12){
											return (<Text style={ styles.statusText }>{'已完成'}</Text>);
										}
									})()
								}
							</View>
						</View>
					</View>
				</View>
		</TouchableHighlight>
		);
	}
}

const mapStateToProps = state => {
	const { app, carrier } = state;
	return {
		user: app.get('user'),
		hasMore: carrier.get('hasMore'),
		isEndReached: carrier.get('isEndReached'),
		isRefresh: carrier.get('isRefresh'),		
		bargainList: carrier.getIn(['carrierInfo','bargainInfoList']),
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getBarginList: (body) => {
			dispatch(fetchData({
				body,
				method: 'GET',
				api: GET_CARRIR_BARGAIN_LIST,
				success: (data) => {
					// console.log('lqq-getBarginList-data-',data);
					dispatch(dispatchBargainList({ data, pageNo: body.pageNo }));
				}
			}));
		}

	};
}
export default connect(mapStateToProps,mapDispatchToProps)(BargainContainer);
