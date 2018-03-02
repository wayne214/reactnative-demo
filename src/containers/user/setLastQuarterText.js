/**
 * 电子签章模板--设置横向文
 * */
import React from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	TextInput,
} from 'react-native';
import styles from '../../../assets/css/eSign';
import NavigatorBar from '../../components/common/navigatorbar';
import BaseComponent from '../../components/common/baseComponent';
import Toast from '../../utils/toast';
import Regex from '../../utils/regex';
import { dispatchRefreshLastQuarterText } from '../../action/eSign';


class setLastQuarterText extends BaseComponent {

	constructor(props) {
		super(props);
		this.state = {
        lastQuarterText: '',
		};
	}

	componentDidMount(){
		super.componentDidMount();
	}

	componentWillUnmount() {
		super.componentWillUnmount();
	}


	render(){
		const { router,eSignInfo, navigation } = this.props;

		return (
			<View style={ styles.container }>
				<NavigatorBar
					title='设置下弦文'
					router={ navigation }
					optTitle='确定'
					hiddenBackIcon={false}
					optTitleStyle={{fontSize: 15, color: '#666666'}}
					firstLevelClick={() => {
              if(!this.state.lastQuarterText && !Regex.test('eSginText', this.state.lastQuarterText)){
                  return Toast.show('请输入正确的下弦文格式')
              } else {
                  this.props.dispatch(dispatchRefreshLastQuarterText(this.state.lastQuarterText));
                  navigation.goBack();
              }
          }}/>
				<View style={styles.titleContainer}>
					<Text style={{color: '#FF8500', fontFamily: 'iconfont', fontSize: 15, marginRight: 5}}>&#xe642;</Text>
					<Text style={styles.colorText}>最高为8位汉字、字母、符号及数字</Text>
				</View>
				<View style={{height: 44, backgroundColor: 'white', paddingLeft: 20}}>
					<TextInput
						textAlign='left'
						placeholder='请输入下弦文内容'
						returnKeyType='done'
						placeholderTextColor='#ccc'
						defaultValue={ eSignInfo && eSignInfo.get('sealQtext')}
						style={ styles.textInput }
						underlineColorAndroid={ 'transparent' }
						value = { this.state.lastQuarterText }
						onChangeText={ text => this.setState({ lastQuarterText: text }) }/>
				</View>
			</View>
			);
	}
}
const mapStateToProps = state => {
	const { app ,eSign} = state;
	return {
	}
}


const mapDispatchToProps = dispatch => {
	return {
		dispatch,
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(setLastQuarterText);
