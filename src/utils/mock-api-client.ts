import { API_DELAY, LOCALSTORAGE_KEY } from "../config/app";

export const mockApiClient = {
    // PUT, not POST - because every time we re-write localstorage data
    PUT: function (data: any) {
        return new Promise<string>(function(resolve, reject) {
            try {
                const encodedData = JSON.stringify(data);
                localStorage.setItem(LOCALSTORAGE_KEY, encodedData)
                window.setTimeout(() => {
                    resolve(encodedData)
                }, API_DELAY)
            } catch (error) {
                console.error('mockApiClient.PUT failed: ', error)
                reject()
            }
        })
    },
    GET: function () {
        return new Promise<string>(function(resolve, reject) {
            try {
                const encodedData = localStorage.getItem(LOCALSTORAGE_KEY)
                window.setTimeout(() => {
                    if (encodedData) {
                        resolve(encodedData);
                    } else {
                        reject()
                    }
                }, API_DELAY)
            } catch (error) {
                console.error('mockApiClient.GET failed: ', error)
                reject()
            }
        })
    }
}