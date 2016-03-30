package com.cs319.canary.canaryprotector;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.text.TextUtils;
import android.view.View;
import android.content.Intent;
import android.widget.EditText;


public class WelcomeActivity extends AppCompatActivity {

    public final static String CLIENT_NAME = "canaryprotector.USERNAME_MESSAGE";

    @Override
    protected void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);

        // if client_name is already set, ignore this page, go directly to main activity.
        SharedPreferences pref = getSharedPreferences("APP_PREF", Context.MODE_PRIVATE);
        String clientName = pref.getString(CLIENT_NAME,"");
        if(!clientName.equals("")){
            Intent intent = new Intent(this, MainActivity.class);
            startActivity(intent);
            finish();
        } else {
            setContentView(R.layout.activity_welcome);
        }

    }

    /** Called when the user clicks the SUBMIT button */
    public void sendUsername(View view) {
        Intent intent = new Intent(this, MainActivity.class);
        EditText editUsername = (EditText) findViewById(R.id.editID);
        String username = editUsername.getText().toString();

        if(TextUtils.isEmpty(username)){
            editUsername.setError("Username can't be empty");
            return;
        }

        SharedPreferences pref = getSharedPreferences("APP_PREF", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = pref.edit();
        editor.putString(CLIENT_NAME,username);
        editor.commit();

        startActivity(intent);
    }

}
