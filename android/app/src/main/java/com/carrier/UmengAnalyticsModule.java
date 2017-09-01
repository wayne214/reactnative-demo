package com.carrier;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.umeng.analytics.MobclickAgent;

/**
 * Created by kaisun on 17/8/21.
 */

public class UmengAnalyticsModule extends ReactContextBaseJavaModule {

    public UmengAnalyticsModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
    }

    @Override
    public String getName() {
        return "UmengAnalyticsModule";
    }

    @ReactMethod
    public void onPageBegin(String page) {
        MobclickAgent.onPageStart(page);
    }

    @ReactMethod
    public void onPageEnd(String page) {
        MobclickAgent.onPageEnd(page);
    }

}

