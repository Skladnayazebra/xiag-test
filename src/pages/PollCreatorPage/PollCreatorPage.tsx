import s from './PollCreatorPage.module.scss'
import { useHistory } from 'react-router-dom'
import { useFieldArray, useForm } from 'react-hook-form'
import { useRef } from 'react'


type FormData = {
    question: string,
    options: { value: string }[],
}

const setTimeout = window.setTimeout;

const SUBMIT_DELAY = 500;
const MIN_OPTIONS = 2;

export const PollCreatorPage = () => {
    const submitTimeout = useRef<number>()
    const history = useHistory()

    const { register, control, handleSubmit, errors } = useForm<FormData>({
        defaultValues: {
            question: '',
            options: [
                {
                    value: '',
                },
                {
                    value: '',
                },
            ]
        }
    })
    const { fields, append, remove } = useFieldArray({
        control,
        name: "options",
    });

    const onSubmit = (data: FormData) => {
        localStorage.setItem('poll', JSON.stringify(data))
        submitTimeout.current = setTimeout(() => {
            history.push('/vote')
        }, SUBMIT_DELAY)
    }

    return (
        <div>
            <h1>POLL CREATOR</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={s.question}>
                    <input
                        type="text"
                        name="question"
                        placeholder="question"
                        ref={register({
                            required: 'field can`t be empty'
                        })}
                    />
                    {errors?.question &&
                        <span>{errors?.question.message}</span>
                    }
                </div>
                <div className={s.options}>
                    {fields.map((field, index) => (
                        <div className={s.option}>
                            <input
                                key={field.id}
                                name={`options[${index}].value`}
                                ref={register({
                                    required: 'field can`t be empty'
                                })}
                                defaultValue={field.value}
                                placeholder={`option ${index + 1}`}
                            />
                            {errors?.options?.[index]?.value &&
                                <span>{errors?.options?.[index]?.value?.message}</span>
                            }
                            {fields.length > MIN_OPTIONS &&
                                <button type="button" onClick={() => remove(index)}>Delete</button>
                            }
                        </div>
                    ))}
                </div>
                <button type="button" onClick={append}>Add option</button>
                <button type="submit">SUBMIT</button>
            </form>
            <button type="button" onClick={() => localStorage.removeItem('poll')}>remove all polls from local storage</button>
        </div>
    )
}