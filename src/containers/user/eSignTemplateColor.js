/**
 * 电子签章模板--颜色
 * */
import React from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	ScrollView,
	TextInput,
	Button,
	Platform
} from 'react-native';
import styles from '../../../assets/css/eSign';
import NavigatorBar from '../../components/common/navigatorbar';
import BaseComponent from '../../components/common/baseComponent';
import SimplePicker from '../../components/common/picker';
import { ESIGN_COLOR_TYPE } from '../../constants/json';
import { fetchData,appendLogToFile } from '../../action/app';
import { GET_ESIGN_INFO,EDIT_ESIGN_INFO } from '../../constants/api';
import { dispatchGetESignInfo,dispatchRefreshESignTemplateInfo, dispatchRefreshESignColorInfo } from '../../action/eSign';
import CheckBox from '../../components/common/checkbox';
import Toast from '../../utils/toast';
import Regex from '../../utils/regex';
import HelperUtil from '../../utils/helper';
import ESignOne from '../../../assets/img/user/eSignTemplateOne.png';
import ESignTwo from '../../../assets/img/user/eSignTemplateTwo.png';
let startTime = 0
class ShowESignInfoContainer extends BaseComponent {

	constructor(props) {
		super(props);
		this.state = {
			esignId: '',
			accountId: '',
			landscapeText: '',
			lastQuarterText: '',
			colorMap: '',
			data: ESIGN_COLOR_TYPE,
			visible: false,
			sealTemplate: '',
			isLoad: false,
		};
		// this.title = props.router.getCurrentRouteTitle();
	}

	static navigationOptions = ({ navigation }) => {
	  return {
	    header: <NavigatorBar
	    router={ navigation }/>
	  };
	};

	componentDidMount(){
		super.componentDidMount();
	}

	componentWillUnmount() {
		super.componentWillUnmount();
		this.timer && clearTimeout(this.timer);
	}

	componentWillReceiveProps(props) {
		const {eSignInfo,isRefresh} = props;
		if(eSignInfo && eSignInfo.get('accountId') && !this.state.isLoad){
			setTimeout(() => {
				this.setState({
					isLoad: true,
					esignId: this.state.esignId ? this.state.esignId : eSignInfo.get('esignId'),
					accountId: this.state.accountId ? this.state.accountId : eSignInfo.get('accountId'),
					sealTemplate: this.state.sealTemplate ? this.state.sealTemplate : eSignInfo.get('sealTemplate'),
					visible: false,
					landscapeText: this.state.landscapeText ? this.state.landscapeText : eSignInfo.get('sealHtext'),
					lastQuarterText: this.state.lastQuarterText ? this.state.lastQuarterText : eSignInfo.get('sealQtext'),
					colorMap: this.state.colorMap ? this.state.colorMap : HelperUtil.getObject(ESIGN_COLOR_TYPE,eSignInfo.get('sealColor'))
				});
			}, 0);
			// console.log('---clolrMap--->',this.state.colorMap.value);
		}
	}

	_checkedInDatas(index){
		switch(index){
			case 1:
		// 	this.setState({
		// 		sealTemplate: 'STAR',
		// 	});
          this.props.dispatch(dispatchRefreshESignColorInfo({sealColor: '红色'}));

          break;
			case 2:
		// 	this.setState({
		// 		sealTemplate: 'OVAL',
		// 	});
          this.props.dispatch(dispatchRefreshESignColorInfo({sealColor: '蓝色'}));
			break;

			case 3:
					// 	this.setState({
					// 		sealTemplate: 'OVAL',
					// 	});
					this.props.dispatch(dispatchRefreshESignColorInfo({sealColor: '黑色'}));
					break;
		}
      this.props.dispatch(dispatchRefreshESignTemplateInfo({selectTemplate: index}));
	}


	render(){
		const { router,eSignInfo } = this.props;
		// console.log('lqq--render-eSignInfo-',eSignInfo.toJS());

		return (
			<View style={ styles.container }>
					<ScrollView keyboardShouldPersistTaps='handled' style={styles.mainTextContent}>
						<View style={styles.mainTextView}>
							<View style={styles.landscapeLineView}>
								<View style={styles.titleContainer}>
									<Text style={{color: '#FF8500', fontFamily: 'iconfont', fontSize: 15, marginRight: 5}}>&#xe642;</Text>
									<Text style={styles.colorText}>说明：请选择您的签章颜色，系统默认“红色”</Text>
								</View>
								<View>

									<View style={styles.colorContainer}>
										<Text style={styles.colorText}>红色</Text>
										<CheckBox
										contentStyle={{ width: 20 }}
										isChecked={ this.props.selectTemplate === 1 }
										checkedFun={ this._checkedInDatas.bind(this, 1) }/>
									</View>

									<View style={styles.separateLine}/>

									<View style={styles.colorContainer}>
										<Text style={styles.colorText}>蓝色</Text>
										<CheckBox
										contentStyle={{ width: 20 }}
										isChecked={ this.props.selectTemplate === 2  }
										checkedFun={ this._checkedInDatas.bind(this, 2) }/>
									</View>

									<View style={styles.separateLine}/>

									<View style={styles.colorContainer}>
										<Text style={styles.colorText}>黑色</Text>
										<CheckBox
											contentStyle={{ width: 20 }}
											isChecked={ this.props.selectTemplate === 3  }
											checkedFun={ this._checkedInDatas.bind(this, 3) }/>
									</View>
								</View>
							</View>
						</View>
					</ScrollView>
					{ this.props.loading ? this._renderLoadingView() : null }
					{ this._renderUpgrade(this.props) }
			</View>
			);
	}
}
const mapStateToProps = state => {
	const { app ,eSign} = state;
	return {
		user: app.get('user'),
		loading: app.get('loading'),
		eSignInfo: eSign.getIn(['eSign','eSignInfoDetail']),
		isRefresh: eSign.get('isRefresh'),
		isCricleTemplate: eSign.get('isCricleTemplate'),
		upgrade: app.get('upgrade'),
		upgradeForce: app.get('upgradeForce'),
    upgradeForceUrl: app.get('upgradeForceUrl'),
    selectTemplate: eSign.get('selectTemplate'),
	}
}


const mapDispatchToProps = dispatch => {
	return {
		dispatch,
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowESignInfoContainer);
