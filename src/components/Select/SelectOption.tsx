export interface SelectOption {
    label?: string;
    value: any;
    divider?: boolean;
    group?: boolean;
    options?: SelectOption[];
    lazyOptions?: () => Promise<SelectOption>;
}
