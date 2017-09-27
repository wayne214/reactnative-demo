//
//  NativeModule.m
//  carrier
//
//  Created by sherry on 17/9/1.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "NativeModule.h"
#import "AppDelegate.h"

#import <React/RCTEventDispatcher.h>

@implementation NativeModule
@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(inited)
{
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  [defaults setObject:@"init" forKey:@"app_init"];
  [defaults synchronize];
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
  
  NSString *version = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
  NSNumber *iosOSVersion = @([[UIDevice currentDevice].systemVersion floatValue]);
  return @{ @"firstDayOfTheWeek": result, @"VERSION": version, @"IOS_OS_VERSION": iosOSVersion };
}

RCT_EXPORT_METHOD(RNSendMsgToNative)
{
  dispatch_sync(dispatch_get_main_queue(), ^{
    [NSTimer scheduledTimerWithTimeInterval: 60 target:self selector:@selector(sendParamsToRN) userInfo:nil repeats:YES];
  });
}
- (void)sendParamsToRN{
  [self.bridge.eventDispatcher sendAppEventWithName:@"nativeSendMsgToRN" body:@{@"msg":@"123"}];
}
@end

