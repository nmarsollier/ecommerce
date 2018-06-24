package utils.server;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.google.gson.Gson;
import com.google.gson.stream.JsonReader;

public class Environment {
    static EnvData envData = new EnvData();

    public static EnvData getEnv() {
        return envData;
    }

    static {
        envData = new EnvData();

        try {
            Gson gson = new Gson();
            JsonReader reader;
            reader = new JsonReader(new FileReader("config.json"));
            EnvData data = gson.fromJson(reader, EnvData.class);

            if (data.databaseUrl != null) {
                envData.databaseUrl = data.databaseUrl;
            }
            if (data.serverPort != null) {
                envData.serverPort = data.serverPort;
            }
            if (data.securityServerUrl != null) {
                envData.securityServerUrl = data.securityServerUrl;
            }
            if (data.rabbitServerUrl != null) {
                envData.rabbitServerUrl = data.rabbitServerUrl;
            }
            if (data.staticLocation != null) {
                envData.staticLocation = data.staticLocation;
            }

            Logger.getLogger("Environment").log(Level.INFO, "Archivo config.json cargado.");
        } catch (FileNotFoundException e) {
            Logger.getLogger("Environment").log(Level.INFO, "Archivo config.json no encontrado.");
        }
    }

}