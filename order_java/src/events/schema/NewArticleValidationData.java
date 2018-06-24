
package events.schema;

import com.google.gson.annotations.SerializedName;

import utils.gson.Builder;
import utils.validator.MinLen;
import utils.validator.Required;

public class NewArticleValidationData {
    @SerializedName("referenceId")
    @Required
    @MinLen(1)
    public String orderId;

    @SerializedName("articleId")
    @Required
    @MinLen(1)
    public String articleId;

    @SerializedName("valid")
    public boolean valid;

    @SerializedName("stock")
    public int stock;

    @SerializedName("price")
    public double price;

    public static NewArticleValidationData fromJson(String json) {
        return Builder.gson().fromJson(json, NewArticleValidationData.class);
    }
}
