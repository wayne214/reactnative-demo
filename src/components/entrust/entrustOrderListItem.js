
'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	Image,
	FlatList,
} from 'react-native';
import OrderCell from '../order/orderCell.js'
import {changeEntrustOrderListIsRefreshing } from '../../action/entrust.js'
import emptyList from '../../../assets/img/order/empty_order_list.png'
import LoadMoreFooter from '../common/loadMoreFooter'
import CarrerListItem from './carrerListItem';

export default class EntrustOrderListItem extends Component {
	constructor(props) {
	  super(props);
	}
	_renderRow(rowData,SectionId,rowID){
		// 我的承运中 有2种操作按钮（待确认：“接受派单”  待调度：“调度车辆”）
		const {itemClick,dispatchCar,bindOrder} = this.props
		return <CarrerListItem
			{...this.props}
			itemClick={(data)=>{
				if(itemClick){itemClick(data)}
			}}
			dispatchCar={(data)=>{
				if(dispatchCar){dispatchCar(data)}
			}}
			bindOrder={(data)=>{
				if(bindOrder){bindOrder(data)}
			}}
			rowData={rowData.item}
			rowID={ rowID }/>
	}
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
				console.log("------ 正在加载中");
				return;
			}else if(dataSource.get('list').size >= dataSource.get('total')) {
				console.log("------ 已加载全部");
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

    separatorComponent() {
        return (
					<View style={{height: 10, backgroundColor: '#f0f2f5',}}/>
        );
    };
	_keyExtractor = (item, index) => index
	render(){
		const {dataSource,type} = this.props
		return (
			<FlatList
				style={{flex:1}}
				onRefresh={()=>{
					this.props.dispatch(changeEntrustOrderListIsRefreshing(type, true))//刷新货源列表
					this.props.refreshList && this.props.refreshList()
				}}
				refreshing={dataSource.get('isRefreshing')}
				data={dataSource.get('list').toJS() || []}
				renderItem={this._renderRow.bind(this)}
				keyExtractor={this._keyExtractor}
				extraData={this.state}
				onEndReachedThreshold={100}
				enableEmptySections={true}
				ItemSeparatorComponent={this.separatorComponent}
				onEndReached={ this._toEnd.bind(this) }
				ListFooterComponent={this._renderFooter.bind(this)}
				ListEmptyComponent={this._listEmptyComponent()}/>
		)
	}
}


// <ListView
// 	style={{flex:1}}
// 	refreshControl={
// 		<RefreshControl
// 			refreshing={ dataSource.get('isRefreshing') }
// 			onRefresh={ ()=>{
// 				this.props.dispatch(changeEntrustOrderListIsRefreshing(type, true))//刷新货源列表
// 				this.props.refreshList && this.props.refreshList()
// 			}}
// 			tintColor="gray"
// 			colors={['#ff0000', '#00ff00', '#0000ff']}
// 			progressBackgroundColor="gray"/>
// 	}
// 	dataSource={ ds.cloneWithRows(dataSource.get('list').toJS() || []) }
// 	renderRow={this._renderRow.bind(this)}
// 	onEndReachedThreshold={10}
// 	enableEmptySections={true}
// 	onEndReached={ this._toEnd.bind(this) }
// 	renderFooter={ this._renderFooter.bind(this) }/>