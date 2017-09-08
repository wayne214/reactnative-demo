'use strict'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	View,
	Text,
	StyleSheet,
	// Modal,
	TouchableOpacity,
	Dimensions,
	ScrollView,
	Image
} from 'react-native';
import NavigatorBar from '../../components/common/navigatorbar'
import * as COLOR from '../../constants/colors'
import Button from 'apsl-react-native-button'
import * as RouteType from '../../constants/routeType'
// import Swiper from 'react-native-swiper';
import HelperUtil from '../../utils/helper';
import Modal from 'react-native-root-modal';
// import PhotoView from 'react-native-photo-view';
import ImagePreview from '../../components/common/imagePreview.js'

const { height,width } = Dimensions.get('window')

class LadingBill extends Component {
	constructor(props) {
	  super(props);
	  const {params} = this.props.navigation.state
	  this.state = {
	  	title: params.title || '单据',
	  	showPhoto: false,
	  	images: params.images,
	  	activeIndex: 0
	  }
	  if (!(params.images && params.images.length > 0 )) {
	  	console.warn('必须有图片才能查看');
	  };
	}
	componentDidMount() {

	}
	static navigationOptions = ({navigation}) => {
		const {params} = navigation.state
		return {
			headerTitle: params.title
		}
	}
	render() {
		const { showPhoto,images,activeIndex,title } = this.state
		const photos = images.map((item,index)=>{
			return (
				<View key={index} style={[styles.imageView,{marginRight: (index % 3 == 2 ? 10 : 15)}]}>
					<TouchableOpacity style={{flex: 1}} activeOpacity={0.8} key={index}  onPress={()=>{
						this.setState({
							showPhoto: true,
							activeIndex: index
						})
					}}>
						<Image source={{uri: HelperUtil.getFullImgPath(item,parseInt(width/3 * 2), height)}} style={{flex: 1,resizeMode: 'cover'}}/>
					</TouchableOpacity>
				</View>
			)
		})

		const imagePathes = images.map((item,index)=>{
			return HelperUtil.getFullImgPath(item, width * 2,height)
		})
		return <View style={styles.container}>
			{/*<NavigatorBar router={this.props.router} title={ title }/>*/}
			<ScrollView style={{flex: 1}}>
				<View style={styles.scrollViewContent}>
					{photos}
				</View>
			</ScrollView>
			<ImagePreview show={showPhoto} activeIndex={activeIndex} imagePathes={imagePathes} hide={()=>{
				this.setState({ showPhoto: false })
			}}/>
		</View>
	}

}


const styles =StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLOR.APP_CONTENT_BACKBG
	},
	modalView: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,1)'
	},
	scrollViewContent: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		flexWrap:'wrap',
		paddingLeft: 10,
		paddingBottom: 15
	},
	imageView: {
		width: parseInt((width - 20 - 30)/3),
		height: parseInt((width - 20 - 30)/3*0.75),
		backgroundColor: 'lightgray',
		marginTop: 15
	}
})

const mapStateToProps = (state) => {
	return {}
}

const mapDispatchToProps = (dispatch) => {
	return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(LadingBill);

// const photoViews = images.map((item,index)=>{
// 	return (
// 		<PhotoView
// 			key={ index }
// 			resizeMode={ 'contain'}
// 		  source={{uri: HelperUtil.getFullImgPath(item, width * 2,height)}}
// 		  minimumZoomScale={0.5}
// 		  maximumZoomScale={3}
// 		  androidScaleType="fitCenter"
// 		  onLoad={() => console.log("Image loaded!")}
// 		  style={{width, height}}
// 		  onTap={() => }/>
// 	);
// })

// <Modal animationType={ "fade" } transparent={true} visible={showPhoto} onRequestClose={()=>console.log('resolve warnning')} >
// 	<View style={styles.modalView}>
// 		<Swiper style={ styles.wrapper } showsButtons={ false }
// 			height={ height } loop={ false }
// 			showsPagination={ true }
// 			renderPagination={(index, total, context)=>{
// 				return (
// 					<View style={{ marginBottom: 0, width,height: 20,justifyContent: 'center',alignItems: 'center'}}>
// 						<Text style={{color: COLOR.APP_THEME,fontSize: 16}}>{`${index+1}/${total}`}</Text>
// 					</View>
// 				)
// 			}}
// 			index={activeIndex}
// 			dotColor={COLOR.APP_CONTENT_BACKBG}
// 			activeDotColor={COLOR.APP_THEME}
// 			onMomentumScrollEnd={()=> console.log("-- scroll to end ") }>
// 			{ photoViews }
// 		</Swiper>
// 	</View>
// </Modal>