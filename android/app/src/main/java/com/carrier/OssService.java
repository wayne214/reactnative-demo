package com.carrier;

import android.util.Log;

import com.alibaba.sdk.android.oss.ClientException;
import com.alibaba.sdk.android.oss.OSS;
import com.alibaba.sdk.android.oss.ServiceException;
import com.alibaba.sdk.android.oss.callback.OSSCompletedCallback;
import com.alibaba.sdk.android.oss.internal.OSSAsyncTask;
import com.alibaba.sdk.android.oss.model.PutObjectRequest;
import com.alibaba.sdk.android.oss.model.PutObjectResult;
import com.facebook.react.bridge.Promise;

import java.io.File;

/**
 * Created by kaisun on 17/6/8.
 */

public class OssService {

    private OSS oss;
    private String bucket;
    private String callbackAddress;
    //根据实际需求改变分片大小
    private final static int partSize = 256 * 1024;


    public OssService(OSS oss, String bucket) {
        this.oss = oss;
        this.bucket = bucket;
    }

    public void SetBucketName(String bucket) {
        this.bucket = bucket;
    }

    public void InitOss(OSS _oss) {
        this.oss = _oss;
    }

    public void setCallbackAddress(String callbackAddress) {
        this.callbackAddress = callbackAddress;
    }

    public void asyncPutImage(final String object, String localFile, String bucket, final String type, final Promise promise) {
        if (object.equals("")) {
            Log.w("AsyncPutImage", "ObjectNull");
            return;
        }

        File file = new File(localFile);
        if (!file.exists()) {
            Log.w("AsyncPutImage", "FileNotExist");
            Log.w("LocalFile", localFile);
            return;
        }


        // 构造上传请求
        PutObjectRequest put = new PutObjectRequest(bucket, object, localFile);

//        if (callbackAddress != null) {
//            // 传入对应的上传回调参数，这里默认使用OSS提供的公共测试回调服务器地址
//            put.setCallbackParam(new HashMap<String, String>() {
//                {
//                    put("callbackUrl", callbackAddress);
//                    //callbackBody可以自定义传入的信息
//                    put("callbackBody", "filename=${object}");
//                }
//            });
//        }

        // 异步上传时可以设置进度回调
//        put.setProgressCallback(new OSSProgressCallback<PutObjectRequest>() {
//            @Override
//            public void onProgress(PutObjectRequest request, long currentSize, long totalSize) {
//                //Log.d("PutObject", "currentSize: " + currentSize + " totalSize: " + totalSize);
//                int progress = (int) (100 * currentSize / totalSize);
//                UIDisplayer.updateProgress(progress);
//                UIDisplayer.displayInfo("上传进度: " + String.valueOf(progress) + "%");
//            }
//        });

        OSSAsyncTask task = oss.asyncPutObject(put, new OSSCompletedCallback<PutObjectRequest, PutObjectResult>() {
            @Override
            public void onSuccess(PutObjectRequest request, PutObjectResult result) {
                Log.d("PutObject", "UploadSuccess");
                Log.i("-------onSuccess-----", "");
                Log.d("ETag", result.getETag());
                Log.d("RequestId", result.getRequestId());
                // promise.resolve(object);
                promise.resolve(type);
//                UIDisplayer.uploadComplete();
//                UIDisplayer.displayInfo("Bucket: " + bucket
//                        + "\nObject: " + request.getObjectKey()
//                        + "\nETag: " + result.getETag()
//                        + "\nRequestId: " + result.getRequestId()
//                        + "\nCallback: " + result.getServerCallbackReturnBody());
            }

            @Override
            public void onFailure(PutObjectRequest request, ClientException clientExcepion, ServiceException serviceException) {
                String info = "";
                // 请求异常
                if (clientExcepion != null) {
                    // 本地异常如网络异常等
                    clientExcepion.printStackTrace();
                    info = clientExcepion.toString();
                }
                if (serviceException != null) {
                    // 服务异常
                    Log.e("ErrorCode", serviceException.getErrorCode());
                    Log.e("RequestId", serviceException.getRequestId());
                    Log.e("HostId", serviceException.getHostId());
                    Log.e("RawMessage", serviceException.getRawMessage());
                    info = serviceException.toString();
                }
                Log.i("-------onFailure-----", "");
                promise.reject(type, "", new Error(info));
//                UIDisplayer.uploadFail(info);
//                UIDisplayer.displayInfo(info);
            }
        });
    }


}
