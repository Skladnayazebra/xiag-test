import s from './VotePage.module.scss'
import { Link } from 'react-router-dom'
import { useEffect, useReducer, useRef, useState } from "react";
import { mockApiClient } from "../../utils/mock-api-client";
import { Routes } from "../../routes";
import { TOption, TPollPublished, TVote } from "../../models";
import { useForm } from "react-hook-form";
import { VOTES_LIST_STEP } from "../../config/app";

const firstNames = ['Fabulous', 'Shy', 'Mighty', 'Lazy', 'Angry', 'Little', 'Beautiful', 'Funny', 'Brave']
const secondNames = ['Mongoose', 'Doge', 'Lion', 'Zebra', 'Tiger', 'Bee', 'Deer', 'Ant', 'Squirrel']


const randomNumberInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pickRandomFromArray = (array: unknown[]): unknown => array[randomNumberInRange(0, array.length - 1)]
const getRandomName = (): string => `${pickRandomFromArray(firstNames)} ${pickRandomFromArray(secondNames)}`



enum ActionType {
    loadPoll = 'loadPoll',
    updatePoll = 'updatePoll',
}

type State = {
    poll: TPollPublished | null
}

interface Action<T> {
    type: ActionType,
    payload: T,
}

const getRandomVote = (options: TOption[]): TVote => {
    return ({
        name: getRandomName(),
        optionId: randomNumberInRange(1, options.length),
    })
}


const votePageReducer = (state: State, action: Action<any>) => {
    switch(action.type) {
        case ActionType.loadPoll:
            return {
                ...state,
                poll: action.payload.poll,
            }
        case ActionType.updatePoll:
            return {
                ...state,
                poll: { ...state.poll, ...action.payload.poll },
            }
    }
}

export const VotePage = () => {
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [state, dispatch] = useReducer(votePageReducer, { poll: null })
    const [autoVote, setAutoVote] = useState(false);
    const { register, handleSubmit } = useForm<TVote>()
    const timerRef = useRef<number | undefined>()
    const [votesToShow, setVotesToShow] = useState<number>(VOTES_LIST_STEP)

    const downloadPoll = () => {
        mockApiClient.GET()
            .then((data: string) => {
                const poll: TPollPublished = JSON.parse(data);
                dispatch({ type: ActionType.loadPoll, payload: { poll } })
            })
            .catch(() => {
                setGeneralError('No poll loaded.');
            })
    }

    const uploadPoll = (poll: TPollPublished) => {
        mockApiClient.PUT(poll)
            .then((data) => {
                const incomingPoll: TPollPublished = JSON.parse(data);
                dispatch({ type: ActionType.updatePoll, payload: { poll: incomingPoll }})
            })
            .catch(() => {
                setGeneralError('Error on vote sending.');
            })
    }


    useEffect(() => {
        downloadPoll();
    }, [])

    // repeatedly adds votes
    useEffect(() => {
        if (state.poll && autoVote) {
            timerRef.current = window.setTimeout(() => {
                window.clearTimeout(timerRef.current)
                const updatedPoll = {
                    ...state.poll,
                    votes: [...state.poll.votes, getRandomVote(state.poll.options)]
                }
                uploadPoll(updatedPoll)
            }, randomNumberInRange(1000, 4000))
        }
        if (!autoVote) {
            window.clearTimeout(timerRef.current)
        }
    }, [state.poll, state.poll?.votes, autoVote])


    const onSubmit = (vote: TVote) => {
        const updatedPoll: TPollPublished = {
            ...state.poll,
            votes: [...state.poll.votes, vote],
            userVoted: true,
        }
        uploadPoll(updatedPoll)
    }

    return (
        <div>
            <h1>VOTE PAGE</h1>
            {generalError &&
                <p>{generalError} <Link to={Routes.index}>Return to poll creator</Link></p>
            }
            {state.poll &&
                <div>
                    <div>
                        <h2>{state.poll?.question}</h2>
                        {state.poll.userVoted ? (
                            <p>Thank you for your vote! <Link to={Routes.index}>Return to poll creator</Link></p>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className={s.options}>
                                    {state.poll.options.map((option: TOption) => (
                                        <label key={option.id}>
                                            <input type="radio" name="optionId" value={option.id} ref={register({ required: true, valueAsNumber: true })}/>
                                            {option.value}
                                        </label>
                                    ))}
                                </div>
                                <label>
                                    <span>your name</span>
                                    <input
                                        type="text"
                                        name="name"
                                        ref={register({ required: true })}
                                    />
                                </label>
                                <button type="submit">Vote</button>
                            </form>
                        )}
                    </div>
                    <p>Votes: {state.poll.votes.length}</p>
                    <button onClick={() => setAutoVote(!autoVote)}>{autoVote ? 'Disable crowd' : 'Enable crowd'}</button>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                {state.poll.options.map((option: TOption) => (
                                    <th key={option.id}>{option.value}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {state.poll.votes.slice(0, votesToShow).map((vote: TVote, index: number) => (
                                <tr key={index}>
                                    <td>{vote.name}</td>
                                    {state.poll.options.map((option: TOption) => (
                                        <th key={option.id}>{+option.id === +vote.optionId ? 'YEP' : ''}</th>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {state.poll.votes.length > votesToShow &&
                        <button onClick={() => setVotesToShow((votes) => votes + VOTES_LIST_STEP)}>Show more</button>
                    }
                </div>
            }
        </div>
    )
}