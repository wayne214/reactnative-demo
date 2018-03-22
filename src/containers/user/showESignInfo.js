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
import { GET_ESIGN_INFO,EDIT_ESIGN_INFO, UPDATE_COMPANY_ESIGN_INFO,NEW_COMPANY_ESIGN_INFO } from '../../constants/api';
import { dispatchGetESignInfo,dispatchRefreshESignTemplateInfo } from '../../action/eSign';
import CheckBox from '../../components/common/checkbox';
import Toast from '../../utils/toast';
import Regex from '../../utils/regex';
import HelperUtil from '../../utils/helper';
import ESignOne from '../../../assets/img/user/eSignTemplateOne.png';
import ESignTwo from '../../../assets/img/user/eSignTemplateTwo.png';
import * as RouteType from '../../constants/routeType';

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
        companyId: ''
		};
		// this.title = props.router.getCurrentRouteTitle();
		this._getESignInfo = this._getESignInfo.bind(this);
		// this._onPickerSelect = this._onPickerSelect.bind(this);
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
		const {eSignInfo,isRefresh, sealTemplate, sealColor, sealHtext, sealQtext} = props;
			setTimeout(() => {
				this.setState({
					isLoad: true,
					esignId: this.state.esignId ? this.state.esignId : eSignInfo.get('esignId'),
					accountId: this.state.accountId ? this.state.accountId : eSignInfo.get('accountId'),
					sealTemplate: this.state.sealTemplate ? this.state.sealTemplate : sealTemplate,
				// 	visible: false,
					landscapeText: this.state.landscapeText ? this.state.landscapeText : sealHtext,
					lastQuarterText: this.state.lastQuarterText ? this.state.lastQuarterText : sealQtext,
					colorMap: this.state.colorMap ? this.state.colorMap : sealColor,
          companyId: this.state.companyId ? this.state.companyId : eSignInfo.get('carrierId'),
				});
			}, 0);
			// console.log('---clolrMap--->',this.state.colorMap.value);
	}

	_getESignInfo(){
		// 企业
    const {companyInfo} = this.props;
		this.props.getESignInfo({
        companyId: companyInfo.id,
		},this.props.router);
	}

	_editESignInfo(){
      console.log('---',this.state.sealTemplate,this.state.landscapeText,this.state.lastQuarterText,this.state.colorMap)
      if(!this.state.sealTemplate )return Toast.show('请选择印章模板');
      if(!this.state.colorMap ) return Toast.show('请选择印章颜色');
      if(!this.state.landscapeText ) return Toast.show('请输入横向文');
      if(!this.state.lastQuarterText ) return Toast.show('请输入下弦文');
      // if(this.state.landscapeText && !Regex.test('eSginText', this.state.landscapeText)){
      //     return Toast.show('请输入正确的横向文格式')
      // }
      // if(this.state.lastQuarterText && !Regex.test('eSginText', this.state.lastQuarterText)){
      //     return Toast.show('请输入正确的下弦文格式')
      // }

    const {companyInfo} = this.props;

		if (this.state.accountId) {
        this.props.editESignInfo({
            accountId: this.state.accountId, // e签宝账号id
            companyId: this.state.companyId, // 承运商id
            companyName: companyInfo.companyName, // 承运商名字
            htext: this.state.landscapeText,
            organCode: companyInfo.rmcAnalysisAndContrast ? companyInfo.rmcAnalysisAndContrast.manualUnifiedSocialCreditCode : '', // 统一信用代码
            mobile: companyInfo.busTel, // 手机号
            qtext: this.state.lastQuarterText,
            sealColor: this.props.sealColor,
            templateType: this.state.sealTemplate,
        }, UPDATE_COMPANY_ESIGN_INFO, this.props.navigation);
		} else {
        this.props.editESignInfo({
            accountId: '', // e签宝账号id
            companyId: companyInfo.id, // 承运商id
            companyName: companyInfo.companyName, // 承运商名字
            htext: this.state.landscapeText,
            organCode: companyInfo.rmcAnalysisAndContrast ? companyInfo.rmcAnalysisAndContrast.manualUnifiedSocialCreditCode : '', // 统一信用代码
            mobile: companyInfo.busTel, // 手机号
            qtext: this.state.lastQuarterText,
            sealColor: this.props.sealColor,
            templateType: this.state.sealTemplate,
        }, NEW_COMPANY_ESIGN_INFO, this.props.navigation);
		}


	}


