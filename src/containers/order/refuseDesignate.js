'use strict'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	TextInput
} from 'react-native';
import NavigatorBar from '../../components/common/navigatorbar'
import * as COLOR from '../../constants/colors'
import Button from 'apsl-react-native-button'
import * as RouteType from '../../constants/routeType'

class RefuseDesignate extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
	  	reasons: [
	  		{id:1,content:'原因1原因1原因1原因1原因1'},
	  		{id:2,content:'原因2'},
	  		{id:3,content:'原因3'},
	  	],
	  	selectedIndex: -1,
	  	otherReasonContent: ''
	  }
	}
	componentDidMount() {

	}
	render() {
		const {reasons,selectedIndex,otherReasonContent} = this.state
		const reasonsComponent = reasons.map((item,index)=>{
			return (
				<TouchableOpacity key={index} activeOpacity={0.8} onPress={()=>{
					if (selectedIndex == index) {
						this.setState({
							selectedIndex: -1
						})
					}else{
						this.setState({
							selectedIndex: index,
						})
					}
				}}>
					<View style={styles.reasonView}>
						<Text style={styles.leftText}>{item.content}</Text>
						{
							(()=>{
								if (selectedIndex == index) {
									return (
										<Text style={{fontFamily: 'iconfont',color: COLOR.APP_THEME}}>&#xe621;</Text>
									)
								}else{
									return (
										<Text style={{fontFamily: 'iconfont',color: COLOR.APP_THEME}}>&#xe620;</Text>
									)
								}
							})()
						}
					</View>
				</TouchableOpacity>
			)
		})

		return <View style={styles.container}>
			<NavigatorBar router={this.props.router} title={ '拒绝派单理由' }/>
			<View style={{height: 10}}></View>
			{reasonsComponent}
			<View style={{flexDirection: 'row',height: 90,backgroundColor: 'white',borderBottomWidth:1,borderBottomColor: COLOR.LINE_COLOR}}>
				<View style={{marginTop: 15,marginLeft: 10}}>
					<Text style={{color: COLOR.TEXT_NORMAL,fontSize: 15}}>其他理由</Text>
				</View>
				<View style={{flex: 1}}>
					<TextInput
						underlineColorAndroid="transparent"
						multiline={true}
						autoFocus={false}
						maxLength={50}
						placeholder={'50字以内'}
						placeholderTextColor={COLOR.TEXT_LIGHT}
						style={{flex:1,fontSize: 15,lineHeight: 30,marginLeft: 10,marginTop: 10}}
						onChangeText={(text) => {
							this.setState({otherReasonContent:text})
						}}
						value={otherReasonContent}
		      />
				</View>
			</View>
			<View style={{flex: 1,alignItems: 'center',paddingTop: 20}}>
				<View style={{width: 295,height: 44}}>
					<Button activeOpacity={0.8}
						isDisabled={(selectedIndex < 0 && otherReasonContent.length < 1)}
						disabledStyle={{backgroundColor: 'lightgray'}}
						style={styles.confirmButton}
						textStyle={{fontSize: 15,color: 'white'}}
						onPress={()=>{
							console.log("------ 确认");
						}}>
					  确认
					</Button>
				</View>
			</View>
		</View>
	}
}

const styles =StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLOR.APP_CONTENT_BACKBG
	},
	reasonView: {
		height: 50,
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: COLOR.LINE_COLOR,
		backgroundColor: 'white',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 10
	},
	confirmButton: {
		borderWidth: 0,
		backgroundColor: COLOR.APP_THEME,
		borderRadius: 2,
		width: 295,
		height: 44
	},
	leftText: {
		fontSize: 15,
		color: COLOR.TEXT_NORMAL
	}
})

const mapStateToProps = (state) => {
	return {}
}

const mapDispatchToProps = (dispatch) => {
	return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(RefuseDesignate);

