package utils.errors;

import com.google.gson.Gson;
import com.google.gson.annotations.SerializedName;

import utils.gson.SkipSerialization;

/**
 * Es un error simple que se puede serializar como Json.
 */
public class SimpleError extends Exception implements JsonError {
    private static final long serialVersionUID = 1L;

    @SkipSerialization
    int statusCode = 500;

    @SerializedName("error")
    String error;

    public SimpleError(int statusCode, String error) {
        this.statusCode = statusCode;
        this.error = error;
    }

    public SimpleError(String error) {
        this.error = error;
    }

    public String toJson() {
        SerializedMessage msg = new SerializedMessage();
        msg.error = error;
        return new Gson().toJson(msg);
    }

    class SerializedMessage {
        @SerializedName("error")
        String error;
    }

	@Override
	public int statusCode() {
		return statusCode;
	}
}