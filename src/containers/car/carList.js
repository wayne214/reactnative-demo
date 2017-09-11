import React from 'react';
import {
	View,
	Text,
	Alert,
	Keyboard,
	ListView,
	TextInput,
	TouchableOpacity,
	DeviceEventEmitter,
	TouchableHighlight,
} from 'react-native';

import { connect } from 'react-redux';
import styless from '../../../assets/css/route';
import styles from '../../../assets/css/carList';
import { QUERY_CAR_LIST } from '../../constants/api';
import { fetchData, refreshTravel } from '../../action/app';
import { dispatchCarsForOrderWork } from '../../action/car';
import { adjustToolBarHeigth, adjustStaBarHeight } from '../../constants/dimen';
import { dispatchDefaultCar } from '../../action/travel';
import BaseComponent from '../../components/common/baseComponent';

class CarListContainer extends BaseComponent {

	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
	  	pageNo: 1,
	  	searchKey: '',
	  	showKey: '',
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
		};
		this._update = this._update.bind(this)
		this._search = this._search.bind(this);
		this.likeSearch = this.likeSearch.bind(this);
		this._showModal = this._showModal.bind(this);
		this._endReached = this._endReached.bind(this);
		this._renderItem = this._renderItem.bind(this);
	}

	static propTypes = {
		router: React.PropTypes.object
	}

  componentWillMount () {
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }

  static navigationOptions = ({ navigation }) => {
    const { state, setParams } = navigation
    if (state.params.showModal) {
    	return {
    		header: <TouchableOpacity
					activeOpacit={ 1 }
					style={ styles.modal }
					onPress={ () => setParams({ showModal: false }) }>
					<View style={ [styles.navContainer, adjustToolBarHeigth] }>
						<View style={ [styles.searchBar, adjustStaBarHeight] }>
							<TextInput
								autoFocus={ true }
								placehold='请输入车牌号'
								returnKeyType='search'
								style={ styles.inputContent }
								onEndEditing={ () => navigation.params._likeSearch }
								defaultValue={ state.params.searchKey }
								underlineColorAndroid={ 'transparent' }
								value = { state.params.searchKey }
								onChangeText={ text => navigation.state.params._update(text) }/>
						</View>
						<TouchableOpacity
							activeOpacity={ 1 }
							onPress={ () => navigation.state.params._search() }
							style={ [styles.textContainer, adjustStaBarHeight] }>
							<Text style={ styles.cancelText }>搜索</Text>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
    	}
    } else {
	    return {
	      header: <View style={ [styles.navContainer, adjustToolBarHeigth] }>
					<TouchableOpacity
						activeOpacity={ 1 }
						onPress={ () => state.params._showModal() }
						style={ [styles.searchBar, adjustStaBarHeight] }>
						<Text style={ styles.iconFont }>&#xe610;</Text>
						<Text style={ styles.placehold }>{ state.params.showKey || '请输入车牌号/司机姓名/手机号' }</Text>
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={ 1 }
						onPress={ () => navigation.dispatch({ type: 'pop' }) }
						style={ [styles.textContainer, adjustStaBarHeight] }>
						<Text style={ styles.cancelText }>返回</Text>
					</TouchableOpacity>
				</View>
	    }    	
    }

  }

	componentDidMount() {
		super.componentDidMount();
		this.props.navigation.setParams({ showKey: '', showModal: false, 
			_showModal: this._showModal, _search: this._search, _update: this._update, _likeSearch: this._likeSearch })
		this._fetch();
	}

	_update (text) {
		this.setState({ searchKey: text })
		this.props.navigation.setParams({ searchKey: text })
	}

  componentWillUnmount () {
  	super.componentWillUnmount();
		this.keyboardDidShowListener.remove();
		this.keyboardDidHideListener.remove();
  }

	_keyboardDidShow() {
		this.setState({ showModal: true });
	}

	_keyboardDidHide() {
		this.setState({ showModal: false });
	}

  componentWillReceiveProps(props) {
    const { carList } = props;
    if (props) {
      this.setState({ dataSource: this.state.dataSource.cloneWithRows(carList.toArray()) });
    }
  }

	_endReached() {
		if (this.props.hasMore && !this.props.isEndReached) {
			this.props.getCarList({
				haveDriver: 1,
				pageNo: this.state.pageNo + 1,
				searchKey: this.state.searchKey,
				carrierId: this.props.user.userId
			});
			this.setState({ pageNo: this.state.pageNo + 1 });
		}
	}

	_fetch() {
		this.setState({ showKey: this.state.searchKey });
		this.props.getCarList({
			pageNo: 1,
			haveDriver: 1,
			searchKey: this.state.searchKey,
			carrierId: this.props.user.userId
		});
	}

	likeSearch() {
		this._fetch();
		this.props.navigation.setParams({ showModal: false })
		this.setState({ pageNo: 1, showModal: false });
	}

	_showModal () {
		this.props.navigation.setParams({ showModal: true })
		this.setState({ showModal: true });
	}

	_search() {
		this.props.getCarList({
			pageNo: 1,
			haveDriver: 1,
			searchKey: this.state.searchKey,
			carrierId: this.props.user.userId
		});		
		this.setState({ showKey: this.state.searchKey });
		this.setState({ showModal: false, pageNo: 1 });		
		this.props.navigation.setParams({ showModal: false, showKey: this.state.searchKey })
	}

	_selectCar(id, type, carNo) {
		Alert.alert('提示', `确认选择${ carNo }车辆吗`, [
			{ text: '确定', onPress: () => {
				// console.log({ id, carState: type });
				this.props.dispatch(dispatchDefaultCar({ id, carState: type, carNo: carNo }));				
				this.props.dispatch(refreshTravel());
				this.props.navigation.dispatch({ type: 'pop' })
			} },
			{ text: '取消', onPress: () => console.log('') }
		]);
	}

  _renderItem(rowData, section, row) {
  	const textColor = rowData.get('carState') === 0 ? { color: '#ffd1ae' } : { color: '#3fbb55' };
		return (
			<TouchableHighlight
				key={ section + row }
				underlayColor='#e6eaf2'
				style={ styless.statusContainer }
				onPress={ this._selectCar.bind(this, rowData.get('id'), rowData.get('carState'), rowData.get('carNo')) }>
				<View style={ styless.statusContainer }>
					<View style={ styles.itemCell }>
						<Text style={ styless.contentTexts }>{ rowData.get('carNo') }</Text>
					</View>
					<View style={ styles.itemCell }>
						<Text style={ styless.contentTexts }>{ rowData.get('driverName') }</Text>
					</View>
					<View style={ [styles.itemCellPhone] }>
						<Text style={ styless.contentTexts }>{ rowData.get('driverPhone') }</Text>
					</View>
					<View style={ styles.itemCell }>
						<Text style={ [styless.contentTexts, textColor] }>{ rowData.get('carState') === 0 ? '休息中' : '运输中' }</Text>
					</View>
				</View>
			</TouchableHighlight>
		);
  }

	render () {
		return (
			<View style={ styles.container }>

				<View style={ styles.titleText }>
					<View style={ styles.itemCell }>
						<Text style={ styles.cellText }>车牌号</Text>
					</View>
					<View style={ styles.itemCell }>
						<Text style={ styles.cellText }>司机</Text>
					</View>
					<View style={ styles.itemCellPhone }>
						<Text style={ styles.cellText }>电话</Text>
					</View>
					<View style={ styles.itemCell }>
						<Text style={ styles.cellText }>状态</Text>
					</View>
				</View>

				<View style={ styles.line }></View>

				<ListView
					style={ styles.listView }
					enableEmptySections={ true }
					onEndReachedThreshold={ 100 }
					renderRow={ this._renderItem }
					onEndReached={ this._endReached }
					dataSource={ this.state.dataSource }/>

			</View>
		);
	}

}

const mapStateToProps = state => {
	const { app, car } = state;
	return {
		user: app.get('user'),
		hasMore: car.get('hasMore'),
		isEndReached: car.get('isEndReached'),
		carList: car.getIn(['car', 'selectCarForOrderWorkList'])
	};
}

const mapDispatchToProps = dispatch => {
	return {
		dispatch,
		getCarList: (body) => {
			dispatch(fetchData({
				body,
				method: 'POST',
				api: QUERY_CAR_LIST,
				success: (data) => {
					dispatch(dispatchCarsForOrderWork({ data, pageNo: body.pageNo }));
				}
			}));
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(CarListContainer);
