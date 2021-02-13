import s from './VotePage.module.scss'
import { Link } from 'react-router-dom'
import { useEffect, useState } from "react";
import { mockApiClient } from "../../utils/mock-api-client";
import { Routes } from "../../routes";
import { TPollPublished, TVote } from "../../models";
import { useForm } from "react-hook-form";


export const VotePage = () => {
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [poll, setPoll] = useState<TPollPublished | null>(null)

    const { register, handleSubmit } = useForm<TVote>()

    useEffect(() => {
        mockApiClient.GET()
            .then((data: string) => {
                const poll: TPollPublished = JSON.parse(data);
                setPoll(poll)
            })
            .catch(() => {
                setGeneralError('No poll loaded.');
            })
    }, [])

    const onSubmit = (vote: TVote) => {
        if (poll) {
            const updatedPoll: TPollPublished = {
                ...poll,
                userVoted: true,
                votes: [...poll.votes, vote]
            }
            mockApiClient.PUT(updatedPoll)
                .then((data) => {
                    const poll: TPollPublished = JSON.parse(data);
                    setPoll(poll)
                })
                .catch(() => {
                    setGeneralError('Error on vote sending.');
                })
        }
    }

    return (
        <div>
            <h1>VOTE PAGE</h1>
            {generalError &&
                <p>{generalError} <Link to={Routes.index}>Return to poll creator</Link></p>
            }
            {poll &&
                <div>
                    <div>
                        <h2>{poll?.question}</h2>
                        {poll.userVoted ? (
                            <p>Thank you for your vote! <Link to={Routes.index}>Return to poll creator</Link></p>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className={s.options}>
                                    {poll.options.map((option) => (
                                        <label>
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
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                {poll.options.map((option) => (
                                    <th key={option.id}>{option.value}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {poll.votes.map((vote, index) => (
                                <tr key={index}>
                                    <td>{vote.name}</td>
                                    {poll.options.map((option) => (
                                        <th key={option.id}>{+option.id === +vote.optionId ? 'YEP' : ''}</th>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }
        </div>
    )
}