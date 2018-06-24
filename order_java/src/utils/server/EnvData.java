package utils.server;

import com.google.gson.annotations.SerializedName;

public class EnvData {
    @SerializedName("serverPort")
    public Integer serverPort = 3004;
    @SerializedName("securityServerUrl")
    public String securityServerUrl = "http://localhost:3000";
    @SerializedName("rabbitServerUrl")
    public String rabbitServerUrl = "localhost";
    @SerializedName("databaseUrl")
    public String databaseUrl = "localhost";
    @SerializedName("staticLocation")
    public String staticLocation = "www";
}