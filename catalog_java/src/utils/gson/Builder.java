package utils.gson;

import com.google.gson.ExclusionStrategy;
import com.google.gson.FieldAttributes;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * Un builder de Gson que entiende como serializar las propiedades correctamente.
 */
public class Builder {
  public static Gson gson() {
    return new GsonBuilder().addSerializationExclusionStrategy(new ExclusionStrategy() {

      @Override
      public boolean shouldSkipField(FieldAttributes f) {
        return f.getAnnotation(SkipSerialization.class) != null;
      }

      @Override
      public boolean shouldSkipClass(Class<?> clazz) {
        return false;
      }
    }).create();
  }
}