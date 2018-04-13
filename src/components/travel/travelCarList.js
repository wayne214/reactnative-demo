import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity
} from 'react-native';
import emptyList from '../../../assets/img/order/empty_order_list.png'
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
                onItemClick && onItemClick()
            }}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image style={{height: 31, width: 31, backgroundColor: 'blue'}}/>
                        <Text style={{color: '#333333', fontSize: 16}}>京A123456</Text>
                    </View>
                    <Image source={rightArrow}/>
                </View>
            </TouchableOpacity>
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
        const {refreshList, dataSource} = this.props;
        return (
            <FlatList
                style={{flex:1, marginTop: 10}}
                onRefresh={()=>{
                    // 刷新操作
                    refreshList && refreshList()
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