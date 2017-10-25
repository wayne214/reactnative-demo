//
//  NativeModule.m
//  carrier
//
//  Created by sherry on 17/9/1.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "NativeModule.h"
#import "AppDelegate.h"
#import "UIDevice+Hardware.h"
#import <CoreLocation/CoreLocation.h>

#import <React/RCTEventDispatcher.h>

@implementation NativeModule
@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(inited)
{
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  [defaults setObject:@"init" forKey:@"app_init"];
  [defaults synchronize];
//  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(sendParamsToRN) name:@"ios-native-call-js" object:@{}];
}

RCT_EXPORT_METHOD(toAppStore)
{
  [[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"https://itunes.apple.com/cn/app/id1253796640?mt=8"]];
}

- (NSDictionary *)constantsToExport
{
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  NSString *str = [defaults objectForKey:@"app_init"];
  NSString * result = str ? str : @"null";
  NSString *deviceModal = IS_IPHONE_X ? @"iPhone X" : [[UIDevice currentDevice] hardwareSimpleDescription];
  NSString *version = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
  NSNumber *iosOSVersion = @([[UIDevice currentDevice].systemVersion floatValue]);
  return @{ @"firstDayOfTheWeek": result, @"VERSION": version, @"IOS_OS_VERSION": iosOSVersion ,@"DEVICE_MODAL": deviceModal};
}

RCT_EXPORT_METHOD(RNSendMsgToNative)
{
    dispatch_sync(dispatch_get_main_queue(), ^{
//      if([CLLocationManager locationServicesEnabled] && [CLLocationManager authorizationStatus] == kCLAuthorizationStatusDenied) {
//
//      }else{
        [NSTimer scheduledTimerWithTimeInterval: 60 target:self selector:@selector(sendParamsToRN) userInfo:nil repeats:YES];
//      }
    });
}
- (void)sendParamsToRN{
  [self.bridge.eventDispatcher sendAppEventWithName:@"nativeSendMsgToRN" body:@{@"msg":@"123"}];
}

@end

