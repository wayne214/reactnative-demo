/*
 * @author:  wangl
 * @description:  货源详情 运货单界面
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';
import Communications from 'react-native-communications';
import * as StaticColor from '../../../constants/colors';
import Contact from '../../../../assets/img/driverOrder/contact.png';
import locationRedIcon from '../../../../assets/home/locationRed.png';

const styles = StyleSheet.create({
    dressIconStyle: {
        marginLeft: 10,
    }
});

class DetailsUserCell extends Component {
    static propTypes = {
        detailsUser: PropTypes.string,
        detailsPhoneNO_: PropTypes.string,
        detailsADDR: PropTypes.string,
        onSelectAddr: PropTypes.func.isRequired,
    };


    constructor(props) {
        super(props);
        this.state = {
            detailsUser: '',
            detailsPhoneNO_: '',
            detailsADDR: '',
        };
    }

    render() {
        const {deliveryInfo, onSelectAddr, isShowContactAndPhone} = this.props;
        return (
            <View
                style={{backgroundColor: StaticColor.WHITE_COLOR, paddingTop: 5,}}
            >
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{flex: 3, paddingRight: 20, paddingTop: 10}}>
                        {
                            isShowContactAndPhone ? <View
                                style={{
                                    flexDirection: 'row',
                                    paddingLeft: 35,
                                    marginBottom: 10,
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 15,
                                        // paddingLeft: 10,
                                        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
                                    }}
                                >
                                    {deliveryInfo.receiveContactName}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        Communications.phonecall(deliveryInfo.receivePhoneNum, true);
                                    }}
                                >
                                    <View style={{flexDirection: 'row'}}>
                                        <Image source={Contact} resizeMode='cover'/>
                                        <Text style={{
                                            fontSize: 15,
                                            marginLeft: 8,
                                            color: StaticColor.BLUE_CONTACT_COLOR,
                                        }}>联系对方</Text>
                                    </View>
                                </TouchableOpacity>
                            </View> : null
                        }
                        <TouchableOpacity
                            onPress={() => {
                                onSelectAddr();
                            }}
                            underlayColor={StaticColor.COLOR_SEPARATE_LINE}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    paddingRight: 40,
                                    marginTop: 5,
                                    marginBottom: 5,
                                }}
                            >
                                <Image source={locationRedIcon} style={styles.dressIconStyle}/>
                                <Text
                                    style={{
                                        fontSize: 15,
                                        color: StaticColor.LIGHT_BLACK_TEXT_COLOR,
                                        marginLeft: 10,
                                        // marginTop: 5,
                                        // marginBottom: 5,
                                    }}
                                >
                                    {deliveryInfo.receiveAddress}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View
                    style={{height: 1, backgroundColor: '#fff', marginLeft: 20, marginTop: 5}}
                />
            </View>
        );
    }
}
DetailsUserCell.propTypes = {
    detailsUser: React.PropTypes.object,
    detailsPhoneNO_: React.PropTypes.object,
    detailsADDR: React.PropTypes.object,
    deliveryInfo: React.PropTypes.object,
};
export default DetailsUserCell;
