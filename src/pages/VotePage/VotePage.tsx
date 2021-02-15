import s from './VotePage.module.scss'
import commonStyles from '../../styles/common.module.scss'
import { Link } from 'react-router-dom'
import { useEffect, useReducer, useRef } from "react";
import { apiClient } from "../../mocks/api-client";
import { isPollPublished, TOption, TPollPublished, TVote } from "../../models";
import { useForm } from "react-hook-form";
import { getRandomVote } from "../../utils/vote";
import { randomNumberInRange } from '../../utils/random';
import { ActionType, initialState, TGeneralError, votePageReducer } from "./reducer";
import cn from 'classnames'

type Props = {
    params: { pollId: string },
}

export const VotePage = ({ params }: Props) => {
    const [state, dispatch] = useReducer(votePageReducer, initialState)
    const { register, handleSubmit, errors } = useForm<TVote>()
    const autoVoteTimerRef = useRef<number | undefined>()

    const downloadPoll = () => {
        apiClient.get(`/poll?pollId=${params.pollId}`,
            (data) => {
                if (isPollPublished(data)) {
                    dispatch({type: ActionType.loadPoll, payload: {poll: data}})
                    return;
                }
                dispatch({ type: ActionType.setGeneralError, payload: TGeneralError.loadPollError })
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
                return <span>Poll not loaded. <Link to="/">Return to vote creator</Link></span>
        }
    }

    return (
        <div>
            <h1 className={commonStyles.mainHeading}>VOTE PAGE</h1>
            {state.generalError &&
                <p>{renderGeneralError(state.generalError)}</p>
            }
            {state.poll &&
                <div>
                    <div className={s.question}>
                        <span>Question</span>
                        <h2 className={s.question__heading}>{state.poll?.question}</h2>
                        {state.poll.userVoted ? (
                            <p>Thank you for your vote! <Link to="/">Return to poll creator</Link></p>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className={s.question__options}>
                                    <span>Your answer</span>
                                    {state.poll.options.map((option: TOption) => (
                                        <label key={option.id} className={s.question__option}>
                                            <input
                                                type="radio"
                                                name="optionId"
                                                value={option.id}
                                                ref={register({ required: 'Select option', valueAsNumber: true })}
                                            />
                                            {option.value}
                                        </label>
                                    ))}
                                    {errors.optionId &&
                                        <span className={commonStyles.input__errorMessage}>{errors.optionId.message}</span>
                                    }
                                </div>
                                <label className={s.question__nameInputWrapper}>
                                    <span>Your name</span>
                                    <input
                                        className={cn(commonStyles.input, { [commonStyles.input_error]: errors.name })}
                                        placeholder=""
                                        type="text"
                                        name="name"
                                        ref={register({ required: 'Enter your name' })}
                                    />
                                    {errors.name &&
                                        <span className={commonStyles.input__errorMessage}>{errors.name.message}</span>
                                    }
                                </label>
                                <button type="submit" className={commonStyles.button}>Vote</button>
                            </form>
                        )}
                    </div>
                    <div className={s.results}>
                        <h2>Results</h2>
                        <p>Votes: {state.poll.votes.length}</p>
                        <button
                            className={cn(commonStyles.button, commonStyles.button_outlined)}
                            onClick={() => dispatch({ type: ActionType.toggleAutoVote })}
                        >
                            {state.autoVote ? 'Disable crowd' : 'Enable crowd'}
                        </button>
                        <table className={s.results__table}>
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
                                            <td key={option.id} className={s.results__tableCell}>{+option.id === +vote.optionId ? '✅' : ''}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {state.poll.votes.length > state.votesToShow &&
                            <button
                                className={cn(commonStyles.button, commonStyles.button_outlined)}
                                onClick={() => dispatch({ type: ActionType.increaseVotesToShow })}
                            >
                                Show more
                            </button>
                        }
                    </div>
                </div>
            }
        </div>
    )
}