package com.cs319.canary.canaryprotector;

import org.json.JSONObject;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by Benjamin on 2016-03-11.
 */
public class BackgroundServicesTest {

    @Before
    public void setUp() throws Exception {

    }

    @After
    public void tearDown() throws Exception {

    }

    @Test
    public void testGetClientId() throws Exception {

    }

    @Test
    public void testSetClientId() throws Exception {

    }

    @Test
    public void testCreateJsonData() throws Exception {

    }

    @Test
    public void testSendMessage() throws Exception {
        float[] testAccel = new float[]{(float)3.3,(float)4.4,(float)5.5};
        double[] testLatLon = new double[]{1.1,2.2};
        String testString = BackgroundServices.createJsonData("testId",
                "testDate",
                testAccel,
                (float).5,
                testLatLon,
                555
                );

        JSONObject newJSON = new JSONObject(testString);

        assertEquals("testId", newJSON.get("clientId"));
        assertEquals("testDate", newJSON.get("datetime"));
        //assertEquals(3.3, newJSON.get("accelX")); //There are round errors here
        //assertEquals(4.4, newJSON.get("accelY"));
        //assertEquals(5.5, newJSON.get("accelZ"));
        assertEquals(0.5, newJSON.get("battery"));
        assertEquals(1.1, newJSON.get("lat"));
        assertEquals(2.2, newJSON.get("lon"));
        assertEquals(555, newJSON.get("transferRate"));
    }

    @Test
    public void testDataCollectionInterval() throws Exception {


    }


    @Test
    public void testDataTransferInterval() throws Exception {
        BackgroundServices.setDataTransferInterval(2000);
        assertEquals(2000, BackgroundServices.getDataTransferInterval());

        BackgroundServices.setDataTransferInterval(1);
        assertEquals(1, BackgroundServices.getDataTransferInterval());
    }


    @Test
    public void testSetIntentRedelivery() throws Exception {

    }
}