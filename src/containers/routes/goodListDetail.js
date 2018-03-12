import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Modal
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
import DateHandler from '../../utils/dateHandler'
import Picker from '../../utils/picker';
import moment from 'moment';
let startTime = 0;


class goodListDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 0,
            modalVisiable: false,
            pickerDataType: '',
            pickerDateSource: [],

            installDateStart: '',
            installDateEnd: '',
            installTimeStart: null,
            installTimeEnd: null,
            arrivalDate: null,
        }
    }
    componentDidMount() {

    }


    _showPickerView(type){

        const {installDateStart,installTimeStart,installDateEnd,installTimeEnd,arrivalDate} = this.state

        const overTimeStamp = Date.parse(moment(installDateStart, 'YYYY-MM-DD').format())
        const tomorrowStamp = overTimeStamp + 24 * 60 * 60 * 1000
        const tomorrowDate = moment.unix(tomorrowStamp/1000).format('YYYY-MM-DD');


        switch(type){
            case 'installDateStart':
                this.setState({pickerDateSource: DateHandler.createDateData()});
                break;
            case 'installTimeStart':
                this.setState({pickerDateSource: DateHandler.createInstallStartTimeData(installDateStart)});
                break;
            case 'installDateEnd':
                if (installDateStart) {
                    this.setState({pickerDateSource: [installDateStart,tomorrowDate]})
                }else{
                    this.setState({pickerDateSource: DateHandler.createDateData(installDateStart && installDateStart.split('-'))});
                }
                break;
            case 'installTimeEnd':

                if (installTimeStart) {
                    if (installDateStart == installDateEnd) {
                        //同一天 installTimeStart ~ 23:59
                        this.setState({pickerDateSource: DateHandler.createTimeData(installTimeStart)});
                    }else{
                        // 不是同一天  0:0 ~ installTimeStart
                        this.setState({pickerDateSource: DateHandler.createTimeData(null,installTimeStart)});
                    }
                }else{
                    this.setState({pickerDateSource: DateHandler.createTimeData('0:0')});
                }


                break;
            case 'arrivalDate':
                this.setState({pickerDateSource: DateHandler.createDateData(installDateStart && installDateStart.split('-'))});
                break;
            default:
                console.warn("type is error ");
        }
        this.setState({
            pickerDataType: type,
            modalVisiable: true,
        })
    }
    _onPickerConfirm(data){

        const { pickerDataType, pickerDateSource } = this.state;
        if (data && data.length > 0) {
            switch(pickerDataType){
                case 'installDateStart':
                    this.setState({
                        installDateStart: DateHandler.dateNumberFormat(`${data[0]}-${data[1]}-${data[2]}`),
                        installTimeStart: '',
                        installDateEnd: '',
                        installTimeEnd: '',
                        arrivalDate: ''
                    })
                    break;
                case 'installTimeStart':
                    this.setState({
                        installTimeStart: `${data[0]}:${data[1]}`.replace('时','').replace('分',''),
                        installTimeEnd: ''
                    })
                    break;
                case 'installDateEnd':
                    this.setState({
                        // installDateEnd: DateHandler.dateNumberFormat(`${data[0]}-${data[1]}-${data[2]}`),
                        installDateEnd: DateHandler.dateNumberFormat(`${data[0]}`),
                        installTimeEnd:''
                    })
                    break;
                case 'installTimeEnd':
                    this.setState({
                        installTimeEnd: `${data[0]}:${data[1]}`.replace('时','').replace('分','')
                    })
                    break;
                case 'arrivalDate':
                    this.setState({
                        arrivalDate: DateHandler.dateNumberFormat(`${data[0]}-${data[1]}-${data[2]}`)
                    })
                    break;
                default:
                    console.warn("none type is matched ");
            }
        }
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

                    <GoodsDetailTime startTime={this.state.installDateStart}
                                     endTime={this.state.installDateEnd}
                                     startaTimeClick={()=>{
                                         this._showPickerView('installDateStart')
                                     }}
                                     endTimeClick={()=>{
                                         this._showPickerView('installDateEnd')
                                     }}/>

                    <GoodsDetailMoney/>

                    <TouchableOpacity style={{padding: 15, backgroundColor: '#0092FF',margin: 20, borderRadius: 3}}>
                        <Text style={{textAlign: 'center', fontSize: 17,color: 'white',fontWeight: 'bold'}}>立即抢单</Text>
                    </TouchableOpacity>
                </ScrollView>

                <Modal animationType={ "fade" } transparent={true} visible={this.state.modalVisiable} onRequestClose={()=>console.log('resolve warnning')} >
                    <Picker data={this.state.pickerDateSource}
                            onPickerConfirm={(data)=>{
						this.setState({modalVisiable: false});
						this._onPickerConfirm(data);


					}}
                            onPickerCancel={(data)=>{
						this.setState({modalVisiable: false});
					}}
                            onPickerSelect={(data)=>{
						console.log(" log onPickerSelect",data);


					}}/>
                </Modal>
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

