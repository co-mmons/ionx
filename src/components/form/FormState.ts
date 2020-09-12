export interface FormState {
    readonly touched: boolean;
    readonly untouched: boolean;
    readonly dirty: boolean;
    readonly pristine: boolean;
    readonly errors: {[key: string]: any};
    readonly value: any;
    readonly controls?: {[name: string]: FormState};
}
