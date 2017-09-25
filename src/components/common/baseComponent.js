import React from 'react';
import LoadingView from './loading';
import { NativeModules, Platform, View, Text, Image } from 'react-native'
import Upgrade from '../app/upgrade'
import styles from '../../../assets/css/main'
import Button from './button'
import Toast from '../../utils/toast'

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
      NativeModules.NativeModule.upgradeForce(this.url).then(response => {
        this.setState({ showUpgrade: true })
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
		if (props.upgradeForce && !props.showFloatDialog && !props.upgrade.get('busy')) {
			return (
				<View style={ styles.upgradeContainer }>
					<View style={ styles.upgradeView }>
						<Image style={{ width: 50, height: 55, marginTop: 15 }} source={ require('../../../assets/img/app/upgrade_icon.png')}/>
						<Text style={ styles.upgradeText }>冷链马甲承运方升级啦，界面焕然一新，修复了已知bug,赶快升级体验吧</Text>
						<Button onPress={ this._forceUpgrade } title='立即更新' style={{ backgroundColor: 'white', width: 100, height: Platform.OS === 'ios' ? 40 : 30, borderColor: 'white' }} textStyle={{ fontSize: 12, color: '#17a9df' }}/>
						{
							Platform.OS === 'android' && this.state.showUpgrade &&
								<Button onPress={ this._installApk } title='已下载，立即安装' style={{ backgroundColor: 'white', width: 100, height: 30, borderColor: 'white' }} textStyle={{ fontSize: 12, color: '#1ab036' }}/>
						}
					</View>
				</View>
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
