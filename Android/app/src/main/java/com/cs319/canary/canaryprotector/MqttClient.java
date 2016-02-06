package com.cs319.canary.canaryprotector;

import android.content.Context;

import org.eclipse.paho.android.service.MqttAndroidClient;
import org.eclipse.paho.client.mqttv3.IMqttActionListener;
import org.eclipse.paho.client.mqttv3.IMqttToken;
import org.eclipse.paho.client.mqttv3.MqttException;


/**
 * Created by Benjamin on 2016-02-02.
 */
public class MqttClient {
    private static int transmissionInterval = 1;
    private static MqttAndroidClient client;
    private static float[] accelValues = new float[3];

    public static void connect(Context context, String serverURI, int portNum, String clientId){
        String uri = "tcp://" + serverURI + ":" + String.valueOf(portNum);

        TestCallBackClass callback = new TestCallBackClass();

        client = new MqttAndroidClient(context, uri, clientId);

        try{
            client.connect(null, callback);
        } catch (MqttException e){
            System.out.println("Error connecting to server: " + e.getMessage());
            e.printStackTrace();
        }
    }

    //We might need to pass in the topic as a parameter instead of hardcoding
    public static void subscribe(){
        try {
            client.subscribe("team-mat-canary", 0);
        } catch (MqttException e) {
            System.out.println("Error subscribing to topic: " + e.getMessage());
            e.printStackTrace();
        }
    }

    //We might need to pass in the topic as a parameter instead of hardcoding
    public static void publish(String data){

        if(client != null && client.isConnected()){
            try{
                client.publish("team-mat-canary", data.getBytes(),0,true);
            } catch(Exception e){
                System.out.println("Error sending message: " + e.getMessage());
                e.printStackTrace();
            }
        }


    }

    public static void setTransmissionInterval(int interval){
        transmissionInterval = interval;
    }

    public static int getTransmissionInterval(){
        return transmissionInterval;
    }

    public static void setAccelValues(float[] values){
        accelValues = values;
    }

    public static float[] getAccelValues(){
        return accelValues;
    }



}

//We need to change this callback class to something useful
class TestCallBackClass implements IMqttActionListener {

    public TestCallBackClass(){

    }

    @Override
    public void onSuccess(IMqttToken iMqttToken) {

        System.out.println("*****SENDING MESSAGE******");
    }

    @Override
    public void onFailure(IMqttToken iMqttToken, Throwable throwable) {
        System.out.println("*****ERROR CONNECTING*****");
    }
}

