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
import { fetchData } from '../../action/app';
import { GET_ESIGN_INFO,EDIT_ESIGN_INFO } from '../../constants/api';
import { dispatchGetESignInfo,dispatchRefreshESignTemplateInfo } from '../../action/eSign';
import CheckBox from '../../components/common/checkbox';
import Toast from '../../utils/toast';
import Regex from '../../utils/regex';
import HelperUtil from '../../utils/helper';
import ESignOne from '../../../assets/img/user/eSignTemplateOne.png';
import ESignTwo from '../../../assets/img/user/eSignTemplateTwo.png';

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
		this._getESignInfo = this._getESignInfo.bind(this);
		this._onPickerSelect = this._onPickerSelect.bind(this);
		this._editESignInfo = this._editESignInfo.bind(this);
	}

	static navigationOptions = ({ navigation }) => {
	  return {
	    header: <NavigatorBar 
	    router={ navigation }/>
	  };
	};

	componentDidMount(){
		super.componentDidMount();
		this._getESignInfo();
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

	_getESignInfo(){
		this.props.getESignInfo({
			carrierId: this.props.user.userId,
		},this.props.router);
	}

	_editESignInfo(){
		if(!this.state.sealTemplate )return Toast.show('请选择印章模板');
		// if(!this.state.landscapeText ) return Toast.show('请输入横向文');
		// if(!this.state.lastQuarterText ) return Toast.show('请输入下弦文');
		if(!this.state.colorMap.key ) return Toast.show('请选择印章颜色');
		if(this.state.landscapeText && !Regex.test('eSginText', this.state.landscapeText)){
			return Toast.show('请输入正确的横向文格式')
		}
		if(this.state.lastQuarterText && !Regex.test('eSginText', this.state.lastQuarterText)){
			return Toast.show('请输入正确的下弦文格式')
		}

		this.props.editESignInfo({
			esignId: this.state.esignId,
			accountId: this.state.accountId,
			carrierId: this.props.user.userId,
			sealColor: this.state.colorMap.key,
			sealHtext: this.state.landscapeText,
			sealQtext: this.state.lastQuarterText,
			sealTemplate: this.state.sealTemplate,
		},this.props.navigation);
	}

	_checkedInDatas(index){
		switch(index){
			case 1:
			this.setState({
				sealTemplate: 'STAR',
			});
			this.props.dispatch(dispatchRefreshESignTemplateInfo({template: true}));

			break;
			case 2:
			this.setState({
				sealTemplate: 'OVAL',
			});
			this.props.dispatch(dispatchRefreshESignTemplateInfo({template: false}));

			break;
		}
	}

	_onPickerSelect(data) {
		if (data.type === 'esign_color_type') {
			this.setState({ colorMap: data,visible: false });
		}
	}


	render(){
		const { router,eSignInfo } = this.props;
		// console.log('lqq--render-eSignInfo-',eSignInfo.toJS());

		return (
			<View style={ styles.container }>
					<ScrollView keyboardShouldPersistTaps='handled' style={styles.mainTextContent}>
						<View style={styles.mainTextView}>
							<View style={styles.landscapeLineView}>
								<View style={[styles.cellLeft,{marginTop:10}]}>
									<Text style={styles.cellText}>{'印章模板'}</Text>
								</View>
								<View style={styles.landscapeView}>
									<View style={styles.landscapeHalfView}>
										<CheckBox
										contentStyle={{ width: 20 }}
										isChecked={ this.props.isCricleTemplate }
										checkedFun={ this._checkedInDatas.bind(this, 1) }/>
										<Image source={ESignTwo}
										resizeMode='stretch' style={[styles.image,{ marginLeft: 10 }]}/>
									</View>
									<View style={styles.landscapeHalfView}>
										<CheckBox
										contentStyle={{ width: 20 }}
										isChecked={ !this.props.isCricleTemplate  }
										checkedFun={ this._checkedInDatas.bind(this, 2) }/>
										<Image source={ESignOne}
										resizeMode='stretch' style={[styles.image,{ marginLeft: 10 }]} />
									</View>


								</View>
							</View>
							<View style={styles.CellContainer}>
								<View style={styles.cellLeft}>
										<Text style={styles.cellText}>{'横向文'}</Text>
								</View>
								<View style={styles.cellRight}>
									<TextInput
										textAlign='right'
										placeholder='请输入横向文'
										placeholderTextColor='#ccc'
										defaultValue={ eSignInfo && eSignInfo.get('sealHtext')}
										style={ styles.textInput }
										underlineColorAndroid={ 'transparent' }
										value = { this.state.landscapeText }
										onChangeText={ text => this.setState({ landscapeText: text }) }/>
									</View>
							</View>
							<View style={styles.CellContainer}>
								<View style={styles.cellLeft}>
										<Text style={styles.cellText}>{'下弦文'}</Text>
								</View>
								<View style={styles.cellRight}>
									<TextInput
										textAlign='right'
										placeholder='请输入下弦文'
										placeholderTextColor='#ccc'
										defaultValue={ eSignInfo && eSignInfo.get('sealQtext')}
										style={ styles.textInput }
										underlineColorAndroid={ 'transparent' }
										value = { this.state.lastQuarterText }
										onChangeText={ text => this.setState({ lastQuarterText: text }) }/>
									</View>
							</View>
							<TouchableOpacity
								activeOpacity={ 1 }
								onPress={ () => this.setState({ visible: true, data: ESIGN_COLOR_TYPE })}>

							<View style={styles.CellContainer}>
								<View style={styles.cellLeft}>
										<Text style={styles.cellText}>{'印章颜色'}</Text>
								</View>

								<View style={styles.arrowTextRight}>
									<Text
										style={  this.state.colorMap.value ? styles.blackArrowText : styles.arrowText }>
										{ this.state.colorMap.value || HelperUtil.getColor(eSignInfo.get('sealColor'))||'请选择印章颜色' }
									</Text>
									<Text style={ styles.arrowRight }>&#xe60d;</Text>
								</View>
							</View>
							</TouchableOpacity>
							<TouchableOpacity onPress={ () => {this._editESignInfo()} }>
							<View style={ styles.saveBtn }>
								<Text
									style={styles.btn}
									>保存</Text>
							</View>
							</TouchableOpacity>
						</View>
					</ScrollView>
					<SimplePicker
					data={ this.state.data }
					visible={ this.state.visible }
					modalPress={ () => this.setState({ visible: false }) }
					onPickerSelect={ data => this._onPickerSelect(data) } />
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
	}
}


const mapDispatchToProps = dispatch => {
	return {
		dispatch,
		getESignInfo: (body, router) => {
			dispatch(fetchData({
				body,
				method: 'GET',
				api: GET_ESIGN_INFO,
				success: (data) => {
					// console.log('lqq---getESignInfo--success-->'+data);
					dispatch(dispatchGetESignInfo({data}));
				},
				fail: () => {
					// console.log('lqq---getESignInfo--fail-->');
				}
			}));
		},
		editESignInfo:(body, navigation) => {
			dispatch(fetchData({
				body,
				method: 'POST',
				api: EDIT_ESIGN_INFO,
				successToast: true,
				showLoading: true,
				msg: '保存成功',
				success: (data) => {
					navigation.dispatch({type:'pop'});
					// dispatch(dispatchRefreshESignTemplateInfo());
					// console.log('lqq---editESignInfo--success-->'+data);
				},
				fail: () => {
					// console.log('lqq---editESignInfo--fail-->');
				}
			}));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowESignInfoContainer);
