'use strict'

import React, { Component, PropTypes } from 'react';
import {
	View,
	Text,
	Image,
	StyleSheet,
	Dimensions,
	TouchableOpacity
} from 'react-native';
import topIcon from '../../../assets/img/order/coordinate.png'
import closeIcon from '../../../assets/img/order/close_coordinate.png'
import * as COLOR from '../../constants/colors'

const { height,width } = Dimensions.get('window')

class Coordination extends Component{
	constructor(props) {
		super(props);
	}

	static propTypes = {
	  style: View.propTypes.style,
	};
	componentDidMount(){

	}
	render() {
		const {closeAction,data} = this.props

		return (
			<View style={styles.container}>
				<View style={{borderRadius: 8}} removeClippedSubviews={true}>
					<View>
						<Image style={{width: 295 ,height: 50,marginTop: 1}} source={topIcon}/>
						<View style={{position: 'absolute',width: 295,bottom: 17}}>
							<Text style={{textAlign: 'center',fontSize: 15,color: 'white',fontWeight: 'bold'}}>协调结果</Text>
						</View>

						<View style={{width: 30 ,height: 33,position: 'absolute',right: 20}}>
							<TouchableOpacity activeOpacity={0.8} onPress={()=>{
								if(closeAction){closeAction()}
							}}>
								<Image  source={closeIcon}/>
							</TouchableOpacity>
						</View>
					</View>
					<View style={{width: 295,backgroundColor: 'white',padding: 15,borderBottomRightRadius: 8,borderBottomLeftRadius: 8}}>
						<Text style={{color: COLOR.TEXT_NORMAL,fontSize:12,marginBottom: 15}}>申请协调方：<Text style={{color: COLOR.TEXT_BLACK}}>{data.consult}</Text></Text>
						<Text style={{color: COLOR.TEXT_NORMAL,fontSize:12,marginBottom: 15}}>应收运费：<Text style={{color: COLOR.TEXT_BLACK}}>¥{data.dealPrice}</Text></Text>
						<Text style={{color: COLOR.TEXT_NORMAL,fontSize:12,marginBottom: 15}}>实收运费：¥<Text style={{color: COLOR.TEXT_MONEY}}>{data.paymentPrice}</Text></Text>
						<Text style={{color: COLOR.TEXT_NORMAL,fontSize:12,marginBottom: 8}}>协调内容：</Text>
						<Text style={{color: COLOR.TEXT_BLACK,fontSize:12,lineHeight: 25}}>{data.content}</Text>
					</View>
				</View>
			</View>
		)
	}
}
const styles = StyleSheet.create({
	container:{
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.6)',
		justifyContent: 'center',
		alignItems: 'center'
	}
})

export default Coordination