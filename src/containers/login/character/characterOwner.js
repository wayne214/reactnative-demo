/**
 * 角色选择界面
 * by：wl
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
    Text,
    View,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import Storage from '../../../utils/storage';
import StorageKey from '../../../constants/storageKeys';
import CharacterCell from '../../../components/login/characterCell';
/*角色-个人车主*/
import PersonalOwner from '../../../../assets/img/character/personalOwner.png';
/*角色-企业车主*/
import BusinessOwners from '../../../../assets/img/character/businessOwners.png';
import NavigatorBar from '../../../components/common/navigatorbar';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
});

class CharacterOwner extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    static navigationOptions = ({navigation}) => {
        const {state, setParams} = navigation
        return {
            tabBarLabel: '选择身份',
            header: <NavigatorBar
                title='选择身份'
                hiddenBackIcon={false}
                router={navigation}/>,
        }
    };

    render() {
        const navigator = this.props.navigation;

        return (
            <View style={styles.container}>
                <View style={{flex:1,backgroundColor: '#f5f5f5'}}>

                    <CharacterCell
                        textAbout={'个人车主'}
                        imageAbout={PersonalOwner}
                        onClick={() => {
                            console.log('选择个人车主')
                            Storage.get(StorageKey.personownerInfoResult).then((value) => {
                                                if (value){
                                                    navigator.navigate('PersonCarOwnerAuth', {
                                                        resultInfo: value,
                                                    });
                                                }else {
                                                   navigator.navigate('PersonCarOwnerAuth');
                                                }
                                            });
                        }}
                    />

                    <CharacterCell
                        textAbout={'企业车主'}
                        imageAbout={BusinessOwners}
                        onClick={() => {
                            console.log('选择企业车主')

                            Storage.get(StorageKey.enterpriseownerInfoResult).then((value) => {
                                                if (value){
                                                    navigator.navigate('CompanyCarOwnerAuth', {
                                                        resultInfo: value,
                                                    });
                                                }else {
                                                   navigator.navigate('CompanyCarOwnerAuth');
                                                }
                                            });
                        }}
                    />

                </View>

            </View>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        sendLoginSuccessAction: (result) => {
            dispatch()
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CharacterOwner);
