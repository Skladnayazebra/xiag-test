import s from './VotePage.module.scss'
import { Link } from 'react-router-dom'
import { useEffect, useReducer, useRef } from "react";
import { apiClient } from "../../mocks/api-client";
import { Routes } from "../../routes";
import { TOption, TPollPublished, TVote } from "../../models";
import { useForm } from "react-hook-form";
import { getRandomVote } from "../../utils/vote";
import { randomNumberInRange } from '../../utils/random';
import { ActionType, TGeneralError, votePageReducer, initialState } from "./reducer";

export const VotePage = () => {
    const [state, dispatch] = useReducer(votePageReducer, initialState)
    const { register, handleSubmit } = useForm<TVote>()
    const autoVoteTimerRef = useRef<number | undefined>()

    const downloadPoll = () => {
        apiClient.get('/poll',
            (data) => {
                dispatch({ type: ActionType.loadPoll, payload: { poll: data } })
            },
            () => {
                dispatch({ type: ActionType.setGeneralError, payload: TGeneralError.loadPollError })
            }
        )
    }

    const uploadPoll = (poll: TPollPublished) => {
        apiClient.put('/poll', poll,
            (data) => {
                dispatch({ type: ActionType.updatePoll, payload: { poll: data }})
            },
            () => {
                dispatch({ type: ActionType.setGeneralError, payload: TGeneralError.sendVoteError })
            }
        )
    }


    useEffect(() => {
        downloadPoll();
    }, [])

    // repeatedly adds votes
    useEffect(() => {
        if (state.poll && state.autoVote) {
            autoVoteTimerRef.current = window.setTimeout(() => {
                window.clearTimeout(autoVoteTimerRef.current)
                const updatedPoll = {
                    ...state.poll,
                    votes: [getRandomVote(state.poll.options), ...state.poll.votes ] // put new votes in beginning of list
                }
                uploadPoll(updatedPoll)
            }, randomNumberInRange(1000, 4000))
        }
        if (!state.autoVote) {
            window.clearTimeout(autoVoteTimerRef.current)
        }
    }, [state.poll, state.poll?.votes, state.autoVote])


    const onSubmit = (vote: TVote) => {
        const updatedPoll: TPollPublished = {
            ...state.poll,
            votes: [vote, ...state.poll.votes], // put new votes in beginning of list
            userVoted: true,
        }
        uploadPoll(updatedPoll)
    }

    const renderGeneralError = (type: TGeneralError) => {
        switch (type) {
            case TGeneralError.sendVoteError:
                return <span>Error on vote sending</span>
            case TGeneralError.loadPollError:
                return <span>Poll not loaded. <Link to={Routes.index}>Return to vote creator</Link></span>
        }
    }

    return (
        <div>
            <h1>VOTE PAGE</h1>
            {state.generalError &&
                <p>{renderGeneralError(state.generalError)}</p>
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
                    <button onClick={() => dispatch({ type: ActionType.toggleAutoVote })}>
                        {state.autoVote ? 'Disable crowd' : 'Enable crowd'}
                    </button>
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
                            {state.poll.votes.slice(0, state.votesToShow).map((vote: TVote, index: number) => (
                                <tr key={index}>
                                    <td>{vote.name}</td>
                                    {state.poll.options.map((option: TOption) => (
                                        <th key={option.id}>{+option.id === +vote.optionId ? 'YEP' : ''}</th>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {state.poll.votes.length > state.votesToShow &&
                        <button onClick={() => dispatch({ type: ActionType.increaseVotesToShow })}>Show more</button>
                    }
                </div>
            }
        </div>
    )
}