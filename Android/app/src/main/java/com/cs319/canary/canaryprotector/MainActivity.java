package com.cs319.canary.canaryprotector;

import android.content.Context;
import android.content.Intent;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.telephony.TelephonyManager;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity
        implements NavigationDrawerFragment.NavigationDrawerCallbacks, SensorEventListener {

    /**
     * Fragment managing the behaviors, interactions and presentation of the navigation drawer.
     */
    private NavigationDrawerFragment mNavigationDrawerFragment;

    /**
     * Used to store the last screen title. For use in {@link #restoreActionBar()}.
     */
    private CharSequence mTitle;


    private int timer1 = 0;
    private int timer2 = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mNavigationDrawerFragment = (NavigationDrawerFragment)
                getSupportFragmentManager().findFragmentById(R.id.navigation_drawer);
        mTitle = getTitle();

        // Set up the drawer.
        mNavigationDrawerFragment.setUp(
                R.id.navigation_drawer,
                (DrawerLayout) findViewById(R.id.drawer_layout));

        //Set up accelerometer sensor
        SensorManager senSensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
        Sensor senAccelerometer = senSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        senSensorManager.registerListener(this, senAccelerometer, SensorManager.SENSOR_DELAY_NORMAL);

        //Set up data collector
        DataCollector.DataCollectorInitialize(getApplicationContext());

        //Connect to MQTT Server
        TelephonyManager tm = (TelephonyManager) getSystemService(Context.TELEPHONY_SERVICE);
        String clientId = tm.getDeviceId();
        MqttClient.connect(getApplicationContext(), getString(R.string.broker_url), 1883, clientId);

        // Initialize LocalDataManager
        LocalDataManager.DataManagerInitialize(getApplicationContext(), "CanaryTestFile.txt");

        //Start sending data
        Intent backgroundServicesIntent = new Intent(this, BackgroundServices.class);
        this.startService(backgroundServicesIntent);

    }

    @Override
    public void onNavigationDrawerItemSelected(int position) {
        // update the main content by replacing fragments
        Fragment fragment;
        FragmentManager fragmentManager = getSupportFragmentManager();
        System.out.println("Position: " + position);
        switch(position) {
            default:
            case 0:
                fragment = HomeFragment.newInstance();
                break;
            case 1:
                fragment = AdjustCollection.newInstance();
                break;
            case 2:
                fragment = AdjustTransfer.newInstance();
                break;
        }

        fragmentManager.beginTransaction()
                .replace(R.id.container, fragment)
                .commit();
    }

    public void onSectionAttached(int number) {
        switch (number) {
            case 1:
                mTitle = getString(R.string.title_section1);
                break;
            case 2:
                mTitle = getString(R.string.title_section2);
                break;
            case 3:
                mTitle = getString(R.string.title_section3);
                break;
        }
    }

    public void restoreActionBar() {
        ActionBar actionBar = getSupportActionBar();
        actionBar.setNavigationMode(ActionBar.NAVIGATION_MODE_STANDARD);
        actionBar.setDisplayShowTitleEnabled(true);
        actionBar.setTitle(mTitle);
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        if (!mNavigationDrawerFragment.isDrawerOpen()) {
            // Only show items in the action bar relevant to this screen
            // if the drawer is not showing. Otherwise, let the drawer
            // decide what to show in the action bar.
            getMenuInflater().inflate(R.menu.main, menu);
            restoreActionBar();
            return true;
        }
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        Sensor mySensor = event.sensor;

        timer1++;
        timer2++;

        MqttClient.setAccelValues(event.values);
        if (mySensor.getType() == Sensor.TYPE_ACCELEROMETER) {

            TextView xValue = (TextView)findViewById(R.id.x_value);
            TextView yValue = (TextView)findViewById(R.id.y_value);
            TextView zValue = (TextView)findViewById(R.id.z_value);

            if((xValue != null) && (yValue != null) && (zValue != null)){
                xValue.setText(String.valueOf(event.values[0]));
                yValue.setText(String.valueOf(event.values[1]));
                zValue.setText(String.valueOf(event.values[2]));
            }

            // Uncomment to test LocalDataManager
            // TODO delete this and timer1, timer2 later
            /*
            if(timer1 >= 10)
            {
                timer1 = 0;
                LocalDataManager.WriteToFile("X: " + event.values[0] + " Y: " + event.values[1] + " Z: " + event.values[2]);
            }

            if(timer2 >= 200)
            {
                timer2 = 0;
                LocalDataManager.ReadFile();
            }
            */
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {

    }

    //Main class methods
    protected void onPause() {
        super.onPause();
        //We don't want to unregister this, since we need it working the background
        //senSensorManager.unregisterListener(this);
    }

    protected void onResume() {
        super.onResume();
        //senSensorManager.registerListener(this, senAccelerometer, SensorManager.SENSOR_DELAY_NORMAL);
    }

}
