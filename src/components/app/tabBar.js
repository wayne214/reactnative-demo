import React, { Component } from 'react';
import TabNavigator from 'react-native-tab-navigator';
import {
	Text,
	Image,
	Animated
} from 'react-native';
import Immutable from 'immutable';
import styles from '../../../assets/css/main';

import GoodsListContainer from '../../containers/routes/goodsList';
import TravelContainer from '../../containers/travel/travel';
import OrderContainer from '../../containers/order/order';
import EntrustOrderContainer from '../../containers/entrust/entrustOrder';

import BadgeViewIcon from '../../../assets/img/app/message_num_bg.png';

export default class Tabar extends Component {

	constructor(props) {
		super(props);
		this.state = {
			goodsAnimatedValue: new Animated.Value(0),
			orderAnimatedValue: new Animated.Value(0),
			routeAnimatedValue: new Animated.Value(0),
			carriageAnimatedValue: new Animated.Value(0)
		};
		this._renderContainer = this._renderContainer.bind(this);
	}

	static propTypes = {
		currentTab: React.PropTypes.string,
		changeTab: React.PropTypes.func,
		tabs: React.PropTypes.instanceOf(Immutable.List),
	}

	_renderBadge(badgeCount) {
		if (!badgeCount) {
			return null;
		}
		return (
			<Image style={ styles.badgeBg } source={ BadgeViewIcon }>
				<Text style={ styles.badgeText }>{ badgeCount }</Text>
			</Image>
		);
	}

	/**
	 * [_renderContainer description]
	 * 	这种方式耦合性太高，暂定，
	 * 		ExceptionsManager.js:82 Warning: Using Maps as children is not yet fully supported.
	 * 		It is an experimental feature that might be removed.
	 * 		Convert it to a sequence / iterable of keyed ReactElements instead.
	 * 		Check the render method of `View`.
	 * @param  {[type]} key [description]
	 * @return {[type]}     [description]
	 */
	_renderContainer(key) {
		switch(key) {
			case 'goods':
				return React.cloneElement(<GoodsListContainer />, this.props);
			case 'route':
				return React.cloneElement(<TravelContainer />, this.props);
			case 'order':
				return React.cloneElement(<OrderContainer />, this.props);
			case 'carriage':
				return React.cloneElement(<EntrustOrderContainer />, this.props);
			default:
				return React.cloneElement(<TravelContainer />, this.props);
		}
	}

	_selectTab(tab) {
		if (tab === 'goods') {
			Animated.timing(this.state.goodsAnimatedValue,
				{ toValue: 1 }
			).start(() => this.state.goodsAnimatedValue.setValue(0));
		} else if (tab === 'order') {
			Animated.timing(this.state.orderAnimatedValue,
				{ toValue: 1 }
			).start(() => this.state.orderAnimatedValue.setValue(0));
		} else if (tab === 'route') {
			Animated.timing(this.state.routeAnimatedValue,
				{ toValue: 1 }
			).start(() => this.state.routeAnimatedValue.setValue(0));
		} else if (tab === 'carriage') {
			Animated.timing(this.state.carriageAnimatedValue,
				{ toValue: 1 }
			).start(() => this.state.carriageAnimatedValue.setValue(0));
		}
		this.props.changeTab(tab);
	}

	render() {
		const { tabs, currentTab } = this.props;
		const tabItems = tabs.map((item, index) => {
			return (
				<TabNavigator.Item
					key={ index }
					selected={ currentTab === item.get('key') }
					renderIcon={() => <Image style={ styles.tabIcon } source={ item.get('renderIcon') }/> }
					renderSelectedIcon={() => {
						if (item.get('key') === 'order') {
							return (
								<Animated.Image
									style={ [styles.tabIcon, {
										transform: [
											{ scale: this.state.orderAnimatedValue.interpolate({
												inputRange: [0, 1],
												outputRange: [1, 0.8]
											})}
										]
									}] }
									source={ item.get('renderSelectedIcon') }/>
							);
						} else if (item.get('key') === 'goods') {
							return (
								<Animated.Image
									style={ [styles.tabIcon, {
										transform: [
											{ scale: this.state.goodsAnimatedValue.interpolate({
												inputRange: [0, 1],
												outputRange: [1, 0.8]
											})}
										]
									}] }
									source={ item.get('renderSelectedIcon') }/>
							);
						} else if (item.get('key') === 'route') {
							return (
								<Animated.Image
									style={ [styles.tabIcon, {
										transform: [
											{ scale: this.state.routeAnimatedValue.interpolate({
												inputRange: [0, 1],
												outputRange: [1, 0.8]
											})}
										]
									}] }
									source={ item.get('renderSelectedIcon') }/>
							);
						} else if (item.get('key') === 'carriage') {
							return (
								<Animated.Image
									style={ [styles.tabIcon, {
										transform: [
											{ scale: this.state.carriageAnimatedValue.interpolate({
												inputRange: [0, 1],
												outputRange: [1, 0.8]
											})}
										]
									}] }
									source={ item.get('renderSelectedIcon') }/>
							);
						}
					}}
					title={ item.get('title') }
					titleStyle={ styles.titleStyle }
					selectedTitleStyle={ styles.selectedTitleStyle }
					renderBadge={()=>this._renderBadge(item.get('badgeCount'))}
					onPress={ this._selectTab.bind(this, item.get('key')) }>
					{ this._renderContainer(item.get('key')) }
				</TabNavigator.Item>
			);
		});
		return (
			<TabNavigator
				tabBarStyle={{ backgroundColor: 'white', height: IS_IPHONE_X ? 77 : 49, paddingBottom: IS_IPHONE_X ? 28 : 0 }}
				tabBarShadowStyle={{ backgroundColor: '#e6eaf2', height: 1 }}>
				{ tabItems }
			</TabNavigator>
		);
	}
}
