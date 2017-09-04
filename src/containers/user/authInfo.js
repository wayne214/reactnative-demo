import React from 'react';
import {
	View,
	Platform
} from 'react-native'
import { connect } from 'react-redux';
import NavigatorBar from '../../components/common/navigatorbar';
import styles from '../../../assets/css/car';
import AuthInfo from '../../components/user/authInfo';
import { GET_AUTHINFO_DETAIL } from '../../constants/api';
import { fetchData } from '../../action/app';
import * as RouteType from '../../constants/routeType';
import { dispatchGetAuthInfo } from '../../action/carrier';
import BaseComponent from '../../components/common/baseComponent';

class AuthInfoContainer extends BaseComponent {

	constructor(props) {
		super(props);
		// this.title = props.router.getCurrentRouteTitle();
		// this.carrierId = props.router.getParams().carrierId;	
		this._getAuthInfo = this._getAuthInfo.bind(this);
	}

	componentDidMount(){
		super.componentDidMount();
		// FIXME 根据承运商 carrierId 获取认证详情展示
		// console.log('lqq--carrierId',this.carrierId);
		this._getAuthInfo();
	}

	componentWillUnmount() {
		super.componentWillUnmount();
	}

	_getAuthInfo(){
		this.props.getAuthInfo({
			carrierId: this.props.user.userId,
		},this.props.router);
	}

	static navigationOptions = ({ navigation }) => {
	  return {
	    header: <NavigatorBar  
	    router={ navigation }/>
	  };
	};

	render () {
		// console.log('lqq--render--->',this.props.carrierInfo.toJS());
		return (
			<View style={ styles.container }>
				<AuthInfo { ...this.props } />
			</View>
		);
	}
}
const mapStateToProps = state => {
	const { app,carrier } = state;
	return {
		user: app.get('user'),
		carrierInfo: carrier.getIn(['carrierInfo','carrierInfoDetail'])
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getAuthInfo:(body, router) => {
			dispatch(fetchData({
				body,
				method: 'GET',
				api: GET_AUTHINFO_DETAIL,
				success: (data) => {
					// console.log('lqq---AuthInfo--',data);
					dispatch(dispatchGetAuthInfo({data}));
				}
			}));
		}
	}
}
export default connect(mapStateToProps,mapDispatchToProps)(AuthInfoContainer);
