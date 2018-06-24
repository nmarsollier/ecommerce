package article.vo;

import com.google.gson.annotations.SerializedName;

import utils.gson.Builder;
import utils.gson.JsonSerializable;
import utils.validator.MaxLen;
import utils.validator.MinLen;
import utils.validator.Required;

/**
 * Objeto valor para editar un articulo.
 */
public class DescriptionData implements JsonSerializable {
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

    public static DescriptionData fromJson(String json) {
        return Builder.gson().fromJson(json, DescriptionData.class);
    }

    @Override
	public String toJson() {
		return Builder.gson().toJson(this);
	}
}