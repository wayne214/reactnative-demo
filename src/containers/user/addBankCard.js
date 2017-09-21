import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	Platform
} from 'react-native';
import styles from '../../../assets/css/car';
import NavigatorBar from '../../components/common/navigatorbar';
import BaseComponent from '../../components/common/baseComponent';
import Button from '../../components/common/button';
import Link from '../../utils/linking';
import { HOST } from '../../constants/setting';
import * as ActionType from '../../constants/actionType';
import { fetchData } from '../../action/app';
import Toast from '../../utils/toast';
import Regex from '../../utils/regex';
import { ADD_BANK_CARD_INFO,EDIT_BANK_CARD_INFO,QUERY_BANK_CARD_BY_ID } from '../../constants/api';
import { dispatchBankCardById,dispatchRefreshBankCard } from '../../action/bankCard';


class AddBankCardContainer extends BaseComponent{

	constructor(props) {
		super(props);
		this.state = {

			bankName:'',
			accountName:'',
			accountNo: '',
			isLoad: true,
		};
	  // this.title = props.router.getCurrentRouteTitle();
	  this._judgeStyle = this._judgeStyle.bind(this);
	  this.id = props.navigation.state.params.id;

	}

	componentDidMount() {
		super.componentDidMount();
    console.log('lqq----componentDidMount---');
		if(this.id && this.id !== -1){
			this.props.getBankCardById({
				carrierId: this.props.user.userId,
				id: this.id,
			});
		}else if(this.id && this.id === -1){
			this.setState({
      	isLoad: false,
      })
		}
		if(this.props.user.certificationStatus*1 === 2){
			this.setState({
				accountName: this.props.user.corporation
			});
		}
	}

	componentWillUnmount() {
		super.componentWillUnmount();
	}

	componentWillReceiveProps(props) {
    const { bankCardDetail } = props;
    if (bankCardDetail && this.state.isLoad) {
    	console.log('lqq----componentWillReceiveProps---');
      this.setState({
      	isLoad: false,
      	bankName: bankCardDetail.bankName,
      	accountName: bankCardDetail.accountName,
      	accountNo: bankCardDetail.accountNumber
      })
    }
  }
	_judgeStyle(){
		if (!this.state.bankName) return Toast.show('请输入开户行名称');
		if (!this.state.accountName) return Toast.show('请输入账户名称');
		if (!this.state.accountNo) return Toast.show('请输入开户行账号');

		if(this.id && this.id !== -1){
			this.props.editBankCardInfo({ 
				id: this.id,
				carrierId: this.props.user.userId,
			  bankName:  this.state.bankName,
			  accountName: this.state.accountName,
			  accountNumber: this.state.accountNo,
			}, this.props.navigation);
		}else{
			this.props.saveBankCardInfo({ 
					carrierId: this.props.user.userId,
				  bankName:  this.state.bankName,
				  accountName: this.state.accountName,
				  accountNumber: this.state.accountNo,
			}, this.props.navigation);
		}
	}

	static navigationOptions = ({ navigation }) => {
	  return {
	    header: <NavigatorBar  
	    router={ navigation }/>
	  };
	};

	render () {
		
		return (
			<View style={ styles.container }>
				<View>
					
					<View style = { [ styles.hiddenCellContainer, { backgroundColor: 'white' } ] }>
						<View style={ styles.hiddenLeft }>
							<Text style={ styles.hiddenText }>开户行名称</Text>
						</View>
						<View style={ styles.hiddenRight }>
							<TextInput 
								textAlign = 'right'
								placeholder ='请输入开户行名称'
								style = { [styles.textInput, {marginRight : 10}] }
								underlineColorAndroid={ 'transparent' }
								value={this.state.bankName}
								onChangeText={ (text) => this.setState({ bankName: text }) }/>
						</View>
					</View>
					<View style={ [ styles.hiddenCellContainer, { backgroundColor: 'white' } ] }>
						<View style={ styles.hiddenLeft }>
							<Text style={ styles.hiddenText }>账户名称</Text>
						</View>
						<View style={ styles.hiddenRight }>
							<TextInput 
								textAlign = 'right'
								placeholder='请输入账户名称'
								style = { [styles.textInput, {marginRight : 10}] }
								underlineColorAndroid={ 'transparent' }
								value={this.state.accountName}
								onChangeText={ (text) => this.setState({ accountName: text }) }/>
						</View>
					</View>
					<View style={ [ styles.hiddenCellContainer, { backgroundColor: 'white' } ] }>
						<View style={ styles.hiddenLeft }>
							<Text style={ styles.hiddenText }>开户行账号</Text>
						</View>
						<View style={ styles.hiddenRight }>
							<TextInput 
								textAlign = 'right'
								placeholder='请输入开户行账号'
								keyboardType= 'numeric'
								style = { [styles.textInput, {marginRight : 10}] }
								underlineColorAndroid={ 'transparent' }
								value={this.state.accountNo}
								onChangeText={ (text) => this.setState({ accountNo: text }) }/>
						</View>
					</View>
					<View style={ styles.loginBtn }>
						<Button
							title='提交'
							style={ styles.btn }
							textStyle={ styles.btnText }
							onPress={ this._judgeStyle }/>
					</View>
				</View>
				{ this.props.loading ? this._renderLoadingView() : null }
				{ this._renderUpgrade(this.props.upgrade) }

			</View>
		);
	}
}
const mapStateToProps = state => {
	const { app ,bankCard} = state;
	return {
		user: app.get('user'),
		loading: app.get('loading'),
		upgrade: app.get('upgrade'),
		bankCardDetail: bankCard.getIn(['bankCard', 'bankCardDetail']),
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getBankCardById: (body) => {
			dispatch(fetchData({
				body,
				method: 'POST',
				api: QUERY_BANK_CARD_BY_ID,
				success: (data) => {
					dispatch(dispatchBankCardById({data}));
				},
			}));
		},
		saveBankCardInfo: (body, navigation) => {
			dispatch(fetchData({
				body,
				method: 'POST',
				api: ADD_BANK_CARD_INFO,
				msg: '添加银行卡信息成功',
				successToast: true,
				showLoading: true,
				success: () => {
					dispatch(dispatchRefreshBankCard());
					navigation.dispatch({type:'pop'});
				},
			}));
		},
		editBankCardInfo: (body, navigation) => {
			dispatch(fetchData({
				body,
				method: 'POST',
				api: EDIT_BANK_CARD_INFO,
				msg: '编辑银行卡信息成功',
				successToast: true,
				showLoading: true,
				success: () => {
					dispatch(dispatchRefreshBankCard());
					navigation.dispatch({type:'pop'});
				},
			}));
		}
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(AddBankCardContainer);



