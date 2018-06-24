package utils.errors;

import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.google.gson.Gson;
import com.google.gson.annotations.SerializedName;

import utils.gson.SkipSerialization;

/**
 * Un error de validaciones de atributos de una clase.
 * Estos errores se pueden serializar como Json.
 */
public class ValidationError extends Exception implements JsonError {
    private static final long serialVersionUID = 1L;

    @SkipSerialization
    public int statusCode = 400;

    @SerializedName("messages")
    ArrayList<ValidationMessage> messages = new ArrayList<>();

    public ValidationError() {

    }

    public ValidationError(int statusCode) {
        this.statusCode = statusCode;
    }

    public boolean isEmpty() {
        return messages.size() == 0;
    }

    public ValidationError addPath(String path, String message) {
        messages.add(new ValidationMessage(path, message));
        return this;
    }

    public String toJson() {
        SerializedMessage msg = new SerializedMessage();
        msg.messages = messages;
        return new Gson().toJson(msg);
    }

    class ValidationMessage {
        @SerializedName("path")
        String path;
        @SerializedName("message")
        String message;

        ValidationMessage(String path, String message) {
            this.path = path;
            this.message = message;
        }
    }

    class SerializedMessage {
        @SerializedName("messages")
        ArrayList<ValidationMessage> messages = new ArrayList<>();
    }

    @Override
	public int statusCode() {
		return statusCode;
    }

    @Override
    public void printStackTrace() {
        Logger.getLogger("ValidationError").log(Level.SEVERE, "Validation error : " + this.toJson());
    }
}