import React from 'react';
import {
	View,
	Image,
	Text,
	StyleSheet
} from 'react-native';
import timeIcon from '../../../assets/gif/upgrade_icon.gif';

export default class Upgrade extends React.Component {

	constructor(props) {
		super(props);

		this.state = {};
	}

	static propTypes = {
		text: React.PropTypes.string.isRequired
	}

	render () {
		const { text } = this.props;
		return (
			<View style={ styles.container }>
				<View style={ styles.dialog }>
					<Image style={ styles.icon } source={ timeIcon }/>
					<Text style={ styles.text }>{ text }</Text>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		top: 0,
		right: 0,
		left: 0,
		bottom: 0,
		alignItems: 'center',
		position: 'absolute',		
		justifyContent: 'center',
		backgroundColor: '#000000b8',
	},
	dialog: {
		width: 200,
		height: 100,
		backgroundColor: '#ffffff',
		flexDirection: 'column',
		justifyContent: 'space-around',
		alignItems: 'center',
		borderRadius: 8,
	},
	text: {
		fontSize: 15,
		color: '#333333'
	},
	icon: {
		width: 40,
		height: 40
	}
});