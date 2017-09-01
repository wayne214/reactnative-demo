//
//  UmengAnalyticsModule.m
//  carrier
//
//  Created by sherry on 17/9/1.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "UMMobClick/MobClick.h"
#import "UmengAnalyticsModule.h"

@implementation UmengAnalyticsModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(onPageBegin:(NSString *) page) {
  [MobClick beginLogPageView:page];
}

RCT_EXPORT_METHOD(onPageEnd:(NSString *) page) {
  [MobClick endLogPageView:page];
}

@end
