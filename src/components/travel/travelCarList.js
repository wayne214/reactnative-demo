import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity
} from 'react-native';
import emptyList from '../../../assets/img/order/empty_order_list.png'
import TransCarIcon from '../../../assets/img/travel/transCarIcon.png'
import LoadMoreFooter from '../common/loadMoreFooter';
import rightArrow from '../../../assets/img/arrow/rightarrow.png';



export default class travelCarList extends Component {
    constructor(props) {
        super(props);
    }
    _renderRow(rowData,SectionId,rowID) {
        const {onItemClick} = this.props;
         return (
            <TouchableOpacity onPress={() => {
                onItemClick && onItemClick(rowData.item.carNum)
            }}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white', height: 55, alignItems: 'center', paddingHorizontal: 15}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', }}>
                        <Image style={{height: 31, width: 31}} source={TransCarIcon}/>
                        <Text style={{color: '#333333', fontSize: 16, marginLeft: 15}}>{rowData.item.carNum}</Text>
                    </View>
                    <Image source={rightArrow}/>
                </View>
            </TouchableOpacity>
        )
    }

    _renderItem(rowData,SectionId,rowID) {
        const driverList = rowData.item.driverArray ? rowData.item.driverArray : [];
        let drivers = '';
        if (driverList.length > 0) {
            for (let i = 0; i < driverList.length; i++) {
                if(i < driverList.length - 1) {
                    drivers = drivers.concat(driverList[i] + ',')
                } else {
                    drivers = drivers.concat(driverList[i])
                }
            }
        } else {
            drivers = ''
        }

        return (
            <View style={{backgroundColor: 'white', height: 80, justifyContent: 'center'}}>
                <View style={{ paddingHorizontal: 15}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image style={{height: 31, width: 31}} source={TransCarIcon}/>
                        <Text style={{color: '#333333', fontSize: 16, marginLeft: 15}}>{rowData.item.carNum}</Text>
                    </View>
                </View>
                 <View style={{paddingHorizontal: 61, flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                    <Text style={{color: '#333333', fontSize: 14}}>司机：{drivers}</Text>
                    <Text style={{color: '#333333', fontSize: 14, marginLeft: 20}}>随车电话：{rowData.item.carrierPhone ? rowData.item.carrierPhone : ''}</Text>
                 </View>
            </View>
        )
    }

    // 设置item的key,提高效率
    _keyExtractor = (item, index) => index;

    // 分割线
    separatorComponent() {
        return (
            <View style={{height: 1, backgroundColor: '#f0f2f5',}}/>
        );
    }

    _toEnd() {
        const {loadMoreAction, dataSource} = this.props;
        if (loadMoreAction) {
            if (dataSource.get('isLoadingMore')){
                console.log("------ 正在加载中");
                return;
            }else if(dataSource.get('list').size >= dataSource.get('total')) {
                console.log("------ 已加载全部");
                return;
            }
            loadMoreAction();
        }
    }
    _renderFooter () {
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

    _listEmptyComponent () {
        return (
            <View style={{flex:1,justifyContent: 'center',alignItems: 'center',height: SCREEN_HEIGHT-DANGER_TOP-DANGER_BOTTOM-44-40-49}}>
                <Image source={emptyList}/>
            </View>
        )
    }
    render() {
        const {refreshList, dataSource, carType} = this.props;
        return (
            <FlatList
                style={{flex:1, marginTop: 10}}
                onRefresh={()=>{
                    // 刷新操作
                    refreshList && refreshList()
                }}
                refreshing={dataSource.get('isRefreshing')}
                data={dataSource.get('list').toJS() || []}
                renderItem={carType === 1 ? this._renderRow.bind(this) : this._renderItem.bind(this)}
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