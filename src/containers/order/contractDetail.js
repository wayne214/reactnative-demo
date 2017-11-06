'use strict'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	StyleSheet,
	WebView,
	Alert,
	Clipboard,
	Platform,
	TouchableHighlight,
	Share,
	Dimensions,
	InteractionManager
} from 'react-native';
import NavigatorBar from '../../components/common/navigatorbar';
import * as COLOR from '../../constants/colors'
import * as API from '../../constants/api'
import {fetchData, appendLogToFile } from '../../action/app'
import Toast from 'react-native-root-toast';
import Pdf from 'react-native-pdf'
import BaseComponent from '../../components/common/baseComponent'
import { CONTRACT_HEADER,CONTRACT_TEMPLATE_URL } from '../../constants/setting'
import LoadingView from '../../components/common/loading.js';
import Button from 'apsl-react-native-button'
let startTime = 0
class ContractDetail extends BaseComponent {
	constructor(props) {
	  super(props);
	  // params中 需要 contractNo 和 orderNo
	  const { params={} } = this.props.navigation.state
	  let uri = ''
	  if (params.isTemplate) {
	  	uri = CONTRACT_TEMPLATE_URL
	  }else if (!(params.orderNo && params.contractNo)) {
	  	console.warn("参数不足 合同详情需要订单编号（orderNo）和合同编号（contractNo）");
	  	uri = params.uri
	  };
	  this.state = {
	  	uri,
      loading: false,
	  	...params
	  }
	  this.pdf = null;
	  // this._shareMessage = this._shareMessage.bind(this);
	  // this._showResult = this._showResult.bind(this);
	}
	componentDidMount() {
		if (this.state.isTemplate) {
			return
		};
		setTimeout(()=>{
			this.props._getContractPath({
				orderNo: this.state.orderNo,
				contractNo: this.state.contractNo
			},(uri)=>{
				this.setState({
					uri: CONTRACT_HEADER + uri
				})
				this.props.navigation.setParams({
					uri: CONTRACT_HEADER + uri
				})
			})
		}, 500);
		this.props.navigation.setParams({
			copyToClipboardAndAppendLogToFile: ()=>{
				this.props.dispatch(appendLogToFile('合同','复制合同下载链接',0))
			}
		})
	}
	static navigationOptions = ({navigation}) => {
		const {params} = navigation.state
		if (params.isTemplate) {
			return {
				header: <NavigatorBar router={navigation}/>
			}
		}else{
			return {
				header: (
					<NavigatorBar router={navigation} firstLevelIconFont='&#xe61a;' firstLevelClick={ () => {
						if (params.uri) {
							Alert.alert('合同下载地址',params.uri,[
								{ text: '复制到剪贴板', onPress: () => {
									Clipboard.setString(params.uri)
									Toast.show('已复制到剪贴板')
									params && params.copyToClipboardAndAppendLogToFile && params.copyToClipboardAndAppendLogToFile()
								}}
							])
						}else{
							Toast.show('未找到合同下载链接')
						}
					}}/>
				)
			}
		}
	}
  // _shareMessage(content) {
  //   Share.share({
  //     message: content,
  //     title: '合同下载地址',
  //     url: this.state.uri
  //   })
  //   .then(this._showResult)
  //   .catch((error) => this.setState({result: 'error: ' + error.message}));
  // }
  // _showResult(result) {
  //     if (result.action === Share.sharedAction) {
  //       if (result.activityType) {
  //         this.setState({result: 'shared with an activityType: ' + result.activityType});
  //       } else {
  //         this.setState({result: 'shared'});
  //       }
  //     } else if (result.action === Share.dismissedAction) {
  //       this.setState({result: 'dismissed'});
  //     }
  //   }
	render() {
		const {uri,isTemplate} = this.state
		console.log("-------- 合同地址 ",uri);
		return <View style={styles.container}>
			{
				(()=>{
					if (!uri) {
						return null
					};
					if (Platform.OS === 'ios') {
						return (
							<WebView
								style={{backgroundColor: 'lightgray',flex: 1}}
								source={{uri}}
								scalesPageToFit={true}
								onLoadStart={()=>{
									this.setState({
										loading: true
									})
									console.log("------ onLoadStart");
								}}
								onLoadEnd={(end)=>{
									this.setState({
										loading: false
									})
									console.log("====== onLoadEnd",end);
								}}
								onError={()=>{
									Toast.show('合同加载出错，请重试')
								}}/>
						)
					}else{
						return (
							<View style={styles.container2}>
								<Pdf ref={(pdf)=>{this.pdf = pdf;}}
									source={{uri,cache:true}}
									page={1}
									horizontal={false}
									activityIndicator={
										<LoadingView />
									}
									onLoadProgress={()=>{
										if (!this.state.loading) {
											this.setState({
												loading: true
											})
										};
									}}
									onLoadComplete={(pageCount)=>{
										this.setState({
											loading: false
										})
									}}
									onError={(error)=>{
										console.log(error);
										Toast.show('合同加载出错，请重试')
										this.setState({
											loading: false
										})
									}}
									style={styles.pdf}/>
							</View>
						)
					}
				})()
			}
			{this.state.loading ? this._renderLoadingView() : null}

			{ this._renderUpgrade(this.props) }

		</View>
	}
}

const styles =StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLOR.APP_CONTENT_BACKBG
	},
	container2: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
		padding: 5
	},
	pdf: {
		flex:1,
		width:Dimensions.get('window').width-20,
	}
})

const mapStateToProps = (state) => {
	const { app } = state
	return {
		upgrade: app.get('upgrade'),
		upgradeForce: app.get('upgradeForce'),
    upgradeForceUrl: app.get('upgradeForceUrl'),
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		dispatch,
		_getContractPath: (params,successCallBack)=>{
			startTime = new Date().getTime()
			dispatch(fetchData({
				api: API.GET_CONTRACT_PATH,
				method: 'GET',
				body: params,
				showLoading: true,
				success: (data)=>{
					if (successCallBack) {successCallBack(data)};
					dispatch(appendLogToFile('合同','合同详情',startTime))
				}
			}))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ContractDetail);
