'use strict';

import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	FlatList,
	Image,
	Text,
	TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import * as COLOR from '../../constants/colors'
import GoodsCell from './goodsCell'
import LoadMoreFooter from '../common/loadMoreFooter'
import emptyList from '../../../assets/img/order/empty_order_list.png'
import {changeGoodsListIsRefreshing} from '../../action/goods.js'

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
		return <GoodsCell { ...this.props } rowData={rowData.item} rowID={ rowID }/>
	}
	_keyExtractor = (item, index) => item.resourceId

	_renderFooter(){
		const { dataSource } = this.props;
		if (dataSource.get('list').size > 1) {
			if (dataSource.get('hasMore')) {
				return <LoadMoreFooter />
			}else{
				return <LoadMoreFooter isLoadAll={true}/>
			}
		}else{
			return null
		}
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
	_listEmptyComponent(){
		return (
			<View style={{flex:1,justifyContent: 'center',alignItems: 'center',height: SCREEN_HEIGHT-DANGER_TOP-DANGER_BOTTOM-44-40-49}}>
				<Image source={emptyList}/>
			</View>
		)
	}
	render() {
		const {type,dataSource,style,pushToManagerList} = this.props
		return (
			<View style={[styles.container,style]}>
				<FlatList
					style={{flex:1}}
					onRefresh={()=>{
						this.props.dispatch(changeGoodsListIsRefreshing(type, true))//刷新货源列表
						this.props.refreshList && this.props.refreshList(1, true)
					}}
					refreshing={dataSource.get('isRefreshing')}
					data={dataSource.get('list').toJS() || []}
					renderItem={this._renderRow.bind(this)}
					keyExtractor={this._keyExtractor}
					extraData={this.state}
					onEndReachedThreshold={0.1}
					enableEmptySections={true}
					onEndReached={ this._toEnd.bind(this) }
					ListFooterComponent={this._renderFooter.bind(this)}
					ListEmptyComponent={this._listEmptyComponent()}/>
			</View>
		)
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