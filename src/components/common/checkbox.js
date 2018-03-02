import React from 'react';
import {
	Text,	
	TouchableOpacity,
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
		const { isChecked, style, contentStyle, checkedFun } = this.props;
		return (
			<TouchableOpacity
				activeOpacity={ 1 }
				onPress={ checkedFun }
				style={ [{ justifyContent: 'center' }, contentStyle]}>
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
			</TouchableOpacity>
		);
	}
}
