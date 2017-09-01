//
//  OssService.h
//  carrier
//
//  Created by sherry on 17/9/1.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#ifndef OssService_h
#define OssService_h
#import "OssModule.h"
#import <AliyunOSSiOS/OSSService.h>

@interface OssService : NSObject

- (id)initWithEndPointName:(NSString *)endPoints
                 stsServer:(NSString *) server;

- (void)asyncPutImage:(NSString *)objectKey
        localFilePath:(NSString *)filePath
               bucket:(NSString *)buckets
                 type:(NSString *)type
             resolves:(RCTPromiseResolveBlock)resolve
              rejects:(RCTPromiseRejectBlock)reject;

@end
#endif /* OssService_h */
