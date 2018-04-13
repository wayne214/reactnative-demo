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
         return (
        <View style={{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image style={{height: 31, width: 31, backgroundColor: 'blue'}}/>
                <Text style={{color: '#333333', fontSize: 16}}>京A123456</Text>
            </View>
            <Image source={rightArrow}/>
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

    render() {
        const {dataSource} = this.props;
        return (
            <FlatList
                style={{flex:1, marginTop: 10}}
                data={dataSource.get('list').toJS() || []}
                renderItem={this._renderRow.bind(this)}
                keyExtractor={this._keyExtractor}
                extraData={this.state}
                onEndReachedThreshold={100}
                enableEmptySections={true}
                // ItemSeparatorComponent={this.separatorComponent}
               />
        )
    }
}