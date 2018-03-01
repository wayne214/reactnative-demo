import React, { Component } from 'react';
import TabNavigator from 'react-native-tab-navigator';
import {connect} from 'react-redux';
import {
	Text,
	Image,
	Animated
} from 'react-native';
import Immutable from 'immutable';
import styles from '../../../assets/css/main';
import PropTypes from 'prop-types';
import GoodsListContainer from '../../containers/routes/goodsList';
import TravelContainer from '../../containers/travel/travel';
import OrderContainer from '../../containers/order/order';
import EntrustOrderContainer from '../../containers/entrust/entrustOrder';
import DriverHome from '../../containers/home/home';
import DriverGoodSource from '../../containers/driverGoodSource/driverGoods';
import DriverOrder from '../../containers/driverOrder/driverOrder';
import Mine from '../../containers/mine/mine';

import BadgeViewIcon from '../../../assets/img/app/message_num_bg.png';

class Tabar extends Component {

	constructor(props) {
		super(props);
		this.state = {
			goodsAnimatedValue: new Animated.Value(0),
			orderAnimatedValue: new Animated.Value(0),
			routeAnimatedValue: new Animated.Value(0),
			carriageAnimatedValue: new Animated.Value(0),
			driverHomeAnimatedValue: new Animated.Value(0),
			driverGoodsAnimatedValue: new Animated.Value(0),
			driverOrderAnimatedValue: new Animated.Value(0),
			mineAnimatedValue: new Animated.Value(0)
		};
		this._renderContainer = this._renderContainer.bind(this);
	}

	static propTypes = {
		currentTab: PropTypes.string,
		changeTab: PropTypes.func,
		tabs: PropTypes.instanceOf(Immutable.List),
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
			case 'Home':
				return React.cloneElement(<DriverHome />, this.props);
			case 'driverGoods':
				return React.cloneElement(<DriverGoodSource />, this.props);
			case 'driverOrder':
				return React.cloneElement(<DriverOrder />, this.props);
			case 'mine':
				return React.cloneElement(<Mine />, this.props);
			default:
				// return React.cloneElement(<TravelContainer />, this.props);
				return React.cloneElement(<DriverHome />, this.props);
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
		} else if (tab === 'Home') {
        Animated.timing(this.state.driverHomeAnimatedValue,
            { toValue: 1 }
        ).start(() => this.state.driverHomeAnimatedValue.setValue(0));
    } else if (tab === 'driverGoods') {
        Animated.timing(this.state.driverGoodsAnimatedValue,
            { toValue: 1 }
        ).start(() => this.state.driverGoodsAnimatedValue.setValue(0));
    } else if (tab === 'driverOrder') {
        Animated.timing(this.state.driverOrderAnimatedValue,
            { toValue: 1 }
        ).start(() => this.state.driverOrderAnimatedValue.setValue(0));
    } else if (tab === 'mine') {
        Animated.timing(this.state.mineAnimatedValue,
            { toValue: 1 }
        ).start(() => this.state.mineAnimatedValue.setValue(0));
    }
      this.props.changeTab(tab);
	}

	render() {
		const { tabs, driverTabs, currentTab } = this.props;
        let tabItems = '';
        console.log('currentTab', this.props);
		if (this.props.currentStatus == 'driver') {
        tabItems = driverTabs.map((item, index) => {
            return (
				<TabNavigator.Item
					key={ index }
					selected={ currentTab === item.get('key') }
					renderIcon={() => <Image style={ styles.tabIcon } source={ item.get('renderIcon') }/> }
					renderSelectedIcon={() => {
                    if (item.get('key') === 'Home') {
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
                    } else if (item.get('key') === 'driverGoods') {
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
                    } else if (item.get('key') === 'driverOrder') {
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
                    } else if (item.get('key') === 'mine') {
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
		} else {
        	tabItems = tabs.map((item, index) => {
            return (
				<TabNavigator.Item
					key={ index }
					selected={ currentTab === item.get('key') }
					renderIcon={() => <Image style={ styles.tabIcon } source={ item.get('renderIcon') }/> }
					renderSelectedIcon={() => {
                    if (item.get('key') === 'goods') {
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
                    } else if (item.get('key') === 'order') {
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
                    } else if (item.get('key') === 'mine') {
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
		}
		return (
			<TabNavigator
				tabBarStyle={{ backgroundColor: 'white', height: 49 + DANGER_BOTTOM, paddingBottom: DANGER_BOTTOM }}
				tabBarShadowStyle={{ backgroundColor: '#e6eaf2', height: 1 }}>
				{ tabItems }
			</TabNavigator>
		);
	}
}

function mapStateToProps(state) {
    return {
        currentStatus: state.user.get('currentStatus'),
    };

}

function mapDispatchToProps(dispatch) {
    return {
        /*登录成功发送Action，全局保存用户信息*/
        dispatch,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Tabar);
