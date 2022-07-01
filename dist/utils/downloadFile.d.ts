export declare function downloadFile(url: string, responseType: "blob"): Promise<Blob>;
export declare function downloadFile(url: string, responseType: "arraybuffer"): Promise<Uint8Array>;
export declare function downloadFile(url: string, responseType: "text"): Promise<string>;
