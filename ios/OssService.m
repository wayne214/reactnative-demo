//
//  OssService.m
//  carrier
//
//  Created by sherry on 17/9/1.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "OssService.h"
#import "OssModule.h"
#import <AliyunOSSiOS/OSSService.h>

NSString * bucketName = @"llmj-upload-img-test";
NSString * endPoint;
NSString * STSServer = @"http://app-api-test.lenglianmajia.com/oss/tst/exclude/getPolicy.shtml?p=order";

@implementation OssService
{
  OSSClient * client;
  OSSPutObjectRequest * putRequest;
  OSSGetObjectRequest * getRequest;
}

- (id)initWithEndPointName:(NSString *)endPoints stsServer:(NSString *)server {
  if (self = [super init]) {
    endPoint = endPoints;
    STSServer = server;
    [self ossInit];
  }
  return self;
}

/**
 *	@brief	初始化获取OSSClient
 */
- (void)ossInit {
  id<OSSCredentialProvider> credential = [[OSSFederationCredentialProvider alloc] initWithFederationTokenGetter:^OSSFederationToken * {
    return [self getFederationToken];
  }];
  client = [[OSSClient alloc] initWithEndpoint:endPoint credentialProvider:credential];
}

/**
 *	@brief	上传图片
 *
 *	@param 	objectKey 	objectKey
 *	@param 	filePath 	路径
 */
- (void)asyncPutImage:(NSString *)objectKey localFilePath:(NSString *)filePath bucket:(NSString *)buckets type:(NSString *)type resolves:(RCTPromiseResolveBlock)resolve rejects:(RCTPromiseRejectBlock)reject {
  
  if (objectKey == nil || [objectKey length] == 0) {
    return;
  }
  putRequest = [OSSPutObjectRequest new];
  putRequest.bucketName = buckets;
  putRequest.objectKey = objectKey;
  putRequest.uploadingFileURL = [NSURL fileURLWithPath:filePath];
  //  putRequest.uploadProgress = ^(int64_t bytesSent, int64_t totalByteSent, int64_t totalBytesExpectedToSend) {
  //    NSLog(@"%lld, %lld, %lld", bytesSent, totalByteSent, totalBytesExpectedToSend);
  //  };
  //  if (callbackAddress != nil) {
  //    putRequest.callbackParam = @{
  //                                 @"callbackUrl": callbackAddress,
  //                                 // callbackBody可自定义传入的信息
  //                                 @"callbackBody": @"filename=${object}"
  //                                 };
  //  }
  
  OSSTask * task = [client putObject:putRequest];
  [task continueWithBlock:^id(OSSTask *task) {
    OSSPutObjectResult * result = task.result;
    // 查看server callback是否成功
    if (!task.error) {
      NSLog(@"Put image success!");
      NSLog(@"server callback : %@", result.serverReturnJsonString);
      dispatch_async(dispatch_get_main_queue(), ^{
        NSLog(@"普通上传成功");
        //        resolve(objectKey);
        resolve(type);
        //        [viewController showMessage:@"普通上传" inputMessage:@"Success!"];
      });
    } else {
      NSLog(@"Put image failed, %@", task.error);
      if (task.error.code == OSSClientErrorCodeTaskCancelled) {
        dispatch_async(dispatch_get_main_queue(), ^{
          reject(type, @"", [[NSError alloc] initWithDomain:@"" code:10000 userInfo:nil]);
          NSLog(@"普通上传--任务取消");
          //          [viewController showMessage:@"普通上传" inputMessage:@"任务取消!"];
        });
      } else {
        dispatch_async(dispatch_get_main_queue(), ^{
          NSLog(@"普通上传失败");
          reject(type, @"", [[NSError alloc] initWithDomain:@"" code:10000 userInfo:nil]);
          //          [viewController showMessage:@"普通上传" inputMessage:@"Failed!"];
        });
      }
    }
    putRequest = nil;
    return nil;
  }];
}

/**
 *	@brief	获取FederationToken
 *
 *	@return
 */
- (OSSFederationToken *) getFederationToken {
  NSURL * url = [NSURL URLWithString:STSServer];
  NSURLRequest * request = [NSURLRequest requestWithURL:url];
  OSSTaskCompletionSource * tcs = [OSSTaskCompletionSource taskCompletionSource];
  NSURLSession * session = [NSURLSession sharedSession];
  NSURLSessionTask * sessionTask = [session dataTaskWithRequest:request
                                              completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
                                                if (error) {
                                                  [tcs setError:error];
                                                  return;
                                                }
                                                [tcs setResult:data];
                                              }];
  [sessionTask resume];
  
  // 实现这个回调需要同步返回Token，所以要waitUntilFinished
  [tcs.task waitUntilFinished];
  if (tcs.task.error) {
    NSLog(@"------获取OssToken失败 \n %@", tcs.task.error);
    return nil;
  } else {
    NSDictionary * object = [NSJSONSerialization JSONObjectWithData:tcs.task.result
                                                            options:kNilOptions
                                                              error:nil];
    OSSFederationToken * token = [OSSFederationToken new];
    token.tAccessKey = [object objectForKey:@"AccessKeyId"];
    token.tSecretKey = [object objectForKey:@"AccessKeySecret"];
    token.tToken = [object objectForKey:@"SecurityToken"];
    bucketName = [object objectForKey:@"bucket"];
    endPoint = [object objectForKey:@"endpoint"];
    token.expirationTimeInGMTFormat = [object objectForKey:@"Expiration"];
    NSLog(@"AccessKey: %@ \n SecretKey: %@ \n Token:%@ expirationTime: %@ \n",
          token.tAccessKey, token.tSecretKey, token.tToken, token.expirationTimeInGMTFormat);
    
    return token;
  }
  
}

@end
