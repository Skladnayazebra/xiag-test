import s from './PollCreatorPage.module.scss'
import commonStyles from '../../styles/common.module.scss'
import { useHistory } from 'react-router-dom'
import { useFieldArray, useForm } from 'react-hook-form'
import { useState } from 'react'
import { TPoll, TPollPublished } from "../../models";
import { POLL_MIN_OPTIONS } from "../../config/app";
import { apiClient } from "../../mocks/api-client";
import { generateId } from "../../utils/id-generator";
import cn from 'classnames'

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

    const preparePoll = (poll: TPoll, pollId: string): TPollPublished => {
        return {
            ...poll,
            userVoted: false,
            votes: [],
            id: pollId,
        }
    }

    const onSubmit = (poll: TPoll) => {
        setFormState(FormState.loading);
        setGeneralError(null);
        const pollId: string = generateId();

        apiClient.put('/poll', preparePoll(poll, pollId),
            () => {
                setFormState(FormState.idle)
                history.push(`/vote/${pollId}`)
            },
            () => {
                setFormState(FormState.idle)
                setGeneralError('There is something wrong. Try to reload page')
            }
        )
    }

    return (
        <div>
            <h1 className={commonStyles.mainHeading}>POLL CREATOR</h1>
            {generalError &&
                <div className={s.generalError}>
                    <span>{generalError}</span>
                </div>
            }
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={s.question}>
                    <label>
                        <span>Question</span>
                        <input
                            className={cn(commonStyles.input, { [commonStyles.input_error]: errors?.question })}
                            placeholder=""
                            type="text"
                            name="question"
                            ref={register({
                                required: 'can`t be empty'
                            })}
                        />
                    </label>
                    {errors?.question &&
                        <span className={commonStyles.input__errorMessage}>{errors?.question.message}</span>
                    }
                </div>
                <div className={s.options}>
                    {fields.map((field, index) => (
                        <div className={s.option} key={field.key}>
                            <label htmlFor={`option-${index + 1}`}>{`Option ${index + 1}`}</label>
                            <div className={s.option__inputWrapper}>
                                <input
                                    id={`option-${index + 1}`}
                                    className={cn(
                                        commonStyles.input,
                                        commonStyles.input_dense,
                                        { [commonStyles.input_error]: errors?.options?.[index]?.value }
                                    )}
                                    placeholder=""
                                    type="text"
                                    name={`options[${index}].value`}
                                    ref={register({
                                        required: 'can`t be empty'
                                    })}
                                    defaultValue={field.value}
                                />
                            {fields.length > POLL_MIN_OPTIONS &&
                                <button title="Delete option" type="button" onClick={() => remove(index)} className={s.option__deleteButton}>✖</button>
                            }
                            </div>
                            <input
                                type="hidden"
                                name={`options[${index}].id`}
                                ref={register({ valueAsNumber: true })}
                                defaultValue={index + 1}
                            />
                            {errors?.options?.[index]?.value &&
                                <span className={commonStyles.input__errorMessage}>{errors?.options?.[index]?.value?.message}</span>
                            }
                        </div>
                    ))}
                </div>
                <div className={s.controls}>
                    <button type="button" onClick={append} className={cn(commonStyles.button, commonStyles.button_outlined)}>+ Add option</button>
                    <button type="submit"  className={commonStyles.button}>
                        {formState === FormState.loading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    )
}