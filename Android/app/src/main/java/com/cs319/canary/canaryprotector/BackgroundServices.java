package com.cs319.canary.canaryprotector;

import android.app.IntentService;
import android.content.Context;
import android.content.Intent;
import android.telephony.TelephonyManager;
import android.text.format.Time;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Timer;
import java.util.TimerTask;

/**
 * Created by Benjamin on 2016-02-05.
 */
public class BackgroundServices extends IntentService {

    public Timer timer = new Timer();

    private int dataCollectionInterval = 1;
    private int dataSendInterval = 1;

    /**
     * Creates an IntentService.  Invoked by your subclass's constructor.
     *
     * @param name Used to name the worker thread, important only for debugging.
     */
    public BackgroundServices(String name) {
        super(name);
    }
    public BackgroundServices() {
       super("BackgroundServicesIntent");
    }

    @Override
    protected void onHandleIntent(Intent intent) {

        //Set up data collector
        Intent dataCollectorServiceIntent = new Intent(this, DataCollectorService.class);
        this.startService(dataCollectorServiceIntent);

        //Connect to MQTT Server
        TelephonyManager tm = (TelephonyManager) getSystemService(Context.TELEPHONY_SERVICE);
        String clientId = tm.getDeviceId();
        MqttClient.connect(getApplicationContext(), getString(R.string.broker_url), 1883, clientId);

        // Initialize LocalDataManager
        LocalDataManager.DataManagerInitialize(getApplicationContext(), "CanaryTestFile.txt");

        timer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                float[] accelValues = DataCollectorService.getAccelValues();
                Time now = new Time();
                now.setToNow();

                JSONObject payload = new JSONObject();

                try{
                    payload.put("datetime",now.format2445());
                    payload.put("accelX",accelValues[0]);
                    payload.put("accelY",accelValues[1]);
                    payload.put("accelZ",accelValues[2]);
                } catch(JSONException e){
                    e.printStackTrace();
                }
                MqttClient.publish(getString(R.string.data_topic), payload.toString());
            }
        },
        //Set how long before to start calling the TimerTask (in milliseconds)
        0,
        //Set the amount of time between each execution (in milliseconds)
        1000);
    }

    public int getDataCollectionInterval() {
        return dataCollectionInterval;
    }

    public void setDataCollectionInterval(int dataCollectionInterval) {
        this.dataCollectionInterval = dataCollectionInterval;
    }

    public int getDataSendInterval() {
        return dataSendInterval;
    }

    public void setDataSendInterval(int dataSendInterval) {
        this.dataSendInterval = dataSendInterval;
    }
}
