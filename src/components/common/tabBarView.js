import React from 'react';
import {
	View,
	Text,
	Dimensions,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
const { width } = Dimensions.get('window');

export default class Help extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			currentTab: this.props.currentTab ? this.props.currentTab : 0,
		};

	}

	_tabChange(index) {
		this.setState({ currentTab: index });
		if (this.props.changeTab) this.props.changeTab(index);
	}

	render () {
		const { tabs } = this.props;
		const items = tabs.map((item, index) => {
			return (
				<TouchableOpacity
					activeOpacity={0.85}
					key={ index }
					onPress={ this._tabChange.bind(this, index) }>
					<View style={this.state.currentTab === index ? styles.normalBg : styles.selectBg}>
						<Text style={ this.state.currentTab === index ? styles.curTipText : styles.tipText }>{ item }</Text>
					</View>
				</TouchableOpacity>
			);
		});
		return (
			<View style={ styles.container }>
				<View style={ styles.tabViewContainer }>
					{ items }
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		width,
		height: 50,
		flexDirection: 'row',
		backgroundColor: 'transparent',
	},
	tabViewContainer: {
		width,
		height: 50,
		flexDirection: 'row',
		backgroundColor: 'transparent',
			alignItems: 'center'
	},
	tabViewCell: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	curTipText: {
		fontSize: 15,
		color: '#17a9df'
	},
	tipText: {
		fontSize: 15,
		color: '#ffffff'
	},	
	line: {
		width: 110,
		height: 2,
		bottom: 0,
		position: 'absolute',
		backgroundColor: '#17a9df'
	},
	hiddenLine: {
		width: 110,
		height: 2,
		bottom: 0,
		position: 'absolute',
		backgroundColor: 'white'
	},
	selectBg: {
		backgroundColor: 'rgba(255, 255, 255, 0.3)',
		justifyContent: 'center',
		alignItems: 'center',
		width: 80,
		height: 29,
		borderWidth: 1,
		borderRadius: 40,
		marginLeft: 5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
	},
	normalBg: {
		backgroundColor: '#ffffff',
		justifyContent: 'center',
		alignItems: 'center',
    width: 80,
		height: 29,
    borderWidth: 1,
		borderRadius: 40,
    borderColor: '#ffffff',
    marginLeft: 5
	}
});
