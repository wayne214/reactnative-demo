/*
 * @author:  yinyongqian
 * @createTime:  2017-03-22, 11:18:32 GMT+0800
 * @description:  description
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';
import * as StaticColor from '../../../constants/colors';

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'center',
        // justifyContent: 'space-between',
    },
    itemName: {
        fontSize: 16,
        color: StaticColor.GRAY_TEXT_COLOR,
    },
    contentText: {
        fontSize: 16,
        color: StaticColor.BLACK_DETAIL_TEXT_COLOR,
    },
});
class taskInfoCell extends Component {
    static propTypes = {
        content: PropTypes.string,
        itemName: PropTypes.string,
        hideBottomLine: PropTypes.bool,
        contentColorStyle: Text.propTypes.style,
    };

    render() {
        const {itemName, content, contentColorStyle} = this.props;
        return (
            <View>
                <View style={styles.container}>
                    <Text style={styles.itemName}>{itemName}</Text>
                    <Text style={[styles.contentText, contentColorStyle]}>{content}</Text>
                </View>
            </View>
        );
    }
}

export default taskInfoCell;
