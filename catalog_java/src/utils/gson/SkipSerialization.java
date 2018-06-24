package utils.gson;

import java.lang.annotation.ElementType;
import java.lang.annotation.Target;

/**
 * Los campos anotados no se van a serializar como json
 */
@Target(ElementType.FIELD)
public @interface SkipSerialization {

}