import React from 'react'
import {
	View,
	Text,
	Keyboard,
	TextInput
} from 'react-native'
import * as COLOR from '../../constants/colors.js'

class SearchInput extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			inputValue: ''
		}
	}
	// componentDidMount(){
	// 	this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
 //    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
	// }
	// componentWillUnmount () {
 //    this.keyboardDidShowListener.remove();
 //    this.keyboardDidHideListener.remove();
 //  }

 //  _keyboardDidShow () {

	// }

	// _keyboardDidHide () {

	// }
	render(){
		const {inputValue} = this.state
		const {searchAction} = this.props
		return (
			<View style={{height: 44,backgroundColor: 'white',padding: 10}}>
				<View style={{backgroundColor: COLOR.APP_CONTENT_BACKBG,flex: 1,flexDirection: 'row', justifyContent: 'center',alignItems: 'center', paddingLeft: 10,borderRadius: 5}}>
					<Text style={{fontFamily: 'iconfont'}}>&#xe610;</Text>
					<TextInput
						placeholder='请输入车辆号或司机姓名或手机号'
						returnKeyType='search'
						style={{flex: 1,marginLeft: 5,marginRight: 5,padding: 0}}
						onEndEditing={ () => {
							console.log(" ==== 输入结束");
							searchAction && searchAction(inputValue && inputValue.trim() || '')//首尾去空
						}}
						defaultValue={ '' }
						underlineColorAndroid={ 'transparent' }
						value = { inputValue }
						onChangeText={ text => {
							this.setState({
								inputValue: text
							})
						} }/>
						{
							inputValue && inputValue.trim().length > 0 ?
								<Text onPress={()=>{
									this.setState({
										inputValue: ''
									})
								}} style={{fontFamily: 'iconfont',fontSize: 16, padding: 5}}>&#xe634;</Text>
							: null
						}
				</View>
			</View>
		)
	}

}

export default SearchInput

