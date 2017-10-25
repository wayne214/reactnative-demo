import React from 'react';
import {
	View,
	Image,
	Text,
	Platform,
	StyleSheet,
	Dimensions,
	TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
const { width } = Dimensions.get('window');

export default class NavigatorBar extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
		};
		this._forward = this._forward.bind(this);
		this._renderOptView = this._renderOptView.bind(this);
		this._renderBackView = this._renderBackView.bind(this);
	}

	componentWillMount() {
		if (Platform.OS === 'ios') {
				this.adjustToolBarHeigth = { height: (IOS_DEVICE_MODAL === 'iPhone X' ? 74 : 64) };
				this.adjustStaBarHeight = { marginTop: (IOS_DEVICE_MODAL === 'iPhone X' ? 30 : 20) };
		} else {
			this.adjustToolBarHeigth = { height: 50 };
			this.adjustStaBarHeight = { marginTop: 0 };
		}
	}

	_forward() {
		if (this.props.backViewClick) {
			this.props.backViewClick();
		} else if(this.props.router) {
			if (this.props.picker) {
				this.props.picker.hide();
			}
			this.props.router.dispatch({ type: 'pop' })
		}
	}

	_renderBackView() {
		const { backIconFontStyle, backImgStyle, backTitle, backTitleStyle} = this.props;
		if (backTitle) {
			return (
				<TouchableOpacity
					activeOpacity={ 1 }
					onPress={ this._forward }
					style={{width: 60,height: 44, justifyContent: 'center',marginLeft: 10}}>
					<Text style={ [styles.backIcon, backTitleStyle] }>{ backTitle }</Text>
				</TouchableOpacity>
			);
		}else if (this.props.backIconFont) {
			return (
				<TouchableOpacity
					activeOpacity={ 1 }
					onPress={ this._forward }
					style={ styles.backIconView }>
					<Text style={ [styles.backIcon, backIconFontStyle] }>{ this.props.backIconFont }</Text>
				</TouchableOpacity>
			);
		} else if (this.props.backImg) {
			return (
				<TouchableOpacity
					activeOpacity={ 1 }
					onPress={ this._forward }
					style={ styles.backIconView }>
					<Image resizeMode='stretch' style={ [styles.backImg, backImgStyle] } source={ this.props.backImg }/>
				</TouchableOpacity>
			);
		} else if (!this.props.hiddenBackIcon) {
			return (
				<TouchableOpacity
					activeOpacity={ 1 }
					onPress={ this._forward }
					style={ styles.backIconView }>
					<Text style={ styles.backIcon }>&#xe611;</Text>
				</TouchableOpacity>
			);
		} else {
			return null;
		}
	}

	_renderOptView() {
		const { firstLevelIconFont, secondLevelIconFont,
			firstLevelIconFontStyle, secondLevelIconFontStyle, optTitle,
			optTitleStyle, firstLevelClick, secondLevelClick, thirdLevelIconFont,
			thirdLevelIconFontStyle, thirdLevelClick, msgCount } = this.props;
		if (firstLevelIconFont && secondLevelIconFont && thirdLevelIconFont) {
			return (
				<View style={ styles.optMenuView }>
					<TouchableOpacity
						activeOpacity={ 1 }
						onPress={ thirdLevelClick }
						style={ styles.secondLevelView }>
						<Text style={ [styles.optIcon, thirdLevelIconFontStyle] }>{ thirdLevelIconFont }</Text>
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={ 1 }
						onPress={ secondLevelClick }
						style={ styles.secondLevelView }>
						<Text style={ [styles.optIcon, secondLevelIconFontStyle] }>{ secondLevelIconFont }</Text>
						{
							msgCount &&
								<View style={ styles.countView }>
									<Text style={ styles.count }>{ msgCount }</Text>
								</View>
						}
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={ 1 }
						onPress={ firstLevelClick }
						style={ styles.firstLevelView }>
						<Text style={ [styles.optIcon, firstLevelIconFontStyle] }>{ firstLevelIconFont }</Text>
					</TouchableOpacity>
				</View>
			);
		}
		if (firstLevelIconFont && secondLevelIconFont) {
			return (
				<View style={ styles.optMenuView }>
					<TouchableOpacity
						activeOpacity={ 1 }
						onPress={ secondLevelClick }
						style={ styles.secondLevelView }>
						<Text style={ [styles.optIcon, secondLevelIconFontStyle] }>{ secondLevelIconFont }</Text>
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={ 1 }
						onPress={ firstLevelClick }
						style={ styles.firstLevelView }>
						<Text style={ [styles.optIcon, firstLevelIconFontStyle] }>{ firstLevelIconFont }</Text>
					</TouchableOpacity>
				</View>
			);
		}
		if (firstLevelIconFont && optTitle) {
			return (
				<View style={ styles.optMenuView }>
					<TouchableOpacity
						activeOpacity={ 1 }
						onPress={ secondLevelClick }
						style={ styles.firstLevelView }>
						<Text style={ [styles.optIcon, firstLevelIconFontStyle] }>{ firstLevelIconFont }</Text>
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={ 1 }
						onPress={ firstLevelClick }
						style={ styles.secondLevelView }>
						<Text style={ [styles.optTitle, optTitleStyle] }>{ optTitle }</Text>
					</TouchableOpacity>
				</View>
			);
		}
		if (firstLevelIconFont) {
			return (
				<View style={ styles.optMenuView }>
					<TouchableOpacity
						activeOpacity={ 1 }
						onPress={ firstLevelClick }
						style={ styles.firstLevelView }>
						<Text style={ [styles.optIcon, firstLevelIconFontStyle] }>{ firstLevelIconFont }</Text>
					</TouchableOpacity>
				</View>
			);
		}
		if (optTitle) {
			return (
				<View style={ styles.optMenuView }>
					<TouchableOpacity
						activeOpacity={ 1 }
						onPress={ firstLevelClick }
						style={ styles.firstLevelView }>
						<Text style={ [styles.optTitle, optTitleStyle] }>{ optTitle }</Text>
					</TouchableOpacity>
				</View>
			);
		}
		return null;
	}

	render() {
		const { style, imgTitle, titleContainer } = this.props;
		let title = ''
		if (this.props.title) {
			title = this.props.title
		} else if (this.props.router.state && this.props.router.state.params) {
			title = this.props.router.state.params.title
		}
		// const title = this.props.router.state.params ? this.props.router.state.params.title : ''
		return (
			<View style={ [styles.container, style, this.adjustToolBarHeigth] }>
				<View style={ [styles.contentContainer, this.adjustStaBarHeight] }>
					<View style={ styles.optContainer }>
						{ this._renderBackView() }
					</View>
					<View style={ [styles.titleContainer, titleContainer] }>
						{
							(() => {
								if (imgTitle) {
									return <Image style={ styles.imgStyle } source={ imgTitle } />;
								} else {
									if (title && this.props.assistIconFont) {
										return(
											<TouchableOpacity activeOpacity={0.8} onPress={()=>{
												if (this.props.assistIconClick) {
													this.props.assistIconClick()
												}
											}}>
												<View style={{flexDirection: 'row',alignItems: 'center'}}>
													<Text style={ styles.title } ellipsizeMode='middle' numberOfLines={ 1 }>{ title || '' }</Text>
													<Text style={ [styles.backIcon,this.props.assistIconFontStyle] }>{ this.props.assistIconFont }</Text>
												</View>
											</TouchableOpacity>
										)
									}else{
										return (
											<Text
												style={ styles.title }
												ellipsizeMode='middle'
												numberOfLines={ 1 }>
												{ title || '' }</Text>
										)
									}
								}
							})()
						}
					</View>
					<View style={ styles.optContainer }>
						{ this._renderOptView() }
					</View>
				</View>
			</View>
		);
	}

}

