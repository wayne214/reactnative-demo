//
//  UIDevice+Hardware.h
//  LeZhanCloud
//
//  Created by YYQ on 15/5/9.
//  Copyright (c) 2015年 YYQ. All rights reserved.
//

#import <UIKit/UIKit.h>
typedef enum
{
  NOT_AVAILABLE,
  
  IPHONE_2G,
  IPHONE_3G,
  IPHONE_3GS,
  IPHONE_4,
  IPHONE_4_CDMA,
  IPHONE_4S,
  IPHONE_5,
  IPHONE_5_CDMA_GSM,
  IPHONE_5C,
  IPHONE_5C_CDMA_GSM,
  IPHONE_5S,
  IPHONE_5S_CDMA_GSM,
  IPHONE_6,
  IPHONE_6_PLUS,
  
  
  IPOD_TOUCH_1G,
  IPOD_TOUCH_2G,
  IPOD_TOUCH_3G,
  IPOD_TOUCH_4G,
  IPOD_TOUCH_5G,
  
  IPAD,
  IPAD_2,
  IPAD_2_WIFI,
  IPAD_2_CDMA,
  IPAD_3,
  IPAD_3G,
  IPAD_3_WIFI,
  IPAD_3_WIFI_CDMA,
  IPAD_4,
  IPAD_4_WIFI,
  IPAD_4_GSM_CDMA,
  
  IPAD_MINI,
  IPAD_MINI_WIFI,
  IPAD_MINI_WIFI_CDMA,
  IPAD_MINI_RETINA_WIFI,
  IPAD_MINI_RETINA_WIFI_CDMA,
  
  IPAD_AIR_WIFI,
  IPAD_AIR_WIFI_GSM,
  IPAD_AIR_WIFI_CDMA,
  
  SIMULATOR
} Hardware;

@interface UIDevice (Hardware)

/** This method retruns the hardware type */
- (NSString*)hardwareString;

/** This method returns the Hardware enum depending upon harware string */
- (Hardware)hardware;

/** This method returns the readable description of hardware string */
- (NSString*)hardwareDescription;

/** This method returs the readble description without identifier (GSM, CDMA, GLOBAL) */
- (NSString *)hardwareSimpleDescription;


@end
