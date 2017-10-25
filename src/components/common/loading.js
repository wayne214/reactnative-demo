import React from 'react';
import {
	View,
	Dimensions,
	StyleSheet,
	ActivityIndicator
} from 'react-native';
import PropTypes from 'prop-types';
import Modal from 'react-native-root-modal';
const { height } = Dimensions.get('window');

const SIZES = ['small', 'normal', 'large'];

export default class Loading extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			visible: this.props.visible
		};
		this.close = this.close.bind(this);
	}

	static propTypes = {
		visible: PropTypes.bool,
		size: PropTypes.oneOf(SIZES),
		overlayColor: PropTypes.string,
		children: PropTypes.element
	}

	static defaultProps = {
		visible: true,
		size: 'large',
		overlayColor: 'rgba(0, 0, 0, 0.7)'
	}

	close() {
		this.setState({ visible: false });
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible !== this.props.visible) {
			this.setState({ visible: nextProps.visible });
		}
	}

	renderLoadingView() {
		return (
			<View style={ [styles.container, { backgroundColor: this.props.overlayColor }] }>
				<ActivityIndicator
					color={ 'white' }
					animating={ true }
					size={ this.props.size } />
			</View>
		);
	}

	render() {
		const spinner = (
			<View style={ styles.modalContainer }>
				{ this.props.children ? this.props.children : this.renderLoadingView() }
			</View>
		);

		return (
			<Modal
				transparent={ true }
				backdropOpacity={ 0 }
				backdropColor='rgba(0,0,0,0)'
				onRequestClose={ this.close }
				supportedOrientations={['landscape', 'portrait']}
				visible={ this.state.visible }>
				{ spinner }
			</Modal>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		width: 100,
		height: 80,
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent'
	},
	modalContainer: {
		flex: 1,
		alignItems: 'center',
		paddingTop: height / 3,		
	}
});
