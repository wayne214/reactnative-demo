import React from 'react';
import { connect } from 'react-redux';
import {
	View,
	Image,
	Text,
	TouchableOpacity,
	ListView,
	TouchableHighlight,
	Alert,
	Platform
} from 'react-native';
import styles from '../../../assets/css/bankCard';
import NavigatorBar from '../../components/common/navigatorbar';
import UserIcon from '../../../assets/img/user/user_icon.png';
import * as RouteType from '../../constants/routeType';
import { QUERY_BANK_CARD_LIST,DELETE_BANK_CARD } from '../../constants/api';
import { fetchData } from '../../action/app';
import { dispatchBankCardList,dispatchRefreshBankCard } from '../../action/bankCard';
import HelperUtil from '../../utils/helper';
import Toast from '../../utils/toast';
import BankListCell from '../../components/user/bankListCell';
import BaseComponent from '../../components/common/baseComponent';

class BankCardManageContainer extends BaseComponent {

	constructor(props) {
		super(props);
		// this.title = props.router.getCurrentRouteTitle();
		this.state = {
	  	pageNo: 1,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
		};
		this._endReached = this._endReached.bind(this);
		this._renderItem = this._renderItem.bind(this); 
		this._jumpToAddBankCard = this._jumpToAddBankCard.bind(this);
	}

	componentDidMount() {
		super.componentDidMount();
		this.props.navigation.setParams({ navigatePress: this._jumpToAddBankCard })  
		this.props.getBankCardList({
			pageNo: this.state.pageNo,
			carrierId:this.props.user.userId
		});
	}

	componentWillUnmount() {
		super.componentWillUnmount();
	}

  componentWillReceiveProps(props) {
    const { bankCardList,isRefresh } = props;
    if (props) {
    	if(isRefresh){
    		this.setState({
    			pageNo: 1,
    		});
    		this.props.getBankCardList({
					pageNo: 1,
					carrierId: this.props.user.userId
				});
    	}else{
    		this.setState({ dataSource: this.state.dataSource.cloneWithRows(bankCardList ) });
    	}
    }
  }	

	_endReached() {
		// if (this.props.hasMore && !this.props.isEndReached) {
		// 	this.props.getBankCardList({
		// 		pageNo: this.state.pageNo + 1,
		// 		carrierId: this.props.user.userId
		// 	});
		// 	this.setState({ pageNo: this.state.pageNo + 1 });
		// }
	}	

	_jumpToAddBankCard(){
		const { user } = this.props;
		// if(user.certificationStatus !== 3){
		// 	console.log('----lqq---添加--');
			this.props.navigation.dispatch({type:RouteType.ROUTE_ADD_BANK_CARD,params:{title:'新增开户行',id:-1}});
		// }else{
		// 	Toast.show('您的认证被驳回！');
		// }
		
	}

	static navigationOptions = ({ navigation }) => {
		const {state, setParams} = navigation;
	  return {
	    header: <NavigatorBar 
	    firstLevelIconFont='&#xe7bf;'
	    firstLevelClick={ () => { navigation.state.params.navigatePress() } } 
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

	_renderItem(rowData, section, rowIndex) {
		return (
			 <BankListCell 
  		index={ rowIndex }
  		rowData={ rowData }
  		delFun={ this._deleteBankCard.bind(this, rowData.id) }
  		editFun={ this._editCar.bind(this, rowData.id) }/>
		);
  }	


  _editCar(id){
  	// console.log('----lqq---编辑--',id);
  	this.props.navigation.dispatch({type:RouteType.ROUTE_ADD_BANK_CARD,params:{title:'编辑开户行',id}});
  }


  _deleteBankCard(id){
  	Alert.alert(
	      '提示',
	      '确定要删除吗',
	      [
	        { text: '删除', onPress: () => {
	        	this.props.deleteBankCard({
		  				id: id,
		  				carrierId: this.props.user.userId	        		
	        	});
	        } },
	        { text: '取消', onPress: () => console.log('cancel') },
	      ]
	    );
  }
}

const mapStateToProps = state => {
	const { app, bankCard } = state;
	return {
		user: app.get('user'),
		hasMore: bankCard.get('hasMore'),
		isEndReached: bankCard.get('isEndReached'),		
		bankCardList: bankCard.getIn(['bankCard', 'bankCardManagerList']),
		isRefresh: bankCard.get('isRefresh'),
	}
}

const mapDispatchToProps = dispatch => {
	return {
		dispatch,
		getBankCardList: (body) => {
			dispatch(fetchData({
				body,
				method: 'POST',
				api: QUERY_BANK_CARD_LIST,
				success: (data) => {
					dispatch(dispatchBankCardList({ data, pageNo: body.pageNo }));
					console.log('lqq--',data);
				}
			}));
		},
		deleteBankCard: (body) => {
			dispatch(fetchData({
				body,
				method: 'POST',
				successToast: true,
				showLoading: true,
				msg: '删除成功',
				api: DELETE_BANK_CARD,
				success: (data) => {
					console.log('lqq--',data);
					dispatch(dispatchRefreshBankCard());

				}
			}));
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(BankCardManageContainer);