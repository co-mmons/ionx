import {FormStatus} from "./FormStatus";

export interface FormState extends FormStatus {
    readonly value: any;
    readonly controls?: {[name: string]: FormState};
}
