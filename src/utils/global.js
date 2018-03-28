import React, { Component } from 'react';
import { Dimensions, PixelRatio, Platform, NativeModules } from 'react-native';
import * as API from '../constants/api.js'
import * as COLOR from '../constants/colors.js'
import * as SETTING from '../constants/setting.js'

let {height, width} = Dimensions.get('window');

global.IS_IOS = (Platform.OS === 'ios');
global.IS_ANDROID = (Platform.OS === 'android');
global.SCREEN_WIDTH = width;
global.SCREEN_HEIGHT = height;
global.Pixel_Ratio = PixelRatio.get();
// 最小线宽
global.MINI_LINE = 1 / Pixel_Ratio;
// 所有接口
// global.API = API
// 所有色值
global.COLOR = COLOR

global.IOS_DEVICE_MODAL = NativeModules.NativeModule.DEVICE_MODAL

global.IS_IPHONE_X = IOS_DEVICE_MODAL === 'iPhone X'

global.DANGER_BOTTOM =  IS_IPHONE_X ? 34 : 0

global.DANGER_TOP = IS_IPHONE_X ? 44 : 20

global.SETTING = SETTING

