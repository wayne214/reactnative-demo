import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    FlatList,
    Dimensions,
    TouchableOpacity,
    Image
} from 'react-native';
import emptyList from '../../../../assets/img/order/empty_order_list.png'
import LoadMoreFooter from '../../../components/common/loadMoreFooter'
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff'
    },
    timeText: {
        color: '#999999',
        fontSize: 14,
    },
    arrow: {
        fontFamily: 'iconfont',
        fontSize: 20,
        color: '#999999'
    },
    orderCode: {
        fontSize: 14,
        color: '#333333'
    }
});
export default class historyList extends Component {
    constructor(props) {
        super(props);
    }
    _renderItem(rowData,SectionId,rowID) {
        return <TouchableOpacity onPress={()=> {
            this.props.itemClick && this.props.itemClick(rowData);
        }}>
            <View style={styles.itemContainer}>
                <View>
                    <Text style={styles.orderCode}>WT121212221212121</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff'}}>
                    <Text style={styles.timeText}>2018-12-12</Text>
                    <Text style={styles.arrow}>&#xe63d;</Text>
                </View>
            </View>
        </TouchableOpacity>
    }
    _listEmptyComponent(){
        return (
            <View style={{flex:1,justifyContent: 'center',alignItems: 'center',height: SCREEN_HEIGHT-DANGER_TOP-DANGER_BOTTOM-44-40-49}}>
                <Image source={emptyList}/>
                <Text style={{fontSize: 20, color: '#666666'}}>暂无数据</Text>
            </View>
        )
    }
    _toEnd(){
        const {loadMore, dataSource} = this.props
        if (loadMore) {
            if (dataSource.get('isLoadingMore')){
                console.log("------ 正在加载中");
                return;
            }else if(dataSource.get('list').size >= dataSource.get('total') || dataSource.get('pageNo') == dataSource.get('pages')) {
                console.log("------ 已加载全部");
                return;
            }
            loadMore()
        }
    }
    separatorComponent() {
        return (
            <View style={{height: 10, backgroundColor: '#f0f2f5',}}/>
        );
    };
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
    _keyExtractor = (item, index) => index;
    render() {
        const {dataSource, refreshList} = this.props;
        return (
            <FlatList
                style={{flex:1}}
                data={dataSource.get('list').toJS() || []}
                renderItem={this._renderItem.bind(this)}
                onRefresh={()=> refreshList()}
                refreshing={false}
                onEndReached={() => this._toEnd.bind(this)}
                ListEmptyComponent={this._listEmptyComponent}
                ItemSeparatorComponent={this.separatorComponent}
                onEndReachedThreshold={0.1}
                enableEmptySections={true}
                ListFooterComponent={this._renderFooter.bind(this)}
                keyExtractor={this._keyExtractor}
            />
        )
    }
}