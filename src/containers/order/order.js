import React from 'react';
import {
  Text,
  View,
  Platform,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux'
import styles from '../../../assets/css/home'

class MainContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};

  }

  render() {
    return (
      <Text>order page</Text>
    );
  }

}

const mapStateToProps = (state) => {
  const { app } = state;
  return {
    user: app.get('user'),
    tabs: app.get('tabs')
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
