package com.cs319.canary.canaryprotector;

import android.content.Context;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Joseph on 05/02/2016.
 */
public class LocalDataManager {

    public static File file;

    public static void DataManagerInitialize(Context context, String fileName)
    {
        file = new File("/sdcard/", fileName);  //TODO change /sdcard/ to context.getFilesDir()
        // file = new File(context.getFilesDir(), fileName);

        if(file.exists())
        {
            // file exists
            System.out.println("FILE EXISTS AT " + file.getPath());

            // try reading
            try {
                BufferedReader bufferedReader = new BufferedReader(new FileReader(file));
                String line;
                while((line = bufferedReader.readLine()) != null)
                {
                    System.out.println(line);
                }
                bufferedReader.close();
            } catch (IOException e) {
                e.printStackTrace();
            }

        }
        else
        {
            System.out.println("FILE DOES NOT EXIST CREATING NEW FILE");
            try {
                // try create
                file.createNewFile();
            } catch (IOException e) {
                System.out.println("ERROR CREATING NEW FILE");
                e.printStackTrace();
            }
        }
    }

    public static void WriteToFile(String stringToWrite)
    {
        //System.out.println("TRYING TO WRITE " + stringToWrite);

        if(file.length() > 500 * 1024) // 500kb max
        {
            System.out.println("FILE TOO BIG, SKIPPING");
            return;
        }

        try {
            BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(file, true));
            bufferedWriter.append(stringToWrite);
            bufferedWriter.newLine();
            bufferedWriter.close();
        } catch (IOException e) {
            System.out.println("ERROR WRITING TO FILE");
            e.printStackTrace();
        }
    }

    public static List<String> ReadFile()
    {
        List<String> stringList = new ArrayList<String>();
        System.out.println("TRYING TO READ FILE");
        try {
            BufferedReader bufferedReader = new BufferedReader(new FileReader(file));
            String line;
            while((line = bufferedReader.readLine()) != null)
            {
                System.out.println(line);
                stringList.add(line);
            }
            bufferedReader.close();
        } catch (IOException e) {
            System.out.println("ERROR READING FILE");
            e.printStackTrace();
        }
        return stringList;
    }

    public static void ClearFile()
    {
        System.out.println("TRYING TO CLEAR FILE");
        try {
            PrintWriter writer = new PrintWriter(file);
            writer.print("");
            writer.close();
            System.out.println("FILE CLEARED");
        } catch (FileNotFoundException e) {
            System.out.println("ERROR CLEARING FILE, FILE NOT FOUND");
            e.printStackTrace();
        }
    }
}
