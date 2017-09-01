/**
 * 适用于option大于4项滴
 */
import React, { Component } from 'react';
import {
  Text,
  View,
  Modal,
  ListView,
  Animated,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
const { width, height } = Dimensions.get('window')

class SimplePicker extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state= {
      dataSource: ds.cloneWithRows(props.data),
      visible: this.props.visible,
    };
    this._renderItem = this._renderItem.bind(this);
    this._modalPress = this._modalPress.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps) return;
    if (nextProps.visible !== this.state.visible) {
      this.setState({ visible: nextProps.visible });
    }
    if (nextProps.data) {
      this.setState({ dataSource: this.state.dataSource.cloneWithRows(nextProps.data) });
    }
  }

  _selected(rowData) {
    this.setState({ visible: false });
    this.props.modalPress();
    this.props.onPickerSelect(rowData)
  }

  _renderItem(rowData, section, rowIndex) {
    const _style = parseInt(rowIndex) === (this.state.dataSource._cachedRowCount - 1) ? { borderBottomWidth: 0 } : {};
    return (
      <TouchableOpacity
        activeOpacity={ 1 }
        onPress={ this._selected.bind(this, rowData) }>
        <View key={ rowIndex }
          style={ [styles.textView, _style] }>
          <Text style={ styles.text }>{ rowData.value || rowData.bankName }</Text>
        </View>
      </TouchableOpacity>
    );
  }

  _modalPress() {
    this.setState({ visible: false })
    this.props.modalPress();
  }

  render() {
    return (
      <Modal
        transparent={ true }
        animationType={ 'none' }
        visible={ this.state.visible }
        onRequestClose={ () => console.log('ignore warining') }>
        <TouchableOpacity
          activeOpacity={ 1 }
          style={ styles.closeContainer }
          onPress={ this._modalPress }>
          <View></View>
        </TouchableOpacity>

        <View style={ styles.container }>
          <View style={ styles.contentView }>

            <View style={ styles.options }>
              <ListView
                style={ styles.listView }
                renderRow={ this._renderItem }
                enableEmptySections={ true }
                dataSource={ this.state.dataSource } />
            </View>

            <TouchableOpacity
              activeOpacity={ 1 }
              onPress={ this._modalPress }>
              <View style={ styles.btnView }>
                <Text style={ styles.cancelText }>取消</Text>
              </View>
            </TouchableOpacity>

          </View>
        </View>

      </Modal>
    );
  }
}

SimplePicker.propTypes = {
  ...ListView.PropTypes,
  visible: PropTypes.bool.isRequired,
  onPickerSelect: PropTypes.func.isRequired,
}

export default SimplePicker

const styles = StyleSheet.create({
  closeContainer: {
    flex: 1,
    height: height - 550,
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  container: {
    flex: 1,
    paddingTop: 5,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  contentView: {
    width,
    borderRadius: 6,
    width: width - 20,
    alignItems: 'center',
  },
  options: {
    width: width - 30,
    height: 200,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  textView: {
    height: 48,
    alignItems: 'center',
    borderBottomWidth: 1,
    justifyContent: 'center',
    borderBottomColor: '#e6e6e6',
  },
  text: {
    fontSize: 16,
    color: '#999999',
  },
  listView: {
    flex: 1,
    margin: 5,
  },
  btnView: {
    width: width - 30,
    height: 50,
    marginTop: 10,
    borderRadius: 6,
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 18,
    color: '#666666'
  }
});
