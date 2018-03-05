import React from 'react';
import {
	Text,	
	TouchableOpacity,
	View
} from 'react-native';
import PropTypes from 'prop-types';

export default class CheckBox extends React.Component {

	constructor(props) {
	  super(props);
		this.name = 'checkbox';
	}

	static propTypes = {
		...TouchableOpacity.propTypes,
		isChecked: PropTypes.bool.isRequired,
		checkedFun: PropTypes.func.isRequired,
	}

	render() {
		const { isChecked, style, contentStyle, checkedFun, isShowText, index } = this.props;
		return (
			<TouchableOpacity
				activeOpacity={ 1 }
				onPress={ checkedFun }
				style={ [{ justifyContent: 'center' }, contentStyle]}>
				<View style={{flexDirection: 'row', alignItems: 'center'}}>
				{/*{*/}
            {/*isChecked ? <Text style={{fontSize: 14, color: '#999999', marginRight: 10}}>(默认)</Text> : null*/}
				{/*}*/}
				{
						isShowText ? <Text style={{fontSize: 14, color: '#999999', marginRight: 10}}>样式{index}</Text> : null
				}
				{
					(() => {
						if (isChecked) {
							return (
								<Text style={[{
									fontSize: 20,
									color: '#17a9df',
				  				fontFamily: 'iconfont' }, style]}>
									&#xe648;
				  			</Text>
							);
						} else {
							return (
								<Text style={[{
									fontSize: 20,
									color: '#999999',
				  				fontFamily: 'iconfont' }, style]}>
									&#xe647;
				  			</Text>
							);
						}
					})()
				}
				</View>
			</TouchableOpacity>
		);
	}
}
