import React from 'react';
import LoadingView from './loading';
import { NativeModules } from 'react-native'

export default class BaseComponent extends React.Component {

	constructor(props) {
		super(props);
		this.title = (props.navigation.state.params && props.navigation.state.params.title) ? props.navigation.state.params.title : '首页'
	}

	componentDidMount () {
		this.title && NativeModules.UmengAnalyticsModule.onPageBegin(this.title)
	}

	componentWillUnmount () {
		this.title && NativeModules.UmengAnalyticsModule.onPageEnd(this.title)
	}

	_renderLoadingView() {
		return <LoadingView />;
	}

	render() {
		return null;
	}

}
