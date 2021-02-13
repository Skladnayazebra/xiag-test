import { API_DELAY, LOCALSTORAGE_KEY } from "../app-config";

// this api client can be extended to class or function,
// maybe we wanted to add some parameters in future, like localstorageKey
// but in real use cases this methods will be replaced by fetch() or similar

export const mockApiClient = {
    // PUT, not POST - because every time we re-write localstorage data
    PUT: function (data: any) {
        return new Promise<void>(function(resolve, reject) {
            try {
                const encodedData = JSON.stringify(data);
                localStorage.setItem(LOCALSTORAGE_KEY, encodedData)
                window.setTimeout(() => {
                    resolve()
                }, API_DELAY)
            } catch (error) {
                console.error('mockApiClient.PUT failed: ', error)
                reject()
            }
        })
    },
    GET: function () {
        return new Promise(function(resolve, reject) {
            try {
                const encodedData = localStorage.getItem(LOCALSTORAGE_KEY)
                if (encodedData) {
                    const data = JSON.parse(encodedData)
                    resolve(data);
                } else {
                    reject()
                }
            } catch (error) {
                console.error('mockApiClient.GET failed: ', error)
                reject()
            }
        })
    }
}