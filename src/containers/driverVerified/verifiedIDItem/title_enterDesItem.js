/**
 * Created by chj on 2018/3/2.
 */
import React ,{PropTypes, Component}  from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Platform,
} from 'react-native'
import Line from '../verifiedIDItem/verifiedLineItem';

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    titleStyle:{
        marginLeft: 20,
        flex: 1,
        marginTop: 15,
        fontSize: 15,

    },
    textInputStyle:{
        ...Platform.select({
            ios: {
                marginTop: 15,
                marginBottom: 15,
            }
        }),
        marginRight: 20,
        fontSize: 15,
        color: '#333333',
        flex: 2,
        textAlign: 'right',

    }
});
class title_enterDesItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            carNumber: '',
        }

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{backgroundColor: 'white'}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.titleStyle}>
                            {this.props.title}
                        </Text>
                        <TextInput style={styles.textInputStyle}
                                   maxLength={15}
                                   underlineColorAndroid={'transparent'}
                                   onChangeText={(text) => {
                                       this.setState({
                                           carNumber: text,
                                       });
                                       this.props.entering(text);
                               }}
                                   value={this.state.carNumber}
                                   placeholder={this.props.des}
                                   keyboardType={this.props.keyboardType}

                        />
                    </View>
                    <Line />
                </View>

            </View>


        )
    }
}
title_enterDesItem.propTypes = {
    title: PropTypes.string,
    des: PropTypes.string,
    entering: PropTypes.func,
    keyboardType:PropTypes.string
};

title_enterDesItem.defaultProps = {
    title: '标题',
    des: '描述',
    entering: (text)=>{},
    keyboardType: 'default'
};


export default title_enterDesItem;
