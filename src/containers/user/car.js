import React from 'react';
import { connect } from 'react-redux';
import {
	View,
	Image,
	Text,
	TouchableOpacity,
	ListView,
	TouchableHighlight,
	Alert,
	Platform
} from 'react-native';
import styles from '../../../assets/css/car';
import NavigatorBar from '../../components/common/navigatorbar';
import UserIcon from '../../../assets/img/user/user_icon.png';
import * as RouteType from '../../constants/routeType';
import { QUERY_CAR_LIST,DELETE_CAR } from '../../constants/api';
import { fetchData,clearImageSource } from '../../action/app';
import { dispatchSelectCars,dispatchRefreshCar } from '../../action/car';
import HelperUtil from '../../utils/helper';
import Toast from '../../utils/toast';
import BaseComponent from '../../components/common/baseComponent';

class CarContainer extends BaseComponent {

	constructor(props) {
		super(props);
		// this.title = props.router.getCurrentRouteTitle()
		this.state = {
	  	pageNo: 1,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
		};
		this._endReached = this._endReached.bind(this);
		this._renderItem = this._renderItem.bind(this); 
		this._jumpToAddCar = this._jumpToAddCar.bind(this);
		this._jumpToBindDriver = this._jumpToBindDriver.bind(this);
	}

	componentDidMount() {
		super.componentDidMount();
		this.props.navigation.setParams({ navigatePress: this._jumpToAddCar,navigatePressTwo:this._jumpToBindDriver})  
		this.props.getCars({
			pageNo: this.state.pageNo,
			carrierId:this.props.user.userId
		});
	}

	componentWillUnmount() {
		super.componentWillUnmount();
	}

  componentWillReceiveProps(props) {
    const { cars,isRefreshCar } = props;
    if (props) {
    	if(isRefreshCar){
    		this.setState({
    			pageNo: 1,
    		});
    		this.props.getCars({
					pageNo: 1,
					carrierId: this.props.user.userId
				});
    	}else{
    		this.setState({ dataSource: this.state.dataSource.cloneWithRows(cars.toArray()) });
    	}
    }
  }	

	_endReached() {
		if (this.props.hasMore && !this.props.isEndReached) {
			this.props.getCars({
				pageNo: this.state.pageNo + 1,
				carrierId: this.props.user.userId
			});
			this.setState({ pageNo: this.state.pageNo + 1 });
		}
	}	

	_jumpToAddCar(){
		const { user } = this.props;
		// if(user.certificationStatus !== 3){
			this.props.navigation.dispatch({type:RouteType.ROUTE_ADD_CAR,params:{title:'新增车辆'}});
			this.props.dispatch(clearImageSource());
		// }else{
		// 	Toast.show('您的认证被驳回！');
		// }
		
	}
	_jumpToBindDriver(){
		this.props.navigation.dispatch({type:RouteType.ROUTE_CAR_BIND_DRIVER,params:{title:'车辆绑定司机'}})
	}

	static navigationOptions = ({ navigation }) => {
		const {state, setParams} = navigation;
	  return {
	    header: <NavigatorBar 
	    firstLevelIconFont='&#xe7bf;'
			secondLevelIconFont='&#xe62f;'
			secondLevelIconFontStyle={{ fontSize: 24, marginTop: 4 }}
			secondLevelClick={ () => navigation.state.params.navigatePressTwo() }
			firstLevelClick={ () => navigation.state.params.navigatePress() }
	    router={ navigation }/>
	  };
	};

	render () {
		const { router } = this.props;
		return (
			<View style={ styles.container }>
				<ListView
					style={ styles.listView }
					renderRow={ this._renderItem }
					enableEmptySections={ true }
					onEndReachedThreshold={ 100 }
					onEndReached={ this._endReached }
					dataSource={ this.state.dataSource }/>

			</View>
		);
	}

