import React from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	Image,
	Platform
} from 'react-native';
import styles from '../../../assets/css/help';
import NavigatorBar from '../../components/common/navigatorbar';
import Help from '../../components/user/help';
import TabView from '../../components/common/tabView';
import { GET_FEEDBACK_DETAILS } from '../../constants/api';
import { fetchData } from '../../action/app';
import * as RouteType from '../../constants/routeType';
import { dispatchGetFeedbackDetails } from '../../action/help';
import UserIcon from '../../../assets/img/user/user_icon.png';
import DateFormat from 'moment';
import BaseComponent from '../../components/common/baseComponent';

class HelpDetailForFeedbackContainer extends BaseComponent {

	constructor(props) {
		super(props);
		// this.title = props.router.getCurrentRouteTitle();
		this.state = {};
		this.id = props.navigation.state.params.id;
		this._getFeedbackDetails = this._getFeedbackDetails.bind(this);
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
		this._getFeedbackDetails();
	}

	componentWillUnmount() {
		super.componentWillUnmount();
	}

	_getFeedbackDetails(){
		this.props.getFeedBackDetailsInfo({
			id: this.id
		},this.props.router);
	}

	render () {
		const { navigation } = this.props;
		return (
			<View style={ styles.container }>
				<View style={ styles.timeContent}>
					<Text style={ styles.timeText }>
						{this.props.feedback && DateFormat(this.props.feedback.get('createTime')).format('YYYY年MM月DD日')}
					</Text>
				</View>
				<View style={styles.feedbackLeftContainer}>
					<View style={ styles.feedbackRightContent}>
						<View style={ styles.feedbackRightTextContainer }>
							<Text style={ styles.feedbackRightText }>
							{this.props.feedback && this.props.feedback.get('questionContent')}
							</Text>
						</View>
						<View style={styles.rightTimeTextContainer}>
							<Text style={ styles.rightTimeText }>
								{this.props.feedback && DateFormat(this.props.feedback.get('createTime')).format('HH:mm:ss')}
							</Text>
						</View>
						
					
					</View>
					<Image style={ styles.image } source={ UserIcon }/>
				</View>
				{ this.props.feedback && this.props.feedback.get('feedback') &&
				<View style={styles.feedbackRightContainer}>
							<Image style={ styles.image } source={ UserIcon }/>
							<View style={ styles.feedbackLeftContent}>
								<View style={styles.feedbackLeftTextContainer}>
									<Text style={ styles.feedbackLeftText }>
									{this.props.feedback && this.props.feedback.get('feedback')}
								</Text>
								</View>	
								<View style={styles.TimeTextContainer}>
								<Text style={ styles.leftTimeText }>
									{this.props.feedback && DateFormat(this.props.feedback.get('updateTime')).format('HH:mm:ss')}
								</Text>	
								</View>					
							</View>	
						</View>						
				}
			{ this._renderUpgrade(this.props.upgrade) }	
			</View>
		);
	}
}
const mapStateToProps = state => {
	const { help } = state;
	return {
		feedback: help.getIn(['help','feedbackDetailsInfo']),
		upgrade: app.get('upgrade'),
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getFeedBackDetailsInfo:(body, navigation) => {
			dispatch(fetchData({
				body,
				method: 'POST',
				api: GET_FEEDBACK_DETAILS,
				success: (data) => {
					// console.log('lqq---getFeedBackDetailsInfo--',data);
					dispatch(dispatchGetFeedbackDetails({data}));
				}
			}));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(HelpDetailForFeedbackContainer);
