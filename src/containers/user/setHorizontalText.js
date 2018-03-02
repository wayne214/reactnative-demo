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

class setHorizontalText extends BaseComponent {

	constructor(props) {
		super(props);
		this.state = {
        landscapeText: '',
		};
	}

	static navigationOptions = ({ navigation }) => {
	  return {
	    header: <NavigatorBar
			title='设置横向文'
	    router={ navigation }
			optTitle='确定'
			hiddenBackIcon={false}
			optTitleStyle={{fontSize: 15, color: '#666666'}}
			firstLevelClick={() => {
          if(this.state.landscapeText && !Regex.test('eSginText', this.state.landscapeText)){
              return Toast.show('请输入正确的横向文格式')
          } else {
              navigation.goBack();
					}
      }}/>
	  };
	};

	componentDidMount(){
		super.componentDidMount();
	}

	componentWillUnmount() {
		super.componentWillUnmount();
	}


	render(){
		const { router,eSignInfo } = this.props;

		return (
			<View style={ styles.container }>
				<View style={styles.titleContainer}>
					<Text style={{color: '#FF8500', fontFamily: 'iconfont', fontSize: 15, marginRight: 5}}>&#xe642;</Text>
					<Text style={styles.colorText}>最高为8位汉字、字母、符号及数字</Text>
				</View>
				<View style={{height: 44, backgroundColor: 'white'}}>
					<TextInput
						textAlign='left'
						placeholder='请输入横向文内容'
						returnKeyType='done'
						placeholderTextColor='#ccc'
						defaultValue={ eSignInfo && eSignInfo.get('sealQtext')}
						style={ styles.textInput }
						underlineColorAndroid={ 'transparent' }
						value = { this.state.landscapeText }
						onChangeText={ text => this.setState({ landscapeText: text }) }/>
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

export default connect(mapStateToProps, mapDispatchToProps)(setHorizontalText);
