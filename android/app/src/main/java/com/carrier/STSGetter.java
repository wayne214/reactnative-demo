package com.carrier;

import android.util.Log;

import com.alibaba.sdk.android.oss.common.auth.OSSFederationCredentialProvider;
import com.alibaba.sdk.android.oss.common.auth.OSSFederationToken;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

/**
 * Created by kaisun on 17/6/8.
 */

public class STSGetter extends OSSFederationCredentialProvider {

    private String stsServer = "http://app-api-test.lenglianmajia.com/oss/tst/exclude/getPolicy.shtml?p=order";

    public STSGetter() {
        stsServer = "http://app-api-test.lenglianmajia.com/oss/tst/exclude/getPolicy.shtml?p=order";
    }

    public STSGetter(String stsServer) {
        this.stsServer = stsServer;
    }

    public OSSFederationToken getFederationToken() {
        String stsJson;
        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder().url(stsServer).build();
        try {
            Response response = client.newCall(request).execute();
            if (response.isSuccessful()) {
                stsJson = response.body().string();
            } else {
                throw new IOException("Unexpected code " + response);
            }
        }
        catch (IOException e) {
            e.printStackTrace();
            Log.e("GetSTSTokenFail", e.toString());
            return null;
        }

        try {
            JSONObject jsonObjs = new JSONObject(stsJson);
            String ak = jsonObjs.getString("AccessKeyId");
            String sk = jsonObjs.getString("AccessKeySecret");
            String token = jsonObjs.getString("SecurityToken");
            String expiration = jsonObjs.getString("Expiration");
            return new OSSFederationToken(ak, sk, token, expiration);
        }
        catch (JSONException e) {
            Log.e("GetSTSTokenFail", e.toString());
            e.printStackTrace();
            return null;
        }
    }

}
