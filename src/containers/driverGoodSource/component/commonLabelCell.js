import React, {Component, PropTypes} from 'react';
import {
	View,
	StyleSheet,
    Text
} from 'react-native';
import * as StaticColor from '../../../constants/colors';

const styles = StyleSheet.create({
    container: {
        backgroundColor: StaticColor.ORANGE_TYPE_COLOR,
        borderRadius: 3,
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 5,
        paddingRight: 5,
        marginRight: 5,
        marginTop: 8,
    },
    contentStyle: {
        fontSize: 12,
        color: StaticColor.ORANGE_TYPE_TEXT_COLOR,
    }
});

class commonLabelCell extends Component{
	constructor(props) {
		super(props);
	}

	render() {
        const {
            content,
            containerStyle,
            textStyle
        } = this.props;
		return (
            <View style={[styles.container, containerStyle]}>
                <Text style={[styles.contentStyle, textStyle]}>{content}</Text>
            </View>
		)
	}
}

export default commonLabelCell;
