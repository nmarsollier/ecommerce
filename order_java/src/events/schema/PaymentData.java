package events.schema;

import com.google.gson.annotations.SerializedName;

import utils.gson.Builder;
import utils.validator.MinLen;
import utils.validator.MinValue;
import utils.validator.Required;

public class PaymentData {
    @SerializedName("orderId")
    public String orderId;

    @SerializedName("userId")
    @Required
    @MinLen(1)
    public String userId;

    @SerializedName("method")
    @Required
    public PaymentEvent.Method method;

    @SerializedName("amount")
    @Required
    @MinValue(0)
    public double amount;

    public static PaymentData fromJson(String json) {
        return Builder.gson().fromJson(json, PaymentData.class);
    }
}