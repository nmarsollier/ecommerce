package utils.validator;

import java.util.Arrays;
import java.util.Collection;
import java.util.logging.Level;
import java.util.logging.Logger;

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
        validate(errors, "", value);
        if (!errors.isEmpty()) {
            throw errors;
        }
    }

    private static void validate(ValidationError errors, String root, Object value) {
        validateRequired(errors, root, value);
        validateMaxLen(errors, root, value);
        validateMinLen(errors, root, value);
        validateMaxValue(errors, root, value);
        validateMinValue(errors, root, value);
        validateNotEmpty(errors, root, value);
        validateNested(errors, root, value);
    }

    static void validateRequired(ValidationError validations, String root, Object obj) {
        Arrays.stream(obj.getClass().getDeclaredFields()) //
                .filter(field -> field.getAnnotation(Required.class) != null).forEach((field) -> {
                    try {
                        field.setAccessible(true);
                        if (field.get(obj) == null) {
                            validations.addPath(root + field.getName(), "Es Requerido");
                        }
                    } catch (Exception e) {
                        Logger.getLogger("Validator").log(Level.SEVERE, "Validator.validateRequired", e);
                    }
                });
    }

    static void validateMinLen(ValidationError validations, String root, Object obj) {
        Arrays.stream(obj.getClass().getDeclaredFields()) //
                .filter(field -> field.getType() == String.class) //
                .filter(field -> field.getAnnotation(MinLen.class) != null) //
                .forEach((field) -> {
                    try {
                        field.setAccessible(true);
                        int minLen = ((MinLen) field.getAnnotation(MinLen.class)).value();
                        String value = (String) field.get(obj);

                        if (value != null && value.length() < minLen) {
                            validations.addPath(root + field.getName(), "Mínimo requerido " + minLen);
                        }
                    } catch (Exception e) {
                        Logger.getLogger("Validator").log(Level.SEVERE, "Validator.validateMinLen", e);
                    }
                });
    }

    static void validateMaxLen(ValidationError validations, String root, Object obj) {
        Arrays.stream(obj.getClass().getDeclaredFields()) //
                .filter(field -> field.getType() == String.class) //
                .filter(field -> field.getAnnotation(MaxLen.class) != null) //
                .forEach((field) -> {
                    try {
                        field.setAccessible(true);
                        int maxLen = ((MaxLen) field.getAnnotation(MaxLen.class)).value();
                        String value = (String) field.get(obj);

                        if (value != null && value.length() > maxLen) {
                            validations.addPath(root + field.getName(), "Máximo permitido  " + maxLen);
                        }
                    } catch (Exception e) {
                        Logger.getLogger("Validator").log(Level.SEVERE, "Validator.validateMaxLen", e);
                    }
                });
    }

    static void validateMinValue(ValidationError validations, String root, Object obj) {
        Arrays.stream(obj.getClass().getDeclaredFields()) //
                .filter(field -> field.getAnnotation(MinValue.class) != null) //
                .forEach((field) -> {
                    try {
                        field.setAccessible(true);
                        double value = field.getDouble(obj);

                        int minValue = ((MinValue) field.getAnnotation(MinValue.class)).value();

                        if (value < minValue) {
                            validations.addPath(root + field.getName(), "Mínimo requerido " + minValue);
                        }
                    } catch (Exception e) {
                        Logger.getLogger("Validator").log(Level.SEVERE, "Validator.validateMinValue", e);
                    }
                });
    }

    static void validateMaxValue(ValidationError validations, String root, Object obj) {
        Arrays.stream(obj.getClass().getDeclaredFields()) //
                .filter(field -> field.getAnnotation(MaxValue.class) != null) //
                .forEach((field) -> {
                    try {
                        field.setAccessible(true);
                        double value = field.getDouble(obj);

                        int maxValue = ((MaxValue) field.getAnnotation(MaxValue.class)).value();

                        if (value > maxValue) {
                            validations.addPath(root + field.getName(), "Máximo permitido  " + maxValue);
                        }
                    } catch (Exception e) {
                        Logger.getLogger("Validator").log(Level.SEVERE, "Validator.validateMaxValue", e);
                    }
                });
    }

    static void validateNotEmpty(ValidationError validations, String root, Object obj) {
        Arrays.stream(obj.getClass().getDeclaredFields()) //
                .filter(field -> field.getAnnotation(NotEmpty.class) != null).forEach((field) -> {
                    try {
                        field.setAccessible(true);
                        Object[] value = (Object[]) field.get(obj);
                        if (value.length == 0) {
                            validations.addPath(root + field.getName(), "No puede esta vacío");
                        }
                    } catch (Exception e) {
                        Logger.getLogger("Validator").log(Level.SEVERE, "Validator.validateNotEmpty", e);
                    }
                });
    }

    @SuppressWarnings("unchecked")
    static void validateNested(ValidationError validations, String root, Object obj) {
        Arrays.stream(obj.getClass().getDeclaredFields()) //
                .filter(field -> field.getType() == Object.class) //
                .filter(field -> field.getAnnotation(Validate.class) != null) //
                .forEach((field) -> {
                    try {
                        Object value = field.get(obj);
                        if (value == null) {
                            return;
                        } else if (value instanceof Collection) {
                            Collection<Object> data = (Collection<Object>) value;
                            data.stream().forEach(it -> validate(validations, field.getName(), it));
                        } else if (value.getClass().isArray()) {
                            Arrays.stream((Object[]) value).forEach(it -> validate(validations, field.getName(), it));
                        } else {
                            validate(validations, field.getName(), value);
                        }
                    } catch (Exception e) {
                        Logger.getLogger("Validator").log(Level.SEVERE, "Validator.validateNested", e);
                    }
                });
    }
}