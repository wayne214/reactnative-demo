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
        flex: 2,
        textAlign: 'right',
    }
});

class verifiedRealNameItem extends Component{
    constructor(props) {
        super(props);

        this.imageClick = this.imageClick.bind(this);
    }

    componentDidMount() {
    }

    imageClick(index){
        this.props.imageClick(index);
    }
    render() {
        const {resultInfo, type} = this.props;
        console.log('resultInfo:=',this.props.resultInfo);

        let name;
        let cardID;
        let cardTime;

        if (resultInfo.rmcAnalysisAndContrast){
            if (type === "companyOwner" ){
                name =  resultInfo.rmcAnalysisAndContrast.agentIdCardName;
                cardID= resultInfo.rmcAnalysisAndContrast.agentIdCard;
                cardTime = resultInfo.rmcAnalysisAndContrast.agentIdCardValidity.replace(/-/g,'/')
            }else {
                name = resultInfo.rmcAnalysisAndContrast.manualLegalIdCardName;
                cardID = resultInfo.rmcAnalysisAndContrast.manualLegalIdCard;
                cardTime = resultInfo.rmcAnalysisAndContrast.manualLegalIdCardValidity.replace(/-/g,'/')
            }
        }


        let image1 = '';
        let image2 = '';
        if (type === 'companyOwner'){
            image1 = resultInfo.rmcPicAddress ?
                (resultInfo.rmcPicAddress.agentPositiveCardThumbnailAddress ? resultInfo.rmcPicAddress.agentPositiveCardThumbnailAddress : '') :  ''
        }else {
            image1 = resultInfo.rmcPicAddress ?
                (resultInfo.rmcPicAddress.legalPersonPositiveCardThumbnailAddress ? resultInfo.rmcPicAddress.legalPersonPositiveCardThumbnailAddress : '') :  ''
        }
        if (type === 'companyOwner'){
            image2 = resultInfo.rmcPicAddress ?
                (resultInfo.rmcPicAddress.agentOppositeCardThumbnailAddress ? resultInfo.rmcPicAddress.agentOppositeCardThumbnailAddress : '')
                : ''
        }else {
            image2 = resultInfo.rmcPicAddress ?
                (resultInfo.rmcPicAddress.legalPersonOppositeCardThumbnailAddress ? resultInfo.rmcPicAddress.legalPersonOppositeCardThumbnailAddress : '')
                : ''
        }
        return (
            <View style={styles.container}>

                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        姓名
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {name}
                    </Text>

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        身份证号
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {cardID}
                    </Text>

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>

                        有效期至
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {cardTime}
                    </Text>

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        图片列表
                    </Text>
                </View>
                <Line />


                <ImagesItem firstName ="身份证正面"
                            secondName="身份证反面"
                            // thirdName="半身照"
                            firstImagePath={image1}
                            secondImagePath={image2}
                            // thirdImagePath={resultInfo.handleIdThumbnailAddress ?
                            // resultInfo.handleIdThumbnailAddress : resultInfo.headPortrait ?
                            // resultInfo.headPortrait : ''}
                            imageClick={(index)=>{
                                this.imageClick(index);
                            }}

                />
            </View>
        )
    }
}

export default verifiedRealNameItem;
