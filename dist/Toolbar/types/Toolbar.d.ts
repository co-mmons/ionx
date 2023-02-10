import type { Components as ionic } from "@ionic/core/components";
import { EventUnlisten } from "ionx/utils";
import { WidthBreakpointsContainer } from "ionx/WidthBreakpoints";
import { ToolbarButtonType } from "./ToolbarButtonType";
import { ToolbarTitleWrap } from "./ToolbarTitleWrap";
export declare class Toolbar {
  element: HTMLElement;
  button: ToolbarButtonType;
  buttonIcon: string;
  buttonHandler: () => void;
  defaultBackHref: string;
  titleVisible: boolean;
  titleWrap: ToolbarTitleWrap;
  titleWrapChanged(niu: ToolbarTitleWrap, old: ToolbarTitleWrap): void;
  breakpoints: WidthBreakpointsContainer;
  toolbarElement: HTMLElement;
  get contentElement(): HTMLElement & ionic.IonContent;
  unlistenScroll: EventUnlisten;
  contentScrolled(scrollElement: HTMLElement): Promise<void>;
  enableCollapsibleTitle(): Promise<void>;
  disableCollapsibleTitle(): void;
  dismissOverlay(): void;
  buttonClicked(ev: Event): Promise<boolean | void>;
  connectedCallback(): void;
  disconnectedCallback(): void;
  render(): any;
}
