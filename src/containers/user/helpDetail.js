import React from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	Platform
} from 'react-native';
import styles from '../../../assets/css/help';
import NavigatorBar from '../../components/common/navigatorbar';
import Help from '../../components/user/help';
import TabView from '../../components/common/tabView';
import { GET_PROBLEM_DETAILS } from '../../constants/api';
import { fetchData } from '../../action/app';
import * as RouteType from '../../constants/routeType';
import { dispatchGetProblemDetails } from '../../action/help';
import BaseComponent from '../../components/common/baseComponent';

class HelpDetailContainer extends BaseComponent {

	constructor(props) {
		super(props);
		// this.title = props.router.getCurrentRouteTitle();
		this.state = {};
		this.id = props.navigation.state.params.id;
		this._getProblemDetails = this._getProblemDetails.bind(this);
		
	}

	static navigationOptions = ({ navigation }) => {
	  const {state, setParams} = navigation;
	  return {
	    header: <NavigatorBar 
	    router={ navigation }/>
	  };
	};

	componentDidMount(){
		super.componentDidMount();
		// FIXME 根据 ID 获取详情并展示
		// console.log('lqq--HelpDetail--id---',this.id);
		this._getProblemDetails();
	}

	componentWillUnmount() {
		super.componentWillUnmount();
	}

	_getProblemDetails(){
		this.props.getProblemDetailsInfo({
			id: this.id
		},this.props.navigation);
	}

	render () {
		const { navigation } = this.props;
		return (
			<View style={ styles.container }>
				<View style={ styles.queContainer }>
					<Text style={ styles.questTitle }>
					{this.props.problem
					 && this.props.problem.get('problemTitle')}
					</Text>
				</View>	
				<View style={ styles.ansContainer }>
					<Text style={ styles.questTitle }>
						{this.props.problem
					 && this.props.problem.get('problemAnswer')}
					</Text>
				</View>					
			</View>
		);
	}
}
const mapStateToProps = state => {
	const { help } = state;
	return {
		problem: help.getIn(['help','problemDetailsInfo'])

	}
}

const mapDispatchToProps = dispatch => {
	return {
		getProblemDetailsInfo:(body, navigation) => {
			dispatch(fetchData({
				body,
				method: 'POST',
				api: GET_PROBLEM_DETAILS,
				success: (data) => {
					// console.log('lqq---getProblemDetailsInfo--',data);
					dispatch(dispatchGetProblemDetails({data}));
				}
			}));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(HelpDetailContainer);
