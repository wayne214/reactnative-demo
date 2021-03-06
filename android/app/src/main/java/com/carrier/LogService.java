package com.carrier;

import android.app.Service;

import android.content.Intent;

import android.os.IBinder;

import java.util.Timer;
import java.util.TimerTask;


/**
 * Created by kaisun on 17/9/18.
 */

public class LogService extends Service {

    Timer timer;
    TimerTask task;

    @android.support.annotation.Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        final Intent i = new Intent();
        i.putExtra("type", "log");
        i.setAction("com.carrier");
        i.addFlags(Intent.FLAG_INCLUDE_STOPPED_PACKAGES);
        timer = new Timer();
        task = new TimerTask() {
            @Override
            public void run() {
                sendBroadcast(i);
            }
        };
        if (timer != null && task != null) {
            timer.schedule(task, 60, 60 * 1000);
        }
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (timer != null) {
            timer.cancel();
        }
        if (task != null) {
            task.cancel();
        }

    }

}
