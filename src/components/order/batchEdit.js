'use strict'

import React, { Component, PropTypes } from 'react';
import {
	View,
	StyleSheet,
	Text,
	Dimensions,
	TouchableOpacity
} from 'react-native';
import Button from 'apsl-react-native-button'
const { height,width } = Dimensions.get('window');
import * as COLOR from '../../constants/colors'

class BatchEdit extends Component{
	constructor(props) {
		super(props);
		this.state = {
			batchEditing: false,
			allSelected: false
		}
	}

	static propTypes = {
	  style: View.propTypes.style,
	};
	componentDidMount(){

	}

	render() {
		const {isAllselected,batchEditing} = this.props
		// const {batchEditing} = this.state
		if (batchEditing) {
			return(
				<View style={{height: 44,width,backgroundColor: 'white',bottom: 0,flexDirection: 'row',justifyContent: 'space-between',paddingLeft: 15,paddingRight: 15}}>
					<View style={{justifyContent: 'center',width: 90}}>
						<TouchableOpacity activeOpacity={0.8} onPress={()=>{
							this.props.selectAll(!isAllselected)

							// this.props._setAllUnPaySelected(!orderUnPay.get('allSelected'))
						}}>
							<View style={{flexDirection: 'row'}}>
								{
									isAllselected ?
										<Text style={{fontFamily: 'iconfont',color: COLOR.APP_THEME}}>&#xe621;</Text>
									: <Text style={{fontFamily: 'iconfont',color: COLOR.TEXT_NORMAL}}>&#xe620;</Text>
								}
								<Text style={{color: COLOR.TEXT_NORMAL}}> 全选</Text>
							</View>
						</TouchableOpacity>
					</View>
					<View>
						<Button activeOpacity={0.8} style={{marginTop:6, marginRight: 0,borderWidth: 0,borderRadius: 2,width:90,height: 31}}
							textStyle={{fontSize: 14,color: COLOR.TEXT_NORMAL}}
							onPress={()=>{
								this.setState({
									batchEditing: false,
									allSelected: false
								})
								this.props.startEditing(false)
							}}>
							取消
						</Button>
					</View>
					<View>
						<Button activeOpacity={0.8} style={{marginTop:6, marginRight: 0,borderWidth: 0,borderRadius: 2,width:90,height: 31}}
							textStyle={{fontSize: 14,color: COLOR.APP_THEME}}
							onPress={()=>{
								this.props.batchApply()
							}}>
							催款
						</Button>
					</View>
				</View>
			)
		}else{
			return(
				<View style={{height: 44,width,backgroundColor: 'white',bottom: 0,flexDirection: 'row',justifyContent: 'space-between',paddingLeft: 15,paddingRight: 15}}>
					<Button activeOpacity={0.8} style={{flex:1, marginTop:6, marginRight: 0,borderWidth: 0,borderRadius: 2,height: 31}}
						textStyle={{fontSize: 14,color: COLOR.APP_THEME}}
						onPress={()=>{
							this.setState({
								batchEditing: true,
							})
							this.props.startEditing(true)
						}}>
						批量催款
					</Button>
				</View>
			)
		}
	}
}
const styles = StyleSheet.create({
	container:{
		flex: 1
	}
})

export default BatchEdit