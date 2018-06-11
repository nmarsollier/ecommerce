import { FormGroup } from '@angular/forms';

export interface ValidationErrorItem {
    path: string;
    message: string;
}
export interface ValidationErrorMessage {
    error?: string;
    messages?: ValidationErrorItem[];
}
export interface IErrorController {
    errorMessage: string;
    errors: Map<string, string>;
}
export interface IFormGroupErrorController extends IErrorController {
    form: FormGroup;
}

export function processRestValidations(controller: IErrorController, data: ValidationErrorMessage) {
    if (controller.errors && controller.errors.size > 0) {
        cleanRestValidations(controller);
    }
    if (data.messages) {
        for (const error of data.messages) {
            controller.errors.set(error.path, error.message);
        }
    } else {
        controller.errorMessage = data.error;
    }
}

export function processFormGroupRestValidations(controller: IFormGroupErrorController, data: ValidationErrorMessage) {
    processRestValidations(controller, data);

    controller.errors.forEach((value, key) => {
        if (controller.form.get(key)) {
            controller.form.get(key).setErrors({backend: {key: value}});
        }
    });
}

export function cleanRestValidations(controller: IErrorController) {
    controller.errorMessage = undefined;
    controller.errors.clear();
}
