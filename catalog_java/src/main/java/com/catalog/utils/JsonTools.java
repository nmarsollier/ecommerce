package com.catalog.utils;

import java.io.IOException;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;

import org.bson.types.ObjectId;

public class JsonTools {

    public static Gson getGson() {
        return new GsonBuilder().registerTypeAdapter(ObjectId.class, new ObjectIdAdapter()).create();
    }
}

class ObjectIdAdapter extends TypeAdapter<ObjectId> {
    private final Gson gson = new GsonBuilder().create();
    private final TypeAdapter<String> dateTypeAdapter = gson.getAdapter(String.class);

    @Override
    public ObjectId read(JsonReader reader) throws IOException {
        return new ObjectId(dateTypeAdapter.read(reader));
    }

    @Override
    public void write(JsonWriter writer, ObjectId value) throws IOException {
        dateTypeAdapter.write(writer, value.toString());
    }
}