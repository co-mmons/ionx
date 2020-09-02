export interface DialogValue {
    dialogValue(): Promise<any>;
}

export const dialogValueAttribute = "ionx-dialog-value";

export const markAsDialogValue = {[dialogValueAttribute]: true};
