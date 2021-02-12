import cn from 'classnames'
import { useHistory } from 'react-router-dom'
import s from './PollCreatorPage.module.scss'
import { useForm } from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'


type FormData = {
    name: string,
}

const SUBMIT_TIMEOUT = 500;

export const PollCreatorPage = () => {
    const { register, handleSubmit } = useForm<FormData>()
    const [savedPoll, setSavedPoll]= useState({ name: ''})

    const submitTimeout = useRef<number>()
    const history = useHistory()

    useEffect(() => {
        const pollString = localStorage.getItem('poll')
        const poll = pollString ? JSON.parse(pollString) : { name: ''}
        setSavedPoll(poll)
    }, [])

    const onSubmit = (data: FormData) => {
        submitTimeout.current = window.setTimeout(() => {
            history.push('/vote')
        }, SUBMIT_TIMEOUT)
        localStorage.setItem('poll', JSON.stringify(data))
    }

    return (
        <div>
            <h1>POLL CREATOR</h1>
            <p>{savedPoll.name}</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="text" name="name" placeholder="name" ref={register}/>
                <button type="submit">SUBMIT</button>
            </form>
            <button type="button" onClick={() => localStorage.removeItem('poll')}>remove all polls from local storage</button>
        </div>
    )
}