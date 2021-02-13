import s from './VotePage.module.scss'
import { Link } from 'react-router-dom'
import { useEffect, useState } from "react";
import { mockApiClient } from "../../utils/mock-api-client";
import { Routes } from "../../routes";
import { TPoll } from "../../models";


export const VotePage = () => {
    const [generalError, setGeneralError] = useState<boolean>(false);
    const [poll, setPoll] = useState<TPoll | null>(null)

    useEffect(() => {
        mockApiClient.GET()
            .then((data: TPoll) => {
                setPoll(data)
            })
            .catch(() => {
                setGeneralError(true);
            })
    }, [])

    return (
        <div>
            <h1>VOTE PAGE</h1>
            {generalError &&
                <p>No poll loaded. <Link to={Routes.index}>Return to poll creator</Link></p>
            }
            {poll &&
                <div>
                    <h2>Question</h2>
                    <p>{poll?.question}</p>
                    <h2>Options</h2>
                    {poll.options.map((option) => (
                        <label>
                            <input type="radio" name="optionId" value={option.id}/>
                            {option.value}
                        </label>
                    ))}
                </div>
            }
        </div>
    )
}