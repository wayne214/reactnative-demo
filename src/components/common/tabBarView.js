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
		const lineWidth = 25;
		const items = tabs.map((item, index) => {
			return (
				<TouchableOpacity
					key={ index }
					style={ styles.tabViewCell }
					onPress={ this._tabChange.bind(this, index) }>
					<View style={this.state.currentTab === index ? styles.selectBg : styles.normalBg}>
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
		alignItems: 'center',
		backgroundColor: 'white',
		borderBottomColor: '#e6eaf2',
		borderBottomWidth: 1
	},
	tabViewContainer: {
		width,
		height: 50,
		flexDirection: 'row',
		backgroundColor: 'white'
	},
	tabViewCell: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	curTipText: {
		fontSize: 15,
		color: '#17a9df'
	},
	tipText: {
		fontSize: 15,
		color: '#999999'		
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
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center',
	},
	normalBg: {
		backgroundColor: 'white',
		// transparent: true,
		justifyContent: 'center',
		alignItems: 'center',
    opacity: 1
	}
});