// 	_onPickerSelect(data) {
// 		if (data.type === 'esign_color_type') {
// 			this.setState({ colorMap: data,visible: false });
// 		}
// 	}


	render(){
		const { router,eSignInfo } = this.props;
		// console.log('lqq--render-eSignInfo-',eSignInfo.toJS());

		return (
			<View style={ styles.container }>
					<ScrollView keyboardShouldPersistTaps='handled' style={styles.mainTextContent}>
						<View style={styles.mainTextView}>
							{/*<View style={styles.landscapeLineView}>*/}
								{/*<View style={[styles.cellLeft,{marginTop:10}]}>*/}
									{/*<Text style={styles.cellText}>{'印章模板'}</Text>*/}
								{/*</View>*/}
								{/*<View style={styles.landscapeView}>*/}
									{/*<View style={styles.landscapeHalfView}>*/}
										{/*<CheckBox*/}
										{/*contentStyle={{ width: 20 }}*/}
										{/*isChecked={ this.props.isCricleTemplate }*/}
										{/*checkedFun={ this._checkedInDatas.bind(this, 1) }/>*/}
										{/*<Image source={ESignTwo}*/}
										{/*resizeMode='stretch' style={[styles.image,{ marginLeft: 10 }]}/>*/}
									{/*</View>*/}
									{/*<View style={styles.landscapeHalfView}>*/}
										{/*<CheckBox*/}
										{/*contentStyle={{ width: 20 }}*/}
										{/*isChecked={ !this.props.isCricleTemplate  }*/}
										{/*checkedFun={ this._checkedInDatas.bind(this, 2) }/>*/}
										{/*<Image source={ESignOne}*/}
										{/*resizeMode='stretch' style={[styles.image,{ marginLeft: 10 }]} />*/}
									{/*</View>*/}


								{/*</View>*/}
							{/*</View>*/}
							<TouchableOpacity
								activeOpacity={ 1 }
								onPress={ () =>
                    // this.setState({ visible: true, data: ESIGN_COLOR_TYPE })
                    this.props.navigation.dispatch({type: RouteType.ROUTE_ESIGN_TEMPLATE_COMPANY, params: {title: '印章模板(个体)', type: 3}})
                }>
								<View style={styles.CellContainer}>
									<View style={styles.cellLeft}>
										<Text style={styles.cellText}>{'印章模板'}</Text>
									</View>

									<View style={styles.arrowTextRight}>
										<Text
											style={  this.props.sealTemplate ? styles.blackArrowText : styles.arrowText }>
												{  this.props.sealTemplate ? this.props.sealTemplate : '请选择印章模板' }
										</Text>
										<Text style={ styles.arrowRight }>&#xe63d;</Text>
									</View>
								</View>
							</TouchableOpacity>

							<TouchableOpacity
								activeOpacity={ 1 }
								onPress={ () =>
                    // this.setState({ visible: true, data: ESIGN_COLOR_TYPE })
                    this.props.navigation.dispatch({type: RouteType.ROUTE_ESIGN_TEMPLATE_COLOR, params: {title: '印章模板(个体)', type: 3}})
                }>
								<View style={styles.CellContainer}>
									<View style={styles.cellLeft}>
										<Text style={styles.cellText}>{'印章颜色'}</Text>
									</View>

									<View style={styles.arrowTextRight}>
										<Text
											style={ this.props.sealColor != '' ? styles.blackArrowText : styles.arrowText }>
												{/*{ this.state.colorMap.value || HelperUtil.getColor(eSignInfo.get('sealColor'))||'请选择印章颜色' }*/}
												{this.props.sealColor == '' ? '请选择印章颜色' : HelperUtil.getColor(this.props.sealColor)}
										</Text>
										<Text style={ styles.arrowRight }>&#xe63d;</Text>
									</View>
								</View>
							</TouchableOpacity>

							<TouchableOpacity
								activeOpacity={ 1 }
								onPress={ () =>
                    // this.setState({ visible: true, data: ESIGN_COLOR_TYPE })
                    this.props.navigation.dispatch({type: RouteType.ROUTE_ESIGN_HORIZONTAL_TEXT})
                }>
								<View style={styles.CellContainer}>
									<View style={styles.cellLeft}>
											<Text style={styles.cellText}>{'横向文'}</Text>
									</View>
									<View style={styles.arrowTextRight}>
										<Text
											style={  this.props.sealHtext != '' ? styles.blackArrowText : styles.arrowText }>
												{/*{ this.state.colorMap.value || HelperUtil.getColor(eSignInfo.get('sealColor'))||'请选择印章颜色' }*/}
												{this.props.sealHtext == '' ? '请设置横向文' : this.props.sealHtext}
										</Text>
										<Text style={ styles.arrowRight }>&#xe63d;</Text>
									</View>
									{/*<View style={styles.cellRight}>*/}
										{/*<TextInput*/}
											{/*textAlign='right'*/}
											{/*returnKeyType='done'*/}
											{/*placeholder='请输入横向文'*/}
											{/*placeholderTextColor='#ccc'*/}
											{/*defaultValue={ eSignInfo && eSignInfo.get('sealHtext')}*/}
											{/*style={ styles.textInput }*/}
											{/*underlineColorAndroid={ 'transparent' }*/}
											{/*value = { this.state.landscapeText }*/}
											{/*onChangeText={ text => this.setState({ landscapeText: text }) }/>*/}
										{/*</View>*/}
								</View>
							</TouchableOpacity>

							<TouchableOpacity
								activeOpacity={ 1 }
								onPress={ () =>
                    // this.setState({ visible: true, data: ESIGN_COLOR_TYPE })
                    this.props.navigation.dispatch({type: RouteType.ROUTE_ESIGN_LAST_QUARTER_TEXT})
                }>
								<View style={styles.CellContainer}>
									<View style={styles.cellLeft}>
											<Text style={styles.cellText}>{'下弦文'}</Text>
									</View>
									<View style={styles.arrowTextRight}>
										<Text
											style={  this.props.sealQtext != '' ? styles.blackArrowText : styles.arrowText }>
												{/*{ this.state.colorMap.value || HelperUtil.getColor(eSignInfo.get('sealColor'))||'请选择印章颜色' }*/}
												{this.props.sealQtext == '' ? '请设置下弦文' : this.props.sealQtext}
										</Text>
										<Text style={ styles.arrowRight }>&#xe63d;</Text>
									</View>
									{/*<View style={styles.cellRight}>*/}
										{/*<TextInput*/}
											{/*textAlign='right'*/}
											{/*placeholder='请输入下弦文'*/}
											{/*returnKeyType='done'*/}
											{/*placeholderTextColor='#ccc'*/}
											{/*defaultValue={ eSignInfo && eSignInfo.get('sealQtext')}*/}
											{/*style={ styles.textInput }*/}
											{/*underlineColorAndroid={ 'transparent' }*/}
											{/*value = { this.state.lastQuarterText }*/}
											{/*onChangeText={ text => this.setState({ lastQuarterText: text }) }/>*/}
										{/*</View>*/}
								</View>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={ 1 }
								onPress={ () => this.setState({ visible: true, data: ESIGN_COLOR_TYPE })}>


							</TouchableOpacity>
							<TouchableOpacity onPress={ () => {this._editESignInfo()} }>
							<View style={ styles.saveBtn }>
								<Text
									style={styles.btn}
									>保存设置</Text>
							</View>
							</TouchableOpacity>
						</View>
					</ScrollView>
					{/*<SimplePicker*/}
					{/*data={ this.state.data }*/}
					{/*visible={ this.state.visible }*/}
					{/*modalPress={ () => this.setState({ visible: false }) }*/}
					{/*onPickerSelect={ data => this._onPickerSelect(data) } />*/}
					{/*{ this.props.loading ? this._renderLoadingView() : null }*/}
					{ this._renderUpgrade(this.props) }
			</View>
			);
	}
}
const mapStateToProps = state => {
	const { app ,eSign, user} = state;
	return {
		user: app.get('user'),
		loading: app.get('loading'),
		eSignInfo: eSign.getIn(['eSign','eSignInfoDetail']),
		isRefresh: eSign.get('isRefresh'),
		isCricleTemplate: eSign.get('isCricleTemplate'),
		upgrade: app.get('upgrade'),
		upgradeForce: app.get('upgradeForce'),
    upgradeForceUrl: app.get('upgradeForceUrl'),
    sealColor: eSign.get('sealColor'),
    sealHtext: eSign.get('sealHtext'),
    sealQtext: eSign.get('sealQtext'),
      sealTemplate: eSign.get('sealTemplate'),
      companyInfo: user.get('companyInfo')
	}
}


