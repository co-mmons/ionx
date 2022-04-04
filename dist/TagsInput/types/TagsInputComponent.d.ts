import { TextFieldTypes } from "@ionic/core";
import { EventEmitter } from "@stencil/core";
export declare class TagsInputComponent {
  element: HTMLElement;
  readonly: boolean;
  hideRemove: boolean;
  maxTags: number;
  placeholder: string;
  type: TextFieldTypes;
  separator: string;
  canEnterAdd: boolean;
  canBackspaceRemove: boolean;
  verifyFn: (tagSrt: string) => boolean;
  sortFn: (a: string, b: string) => number;
  sortable: boolean;
  unique: boolean;
  required?: boolean;
  value: string[];
  currentTag: string;
  get input(): HTMLInputElement;
  ionChange: EventEmitter<{
    value: string[];
  }>;
  setBlur(): void;
  setFocus(): Promise<void>;
  isUnique(tag: string): boolean;
  verifyTag(tagStr: string): boolean;
  sortTags(): void;
  pushTag(tag: string): any;
  onKeyUp(ev: KeyboardEvent): void;
  removeTag(index: number): any;
  render(): any;
}
