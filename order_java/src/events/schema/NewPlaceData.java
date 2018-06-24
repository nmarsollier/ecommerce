package events.schema;

import com.google.gson.annotations.SerializedName;

import utils.gson.Builder;
import utils.validator.MinLen;
import utils.validator.MinValue;
import utils.validator.NotEmpty;
import utils.validator.Required;
import utils.validator.Validate;

public class NewPlaceData {
    @SerializedName("cartId")
    @Required
    @MinLen(1)
    public String cartId;

    @SerializedName("userId")
    @Required
    @MinLen(1)
    public String userId;

    @SerializedName("articles")
    @Required
    @NotEmpty
    @Validate
    public Article[] articles;

    public static class Article {
        @SerializedName("id")
        @Required
        @MinLen(1)
        public String id;

        @SerializedName("quantity")
        @Required
        @MinValue(1)
        public int quantity;
    }

    public static NewPlaceData fromJson(String json) {
        return Builder.gson().fromJson(json, NewPlaceData.class);
    }
}
