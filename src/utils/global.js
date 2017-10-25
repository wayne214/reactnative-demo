import React, { Component } from 'react';
import { Dimensions, PixelRatio, Platform } from 'react-native';
import * as API from '../constants/api.js'
import * as COLOR from '../constants/colors.js'

let {height, width} = Dimensions.get('window');

global.IS_IOS = (Platform.OS === 'ios');
global.IS_ANDROID = (Platform.OS === 'android');
global.SCREEN_WIDTH = width;
global.SCREEN_HEIGHT = height;
global.Pixel_Ratio = PixelRatio.get();
// 最小线宽
global.MINI_LINE = 1 / Pixel_Ratio;
// 所有接口
global.API = API
// 所有色值
global.COLOR = COLOR

