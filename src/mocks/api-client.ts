export const apiClient = {
    put: function (url: string, data: unknown, onSuccess: (data: unknown) => void, onError: () => void) {
        fetch(url, { method: 'PUT', body: JSON.stringify(data) })
            .then((response) => {
                if (response.status === 200) {
                    return response.json()
                } else {
                    onError()
                }
            })
            .then((data) => {
                onSuccess(data)
            })
            .catch(() => {
                onError()
            })
    },
    get: function (url: string, onSuccess: (data: unknown) => void, onError: () => void) {
        fetch(url, { method: 'GET' })
            .then((response) => {
                if (response.status === 200) {
                    return response.json()
                } else {
                    onError()
                }
            })
            .then((data) => {
                onSuccess(data)
            })
            .catch(() => {
                onError()
            })
    },

}