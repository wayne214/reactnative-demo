import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import Line from './verifiedLineItem';
import ImagesItem from './verifiedImagesItem';

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
        flex: 2,
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
        flex: 3,
        textAlign: 'right',
    }
});

class verifiedDriverCardItem extends Component{
    constructor(props) {
        super(props);


        this.imageClick = this.imageClick.bind(this);
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
                        车牌号
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {resultInfo.carNum}
                    </Text>

                </View>
                <Line />

                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        所有人
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {resultInfo.haverName}
                    </Text>

                </View>

                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        车辆识别代码(VIN)
                    </Text>
                    <Text style={styles.textInputStyle}>
                        1234567890
                    </Text>

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        发动机号码
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {resultInfo.engineNumber}
                    </Text>

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        有效期至
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {resultInfo.driveValidity ? resultInfo.driveValidity.toString().replace(/-/g,'/') : ''}
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
                            thirdName="车头照"
                            firstImagePath={resultInfo.drivingLicenseThumbnail ?
                            resultInfo.drivingLicenseThumbnail : resultInfo.drivingLicensePic ?
                            resultInfo.drivingLicensePic : ''}
                            secondImagePath={resultInfo.drivingLicenseSecondaryThumbnail ?
                            resultInfo.drivingLicenseSecondaryThumbnail : resultInfo.drivingLicenseSecondaryPic?
                            resultInfo.drivingLicenseSecondaryPic : ''}
                            thirdImagePath={resultInfo.carHeadThumbnail ?
                            resultInfo.carHeadThumbnail : resultInfo.carHeadPic ?
                            resultInfo.carHeadPic : ''}
                            imageClick={(index)=>{
                                this.imageClick(index);
                            }}/>

            </View>
        )
    }
}

export default verifiedDriverCardItem;
