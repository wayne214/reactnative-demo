'use strict';

import React, {Component} from 'react';

import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	Animated,
	Dimensions
} from 'react-native';
import PropTypes from 'prop-types';
import * as COLOR from '../../constants/colors'
const { height,width } = Dimensions.get('window')
const bottomLineWidth = 90
class SegmentTabBar extends Component {
	constructor(props){
		super(props)
		this.state = {
      marginLeft1: new Animated.Value((width*0.5-bottomLineWidth)*0.5)
    }
	}
	static propTypes = {
		goToPage: PropTypes.func, // 跳转到对应tab的方法
		activeTab: PropTypes.number, // 当前被选中的tab下标
		tabs: PropTypes.array, // 所有tabs集合

		tabNames: PropTypes.array, // 保存Tab名称
		tabIconNames: PropTypes.array, // 保存Tab图标
	}

	setAnimationValue({value}) {
		console.log('----- animation = ',value);
		//串行执行
    Animated.sequence([
        // 0: w/2 * 0 + (w/2-bottomLineWidth)/2
        Animated.spring(this.state.marginLeft1, {
            toValue: width*0.5*value + (width*0.5-bottomLineWidth)*0.5 ,//属性目标值
            friction: 50,        //摩擦力 （越小 振幅越大）
            tension: 1000,        //拉力
        })
    ]).start()    //执行动画
	}

	componentDidMount() {
		// Animated.Value监听范围 [0, tab数量-1]
		this.props.scrollValue.addListener(this.setAnimationValue.bind(this));
	}

	renderTabOption(tabName, i) {
		let color = this.props.activeTab == i ? COLOR.APP_THEME : COLOR.TEXT_NORMAL; // 判断i是否是当前选中的tab，设置不同的颜色
		return (
			<TouchableOpacity onPress={()=>this.props.goToPage(i)} style={styles.tab} key={i}>
				<View style={styles.tabItem}>
					<Text style={{color: color}}>
						{tabName}
					</Text>
				</View>
			</TouchableOpacity>
		);
	}

	render() {
		return (
			<View style={styles.tabs}>
				<View style={styles.segmentView}>
					{this.props.tabNames.map((tab, i) => this.renderTabOption(tabName, i))}
				</View>
				<View style={{height: 2}}>
					<Animated.View style={{backgroundColor: COLOR.APP_THEME,width: bottomLineWidth,height: 2,marginLeft: this.state.marginLeft1}}>
					</Animated.View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	tabs: {
		height: 44,
	},
	segmentView: {
		flex: 1,
		flexDirection: 'row'
	},
	tab: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},

	tabItem: {
		flexDirection: 'column',
		alignItems: 'center',
	},
});


export default SegmentTabBar;