'use strict'

import React, { Component, PropTypes } from 'react';
import {
	View,
	StyleSheet,
	ListView,
	Text,
	Image,
	RefreshControl
} from 'react-native';
import * as COLOR from '../../constants/colors'
import BiddingCell from '../../components/routes/biddingCell'
import emptyList from '../../../assets/img/order/empty_order_list.png'
import LoadMoreFooter from '../../components/common/loadMoreFooter'
import {changePreOrderListIsRefreshing} from '../../action/preOrder.js'

class BiddingListComponent extends Component{
	constructor(props) {
		super(props);
	}

	static propTypes = {
	  style: View.propTypes.style,
	};
	componentDidMount(){

	}

	_renderRow(rowData,SectionId,rowID){
		return <BiddingCell { ...this.props } rowData={rowData} rowID={ rowID }/>
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
	render() {
		const {dataSource,topComponent} = this.props
		// const topCom = topComponent ? topComponent() : null
		// {topCom}
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
		return (
			<View style={styles.container}>
				{
					dataSource.get('list').toJS() && dataSource.get('list').toJS().length > 0 ?
						<ListView
							style={{flex:1}}
							dataSource={ ds.cloneWithRows(dataSource.get('list').toJS() || []) }
							refreshControl={
							  <RefreshControl
							    refreshing={ dataSource.get('isRefreshing') }
							    onRefresh={ ()=>{
							      this.props.refreshList && this.props.refreshList()
							    }}
							    tintColor="gray"
							    colors={['#ff0000', '#00ff00', '#0000ff']}
							    progressBackgroundColor="gray"/>
							}
							renderRow={this._renderRow.bind(this)}
							onEndReachedThreshold={10}
							enableEmptySections={true}
							onEndReached={ this._toEnd.bind(this) }
							renderFooter={ this._renderFooter.bind(this) }/>
					:
						<View style={{flex:1,justifyContent: 'center',alignItems: 'center'}}>
							<Image source={emptyList}/>
						</View>
				}

			</View>
		)
	}
}
const styles = StyleSheet.create({
	container:{
		flex: 1
	}
})

export default BiddingListComponent