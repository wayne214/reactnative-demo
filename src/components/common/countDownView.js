import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';

const LCCountDownButtonState = {
  LCCountDownButtonActive: 0,
  LCCountDownButtonDisable: 1,
}

var timeRecodes = [];

export default class CountDownView extends React.Component {

	constructor(props) {
		super(props);
		this.state={
			btnTitle:'获取验证码'
		}
	}

	static propTypes = {
		id: PropTypes.string,
		count: PropTypes.number,
		pressAction: PropTypes.func,
		// frameStyle: PropTypes.style
	}

	buttonState = LCCountDownButtonState.LCCountDownButtonActive;

	componentWillMount() {
		this.shouldSetState = true;
	}

	componentDidMount() {
	  const { id, count } = this.props;
	  for(var i = 0 ; i < timeRecodes.length; i ++){
			let obj = timeRecodes[i];
			if (obj.id == id) {
		    let liveTime = Date.now() - obj.startTime;
		    if (liveTime < obj.deathCount * 1000){
	        let detalTime = Math.round(liveTime / 1000);
	        let content = `重新获取(${ count - detalTime })s`;
	        this.setState({ btnTitle:content });
	        this.startCountDownWithCount(obj.startTime);
		    }
			}
	  }
	}

	clearTime(){
		this.interval && clearInterval(this.interval);
	}

	componentWillUnmount() {
		this.clearTime();
		this.shouldSetState = false;
	}

	startCountDownWithCount(startTime){
		this.buttonState = LCCountDownButtonState.LCCountDownButtonDisable;
		const { count }= this.props;
		this.startTime = startTime;
		this.interval = setInterval(() => {
	    let detalTime = Math.round((Date.now() - this.startTime) / 1000);
	    let content = `重新获取(${ count - detalTime })s`;
	    if (detalTime >= count) {
        content = '获取验证码';
        this.clearTime();
        this.buttonState = LCCountDownButtonState.LCCountDownButtonActive;
	    }
	    if(this.shouldSetState) {
        this.setState({ btnTitle: content });
	    }
		}, 1000)
	}

  recordButtonInfo(){
    const { id, count } = this.props;
    var hasRecord = false;
    for (var i = 0 ; i < timeRecodes.length ; i ++){
      let obj = timeRecodes[i];
      if(obj.id == id){
        obj.startTime = Date.now();
        hasRecord = true;
        break;
      }
    }
    if (!hasRecord){
      let buttonInfo = {
        id: id,
        deathCount: count,
        startTime: Date.now()
      }
      timeRecodes.push(buttonInfo)
    }
  }

  startCountDown() {
    this.recordButtonInfo();
    this.startCountDownWithCount(Date.now());
  }

  render(){
    const { frameStyle } = this.props;  	
    let isDisable = this.buttonState == LCCountDownButtonState.LCCountDownButtonDisable;
    return (
      <TouchableOpacity disabled={ isDisable } activeOpacity={ 1 }
        onPress={ () => { this.props.pressAction && this.props.pressAction() } }
        style={ [styles.container, frameStyle] }>
        <Text style={[styles.txtCommonStyle, isDisable ? styles.disableTxtStyle : styles.activeTxtStyle]}>
          { this.state.btnTitle }
        </Text>
      </TouchableOpacity>
    );
  }

}

const styles = StyleSheet.create({
  container:{
  	marginRight: 15,
	  borderRadius:3,
	  alignItems:'center',	  
	  justifyContent:'center',
	  backgroundColor: 'transparent'
  },
  txtCommonStyle:{
    fontSize: 15,
  },
  disableTxtStyle:{
		fontSize: 15,  	
    color:'#ccc',
  },
  activeTxtStyle:{
		fontSize: 15,
		color: '#17a9df',
  }
});
