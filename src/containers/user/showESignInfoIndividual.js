/**
 * 电子签章个体
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
import { GET_ESIGN_INFO,EDIT_ESIGN_INFO, UPDATE_PERSON_ESIGN_INFO } from '../../constants/api';
import { dispatchGetESignInfo,dispatchRefreshESignTemplateInfo } from '../../action/eSign';
import CheckBox from '../../components/common/checkbox';
import Toast from '../../utils/toast';
import Regex from '../../utils/regex';
import HelperUtil from '../../utils/helper';
import * as RouteType from '../../constants/routeType';

let startTime = 0
class showESignInfoIndividual extends BaseComponent {

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
				companyId: '',
        sealPersonTemplate: ''
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
		const {eSignInfo,sealPersonTemplate, sealColor} = props;
			setTimeout(() => {
				this.setState({
					isLoad: true,
				// 	esignId: this.state.esignId ? this.state.esignId : eSignInfo.get('esignId'),
					accountId: this.state.accountId ? this.state.accountId : eSignInfo.get('accountId'),
          sealPersonTemplate: this.state.sealPersonTemplate ? this.state.sealPersonTemplate : sealPersonTemplate,
				// 	visible: false,
				// 	landscapeText: this.state.landscapeText ? this.state.landscapeText : eSignInfo.get('sealHtext'),
				// 	lastQuarterText: this.state.lastQuarterText ? this.state.lastQuarterText : eSignInfo.get('sealQtext'),
					colorMap: this.state.colorMap ? this.state.colorMap : sealColor,
					companyId: this.state.companyId ? this.state.companyId : eSignInfo.get('carrierId'),
				});
			}, 0);
			// console.log('---clolrMap--->',this.state.colorMap.value);
	}

	_getESignInfo(){
		// 个人
      const {companyInfo} = this.props;
      this.props.getESignInfo({
          companyId: global.companyId,
      },this.props.router);
	}

	_editESignInfo(){
		console.log('----this.state.sealPersonTemplate',this.state.sealPersonTemplate)
		if(!this.state.sealPersonTemplate )return Toast.show('请选择印章模板');

		if(!this.state.colorMap ) return Toast.show('请选择印章颜色');
      const {eSignInfo,companyInfo} = this.props;

      console.log('=====companyInfo',companyInfo)
			if (this.state.accountId) {
          this.props.editESignInfo({
              accountId: this.state.accountId, // e签宝账号id
              companyId: companyInfo.id, // 承运商id
              htext: '',
              idNo: companyInfo.rmcAnalysisAndContrast ? companyInfo.rmcAnalysisAndContrast.manualIdCard : '', // 身份证
              mobile: companyInfo.busTel, // 手机号
              name: companyInfo.companyName, // 车主名字
              qtext: '',
              sealColor: this.props.sealColor,
              templateType: this.props.sealPersonTemplate,

          },UPDATE_PERSON_ESIGN_INFO, this.props.navigation);
			} else {
          this.props.editESignInfo({
              accountId: '', // e签宝账号id
              companyId: companyInfo.id, // 承运商id
              htext: '',
              idNo: companyInfo.rmcAnalysisAndContrast ? companyInfo.rmcAnalysisAndContrast.manualIdCard : '', // 身份证
              mobile: companyInfo.busTel, // 手机号
              name: companyInfo.companyName, // 车主名字
              qtext: '',
              sealColor: this.props.sealColor,
              templateType: this.props.sealPersonTemplate,

          }, EDIT_ESIGN_INFO, this.props.navigation);
			}

	}

// 	_checkedInDatas(index){
// 		switch(index){
// 			case 1:
// 			this.setState({
// 				sealTemplate: 'STAR',
// 			});
// 			this.props.dispatch(dispatchRefreshESignTemplateInfo({template: true}));
//
// 			break;
// 			case 2:
// 			this.setState({
// 				sealTemplate: 'OVAL',
// 			});
// 			this.props.dispatch(dispatchRefreshESignTemplateInfo({template: false}));
//
// 			break;
// 		}
// 	}

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
								{
                    this.props.navigation.dispatch({type: RouteType.ROUTE_ESIGN_TEMPLATE_INDIVIDUAL, params: {title: '印章模板(个体)', type: 3}})
								}
								}>

								<View style={styles.CellContainer}>
									<View style={styles.cellLeft}>
										<Text style={styles.cellText}>{'印章模板'}</Text>
									</View>

									<View style={styles.arrowTextRight}>
										<Text
											style={  this.props.sealPersonTemplate ? styles.blackArrowText : styles.arrowText }>
                        { this.props.sealPersonTemplate != '' ? HelperUtil.getPersonTemplateStyle(this.props.sealPersonTemplate) : '请选择印章模板' }
										</Text>
										<Text style={ styles.arrowRight }>&#xe63d;</Text>
									</View>
								</View>
							</TouchableOpacity>

							<TouchableOpacity
								activeOpacity={ 1 }
								onPress={ () =>{
                    this.props.navigation.dispatch({type: RouteType.ROUTE_ESIGN_TEMPLATE_COLOR, params: {title: '印章颜色', type: 3}})
								}
										// this.setState({ visible: true, data: ESIGN_COLOR_TYPE })
                }>

							<View style={styles.CellContainer}>
								<View style={styles.cellLeft}>
										<Text style={styles.cellText}>{'印章颜色'}</Text>
								</View>

								<View style={styles.arrowTextRight}>
									<Text
										style={  this.state.colorMap ? styles.blackArrowText : styles.arrowText }>
										{ this.props.sealColor == '' ? '请选择印章颜色' : HelperUtil.getColor(this.props.sealColor) }
									</Text>
									<Text style={ styles.arrowRight }>&#xe63d;</Text>
								</View>
							</View>
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
					{ this.props.loading ? this._renderLoadingView() : null }
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
		sealPersonTemplate: eSign.get('sealPersonTemplate'),
		sealColor: eSign.get('sealColor'),
		templateStyle: eSign.get('templateStyle'),
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
				fail: (error) => {
            Toast.show(error.message);
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

export default connect(mapStateToProps, mapDispatchToProps)(showESignInfoIndividual);
