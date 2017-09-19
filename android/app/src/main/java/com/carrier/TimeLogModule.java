package com.carrier;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

/**
 * Created by kaisun on 17/9/18.
 */

public class TimeLogModule extends ReactContextBaseJavaModule {

    private static ReactApplicationContext applicationContext;

    public TimeLogModule(ReactApplicationContext reactContext) {
        super(reactContext);
        applicationContext = reactContext;
    }

    @Override
    public String getName() {
        return "TimeLogModule";
    }

    public static class LogReceiver extends BroadcastReceiver {

        public LogReceiver() {}

        @Override
        public void onReceive(Context context, Intent intent) {
            if (intent.getExtras().getString("type").equals("log")) {
                if (applicationContext != null) {
                    applicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("scheduleLog", MainApplication.location);
                }
            }
        }
    }

}
