import React from 'react'
import { AppRegistry } from 'react-native'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore';
import AppReducer from './reducers/index'
import AppWithNavigationState from './navigators/navigators'
import codePush from 'react-native-code-push'

const store = configureStore();

class Root extends React.Component {
  
  constructor(props) {
    super(props);
  	this.store = store
  }

  codePushStatusDidChange(status) {
    switch(status) {
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        store.dispatch(upgrade({
          text: '正在下载更新内容',
          busy: true,
          downloaded: false,
        }));
        break;
      case codePush.SyncStatus.INSTALLING_UPDATE:
        store.dispatch(upgrade({
          text: '正在更新内容',
          busy: true,
          downloaded: true,
        }));
        break;
      case codePush.SyncStatus.UPDATE_INSTALLED:
        store.dispatch(upgrade({
          text: '更新成功',
          busy: true,
          downloaded: true,
        }));
        break;
    }
  }

  codePushDownloadDidProgress (progress) {
    store.dispatch(upgrade({
      busy: true,
      progress: parseInt((progress.receivedBytes / progress.totalBytes) * 100) + '%' ///*+ '--' + receive + '/' + total*/ //'(' + HelperUtil.fileSizeFormat(progress.totalBytes) + ')'
    }));
  }

  render() {
    return (
      <Provider store={ this.store }>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

Root = codePush({
  installMode: codePush.InstallMode.IMMEDIATE,
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  updateDialog: {
    title: '温馨提示',
    descriptionPrefix: '',
    optionalUpdateMessage: '',
    appendReleaseDescription: true,
    optionalInstallButtonLabel: '更新',
    optionalIgnoreButtonLabel: '暂不更新',
    mandatoryUpdateMessage: '即将更新app',
    mandatoryContinueButtonLabel: '更新',
  }
})(Root);
codePush.allowRestart();

AppRegistry.registerComponent('carrier', () => Root)
