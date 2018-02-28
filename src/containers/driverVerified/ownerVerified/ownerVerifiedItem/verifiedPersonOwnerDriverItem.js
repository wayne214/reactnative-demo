import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import Line from './../../verifiedIDItem/verifiedLineItem';
import ImagesItem from './../../verifiedIDItem/verifiedImagesItem';

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
    },
    titleStyle:{
        marginTop: 15,
        marginBottom: 15,
        marginLeft: 10,
        fontSize: 15,
        color: '#666666',
        flex: 1,
    },
    touchStyle:{
        flex: 2,
    },
    textInputStyle:{
        marginTop: 15,
        marginBottom: 15,
        marginRight: 10,
        fontSize: 15,
        color: '#333333',
        flex: 1,
        textAlign: 'right',
    }
});

class verifiedDriverItem extends Component{
    constructor(props) {
        super(props);

        this.state={
            IDName: this.props.IDName,
            IDCard: this.props.IDCard,
        };

        this.nameValueChange = this.nameValueChange.bind(this);
        this.cardValueChange = this.cardValueChange.bind(this);
        this.imageClick = this.imageClick.bind(this);
    }


    /*输入姓名*/
    nameValueChange(text){
        this.props.nameChange(text);
    }
    /*输入身份证号*/
    cardValueChange(text){
        this.props.cardChange(text);
    }

    imageClick(index){
        this.props.imageClick(index);
    }
    render() {
        const {resultInfo} = this.props;

        return (
            <View style={styles.container}>

                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        所有人
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {resultInfo.rmcAnalysisAndContrast ? resultInfo.rmcAnalysisAndContrast.manualHaverName : ''}
                    </Text>

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        车牌号
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {resultInfo.rmcAnalysisAndContrast ? resultInfo.rmcAnalysisAndContrast.manualCarNum : ''}
                    </Text>

                </View>
                <Line />

                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>

                        发动机号
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {resultInfo.rmcAnalysisAndContrast ? resultInfo.rmcAnalysisAndContrast.manualEngineNum : ''}
                    </Text>

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>

                        有效期至
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {resultInfo.rmcAnalysisAndContrast ? resultInfo.rmcAnalysisAndContrast.drivingValidity.replace(/-/g,'/') : ''}
                    </Text>

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        图片列表
                    </Text>
                </View>
                <Line />


                <ImagesItem firstName ="行驶证主页"
                            secondName="行驶证副页"
                            firstImagePath={resultInfo.rmcPicAddress ?
                                               (resultInfo.rmcPicAddress.drivingCardHomePageThumbnailAddress ? resultInfo.rmcPicAddress.drivingCardHomePageThumbnailAddress : '') : ''}
                                                secondImagePath={resultInfo.rmcPicAddress ?
                            (resultInfo.rmcPicAddress.drivingPermitSubPageThumbnailAddress ? resultInfo.rmcPicAddress.drivingPermitSubPageThumbnailAddress : '') : ''}
                            imageClick={(index)=>{
                                this.imageClick(index);
                            }}/>
            </View>
        )
    }
}

export default verifiedDriverItem;
