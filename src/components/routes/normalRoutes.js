'use strict';

import React, { Component, PropTypes } from 'react';
import {
	View,
	StyleSheet,
	ListView,
	Image,
	Text,
	TouchableOpacity,
} from 'react-native';
import * as COLOR from '../../constants/colors'
import GoodsCell from './goodsCell'
import LoadMoreFooter from '../common/loadMoreFooter'
import emptyList from '../../../assets/img/order/empty_order_list.png'

class NormalRoutes extends Component{
	constructor(props) {
		super(props);
	}

	static propTypes = {
	  style: View.propTypes.style,
	  itemClick: PropTypes.func,
	  makeOrderClick: PropTypes.func,
	};
	componentDidMount(){

	}

	_renderRow(rowData,SectionId,rowID){
		return <GoodsCell { ...this.props } rowData={rowData} rowID={ rowID }/>
	}

	_renderFooter(){
		const { dataSource } = this.props;
		if (dataSource.get('list').size > 1) {
			if (dataSource.get('hasMore')) {
				return <LoadMoreFooter />
			}else{
				return <LoadMoreFooter isLoadAll={true}/>
			}
		};
	}

	_toEnd(){
		const {loadMoreAction, dataSource} = this.props
		if (loadMoreAction) {
			if (dataSource.get('isLoadingMore')){
				return;
			}else if(dataSource.get('list').size >= dataSource.get('total')) {
				return;
			}
			loadMoreAction()
		};
	}

	render() {
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
		const {type,dataSource,style,pushToManagerList} = this.props
		if (dataSource.get('list').toJS().length > 0 || dataSource.get('isLoadingMore')) {
			return (
				<View style={[styles.container,style]}>
					<ListView
						style={{flex:1}}
						dataSource={ ds.cloneWithRows(dataSource.get('list').toJS() || []) }
						renderRow={this._renderRow.bind(this)}
						onEndReachedThreshold={10}
						enableEmptySections={true}
						onEndReached={ this._toEnd.bind(this) }
						renderFooter={ this._renderFooter.bind(this) }/>
				</View>
			)
		}else{
			return <View style={{flex:1,justifyContent: 'center',alignItems: 'center'}}>
				<Image source={emptyList}/>
			</View>
		}

	}
}
const styles = StyleSheet.create({
	container:{
		flex: 1,
		backgroundColor: COLOR.APP_CONTENT_BACKBG
	},
	biddingIcon:{
		width: 50,
		height: 50,
		position: 'absolute',
		right: 10,
		bottom: 10
	},
	managerView:{
		flexDirection: 'row',
		alignItems:'center',
		paddingRight: 10,
		justifyContent:'space-between',
		height: 40,
		backgroundColor: 'white',
		borderBottomColor: COLOR.LINE_COLOR,
		borderBottomWidth: 1,
		marginTop: 10
	},
	managerText:{
		color: COLOR.TEXT_BLACK,
		flex: 1,
		padding: 10
	}
})

export default NormalRoutes