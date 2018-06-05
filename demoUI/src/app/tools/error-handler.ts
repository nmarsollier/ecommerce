export interface ValidationErrorItem {
    path: string;
    message: string;
}
export interface ValidationErrorMessage {
    error?: string;
    message?: ValidationErrorItem[];
}
export interface IErrorController {
    errorMessage: string;
    errors: string[];
}

export function procesarValidacionesRest(controller: IErrorController, data: ValidationErrorMessage) {
    if (!controller.errors) {
        cleanRestValidations(controller);
    }
    if (data.message) {
        for (const error of data.message) {
            controller.errors[error.path] = error.message;
        }
    } else {
        controller.errorMessage = data.error;
    }
}

export function cleanRestValidations(controller: IErrorController) {
    controller.errorMessage = undefined;
    controller.errors = [];
}

