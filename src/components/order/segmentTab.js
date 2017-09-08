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
import * as COLOR from '../../constants/colors'

const { height,width } = Dimensions.get('window')
const bottomLineWidth = 35
class SegmentTabBar extends Component {
	constructor(props){
		super(props)
		const {tabNames} = this.props

		this.state = {
      marginLeft1: new Animated.Value((width*(1/tabNames.length)-bottomLineWidth)*0.5),
      tabNamesCount: tabNames.length
    }
	}
	static propTypes = {
		goToPage: React.PropTypes.func, // 跳转到对应tab的方法
		activeTab: React.PropTypes.number, // 当前被选中的tab下标
		// tabs: React.PropTypes.array, // 所有tabs集合

		tabNames: React.PropTypes.array, // 保存Tab名称
		tabIconNames: React.PropTypes.array, // 保存Tab图标
	}

	_setAnimationValue(value) {
		this.setState({
			activeTab: value
		})
		const {tabNamesCount} = this.state
		//串行执行
    Animated.sequence([
        // 0: w/2 * 0 + (w/2-bottomLineWidth)/2
        Animated.spring(this.state.marginLeft1, {
            toValue: width*(1/tabNamesCount)*value + (width*(1/tabNamesCount)-bottomLineWidth)*0.5 ,//属性目标值
            friction: 50,        //摩擦力 （越小 振幅越大）
            tension: 1000,        //拉力
        })
    ]).start()    //执行动画
	}

	componentDidMount() {

	}

	renderTabOption(tab, i) {
		let color = this.props.activeTab == i ? COLOR.APP_THEME : COLOR.TEXT_NORMAL; // 判断i是否是当前选中的tab，设置不同的颜色
		const {selectWithIndex} = this.props
		return (
			<TouchableOpacity activeOpacity={0.8} onPress={()=>{
				console.log("--- i activeTab",i,this.props.activeTab);
				if (i != this.props.activeTab) {
					if(selectWithIndex){selectWithIndex(i)}
					this._setAnimationValue(i)
				};
			}} style={styles.tab} key={i}>
				<View style={styles.tabItem}>
					<Text style={{color: color}}>
						{this.props.tabNames[i]}
					</Text>
				</View>
			</TouchableOpacity>
		);
	}

	render() {
		return (
			<View style={styles.tabs}>
				<View style={styles.segmentView}>
					{this.props.tabNames.map((tab, i) => this.renderTabOption(tab, i))}
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
		backgroundColor: 'white',
		borderBottomWidth: 1,
		borderBottomColor: '#e6eaf2'
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