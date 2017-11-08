import React from 'react';
import LoadingView from './loading';
import { NativeModules, Platform, View, Text, Image, TouchableOpacity } from 'react-native'
import Upgrade from '../app/upgrade'
import styles from '../../../assets/css/main'
import Button from './button'
import Toast from '../../utils/toast'
import Modal from 'react-native-root-modal'

export default class BaseComponent extends React.Component {

	constructor(props) {
		super(props)
		this._installApk = this._installApk.bind(this)
		this._forceUpgrade = this._forceUpgrade.bind(this)
		this.title = (props.navigation.state.params && props.navigation.state.params.title) ? props.navigation.state.params.title : '首页'
	}

	componentDidMount () {
		this.title && NativeModules.UmengAnalyticsModule.onPageBegin(this.title)
	}

	componentWillUnmount () {
		this.title && NativeModules.UmengAnalyticsModule.onPageEnd(this.title)
	}

	_renderLoadingView() {
		return <LoadingView />
	}

	/**
   * [_forceUpgrade description] 强制升级
   * @return {[type]} [description]
   */
  _forceUpgrade () {
		if (Platform.OS === 'android') {
      Toast.show('开始下载')
			this.setState({ title: '正在下载...' })
      NativeModules.NativeModule.upgradeForce(this.url).then(response => {
				Toast.show('下载完成')
        this.setState({ showUpgrade: true, title: '立即更新' })
      }, () => {
				// 下载失败
				this.setState({ title: '立即更新' })
				Toast.show('下载失败，请重新下载')
			});
    } else {
      NativeModules.NativeModule.toAppStore();
    }
  }

	_installApk() {
		NativeModules.NativeModule.installApk()
	}

	_renderUpgrade(props) {
		this.url = props.upgradeForceUrl ? props.upgradeForceUrl : ''
		let _show = props.upgradeForce && !props.showFloatDialog && !props.upgrade.get('busy')
		if (props.upgradeForce && !props.showFloatDialog && !props.upgrade.get('busy')) {
			return (
				<Modal
					transparent={ true }
					backdropOpacity={ 0 }
					backdropColor='rgba(0, 0, 0, 0)'
					onRequestClose={ () => console.log('') }
					supportedOrientations={['landscape', 'portrait']}
					visible={ _show }>
					<View style={ styles.upgradeContainer }>
						<View style={ styles.upgradeView }>
							<Image style={{ width: 280, height: 160 }} source={ require('../../../assets/img/upgrade_icon.png')}/>
							<Text style={ styles.upgradeTip }>{ '新功能上线' }</Text>
							<Text style={ styles.upgradeText }>{ '为方便广大客户不同类型的结算模式，此版本实现了在线结算的系统升级，功能更全，性能更优。' }</Text>
							<View style={ styles.optContainer }>
								{
									Platform.OS === 'android' && this.state.showUpgrade &&
										<TouchableOpacity
											activeOpacity={ 1 }
											style={ [styles.optCell, styles.rightBorder] }
											onPress={ this._installApk }>
											<Text style={{ fontSize: 14, color: '#999' }}>已下载，立即安装</Text>
										</TouchableOpacity>
								}
								<TouchableOpacity
									activeOpacity={ 1 }
									style={ styles.optCell }
									onPress={ this._forceUpgrade }>
									<Text style={{ fontSize: 14, color: '#333' }}>{ this.state.title || '立即更新' }</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
			)
		} else if (props.upgrade.get('busy')) {
			if (props.upgrade.get('downloaded')) {
				return (<Upgrade text={ `${ props.upgrade.get('text') }` } />)
			} else {
				return (<Upgrade text={` ${ props.upgrade.get('text') }${ props.upgrade.get('progress') }` } />)
			}
		} else {
			return null
		}
	}

	render() {
		return null
	}

}
