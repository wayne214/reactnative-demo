package com.carrier;

import android.app.Application;
import android.content.Intent;

import com.beefe.picker.PickerViewPackage;
import com.facebook.react.ReactApplication;
import org.reactnative.camera.RNCameraPackage;
import org.lovebing.reactnative.baidumap.BaiduMapPackage;
import com.remobile.toast.RCTToastPackage;
import com.imagepicker.ImagePickerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.rnfs.RNFSPackage;
import com.microsoft.codepush.react.CodePush;
import com.RNFetchBlob.RNFetchBlobPackage;

import org.devio.rn.splashscreen.SplashScreenReactPackage;
import org.wonday.pdf.RCTPdfView;
import com.reactnative.photoview.PhotoViewPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import cn.jpush.reactnativejpush.JPushPackage;

public class MainApplication extends Application implements ReactApplication {
  // 设置为 true 将不弹出 toast
  private boolean SHUTDOWN_TOAST = true;
  // 设置为 true 将不打印 log
  private boolean SHUTDOWN_LOG = true;

  public static String location = "";

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNCameraPackage(),
              new BaiduMapPackage(getApplicationContext()),
            new RCTToastPackage(),
            new ImagePickerPackage(),
            new SplashScreenReactPackage(),
            new RNDeviceInfo(),
            new RNFSPackage(),
            new CodePush(BuildConfig.CODEPUSH_KEY, getApplicationContext(), BuildConfig.DEBUG),
            new RNFetchBlobPackage(),
            new RCTPdfView(),
            new PickerViewPackage(),
            new PhotoViewPackage(),
            new PickerPackage(),
              new NativePackage(),
              new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG)
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    getApplicationContext().startService(new Intent(getApplicationContext(), LogService.class));
  }

}
