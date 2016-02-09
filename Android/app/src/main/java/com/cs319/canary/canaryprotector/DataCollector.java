package com.cs319.canary.canaryprotector;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.BatteryManager;
import android.util.Log;
import android.widget.TextView;

/**
 * Created by Zoe on 2016-02-09.
 */
public class DataCollector {
    // TODO: refactor and move sensor related code here
    public static float batteryPct;
    private static BroadcastReceiver batteryInfoReceiver = new BroadcastReceiver(){
        @Override
        public void onReceive(Context context, Intent intent) {
            int level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
            int scale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
            batteryPct = level / (float) scale;
        }
    };

    public static void DataCollectorInitialize(Context appContext){

        // set up battery monitor
        Intent batteryStatus = appContext.registerReceiver(batteryInfoReceiver,new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
        // set batteryPct for the first time
        batteryPct = batteryStatus.getIntExtra(BatteryManager.EXTRA_LEVEL,-1) / (float)batteryStatus.getIntExtra(BatteryManager.EXTRA_SCALE,-1);

    }

}
