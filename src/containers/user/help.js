import React from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	TouchableHighlight,
	ListView,
	Platform
} from 'react-native';
import styles from '../../../assets/css/help';
import NavigatorBar from '../../components/common/navigatorbar';
import Help from '../../components/user/help';
import TabView from '../../components/common/tabView';
import * as RouteType from '../../constants/routeType';
import { GET_FEEDBACK_LIST,GET_PROBLEM_LIST } from '../../constants/api';
import { fetchData } from '../../action/app';
import { dispatchGetFeedBackList,dispatchGetProblemList } from '../../action/help';
import BaseComponent from '../../components/common/baseComponent';

class HelpContainer extends BaseComponent {

	constructor(props) {
		super(props);
		// this.title = props.router.getCurrentRouteTitle();
		this.state = {
			pageNo: 1,
			index: 0,
			type: 1,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
		};
		this._endReached = this._endReached.bind(this);
		this._renderItem = this._renderItem.bind(this); 
		this._changeTab = this._changeTab.bind(this);
		this._jumpToDetails = this._jumpToDetails.bind(this);

	}

	componentDidMount() {
		super.componentDidMount();
		this.props.navigation.setParams({ navigatePress: this._test, text: '反馈问题' })  
		this._changeTab(this.state.index);
	}

	componentWillUnmount() {
		super.componentWillUnmount();
	}

	componentWillReceiveProps(props) {
    const { selectList,isRefreshFeedbackList } = props;
    // console.log('lqq--will-selectList-',selectList.toArray());
    if (props) {
    	switch(this.state.index){
    		case 0:
    		  this.setState({ dataSource: this.state.dataSource.cloneWithRows(selectList.toArray()) });
    			break;
    		case 1:
    		  this.setState({ dataSource: this.state.dataSource.cloneWithRows(selectList.toArray()) });
    			break;
    		case 2:
    		if(isRefreshFeedbackList){
					this._changeTab(2);
    		}else{
    			this.setState({ dataSource: this.state.dataSource.cloneWithRows(selectList.toArray()) });
    		}
    			break;
    		default:
    			break;
    	}
      }
  }	

	_endReached() {
		// console.log('-----this.props.hasMore-', this.props.hasMore, ' ', this.props.isEndReached);
		if (this.props.hasMore && !this.props.isEndReached) {
			switch(this.state.index){
				case 0:
					this.props.getProblemList({
						pageNo: this.state.pageNo + 1,
						problemType: 1
					});
					break;
				case 1:
					this.props.getProblemList({
						pageNo: this.state.pageNo + 1,
						problemType: 2
					});
					break;
				case 2:
					this.props.getFeedBackList({
						pageNo: this.state.pageNo + 1,
						userId: this.props.user.userId
					});
					break;
				default:
					break;
			}
			
			this.setState({ pageNo: this.state.pageNo + 1 });
		}
	}	

	_changeTab(index){
		// console.log('lqq---changeTab-index-->',index);
		switch(index){
			case 0:
				this.setState({
					index: 0,
					type:1,
					pageNo: 1
				});
				this.props.getProblemList({
					pageNo: 1,
					problemType: 1
				});
				break;
			case 1:
				this.setState({
					index: 1,
					type:1,
					pageNo: 1
				});
				this.props.getProblemList({
					pageNo: 1,
					problemType: 2
				});
				break;
			case 2:
				this.setState({
					index: 2,
					type:2,
					pageNo: 1
				});
				this.props.getFeedBackList({
					pageNo: 1,
					userId: this.props.user.userId
				});
				break;
			default:
    		break;
		}
	}

	static navigationOptions = ({ navigation }) => {
	  return {
	    header: <NavigatorBar 
	    firstLevelClick={ () => navigation.dispatch({type:RouteType.ROUTE_ADD_FEEDBACK,params:{title:'反馈问题'}})} 
	    firstLevelIconFont='&#xe7bf;' 
	    router={ navigation }/>
	  };
	};

	render () {

		const { router,selectList } = this.props;
		// console.log('lqq--render--selectList-',selectList);
		return (
			<View style={ styles.container }>
				
				<TabView
					tabs={ ['常见问题', '全部问题', '我的反馈'] }
					changeTab={ (index) => this._changeTab(index) }/>
				<ListView
					style={ [styles.listView,{ marginTop: 10 }] }
					renderRow={ this._renderItem }
					enableEmptySections={ true }
					onEndReachedThreshold={ 100 }
					onEndReached={ this._endReached }
					dataSource={ this.state.dataSource }/>
					{ this._renderUpgrade(this.props) }		
			</View>
		);
	}

	_renderItem(rowData, section, row) {
		return (
			<TouchableHighlight
				underlayColor='#e6eaf2'
				key={ section + row }
				onPress={ () => this._jumpToDetails(rowData.get('id')) }>
					<View style={ styles.cellContainer }>
						<View style={ styles.textContent }>
						{
							(() => {
								if(this.state.index === 2){
									return (<Text numberOfLines={ 1 } style={ styles.questText }>
							{ rowData.get('questionContent') }
							
						</Text>);
								}else{
									return (<Text numberOfLines={ 1 } style={ styles.questText }>
							{ rowData.get('problemTitle') }
							
						</Text>);
								}
							})()
						}
							
						</View>
						<View style={ styles.iconContent }>
							<Text style={ styles.iconFont }>&#xe60d;</Text>
						</View>
					</View>
			</TouchableHighlight>
		);
  }	
	  _jumpToDetails(id){
		if(this.state.type === 1){
			this.props.navigation.dispatch({type:RouteType.ROUTE_HELP_DETAIL,params:{title:'反馈问题',id:id}});
			// this.props.router.push(RouteType.ROUTE_HELP_DETAIL,{id:id})
		}else if(this.state.type === 2){
			this.props.navigation.dispatch({type:RouteType.ROUTE_HELP_DETAIL_FOR_FEEDBACK,params:{title:'反馈问题',id:id}});
			// this.props.router.push(RouteType.ROUTE_HELP_DETAIL_FOR_FEEDBACK,{id:id})
		}
	}
}


const mapStateToProps = state => {
	const { app, help } = state;
	return {
		user: app.get('user'),
		hasMore: help.get('hasMore'),
		isEndReached: help.get('isEndReached'),		
		selectList: help.getIn(['help', 'selectList']),
		isRefreshFeedbackList: help.get('isRefreshFeedbackList'),
		upgrade: app.get('upgrade'),
		upgradeForce: app.get('upgradeForce'),
    upgradeForceUrl: app.get('upgradeForceUrl'),
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getFeedBackList: (body) => {
			dispatch(fetchData({
				body,
				method: 'POST',
				api: GET_FEEDBACK_LIST,
				success: (data) => {
					// console.log('lqq-feedback-data-',data);
					dispatch(dispatchGetFeedBackList({ data, pageNo: body.pageNo }));
				}
			}));
		},
		getProblemList:(body) => {
			dispatch(fetchData({
				body,
				method: 'POST',
				api: GET_PROBLEM_LIST,
				success: (data) => {
					// console.log('lqq--problem-data-',data);
					dispatch(dispatchGetProblemList({ data, pageNo:body.pageNo }));
				}
			}));
		}
	};
}
export default connect(mapStateToProps,mapDispatchToProps)(HelpContainer);
