/**
 * Created by xizhixin on 2018/4/24.
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Dimensions
} from 'react-native';

import ImageViewer from 'react-native-image-zoom-viewer';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#000'
    },
});

class receiptPhoto extends Component{
    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.state = {
            showImages: params.showImages.map(i => {
                console.log('received image', i);
                return {url: i ? i : ''};
            }),
            currentImageIndexFlag: false,
            currentImageIndex: 0
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.showImages && this.state.showImages.length !==0 && this.state.currentImageIndexFlag === false ?
                        <ImageViewer
                            style={{position: 'absolute', top: 0, left: 0, width: screenWidth, height: screenHeight}}
                            imageUrls={this.state.showImages}
                            enableImageZoom={true}
                            index={this.state.currentImageIndex}
                            renderIndicator={(currentIndex, allSize) => {
                                return React.createElement(View, { style: styles.count }, React.createElement(Text, { style: styles.countText }, allSize + '-' + currentIndex));
                            }}
                            onChange={(index) => {
                                console.log('index1==',index);
                                if(index === 5){
                                    this.setState({
                                        currentImageIndexFlag: true
                                    })
                                }
                            }}
                            onClick={() => {
                                this.setState({
                                    showImages : [],
                                    currentImageIndexFlag: false,
                                    currentImageIndex: 0
                                });
                                this.props.navigation.dispatch({type: 'pop'});
                            }}
                            saveToLocalByLongPress={false}
                        /> : null
                }
                {
                    this.state.showImages && this.state.showImages.length !==0 && this.state.currentImageIndexFlag ?
                        <ImageViewer
                            style={{position: 'absolute', top: 0, left: 0, width: screenWidth, height: screenHeight}}
                            imageUrls={this.state.showImages}
                            enableImageZoom={true}
                            index={5}
                            renderIndicator={(currentIndex, allSize) => {
                                return React.createElement(View, { style: styles.count }, React.createElement(Text, { style: styles.countText }, allSize + '-' + currentIndex));
                            }}
                            onChange={(index) => {
                                if(index === 5){
                                    this.setState({
                                        currentImageIndexFlag: false,
                                        currentImageIndex: 5
                                    })
                                }
                            }}
                            onClick={() => {
                                this.setState({
                                    showImages : [],
                                    currentImageIndexFlag: false,
                                    currentImageIndex: 0
                                });
                                this.props.navigation.dispatch({type: 'pop'});
                            }}
                            saveToLocalByLongPress={false}
                        /> : null
                }
            </View>
        )
    }
}

export default receiptPhoto;