	_renderItem(rowData, section, row) {
		let showInfo = null;

		let showNameAndPhone = false;
		let showBtn = 0;//0:不显示删除和编辑，1：显示删除和编辑；2显示删除;3:显示编辑
		let editGCar = false ;//TRUE:对挂车编辑

		// console.log('lqq---item---driverId-',rowData.get('driverId'),'--certificationStatus--',rowData.get('certificationStatus'),'--carState-',rowData.get('carState'));
		//certificationStatus: 认证状态 0:未认证(默认) 1:认证中 2：已认证 3：认证未通过 ,
		//carState: 车辆状态 0=空闲 1=使用中 ,
		//carType: 车辆类型 1=厢式货车 2=集装箱挂车 3=集装箱车 4=箱式挂车 ,
		if(rowData.get('driverId')){
			showNameAndPhone = true;
		}else{
			showNameAndPhone = false;
		}
		if(rowData.get('certificationStatus') === 0
									|| rowData.get('certificationStatus') === 3){
			showBtn = 1;
			
		}else if(rowData.get('certificationStatus') === 2 
									&& rowData.get('carState') === 0){
			if(rowData.get('carType') === 2 || rowData.get('carType') === 4 ){
				editGCar = true;
				showBtn = 1;
			}else{
				editGCar = false;
				showBtn = 2;
			}	
			
		}else{
			showBtn = 0;
		}
		if(showNameAndPhone || showBtn !== 0){
			if(showNameAndPhone && showBtn === 1){
				showInfo = (
								<View style={{flex: 1, height: 50}}>
									<View style={ styles.line }></View>
									<View style={ styles.operation }>
										<View style={ styles.optText }>
											<Text style={ [styles.iconFont, { marginLeft: 15 }] }>&#xe618;</Text>
											<Text numberOfLines ={1} style={ [styles.firstLevelLeftText, { marginLeft: 5 }] }>{ rowData.get('driverName') }</Text>
											<Text numberOfLines ={1} style={ [styles.firstLevelText, { marginLeft: 5 }] }>{ rowData.get('driverPhone') }</Text>
										</View>
										<View style={ styles.optBtn }>
											<TouchableOpacity
												activeOpacity={ 1 }
												style={ styles.optView }
												onPress={ this._deleteCar.bind(this,rowData.get('carId')) }>
												<Text style={ [styles.iconFont, { marginRight: 5 }] }>&#xe61c;</Text>
												<Text style={ styles.secondLevelText }>删除</Text>
											</TouchableOpacity>
											<TouchableOpacity
												activeOpacity={ 1 }
												style={ styles.optView }
												onPress={ this._editCar.bind(this,rowData.get('carId'),editGCar) }>
												<Text style={ [styles.iconFont, { marginRight: 5 }] }>&#xe617;</Text>
												<Text style={ styles.secondLevelText }>编辑</Text>
											</TouchableOpacity>
										</View>
									</View>
								</View>);
			}else if(showNameAndPhone && showBtn === 2){
				showInfo = (
								<View style={{flex: 1, height: 50}}>
									<View style={ styles.line }></View>
									<View style={ styles.operation }>
										<View style={ styles.optText }>
											<Text style={ [styles.iconFont, { marginLeft: 15 }] }>&#xe618;</Text>
											<Text numberOfLines ={1} style={ [styles.firstLevelLeftText, { marginLeft: 5 }] }>{ rowData.get('driverName') }</Text>
											<Text numberOfLines ={1} style={ [styles.firstLevelText, { marginLeft: 5 }] }>{ rowData.get('driverPhone') }</Text>
										</View>
										<View style={ styles.optBtn }>
											<TouchableOpacity
												activeOpacity={ 1 }
												style={ styles.optView }
												onPress={ this._deleteCar.bind(this,rowData.get('carId')) }>
												<Text style={ [styles.iconFont, { marginRight: 5 }] }>&#xe61c;</Text>
												<Text style={ styles.secondLevelText }>删除</Text>
											</TouchableOpacity>
										</View>	
									</View>
								</View>);
			}else if(!showNameAndPhone && showBtn === 1){
				showInfo = (
								<View style={{flex: 1, height: 50}}>
									<View style={ styles.line }></View>
									<View style={ styles.operation }>
										<View style={ styles.optBtn }>
											<TouchableOpacity
												activeOpacity={ 1 }
												style={ styles.optView }
												onPress={ this._deleteCar.bind(this,rowData.get('carId')) }>
												<Text style={ [styles.iconFont, { marginRight: 5 }] }>&#xe61c;</Text>
												<Text style={ styles.secondLevelText }>删除</Text>
											</TouchableOpacity>
											<TouchableOpacity
												activeOpacity={ 1 }
												style={ styles.optView }
												onPress={ this._editCar.bind(this,rowData.get('carId'),editGCar) }>
												<Text style={ [styles.iconFont, { marginRight: 5 }] }>&#xe617;</Text>
												<Text style={ styles.secondLevelText }>编辑</Text>
											</TouchableOpacity>
										</View>
									</View>
								</View>);
			}else if(!showNameAndPhone && showBtn === 2){
				showInfo = (
								<View style={{flex: 1, height: 50}}>
									<View style={ styles.line }></View>
									<View style={ styles.operation }>
										<View style={ styles.optBtn }>
											<TouchableOpacity
												activeOpacity={ 1 }
												style={ styles.optView }
												onPress={ this._deleteCar.bind(this,rowData.get('carId')) }>
												<Text style={ [styles.iconFont, { marginRight: 5 }] }>&#xe61c;</Text>
												<Text style={ styles.secondLevelText }>删除</Text>
											</TouchableOpacity>
										</View>	
									</View>
								</View>);
			}
			
		}else{
			showInfo = null;
		}
		
		return (
			<TouchableHighlight
				underlayColor='#e6eaf2'
				key={ section + row }
				style={ [styles.statusContainer,{marginBottom: 10}] }>
				<View style={ styles.cell }>
					<TouchableOpacity
						activeOpacity={ 1 }
						onPress={ this._goCarDetail.bind(this,rowData.get('carId')) }>
						<View style={ styles.info }>
							<Image style={ styles.image } source={ UserIcon }/>
							<View style={ styles.rightContent }>
								<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 17 }}>
									<Text style={ [styles.firstLevelText] }>{ rowData.get('carNo') }</Text>
									
