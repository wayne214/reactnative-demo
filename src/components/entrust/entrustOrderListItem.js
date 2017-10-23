
'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	ListView,
	Image,
	RefreshControl
} from 'react-native';
import OrderCell from '../order/orderCell.js'
import {changeEntrustOrderListIsRefreshing } from '../../action/entrust.js'
import emptyList from '../../../assets/img/order/empty_order_list.png'
import LoadMoreFooter from '../common/loadMoreFooter'

export default class EntrustOrderListItem extends Component {
	constructor(props) {
	  super(props);
	}
	_renderRow(rowData,SectionId,rowID){
		// 我的承运中 有2种操作按钮（待确认：“接受派单”  待调度：“调度车辆”）
		const {itemClick,dispatchCar,acceptDesignate} = this.props

		return <OrderCell
			{...this.props}
			itemClick={(data)=>{
				if(itemClick){itemClick(data)}
			}}
			dispatchCar={(data)=>{
				if(dispatchCar){dispatchCar(data)}
			}}
			acceptDesignate={(data)=>{
				if(acceptDesignate){acceptDesignate(data)}
			}}
			rowData={rowData}
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
		};
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
	render(){
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
		const {dataSource,type} = this.props
		if (dataSource.get('list').toJS().length > 0 || dataSource.get('isLoadingMore')) {
			return (
				<ListView
					style={{flex:1}}
					refreshControl={
						<RefreshControl
							refreshing={ dataSource.get('isRefreshing') }
							onRefresh={ ()=>{
								this.props.dispatch(changeEntrustOrderListIsRefreshing(type, true))//刷新货源列表
								this.props.refreshList && this.props.refreshList()
							}}
							tintColor="gray"
							colors={['#ff0000', '#00ff00', '#0000ff']}
							progressBackgroundColor="gray"/>
					}
					dataSource={ ds.cloneWithRows(dataSource.get('list').toJS() || []) }
					renderRow={this._renderRow.bind(this)}
					onEndReachedThreshold={10}
					enableEmptySections={true}
					onEndReached={ this._toEnd.bind(this) }
					renderFooter={ this._renderFooter.bind(this) }/>
			)
		}else{
			return <View style={{flex:1,justifyContent: 'center',alignItems: 'center'}}>
				<Image source={emptyList}/>
			</View>
		}

	}
}