const propTypes = {
	...Image.PropTypes,
	router: PropTypes.object,
	backIconFontStyle: Text.propTypes.style,
	backImgStyle: Text.propTypes.style,
	backTitle: PropTypes.string,
	backTitleStyle: Text.propTypes.style,
	assistIconFont: PropTypes.string,
	assistIconFontStyle: Text.propTypes.style,
	firstLevelIconFontStyle: Text.propTypes.style,
	secondLevelIconFontStyle: Text.propTypes.style,
	thirdLevelIconFontStyle: Text.propTypes.style,
	optTitleStyle:  Text.propTypes.style,
	backIconFont: PropTypes.string,
	firstLevelIconFont: PropTypes.string,
	secondLevelIconFont: PropTypes.string,
	thirdLevelIconFont: PropTypes.string,
	optTitle: PropTypes.string,
	title: PropTypes.string,
	hiddenBackIcon: PropTypes.bool,
	backViewClick: PropTypes.func,
	thirdLevelClick: PropTypes.func
};

NavigatorBar.propTypes = propTypes;

const styles = StyleSheet.create({
	container: {
		width,
		borderBottomWidth: 1,
		borderBottomColor: '#e6eaf2',
		backgroundColor: 'white',
	},
	contentContainer: {
		flex: 2,
		flexDirection: 'row',
	},
	optContainer: {
		flex: 2,
	},
	titleContainer: {
		flex: 5,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		color: '#333',
		fontSize: 16,
		fontWeight: 'bold'
	},
	backIconView: {
		flex: 1,
		paddingLeft: 17,
		marginRight: 20,
		justifyContent: 'center'
	},
	backIcon: {
		fontSize: 20,
		color: '#8f8f8f',
		fontFamily: 'iconfont',
	},
	backImg: {
		width: 30,
		height: 30,
	},
	optMenuView: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	firstLevelView: {
		marginRight: 17,
		paddingTop: 2,
	},
	secondLevelView: {
		marginRight: 10,
		paddingTop: 2,
	},
	optIcon: {
		fontSize: 20,
		color: '#8f8f8f',
		fontFamily: 'iconfont',
	},
	optTitle: {
		fontSize: 12,
		color: '#8f8f8f',
	},
	countView: {
		position: 'absolute',
		top: -4,
		right: -4,
		width: 14,
		height: 14,
		marginLeft: 5,
		borderRadius: 7,
		backgroundColor: 'red',
		alignItems: 'center',
		justifyContent: 'center',
	},
	count: {
		fontSize: 8,
		color: 'white'
	},
	imgStyle: {
		width: 94,
		height: 29,
	}
});