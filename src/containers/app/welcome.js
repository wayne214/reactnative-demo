import React from 'react';
import {connect} from 'react-redux';
import {
    View,
    Image,
    Text,
    Animated,
    TouchableOpacity,
    NativeModules,
    InteractionManager,
} from 'react-native';
import Swiper from 'react-native-swiper';
import {height, width} from '../../constants/dimen';
import styles from '../../../assets/css/welcome';
import Storage from '../../utils/storage';
import * as RouteType from '../../constants/routeType'
import PropTypes from 'prop-types';

class WelcomeContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pageOneActive: false,
            pageTwoActive: false,
            pageTowGuyActive: false,
            pageOneAnim: new Animated.Value(0),
            pageTwoAnim: new Animated.Value(0),
            pageTwoGuyAnim: new Animated.Value(0.1),
        };
        this.pageOneText = new Animated.Value(0);
        this.pageTwoText = new Animated.Value(0);
        this.fadeInTowText = new Animated.Value(0);
        this.fadeInGuy = new Animated.Value(0);
        if (width >= 320) this._marginBottom = 130;
        if (width >= 375) this._marginBottom = 160;
        if (width >= 414) this._marginBottom = 180;
        this._toMain = this._toMain.bind(this);
        this._onMomentumScrollEnd = this._onMomentumScrollEnd.bind(this);
    }

    static propTypes = {
        navigator: PropTypes.object
    }

    componentDidMount() {
        this.timer = setTimeout(() => {
            this.pageOneText.setValue(0);
            Animated.timing(
                this.state.pageOneAnim, {
                    toValue: this.state.pageOneActive ? 0 : 1,
                    duration: 1000,
                },
            ).start(() => {
                Animated.timing(this.pageOneText, {
                    toValue: 1,
                }).start();
            });
        }, 500);
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    _onMomentumScrollEnd(e, state, context) {
        Animated.sequence([
            Animated.timing(
                this.state.pageTwoAnim, {
                    toValue: this.state.pageTwoActive ? 0 : 1,
                    duration: 1000,
                },
            ),
            Animated.spring(this.state.pageTwoGuyAnim, {
                toValue: 1,
                friction: 2,
            }),
            Animated.spring(this.pageTwoText, {
                toValue: 1,
                // friction: 10,
            })
        ]).start();
    }

    _toMain() {
        // const { navigator } = this.props;
        Storage.save('flag', '1');
        Storage.save('IS_FIRST_FLAG', '1');
        this.props.navigation.dispatch({
            type: RouteType.ROUTE_LOGIN_WITH_PWD_PAGE,
            mode: 'reset',
            params: {title: '', insiteNotice: '123'}
        })
        // NativeModules.NativeModule.inited();
        // this.props.dispatch(getInitStatus());
        // InteractionManager.runAfterInteractions(() => {
        // 	navigator.resetTo({
        // 		component: LoginContainer,
        // 		name: 'login',
        // 	});
        // });
    }

    render() {
        return (
            <Swiper style={styles.wrapper} showsButtons={false}
                    height={height} loop={false}
                    showsPagination={false}
                    onMomentumScrollEnd={this._onMomentumScrollEnd}>
                <View style={styles.slide}>
                    <Image style={styles.image} source={require('../../../assets/img/guide/guide1.png')}
                           resizeMode={'stretch'}>

                    </Image>
                </View>
                <View style={styles.slide}>
                    <Image style={styles.image} source={require('../../../assets/img/guide/guide2.png')}
                           resizeMode={'stretch'}>

                        <TouchableOpacity onPress={() => {
                            this._toMain()
                        }}>
                            <View style={{
                                height:100,
                                width,
                                marginTop:height-100,
                            }}/>

                        </TouchableOpacity>
                    </Image>
                </View>
            </Swiper>
        );
    }

}

const mapStateToProps = (state) => {
    const {app} = state;
    return {
        guides: app.get('guide'),
        index: app.get('index')
    };
}

const mapDispatchToProps = dispatch => {
    return {
        dispatch,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeContainer);