										{(()=>{
											if(rowData.get('certificationStatus') === 2){												
												return (<View style={ styles.carStatus }><Text style={ styles.unpass }>{ HelperUtil.getCarStatus(rowData.get('carState')) }</Text></View>);
											}else{
												return (<View style={ styles.carStatus }><Text style={ styles.unpass }>{ HelperUtil.getCarCertificationStatus(rowData.get('certificationStatus'))}</Text></View>);
											}
										})()}
									
								</View>
								<View style={ styles.centerContent  }>
									<Text style={ [styles.secondLevelText, { marginTop: 11 }] }>车辆类型：</Text>
									<Text style={ [styles.secondLevelText, { marginTop: 11 }] }>{ HelperUtil.getCarType(rowData.get('carType')) }</Text>
									<Text style={ [styles.secondLevelText, { marginTop: 11, marginLeft: 10 }] }>车辆类别：</Text>
									<Text style={ [styles.secondLevelText, { marginTop: 11 }] }>{ HelperUtil.getCarCategory(rowData.get('carCategory')) }</Text>								
								</View>
							</View>
						</View>
					</TouchableOpacity>
					{
						showInfo							
					}
					

				</View>
			</TouchableHighlight>
		);
  }	


  _editCar(carId,isGCar){
  	//isGCar: 已认证、运输中的挂车=true,其余的都是FALSE
  	// console.log('_editCar--isGCar--',isGCar);
  	this.props.navigation.dispatch({type:RouteType.ROUTE_EDIT_CAR,params:{title:'编辑车辆',carId,isGCar}});
  	this.props.dispatch(clearImageSource());
  }

  _goCarDetail(carId){
  	this.props.navigation.dispatch({type:RouteType.ROUTE_CAR_DETAIL,params:{title:'车辆详情',carId}});
  }

  _deleteCar(carId){
  	Alert.alert(
	      '提示',
	      '确定要删除吗',
	      [
	        { text: '删除', onPress: () => {
	        	this.props.deleteCar({
		  				carId: carId,	        		
	        	});
	        } },
	        { text: '取消', onPress: () => console.log('cancel') },
	      ]
	    );
  }
}

const mapStateToProps = state => {
	const { app, car } = state;
	return {
		user: app.get('user'),
		hasMore: car.get('hasMore'),
		isEndReached: car.get('isEndReached'),		
		cars: car.getIn(['car', 'selectCarList']),
		isRefreshCar: car.get('isRefreshCar'),
	}
}

const mapDispatchToProps = dispatch => {
	return {
		dispatch,
		getCars: (body) => {
			dispatch(fetchData({
				body,
				method: 'POST',
				api: QUERY_CAR_LIST,
				success: (data) => {
					dispatch(dispatchSelectCars({ data, pageNo: body.pageNo }));
					// console.log('lqq--',data);
				}
			}));
		},
		deleteCar: (body) => {
			dispatch(fetchData({
				body,
				method: 'POST',
				successToast: true,
				showLoading: true,
				msg: '删除成功',
				api: DELETE_CAR,
				success: (data) => {
					// console.log('lqq--',data);
					dispatch(dispatchRefreshCar());

				}
			}));
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(CarContainer);