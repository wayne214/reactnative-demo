/**
 * Created by xizhixin on 2017/7/6.
 * 回单照片大图预览
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import loadFail from '../../../assets/img/load_fail.png';
const simpleStyle = {
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    count: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 38,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    countText: {
        color: 'white',
        fontSize: 16,
        backgroundColor: 'transparent',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: {
            width: 0, height: 0.5
        },
        textShadowRadius: 0
    }
};

export default class ImageShow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
            imageIndex: 1,
        };
    }
    componentWillMount() {
        const params = this.props.navigation.state.params;
        const images = params.image;
        const pageNum = params.num;
        this.setState({
            images: images,
            imageIndex: pageNum,
        });
    }

    render() {
        const navigator = this.props.navigation;
        return (
            <View style={simpleStyle.container}>
                {/*<NavigatorBar*/}
                {/*title={'回单'}*/}
                {/*navigator={navigator}*/}
                {/*leftButtonHidden={false}*/}
            {/*/>*/}
                <ImageViewer
                    imageUrls={this.state.images}
                    enableImageZoom={true}
                    index={this.state.imageIndex}
                    failImageSource={loadFail}
                    renderIndicator={(currentIndex, allSize) => {
                        return React.createElement(View, { style: simpleStyle.count }, React.createElement(Text, { style: simpleStyle.countText }, allSize + '-' + currentIndex));
                    }}
                    onChange={(index) => {
                    }}
                    onClick={() => {
                        this.props.navigation.goBack();
                    }}
                    saveToLocalByLongPress={false}

                />
            </View>
        );
    }
}



