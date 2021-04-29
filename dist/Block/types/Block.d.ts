import { BlockWidth } from "./BlockWidth";
import { BlockWidthsMap } from "./BlockWidthsMap";
export declare class Block {
  innerWidth: BlockWidth | BlockWidthsMap;
  innerAlignment: "start" | "end" | "center";
  innerStyle: {
    [key: string]: string;
  };
  margins: boolean;
  padding: boolean;
  render(): any;
}
