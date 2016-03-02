package com.cs319.canary.canaryprotector;

import android.Manifest;
import android.app.IntentService;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.BatteryManager;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.util.Log;

/**
 * Created by Zoe on 2016-02-09.
 */

public class DataCollectorService extends IntentService implements SensorEventListener {
    private static float batteryPct;

    private static float[] accelValues = new float[3];

    private static double[] latlon = new double[2];

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

    public void DataCollectorInitialize(Context appContext) {

        // set up battery monitor
        Intent batteryStatus = appContext.registerReceiver(batteryInfoReceiver, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
        // set batteryPct for the first time
        batteryPct = batteryStatus.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) / (float) batteryStatus.getIntExtra(BatteryManager.EXTRA_SCALE, -1);

        //Set up accelerometer sensor
        SensorManager senSensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
        Sensor senAccelerometer = senSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        senSensorManager.registerListener(this, senAccelerometer, SensorManager.SENSOR_DELAY_NORMAL);

        // set up location manager
        LocationManager locManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);

        // check permission for access location
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // possible TODO: add code to request permission if access location permission is not granted.
            // ActivityCompat.requestPermissions((Activity)appContext, new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 0);
        }

        locManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 0, 0, locListener);
        locManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, locListener);

        // quickly grab current gps location.
        setLocation(locManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER));
    }


    private static BroadcastReceiver batteryInfoReceiver = new BroadcastReceiver(){
        @Override
        public void onReceive(Context context, Intent intent) {
            int level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
            int scale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
            batteryPct = level / (float) scale;
        }
    };

    // set up location listener
    private static LocationListener locListener = new LocationListener() {
        @Override
        public void onLocationChanged(Location location) {
            Log.d("Location Changed", String.format("lat:%.2f,lon:%.2f",location.getLatitude(),location.getLongitude()));
            setLocation(location);
        }

        @Override
        public void onStatusChanged(String provider, int status, Bundle extras) {

        }

        @Override
        public void onProviderEnabled(String provider) {

        }

        @Override
        public void onProviderDisabled(String provider) {

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


    public static void setLocation(Location location) {
        if (location != null){
            latlon[0] = location.getLatitude();
            latlon[1] = location.getLongitude();
        } else {
            latlon[0] = 0.0;
            latlon[1] = 0.0;
        }

        Log.d("Location Set", String.format("Lat:%.2f,Lon:%.2f",latlon[0],latlon[1]));
    }

    public static double[] getLocation(){
        return latlon;
    }


}
