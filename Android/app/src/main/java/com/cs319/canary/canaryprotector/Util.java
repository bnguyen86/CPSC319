package com.cs319.canary.canaryprotector;

import android.widget.Spinner;

/**
 * Created by Benjamin on 2016-02-20.
 */
public class Util {

    public static int getIndex(Spinner spinner, String myString){
        int index = 0;

        for (int i = 0 ; i < spinner.getCount() ; i++){
            if (spinner.getItemAtPosition(i).toString().equalsIgnoreCase(myString)){
                index = i;
                break;
            }
        }
        return index;
    }
}
