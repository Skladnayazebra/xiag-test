import s from './PollCreatorPage.module.scss'
import { useHistory } from 'react-router-dom'
import { useFieldArray, useForm } from 'react-hook-form'
import { useState } from 'react'
import { TPoll, TPollPublished } from "../../models";
import { POLL_MIN_OPTIONS } from "../../config/app";
import { mockApiClient } from "../../utils/mock-api-client";
import { Routes } from "../../routes";

enum FormState {
    idle = 'idle',
    loading = 'loading',
}

export const PollCreatorPage = () => {
    const history = useHistory()
    const [generalError, setGeneralError] = useState<string | null>(null)
    const [formState, setFormState] = useState<FormState>(FormState.idle)

    const { register, control, handleSubmit, errors } = useForm<TPoll>({
        defaultValues: {
            question: '',
            options: [
                { value: '', id: 1 },
                { value: '', id: 2 },
            ]
        }
    })
    const { fields, append, remove } = useFieldArray({
        control,
        name: "options",
        keyName: 'key',
    });

    const preparePoll = (poll: TPoll): TPollPublished => {
        return {
            ...poll,
            userVoted: false,
            votes: [],
        }
    }

    const onSubmit = (poll: TPoll) => {
        setFormState(FormState.loading);
        setGeneralError(null);
        mockApiClient.PUT(preparePoll(poll))
            .then(() => {
                setFormState(FormState.idle)
                history.push(Routes.vote)
            })
            .catch(() => {
                setFormState(FormState.idle)
                setGeneralError('There is something wrong. Try to reload page')
            })
    }

    return (
        <div>
            <h1>POLL CREATOR</h1>
            {generalError &&
                <div className={s.generalError}>
                    <span>{generalError}</span>
                </div>
            }
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={s.question}>
                    <input
                        type="text"
                        name="question"
                        placeholder="question"
                        ref={register({
                            required: 'can`t be empty'
                        })}
                    />
                    {errors?.question &&
                        <span>{errors?.question.message}</span>
                    }
                </div>
                <div className={s.options}>
                    {fields.map((field, index) => (
                        <div className={s.option} key={field.key}>
                            <input
                                type="text"
                                name={`options[${index}].value`}
                                ref={register({
                                    required: 'can`t be empty'
                                })}
                                defaultValue={field.value}
                                placeholder={`option ${index + 1}`}
                            />
                            <input
                                type="hidden"
                                name={`options[${index}].id`}
                                ref={register({ valueAsNumber: true })}
                                defaultValue={index + 1}
                            />
                            {errors?.options?.[index]?.value &&
                                <span>{errors?.options?.[index]?.value?.message}</span>
                            }
                            {fields.length > POLL_MIN_OPTIONS &&
                                <button type="button" onClick={() => remove(index)}>Delete</button>
                            }
                        </div>
                    ))}
                </div>
                <button type="button" onClick={append}>Add option</button>
                <button type="submit">{formState === FormState.loading ? 'submitting...' : 'submit'}</button>
            </form>
        </div>
    )
}