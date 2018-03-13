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
                        车主姓名
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {resultInfo.haverName}
                    </Text>

                </View>
                <Line />

                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        车主电话
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {resultInfo.phoneNum}
                    </Text>

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        车辆类型
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {resultInfo.carType}
                    </Text>

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        车辆类别
                    </Text>
                    <Text style={styles.textInputStyle}>
                        没有返回
                    </Text>

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        车型长度
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {resultInfo.carLen}
                    </Text>

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        实载重量
                    </Text>
                    <Text style={styles.textInputStyle}>
                        {resultInfo.carryCapacity}吨
                    </Text>

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        实载体积
                    </Text>
                    <Text style={styles.textInputStyle}>
                        没有返回
                    </Text>

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        运输许可证号
                    </Text>
                    <Text style={styles.textInputStyle}>
                        没有返回
                    </Text>

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        挂车牌号
                    </Text>
                    <Text style={styles.textInputStyle}>
                        没有返回
                    </Text>

                </View>
                <Line />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleStyle}>
                        图片列表
                    </Text>
                </View>
                <Line />

                <ImagesItem firstName ="挂车行驶证"
                            secondName="挂车营运证"
                            firstImagePath=''
                            secondImagePath=''
                            imageClick={(index)=>{
                                this.imageClick(index);
                            }}/>

            </View>
        )
    }
}

export default verifiedDriverCardItem;
