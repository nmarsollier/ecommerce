import React from "react";

export interface IError {
    response?: {
        data?: {
            error?: string;
            messages?: Array<{
                path: string;
                message: string;
            }>;
        };
    };
}

export interface ICommonProps {
    history?: any;
    match?: any;
}

export default class CommonComponent<P extends ICommonProps, S> extends React.Component<P, S> {
    // Es un error genérico en el form, no asociado a ningún componente visual
    protected errorMessage?: string = undefined;

    // Son errores de los componentes visuales, es un map
    // la clave es el campo con error, el contenido es el mensaje
    protected errors: Map<string, string> = new Map();

    // Procesa errores rest y llena errors de acuerdo a los resultados
    protected processRestValidations(data: IError) {
        if (this.errors && this.errors.size > 0) {
            this.cleanRestValidations();
        }
        if (!data.response || !data.response.data) {
            this.errorMessage = "Problemas de conexión, verifique conexión a internet.";
            this.forceUpdate();
            return;
        }
        if (data.response.data.messages) {
            for (const error of data.response.data.messages) {
                this.errors.set(error.path, error.message);
            }
        } else {
            this.errorMessage = data.response.data.error;
        }
        this.forceUpdate();
    }

    protected addError(component: string, message: string) {
        this.errors.set(component, message);
    }

    // Limpia las validaciones actuales de errores
    protected cleanRestValidations() {
        this.errorMessage = undefined;
        this.errors.clear();
        this.forceUpdate();
    }

    // Devuelve el texto del error de un elemento
    protected getErrorText(item: string) {
        return this.errors.get(item);
    }

    protected getErrorClass(component: string, baseClass: string) {
        return baseClass + (this.getErrorText(component) ? " is-invalid" : "");
    }

    protected hasErrors() {
        return this.errors.size > 0 && !this.errorMessage;
    }

    protected updateState = (event: React.ChangeEvent<HTMLInputElement>) => {
        const update: any = {};
        update[event.target.id] = event.target.value;
        this.setState(update);
    }

    protected goHome = () => {
        this.props.history.push("/");
    }
}
