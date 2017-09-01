//
//  OssModule.m
//  carrier
//
//  Created by sherry on 17/9/1.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "OssModule.h"
#import "OssService.h"
#import "AppDelegate.h"

@implementation OssModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(init:(NSString *) filePath objKey:(NSString *)objKey bucket:(NSString *)bucket stsServer:(NSString *)server type:(NSString *)type resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
  
  UIImage * image = [[UIImage alloc] initWithContentsOfFile:filePath];
  NSString * path = [self compressImg:image];
  NSLog(@"--------filePath from js %@-----\n %@ -------%@", filePath, path, server);
  NSString * const endPoint = @"http://oss-cn-beijing.aliyuncs.com";
  OssService * service = [[OssService alloc] initWithEndPointName:endPoint stsServer:server];
  
  [service asyncPutImage:objKey localFilePath:path bucket:bucket type:type resolves:resolve rejects:reject];
}

#pragma mark call back imgpath after compress
- (NSString *)compressImg:(UIImage *)image
{
  NSData * data;
  NSString * imgType;
  if (UIImageJPEGRepresentation(image, 0.4) == nil) {
    imgType = @".png";
    data = UIImagePNGRepresentation(image);
  } else {
    imgType = @".jpg";
    data = UIImageJPEGRepresentation(image, 0.4);
  }
  NSDateFormatter *dateFormat = [[NSDateFormatter alloc] init];
  [dateFormat setDateFormat:@"yyyyMMddHHmmssS"];
  NSString *curretDateTime = [dateFormat stringFromDate:[NSDate date]];
  NSString *randomStr = [NSString stringWithFormat:@"%@%@",curretDateTime,@(arc4random()%100)];
  NSString *path = [[[[NSHomeDirectory() stringByAppendingPathComponent:@"Documents"] stringByAppendingString:@"/"] stringByAppendingString:randomStr] stringByAppendingString:imgType];
  [data writeToFile:path atomically:YES];
  return path;
}

@end
