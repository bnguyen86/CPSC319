package com.cs319.canary.canaryprotector;

import android.app.IntentService;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.BatteryManager;

/**
 * Created by Zoe on 2016-02-09.
 */
public class DataCollectorService extends IntentService implements SensorEventListener {
    private static float batteryPct;

    private static float[] accelValues = new float[3];

    private int timer1 = 0;
    private int timer2 = 0;

    public DataCollectorService(String name) {
        super(name);
    }
    public DataCollectorService() {
        super("DataCollectorService");
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        this.DataCollectorInitialize(getApplicationContext());
    }

    public void DataCollectorInitialize(Context appContext){

        // set up battery monitor
        Intent batteryStatus = appContext.registerReceiver(batteryInfoReceiver,new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
        // set batteryPct for the first time
        batteryPct = batteryStatus.getIntExtra(BatteryManager.EXTRA_LEVEL,-1) / (float)batteryStatus.getIntExtra(BatteryManager.EXTRA_SCALE,-1);

        //Set up accelerometer sensor
        SensorManager senSensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
        Sensor senAccelerometer = senSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        senSensorManager.registerListener(this, senAccelerometer, SensorManager.SENSOR_DELAY_NORMAL);
    }

    private static BroadcastReceiver batteryInfoReceiver = new BroadcastReceiver(){
        @Override
        public void onReceive(Context context, Intent intent) {
            int level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
            int scale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
            batteryPct = level / (float) scale;
        }
    };


    @Override
    public void onSensorChanged(SensorEvent event) {
        Sensor mySensor = event.sensor;

        timer1++;
        timer2++;

        this.setAccelValues(event.values);
        //System.out.println(Arrays.toString(event.values));
//        if (mySensor.getType() == Sensor.TYPE_ACCELEROMETER) {
//
//            TextView xValue = (TextView)MainActivity.findViewById(R.id.x_value);
//            TextView yValue = (TextView)findViewById(R.id.y_value);
//            TextView zValue = (TextView)findViewById(R.id.z_value);
//
//            if((xValue != null) && (yValue != null) && (zValue != null)){
//                xValue.setText(String.valueOf(event.values[0]));
//                yValue.setText(String.valueOf(event.values[1]));
//                zValue.setText(String.valueOf(event.values[2]));
//            }
//
//            // Uncomment to test LocalDataManager
//            // TODO delete this and timer1, timer2 later
//            /*
//            if(timer1 >= 10)
//            {
//                timer1 = 0;
//                LocalDataManager.WriteToFile("X: " + event.values[0] + " Y: " + event.values[1] + " Z: " + event.values[2]);
//            }
//
//            if(timer2 >= 200)
//            {
//                timer2 = 0;
//                LocalDataManager.ReadFile();
//            }
//            */
//        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {

    }

    public static void setAccelValues(float[] values){
        accelValues = values;
    }

    public static float[] getAccelValues(){
        return accelValues;
    }

    public static float getBatteryPct() {
        return batteryPct;
    }

    public static void setBatteryPct(float batteryPct) {
        DataCollectorService.batteryPct = batteryPct;
    }

    public static BroadcastReceiver getBatteryInfoReceiver() {
        return batteryInfoReceiver;
    }

    public static void setBatteryInfoReceiver(BroadcastReceiver batteryInfoReceiver) {
        DataCollectorService.batteryInfoReceiver = batteryInfoReceiver;
    }


}
