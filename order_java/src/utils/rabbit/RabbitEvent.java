package utils.rabbit;

import com.google.gson.annotations.SerializedName;

import utils.gson.Builder;
import utils.gson.JsonSerializable;
import utils.validator.Required;

public class RabbitEvent implements JsonSerializable {
    @SerializedName("type")
    @Required
    public String type;

    @SerializedName("queue")
    public String queue;

    @SerializedName("exchange")
    public String exchange;

    @SerializedName("message")
    @Required
    public Object message;

    public static RabbitEvent fromJson(String json) {
        return Builder.gson().fromJson(json, RabbitEvent.class);
    }

    @Override
    public String toJson() {
        return Builder.gson().toJson(this);
    }
}
