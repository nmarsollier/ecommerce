package utils.validator;

import java.util.Arrays;

import utils.errors.ValidationError;

/**
 * Esta clase ejecuta las validaciones definidas en las interfaces de este mismo paquete.
 * A los atributos de una clase hay que anotarlos con cualquier anotación, luego ejecutar el método validate.
 *
 * Este método va a tirar una excepción si no valida.
 */
public class Validator {
    public static void validate(Object value) throws ValidationError {
        ValidationError errors = new ValidationError();
        validateRequired(errors, value);
        validateMaxLen(errors, value);
        validateMinLen(errors, value);
        validateMaxValue(errors, value);
        validateMinValue(errors, value);

        if (!errors.isEmpty()) {
            throw errors;
        }
    }

    static void validateRequired(ValidationError validations, Object obj) {
        Arrays.stream(obj.getClass().getDeclaredFields()) //
                .filter(field -> field.getAnnotation(Required.class) != null
                        && ((Required) field.getAnnotation(Required.class)).value())
                .forEach((field) -> {
                    try {
                        field.setAccessible(true);
                        if (field.get(obj) == null) {
                            validations.addPath(field.getName(), "Es Requerido");
                        }
                    } catch (Exception e) {
                    }
                });
    }

    static void validateMinLen(ValidationError validations, Object obj) {
        Arrays.stream(obj.getClass().getDeclaredFields()) //
                .filter(field -> field.getType() == String.class) //
                .filter(field -> field.getAnnotation(MinLen.class) != null) //
                .forEach((field) -> {
                    try {
                        field.setAccessible(true);
                        int minLen = ((MinLen) field.getAnnotation(MinLen.class)).value();
                        String value = (String) field.get(obj);

                        if (value != null && value.length() < minLen) {
                            validations.addPath(field.getName(), "Mínimo reqerido " + minLen);
                        }
                    } catch (Exception e) {
                    }
                });
    }

    static void validateMaxLen(ValidationError validations, Object obj) {
        Arrays.stream(obj.getClass().getDeclaredFields()) //
                .filter(field -> field.getType() == String.class) //
                .filter(field -> field.getAnnotation(MaxLen.class) != null) //
                .forEach((field) -> {
                    try {
                        field.setAccessible(true);
                        int maxLen = ((MaxLen) field.getAnnotation(MaxLen.class)).value();
                        String value = (String) field.get(obj);

                        if (value != null && value.length() > maxLen) {
                            validations.addPath(field.getName(), "Máximo permitido  " + maxLen);
                        }
                    } catch (Exception e) {
                    }
                });
    }

    static void validateMinValue(ValidationError validations, Object obj) {
        Arrays.stream(obj.getClass().getDeclaredFields()) //
                .filter(field -> field.getAnnotation(MinValue.class) != null) //
                .forEach((field) -> {
                    try {
                        field.setAccessible(true);
                        double value = field.getDouble(obj);

                        int minValue = ((MinValue) field.getAnnotation(MinValue.class)).value();

                        if (value < minValue) {
                            validations.addPath(field.getName(), "Mínimo reqerido " + minValue);
                        }
                    } catch (Exception e) {
                    }
                });
    }

    static void validateMaxValue(ValidationError validations, Object obj) {
        Arrays.stream(obj.getClass().getDeclaredFields()) //
                .filter(field -> field.getAnnotation(MaxValue.class) != null) //
                .forEach((field) -> {
                    try {
                        field.setAccessible(true);
                        double value = field.getDouble(obj);

                        int maxValue = ((MaxValue) field.getAnnotation(MaxValue.class)).value();

                        if (value > maxValue) {
                            validations.addPath(field.getName(), "Máximo permitido  " + maxValue);
                        }
                    } catch (Exception e) {
                    }
                });
    }
}