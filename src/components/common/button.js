import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';

export default class Button extends React.Component {

	constructor(props) {
		super(props);

		this.state = {};
		this._onPress = this._onPress.bind(this);
	}

	static propTypes = {
		...Text.propTypes,
		icon: PropTypes.string,
		onPress: PropTypes.func,
		isDisabled: PropTypes.bool,
		title: PropTypes.string
	}

	_onPress() {
		if (!this.props.isDisabled) {
			this.props.onPress();
		}
	}

	render() {

		const { title, style, textStyle, icon, iconStyle } = this.props;
		const _children = this.props.children;

		let childrenElement = [];
		if (React.Children.count(_children) === 0) {
			const _element = (<Text style={ [styles.text, textStyle] }>{ title }</Text>);
			childrenElement.push(_element);
		} else {
			React.Children.forEach(this.props.children, item => {
				if (typeof item === 'string') {
					const element = (
						<Text style={ [styles.text, textStyle] }>{ item }</Text>
					);
					childrenElement.push(element);
				} else if (React.isValidElement(item)) {
					childrenElement.push(item);
				}
			});
		}

		return (
			<TouchableOpacity
				onPress={ this._onPress }
				activeOpacity={ this.props.opacity || 1 }>
				<View style={ [styles.container, style] }>
				{
					(() => {
						if (icon) {
							return (
								<View style={ styles.iconContainer }>
									<Text style={ [styles.text, textStyle] }>{ title }</Text>
									<Text style={ [styles.iconFont, iconStyle] }>{ icon }</Text>
								</View>
							);
						} else {
							return childrenElement[0];
						}
					})()
				}
				</View>
			</TouchableOpacity>
		);
	}

}

const styles = StyleSheet.create({
	container: {
		width: 120,
		height: 40,
		borderWidth: 1,		
		borderRadius: 2,
		borderColor: 'red',
		alignItems: 'center',
		alignSelf: 'stretch',
		backgroundColor: 'white',
		justifyContent: 'center'
	},
	text: {
		fontSize: 16
	},
	iconFont: {
		color: 'red',
		marginLeft: 5,
		fontFamily: 'iconfont'
	},
	iconContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',		
		justifyContent: 'center'
	}
});
