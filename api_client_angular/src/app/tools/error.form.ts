import { FormGroup } from '@angular/forms';

export interface ValidationErrorItem {
    path: string;
    message: string;
}
export interface ValidationErrorMessage {
    error?: string;
    messages?: ValidationErrorItem[];
}

export class BasicFromGroupController {
    errorMessage: string;
    errors: Map<string, string> = new Map();
    form: FormGroup;

    processRestValidations = function (data: ValidationErrorMessage) {
        if (this.errors && this.errors.size > 0) {
            this.cleanRestValidations(this);
        }
        if (data.messages) {
            for (const error of data.messages) {
                this.errors.set(error.path, error.message);
            }
        } else {
            this.errorMessage = data.error;
        }
    };

    cleanRestValidations = function () {
        this.errorMessage = undefined;
        this.errors.clear();
    };

    hasError(item: string) {
        if (this.form) {
            const formItem = this.form.get(item);
            if (formItem && formItem.touched && formItem.invalid) {
                return true;
            }
        }

        if (this.errors.get(item)) {
            return true;
        }

        return false;
    }

    getErrorText(item: string) {
        if (this.errors.get(item)) {
            return this.errors.get(item);
        }

        if (this.form) {
            const formItem = this.form.get(item);
            if (formItem && formItem.touched && formItem.invalid) {
                return 'Valor inválido';
            }
        }

        return undefined;
    }
}

