import cn from 'classnames'
import { Link } from 'react-router-dom'
import s from './PollCreatorPage.module.scss'

export const PollCreatorPage = () => {
    return (
        <div>
            <h1>POLL CREATOR</h1>
            <Link to={'/vote'}>TO VOTE</Link>
        </div>
    )
}