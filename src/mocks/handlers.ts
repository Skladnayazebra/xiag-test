import { rest } from 'msw'
import { LOCALSTORAGE_KEY } from "../config/app";

export const handlers = [
    rest.get('/poll', ((req, res, ctx) => {
        const encodedData = localStorage.getItem(LOCALSTORAGE_KEY)
        const data = encodedData ? JSON.parse(encodedData) : null;

        if (data !== null) {
            return res(
                ctx.status(200),
                ctx.json(data)
            )
        } else {
            return res(
                ctx.status(404)
            )
        }
    })),

    rest.put('/poll', ((req, res, ctx) => {
        let data = null;
        if (typeof req.body === 'string') { // check if we have json here
            data = JSON.parse(req.body);
            localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(data));
        }

        if (data !== null) {
            return res(
                ctx.status(200),
                ctx.json(data)
            )
        } else {
            return res(
                ctx.status(500)
            )
        }
    }))
]