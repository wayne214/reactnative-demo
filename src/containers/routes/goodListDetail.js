import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    ScrollView,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import NavigatorBar from '../../components/common/navigatorbar';
import * as COLOR from '../../constants/colors'
const { height,width } = Dimensions.get('window')
import AddressItem from '../../components/routes/goodlistAddressItem';
import ItemTop from '../../components/routes/goodlistdetailTopItem';
import MutilAddress from '../../components/routes/goodlistdetailMutilAddress';
import GoodsDetail from '../../components/routes/goodlistdetailgoodDetail';
import GoodsDetailTime from '../../components/routes/goodlistdetailsetTimeItem';
import GoodsDetailMoney from '../../components/routes/goodlistdetailMoneyItem';

class goodListDetail extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {

    }
    render() {
        return (
            <View style={styles.container}>
                <NavigatorBar
                    title='货源详情'
                    router={this.props.navigation}
                    hiddenBackIcon={false}
                />
                <ScrollView>

                    <ItemTop price='123'/>
                    <View style={{backgroundColor: 'white', marginTop: 10,padding: 20}}>
                        <AddressItem startAddress='北京市海淀区' endAddress='中华人民共和国首都'/>
                    </View>
                    <MutilAddress address={['河南省郑州市高新区80号绿新区普惠路78号绿地','郑州市','河南省郑州市惠济区8号','高新区29号2层']}/>
                    <View style={{backgroundColor: 'white', marginTop: 10}}>
                        <GoodsDetail/>
                    </View>
                    <GoodsDetailTime/>
                    <GoodsDetailMoney/>

                    <TouchableOpacity style={{padding: 15, backgroundColor: '#0092FF',margin: 20, borderRadius: 3}}>
                        <Text style={{textAlign: 'center', fontSize: 17,color: 'white',fontWeight: 'bold'}}>立即抢单</Text>
                    </TouchableOpacity>
                </ScrollView>

            </View>
        )

    }
}

const styles =StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.APP_CONTENT_BACKBG
    },
});

function mapStateToProps(state){
    return {};
}

function mapDispatchToProps (dispatch){
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(goodListDetail);

