//
//  NativeModule.h
//  carrier
//
//  Created by sherry on 17/9/1.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>

@interface NativeModule : NSObject <RCTBridgeModule>

#define IPHONEWIDTH         [UIScreen mainScreen].bounds.size.width
#define IPHONEHEIGHT        [UIScreen mainScreen].bounds.size.height
#define IS_IPHONE_X         (IPHONEHEIGHT == 812 && IPHONEWIDTH == 375)

@end
