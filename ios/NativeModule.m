//
//  NativeModule.m
//  carrier
//
//  Created by sherry on 17/9/1.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "NativeModule.h"
#import "AppDelegate.h"

//#import "AppDelegate.h"

@implementation NativeModule

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

@end

