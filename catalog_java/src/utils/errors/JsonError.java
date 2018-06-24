package utils.errors;

import utils.gson.JsonSerializable;

public interface JsonError extends JsonSerializable {
    int statusCode();
}
