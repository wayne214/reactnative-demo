package com.carrier;

import android.util.Log;

import com.alibaba.sdk.android.oss.ClientConfiguration;
import com.alibaba.sdk.android.oss.OSS;
import com.alibaba.sdk.android.oss.OSSClient;
import com.alibaba.sdk.android.oss.common.auth.OSSCredentialProvider;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by kaisun on 17/6/8.
 */

public class OssModule extends ReactContextBaseJavaModule {

    String endpoint = "http://oss-cn-beijing.aliyuncs.com";
//    String bucket = "llmj-upload-img-test";

    public OssModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "OssModule";
    }

    @ReactMethod
    public void init(String filePath, String objKey, String bucket, String url, String type, Promise promise) {

        String _path = ImageCompress.compressBitmap(getReactApplicationContext(), filePath, 480, 800, false);
        Log.i("------------# ", _path);

        OssService ossService = initOSS(endpoint, bucket, url);
        ossService.asyncPutImage(objKey, _path, bucket, type, promise);

    }


    //初始化一个OssService用来上传下载
    public OssService initOSS(String endpoint, String bucket, String url) {
        //如果希望直接使用accessKey来访问的时候，可以直接使用OSSPlainTextAKSKCredentialProvider来鉴权。
        //OSSCredentialProvider credentialProvider = new OSSPlainTextAKSKCredentialProvider(accessKeyId, accessKeySecret);

        OSSCredentialProvider credentialProvider;
        //使用自己的获取STSToken的类
//        String stsServer = ((EditText) findViewById(R.id.stsserver)).getText().toString();
//        if (stsServer .equals("")) {
//            credentialProvider = new STSGetter();
//        }else {
//            credentialProvider = new STSGetter(stsServer);
//        }
        credentialProvider = new STSGetter(url);

//        bucket = ((EditText) findViewById(R.id.bucketname)).getText().toString();
        ClientConfiguration conf = new ClientConfiguration();
        conf.setConnectionTimeout(15 * 1000); // 连接超时，默认15秒
        conf.setSocketTimeout(15 * 1000); // socket超时，默认15秒
        conf.setMaxConcurrentRequest(5); // 最大并发请求书，默认5个
        conf.setMaxErrorRetry(2); // 失败后最大重试次数，默认2次
        OSS oss = new OSSClient(getReactApplicationContext(), endpoint, credentialProvider, conf);
        return new OssService(oss, bucket);

    }

}
