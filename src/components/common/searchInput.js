import React from 'react'
import {
	View,
	Text,
	Keyboard,
	TextInput,
	TouchableOpacity
} from 'react-native'
import * as COLOR from '../../constants/colors.js'

class SearchInput extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			inputValue: ''
		}
	}
	componentDidMount(){
		// this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
	}
	componentWillUnmount () {
    // this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

 //  _keyboardDidShow () {

	// }

	_keyboardDidHide () {
		this.textInput.blur()
	}
	render(){
		const {inputValue} = this.state
		const {searchAction} = this.props
		return (
			<View style={{height: 44,backgroundColor: 'white',padding: 10}}>
				<View style={{backgroundColor: COLOR.APP_CONTENT_BACKBG,flex: 1,flexDirection: 'row', justifyContent: 'center',alignItems: 'center', paddingLeft: 10,borderRadius: 5}}>
					<Text style={{fontFamily: 'iconfont'}}>&#xe610;</Text>
					<TextInput
						ref={(ref)=>{
							this.textInput = ref
						}}
						placeholder='请输入车辆号或司机姓名或手机号'
						style={{flex: 1,marginLeft: 5,marginRight: 5,padding: 0}}
						onEndEditing={ () => {
							console.log(" ==== 输入结束");
							searchAction && searchAction(inputValue && inputValue.trim() || '')//首尾去空
						}}
						defaultValue={ '' }
						underlineColorAndroid={ 'transparent' }
						value = { inputValue }
						returnKeyType={'search'}
						returnKeyLabel={'搜索'}
						onChangeText={ text => {
							this.setState({
								inputValue: text
							})
						} }/>
					<View opacity={inputValue.trim().length>0? 1: 0} >
            <TouchableOpacity
              opacityActive={ 1 }
              onPress={ () => {
                this.setState({ inputValue: ''})
              } } >
            	<Text style={{color: '#cccccc', fontFamily: 'iconfont', alignItems: 'center',marginRight: 10 }}>&#xe634;</Text>
            </TouchableOpacity>
          </View>

				</View>
			</View>
		)
	}

}
export default SearchInput

