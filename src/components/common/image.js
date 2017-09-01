import React from 'react';
import {
	Text,
	Image,
	StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import { IMG_HOST } from '../../constants/setting';
import Spinner from '../../../assets/gif/spinner.gif';

export default class ImageLoading extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			error: false,
			loading: false,
		};
		this._error = this._error.bind(this);
		this._onLoad = this._onLoad.bind(this);
		this._onLoadEnd = this._onLoadEnd.bind(this);
		this._onProgress = this._onProgress.bind(this);
		this._onLoadStart = this._onLoadStart.bind(this);
		this._getRealPath = this._getRealPath.bind(this);
	}

	static propTypes = {
		...Image.propTypes,
		type: PropTypes.string
	}

	componentWillMount() {
		this._getRealPath(this.props);
	}

	_onLoadStart() {
		if (!this.state.loading) {
			this.setState({ loading: true });
		}
	}

	_onLoad() {
		if (this.state.loading) {
			this.setState({ loading: false });
		}
	}

	_onProgress() {
		console.log('%c what exactly does this fuck method do?', 'color: red');
		console.log('%c Oh， i see, if you want to do something while the image loading, you can write some code here', 'color: red');
	}

	_onLoadEnd() {
		if (this.state.loading) {
			this.setState({ loading: false });
		}
	}

	_error() {
		this.setState({ loading: false, error: true });
	}

	_getRealPath(props) {
		const { source, type } = props;
		if (source.uri) {
			this.realSource = {
				uri: this._getFullPath({
					url: source.uri,
					type
				})
			};
		} else {
			this.realSource = source;
		}
	}

	_getFullPath({ url, type }) {
		let result;
		if (url.startsWith('http')) {
			return url;
		}
		switch (type) {
			case 'auth':
				result = '/certificatesImage/450/450/';
				break;
			case 'user':
				result = '/headImage/100/100/';
				break;
			case 'car':
				result = '/carImage/100/100/';
				break;
			default:
				result = '/carImage/100/100/';
				break;
		}
		return IMG_HOST + result + url;
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.source.uri !== this.props.source.uri) {
			this.setState({ error: false, loading: false });
		}
	}

	render() {
		const { style } = this.props;
		let content = this.props.children;
		if (this.state.loading) {
			content = (<Image source={ Spinner }/>);
		} else if (!this.state.loading && this.state.error) {
			content = (<Text style={ styles.iconFont }>&#xe62a;</Text>);
		}
		return (
			<Image
				source={ this.realSource }
				onError={ this._error }
				onLoad={ this._onLoad }
				onLoadEnd={ this._onLoadEnd }
				onProgress={ this._onProgress }
				onLoadStart={ this._onLoadStart }
				style={ [style, styles.container] }>
				{ content }
			</Image>
		);
	}

}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	iconFont: {
		fontSize: 15,
		fontFamily: 'iconfont',
	}
});
