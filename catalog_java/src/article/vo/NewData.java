package article.vo;

import com.google.gson.annotations.SerializedName;

import utils.gson.Builder;
import utils.gson.JsonSerializable;
import utils.validator.MaxLen;
import utils.validator.MinLen;
import utils.validator.MinValue;
import utils.validator.Required;

/**
 * Objeto valor para crear un articulo nuevo.
 */
public class NewData implements JsonSerializable {
    @SerializedName("name")
    @Required()
    @MinLen(1)
    @MaxLen(60)
    public String name;

    @SerializedName("description")
    @MaxLen(2048)
    public String description;

    @SerializedName("image")
    @MinLen(30)
    @MaxLen(40)
    public String image;

    @MinValue(0)
    @SerializedName("price")
    public double price;

    @SerializedName("stock")
    @MinValue(0)
    public int stock;

    public static NewData fromJson(String json) {
        return Builder.gson().fromJson(json, NewData.class);
    }

    @Override
    public String toJson() {
        return Builder.gson().toJson(this);
    }
}
