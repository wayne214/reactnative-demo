import React from 'react';
import {
	View,
	Image,
	Text,
	TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import NavigatorBar from '../../components/common/navigatorbar';
import styles from '../../../assets/css/setting';
import CustomServiceIcon from '../../../assets/img/user/icon_service.png';
import Link from '../../utils/linking';
import BaseComponent from '../../components/common/baseComponent';

class CustomServiceContainer extends BaseComponent {

	constructor(props) {
		super(props);

		this.state = {
			isOpen: true,
		};
	  this.title = props.navigation.state.params.title;
	}

	static navigationOptions = ({ navigation }) => {
	  return {
	    header: <NavigatorBar router={ navigation }/>
	  };
	};

	render () {
		return (
			<View style={ styles.container }>
				<View style={ styles.serviceIconContainer }>
					<Image source={ CustomServiceIcon }/>
					<Text style={ styles.serviceText }>如果您在使用过程中有任何不明白的地方,敬请骚扰我们,我们会为您耐心解答!</Text>
				</View>
				<TouchableOpacity
					style={ styles.linkContainer }
					onPress={ () => Link.link('tel:4006635656') }>
					<View style={ styles.phoneIcon }>
						<Text style={ styles.fontPhone }>&#xe60f;</Text>
					</View>
					<Text style={ styles.phoneText }>400-663-5656</Text>
				</TouchableOpacity>

				{ this._renderUpgrade(this.props) }
			</View>
		);
	}
}

const mapStateToProps = (state) => {
	const { app } = state;
	return {
		upgrade: app.get('upgrade'),
		upgradeForce: app.get('upgradeForce'),
    upgradeForceUrl: app.get('upgradeForceUrl'),
	}
}

const mapDispatchToProps = (dispatch) => {
	return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomServiceContainer);
