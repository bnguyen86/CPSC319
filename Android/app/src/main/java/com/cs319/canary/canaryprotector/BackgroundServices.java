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

    private static Timer transferTimer;
    private static Timer collectionTimer;

    private static String clientId;
    private static final String topic = "team-mat-canary";

    private static int dataCollectionInterval = 1000;
    private static int dataTransferInterval = 1000;

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
        // Initialize LocalDataManager
        LocalDataManager.DataManagerInitialize(getApplicationContext(), "CanaryTestFile.txt");

        //Set up data collector
        Intent dataCollectorServiceIntent = new Intent(this, DataCollectorService.class);
        this.startService(dataCollectorServiceIntent);

        //Connect to MQTT Server
        TelephonyManager tm = (TelephonyManager) getSystemService(Context.TELEPHONY_SERVICE);
        clientId = tm.getDeviceId();
        MqttClient.connect(getApplicationContext(), getString(R.string.broker_url), 1883, clientId);

        setDataCollectionTimer(clientId, getDataCollectionInterval());
        setDataTransferTimer(clientId, getDataTransferInterval());
    }

    private static void setDataTransferTimer(String clientId, int interval){
        final String cId = clientId;

        if(transferTimer != null){
            transferTimer.cancel();
        }

        transferTimer = new Timer();

        transferTimer.scheduleAtFixedRate(new TimerTask() {
                      @Override
                      public void run() {
                          Time now = new Time();
                          now.setToNow();

                          String payload = createJsonData(cId,
                                  String.valueOf(now.toMillis(true)),
                                  DataCollectorService.getAccelValues(),
                                  DataCollectorService.getBatteryPct());

                          //TODO: need to pull items off of local data store and send those instead
                          MqttClient.publish(topic, payload);
                      }
                  },
                //Set how long before to start calling the TimerTask (in milliseconds)
                0,
                //Set the amount of time between each execution (in milliseconds)
                interval);
    }

    private static void setDataCollectionTimer(String clientId, int interval){

        final String cId = clientId;

        if(collectionTimer != null){
            collectionTimer.cancel();
        }

        collectionTimer = new Timer();

        collectionTimer.scheduleAtFixedRate(new TimerTask() {
                      @Override
                      public void run() {
                          Time now = new Time();
                          now.setToNow();

                          String payload = createJsonData(cId,
                                  String.valueOf(now.toMillis(true)),
                                  DataCollectorService.getAccelValues(),
                                  DataCollectorService.getBatteryPct());

                          LocalDataManager.WriteToFile(payload);

                      }
                  },
                //Set how long before to start calling the TimerTask (in milliseconds)
                0,
                //Set the amount of time between each execution (in milliseconds)
                interval);
    }

    public static String createJsonData(String clientId, String datetime, float[] accelValues, float batteryPct){
        JSONObject payload = new JSONObject();

        try{
            payload.put("datetime", datetime);
            payload.put("accelX", accelValues[0]);
            payload.put("accelY", accelValues[1]);
            payload.put("accelZ", accelValues[2]);
            payload.put("battery", batteryPct);
            payload.put("clientId", clientId);
        } catch(JSONException e){
            e.printStackTrace();
        }

        return payload.toString();
    }

    public static int getDataCollectionInterval() {
        return dataCollectionInterval;
    }

    public static void setDataCollectionInterval(int dataCollectionInterval) {
        BackgroundServices.dataCollectionInterval = dataCollectionInterval;
        setDataCollectionTimer(clientId, getDataCollectionInterval());
    }

    public static int getDataTransferInterval() {
        return dataTransferInterval;
    }

    public static void setDataTransferInterval(int dataTransferInterval) {
        BackgroundServices.dataTransferInterval = dataTransferInterval;
        setDataTransferTimer(clientId, getDataTransferInterval());
    }
}
