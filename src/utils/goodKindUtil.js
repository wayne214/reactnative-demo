/**
 * database tools class
 */
import React from 'react';
import {
    Image,
    StyleSheet,
} from 'react-native';

import AgricultureProduct from '../../assets/img/driverGood/agricultureProduct.png';
import AquaticProduct from '../../assets/img/driverGood/aquaticProduct.png';
import Dairy from '../../assets/img/driverGood/dairy.png';
import Livestock from '../../assets/img/driverGood/livestock.png';
import FrozenPastry from '../../assets/img/driverGood/frozenPastry.png';
import OtherKind from '../../assets/img/driverGood/otherKind.png';

const styles = StyleSheet.create({
    goodKindIconStyle: {
        height: 60,
        width: 60,
    }
});

class goodKindUtil {

    show(goodKindName) {
        switch (goodKindName) {
            case '畜禽类':
                return <Image style={styles.goodKindIconStyle} source={Livestock}/>;
                break;
            case '速冻面点':
                return <Image style={styles.goodKindIconStyle} source={FrozenPastry}/>;
                break;
            case '乳制品':
                return <Image style={styles.goodKindIconStyle} source={Dairy}/>;
                break;
            case '农产品类':
                return <Image style={styles.goodKindIconStyle} source={AgricultureProduct}/>;
                break;
            case '水产品类':
                return <Image style={styles.goodKindIconStyle} source={AquaticProduct}/>;
                break;
            default:
                return <Image style={styles.goodKindIconStyle} source={OtherKind}/>;
                break;
        }
    }
}

const instance = new goodKindUtil();

export default instance;
