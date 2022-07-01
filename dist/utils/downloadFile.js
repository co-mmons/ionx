export function downloadFile(url, responseType) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = responseType;
        request.onload = async () => {
            try {
                if (request.status === 200) {
                    resolve(request.response);
                }
                else {
                    throw new Error(request.statusText);
                }
            }
            catch (e) {
                console.error(e);
                reject(e);
            }
        };
        request.onerror = (e) => {
            console.error(e);
            reject(e);
        };
        request.send();
    });
}