const mapDispatchToProps = dispatch => {
	return {
		dispatch,
		getESignInfo: (body, router) => {
			startTime = new Date().getTime()
			dispatch(fetchData({
				body,
				method: 'POST',
				api: GET_ESIGN_INFO + '?companyId='+ body.companyId,
				success: (data) => {
					// console.log('lqq---getESignInfo--success-->'+data);
						if (data) {
                dispatch(dispatchGetESignInfo({data}));
						}
					dispatch(appendLogToFile('电子签章','电子签章信息',startTime))
				},
				fail: () => {
					// console.log('lqq---getESignInfo--fail-->');
				}
			}));
		},
		editESignInfo:(body, api, navigation) => {
			startTime = new Date().getTime()
			dispatch(fetchData({
				body,
				method: 'POST',
				api: api,
				successToast: true,
				showLoading: true,
				msg: '保存成功',
				success: (data) => {
					navigation.dispatch({type:'pop'});
					dispatch(appendLogToFile('电子签章','保存修改电子签章',startTime))
					// dispatch(dispatchRefreshESignTemplateInfo());
					// console.log('lqq---editESignInfo--success-->'+data);
				},
				fail: (error) => {
					Toast.show(error.message);
					// console.log('lqq---editESignInfo--fail-->');
				}
			}));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowESignInfoContainer);
