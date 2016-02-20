package com.cs319.canary.canaryprotector;

import android.app.IntentService;
import android.content.Intent;
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
        timer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                float[] accelValues = MqttClient.getAccelValues();
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

                MqttClient.publish(payload.toString());
            }
        },
        //Set how long before to start calling the TimerTask (in milliseconds)
        0,
        //Set the amount of time between each execution (in milliseconds)
        1000);
    }
}
