/**
 * 电子签章模板--个体
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
import { dispatchRefreshESignPersonTemplateInfo, dispatchRefreshESignTemplateInfo } from '../../action/eSign';
import CheckBox from '../../components/common/checkbox';
import Toast from '../../utils/toast';
import Regex from '../../utils/regex';
import HelperUtil from '../../utils/helper';
import personTemplateOne from '../../../assets/img/user/personTemplateOne.png';
import personTemplateTwo from '../../../assets/img/user/personTemplateTwo.png';
import personTemplateThree from '../../../assets/img/user/personTemplateThree.png';
import personTemplateFour from '../../../assets/img/user/personTemplateFour.png';
import personTemplateFive from '../../../assets/img/user/personTemplateFive.png';
import personTemplateSix from '../../../assets/img/user/personTemplateSix.png';

let startTime = 0
class eSignTemplateIndividual extends BaseComponent {

	constructor(props) {
		super(props);
		this.state = {
			esignId: '',
			accountId: '',
			landscapeText: '',
			lastQuarterText: '',
			colorMap: '',
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

// 	componentWillReceiveProps(props) {
// 		const {eSignInfo,isRefresh} = props;
// 		if(eSignInfo && eSignInfo.get('accountId') && !this.state.isLoad){
// 			setTimeout(() => {
// 				this.setState({
// 					isLoad: true,
// 					esignId: this.state.esignId ? this.state.esignId : eSignInfo.get('esignId'),
// 					accountId: this.state.accountId ? this.state.accountId : eSignInfo.get('accountId'),
// 					sealTemplate: this.state.sealTemplate ? this.state.sealTemplate : eSignInfo.get('sealTemplate'),
// 					visible: false,
// 					landscapeText: this.state.landscapeText ? this.state.landscapeText : eSignInfo.get('sealHtext'),
// 					lastQuarterText: this.state.lastQuarterText ? this.state.lastQuarterText : eSignInfo.get('sealQtext'),
// 					colorMap: this.state.colorMap ? this.state.colorMap : HelperUtil.getObject(ESIGN_COLOR_TYPE,eSignInfo.get('sealColor'))
// 				});
// 			}, 0);
// 			// console.log('---clolrMap--->',this.state.colorMap.value);
// 		}
// 	}

	_checkedInDatas(index){
		switch(index){
			case 1:
				// 	this.setState({
				// 		sealTemplate: 'HYLSF',
				// 	});
					this.props.dispatch(dispatchRefreshESignPersonTemplateInfo({sealPersonTemplate: 'HYLSF',}));

					break;
			case 2:
				// 	this.setState({
				// 		sealTemplate: 'BORDERLESS',
				// 	});
					this.props.dispatch(dispatchRefreshESignPersonTemplateInfo({sealPersonTemplate: 'BORDERLESS',}));

					break;
			case 3:
				// 	this.setState({
				// 			sealTemplate: 'FZKC',
				// 	});
					this.props.dispatch(dispatchRefreshESignPersonTemplateInfo({sealPersonTemplate: 'FZKC',}));

			break;
			case 4:
				// 	this.setState({
				// 			sealTemplate: 'RECTANGLE',
				// 	});
					this.props.dispatch(dispatchRefreshESignPersonTemplateInfo({sealPersonTemplate: 'RECTANGLE',}));

			break;
			case 5:
				// 	this.setState({
				// 			sealTemplate: 'YYGXSF',
				// 	});
					this.props.dispatch(dispatchRefreshESignPersonTemplateInfo({sealPersonTemplate: 'YYGXSF', }));

					break;
			case 6:
				// 	this.setState({
				// 			sealTemplate: 'SQUARE',
				// 	});
					this.props.dispatch(dispatchRefreshESignPersonTemplateInfo({sealPersonTemplate: 'SQUARE', }));

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
									<Text style={styles.colorText}>说明：请选择您的印章样式，系统默认印章样式1</Text>
								</View>
								<View style={styles.landscapeHalfView}>
									<Image source={personTemplateThree}
												 resizeMode='stretch' style={[styles.image,{ marginLeft: 10 }]} />
									<View style={{flexDirection: 'row', alignItems: 'center'}}>
											<Text style={{fontSize: 14, color: '#999999', marginRight: 10}}>(默认)</Text>
											<CheckBox
												index={1}
												isShowText={true}
												isChecked={ this.props.selectTemplate === 1  }
												checkedFun={ this._checkedInDatas.bind(this, 1) }/>
									</View>
								</View>

								<View style={styles.separateLine}/>

								<View style={styles.landscapeHalfView}>
									<Image source={personTemplateFour}
												 resizeMode='stretch' style={[styles.image,{ marginLeft: 10 }]} />
									<CheckBox
										index={2}
										isShowText={true}
										isChecked={ this.props.selectTemplate === 2  }
										checkedFun={ this._checkedInDatas.bind(this, 2) }/>
								</View>

								<View style={styles.separateLine}/>

								<View style={styles.landscapeHalfView}>
									<Image source={personTemplateTwo}
												 resizeMode='stretch' style={[styles.image,{ marginLeft: 10 }]} />
									<CheckBox
										index={3}
										isShowText={true}
										isChecked={ this.props.selectTemplate === 3  }
										checkedFun={ this._checkedInDatas.bind(this, 3) }/>
								</View>

								<View style={styles.separateLine}/>

									<View style={styles.landscapeHalfView}>
										<Image source={personTemplateFive}
													 resizeMode='stretch' style={[styles.image,{ marginLeft: 10 }]} />
										<CheckBox
											index={4}
											isShowText={true}
											isChecked={ this.props.selectTemplate === 4  }
											checkedFun={ this._checkedInDatas.bind(this, 4) }/>
									</View>

								<View style={styles.separateLine}/>

								<View style={styles.landscapeHalfView}>
									<Image source={personTemplateSix}
												 resizeMode='stretch' style={[styles.image,{ marginLeft: 10 }]} />
									<CheckBox
										index={5}
										isShowText={true}
										isChecked={ this.props.selectTemplate === 5  }
										checkedFun={ this._checkedInDatas.bind(this, 5) }/>
								</View>

								<View style={styles.separateLine}/>

								<View style={styles.landscapeView}>
									<View style={styles.landscapeHalfView}>
										<Image source={personTemplateOne}
													 resizeMode='stretch' style={[styles.image,{ marginLeft: 10 }]}/>
										<CheckBox
											index={6}
											isShowText={true}
											isChecked={ this.props.selectTemplate === 6 }
											checkedFun={ this._checkedInDatas.bind(this, 6) }/>
									</View>

								</View>
							</View>
						</View>
					</ScrollView>
			</View>
			);
	}
}
const mapStateToProps = state => {
	const { app ,eSign} = state;
	return {
      selectTemplate: eSign.get('selectTemplate'),

	}
}


const mapDispatchToProps = dispatch => {
	return {
		dispatch,
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(eSignTemplateIndividual);
