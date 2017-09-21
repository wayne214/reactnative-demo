import React from 'react';
import LoadingView from './loading';
import { NativeModules } from 'react-native'
import Upgrade from '../app/upgrade'

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

	_renderUpgrade(upgrade) {
		if (upgrade.get('busy')) {
			if (upgrade.get('downloaded')) {
				return (<Upgrade text={`${ upgrade.get('text') }`} />);
			} else {
				return (<Upgrade text={`${ upgrade.get('text') }${ upgrade.get('progress') }`} />);
			}
		} else {
			return null
		}
	}

	render() {
		return null;
	}

}
