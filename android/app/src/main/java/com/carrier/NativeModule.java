package com.carrier;

import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.support.v7.app.NotificationCompat;
import android.util.Log;
import android.widget.Toast;

import com.alibaba.sdk.android.oss.OSS;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by kaisun on 17/5/4.
 */

public class NativeModule extends ReactContextBaseJavaModule {

    private NotificationManager mNotifyManager;
    NotificationCompat.Builder mBuilder;

    String filePath = "";

    public NativeModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
        mNotifyManager = (NotificationManager) reactApplicationContext.getSystemService(Context.NOTIFICATION_SERVICE);
        mBuilder = new NotificationCompat.Builder(reactApplicationContext);
        mBuilder.setContentTitle("下载").setContentText("下载中").setSmallIcon(R.mipmap.ic_launcher);
    }

    @Override
    public String getName() {
        return "NativeModule";
    }

    @ReactMethod
    public void inited() {
        SharedPreferences.Editor editor = getReactApplicationContext().getSharedPreferences("user",
                getReactApplicationContext().MODE_PRIVATE).edit();
        editor.putString("app_init", "init");
        editor.commit();
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        SharedPreferences preferences = getReactApplicationContext().getSharedPreferences("user",getReactApplicationContext().MODE_PRIVATE);
        String str = preferences.getString("app_init", "null");
        final Map<String, Object> constants = new HashMap<>();
        constants.put("firstDayOfTheWeek", str);
        constants.put(VERSION, getVersionName());
        return constants;
    }

    @ReactMethod
    public void getInited(Promise promise) {
        SharedPreferences preferences = getReactApplicationContext().getSharedPreferences("user",getReactApplicationContext().MODE_PRIVATE);
        String str = preferences.getString("app_init", "null");
        promise.resolve(str);
    }

    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";
    private static final String VERSION = "VERSION";

    public String getVersionName() {
        try {
            PackageManager manager = getReactApplicationContext().getPackageManager();
            PackageInfo info = manager.getPackageInfo(getReactApplicationContext().getPackageName(), 0);
            return info.versionName;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "1.0.0";
    }

    @ReactMethod
    public void installApk() {
        if (filePath == "") {
            Toast.makeText(getReactApplicationContext(), "文件不存在或已损坏请重新下载", Toast.LENGTH_LONG).show();
        } else {
            try {
                File file = new File(filePath);
                Intent i = new Intent();
                i.setAction(Intent.ACTION_VIEW);
                i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                i.setDataAndType(Uri.fromFile(new File(filePath)), "application/vnd.android.package-archive");
                getReactApplicationContext().startActivity(i);
            } catch (Exception e) {
                Toast.makeText(getReactApplicationContext(), "文件不存在或已损坏请重新下载", Toast.LENGTH_LONG).show();
            }
        }
    }

    @ReactMethod
    public void upgradeForce(final String url, final Promise promise) {

        DownloadUtil.get().download(url, "download", new DownloadUtil.OnDownloadListener() {

            @Override
            public void onStartDownload() {
                mBuilder.setProgress(0, 0, false).setContentText("下载中");
                mNotifyManager.notify(1, mBuilder.build());
            }

            @Override
            public void onDownloadSuccess(String path) {
                Log.i("----", "onDownloadSuccess===" + path);
                mBuilder.setProgress(0, 0, false).setContentText("下载完成");
                mNotifyManager.notify(1, mBuilder.build());

                filePath = path + "/" + url.substring(url.lastIndexOf("/") + 1);
                Log.i("----", "fileName===" + filePath);
                Intent i = new Intent();
                i.setAction(Intent.ACTION_VIEW);
                i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                i.setDataAndType(Uri.fromFile(new File(filePath)), "application/vnd.android.package-archive");
                getReactApplicationContext().startActivity(i);

                promise.resolve("");
            }

            @Override
            public void onDownloading(int progress) {
                Log.i("----", "" + progress);
                mBuilder.setProgress(100, progress, false);
                mNotifyManager.notify(1, mBuilder.build());
            }

            @Override
            public void onDownloadFailed() {
                Log.i("----", "onDownloadFailed");
            }
        });
    }
}
