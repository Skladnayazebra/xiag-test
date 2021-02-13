import s from './Layout.module.scss'
import { ReactNode } from "react";

type Props = {
    children: ReactNode,
}

export const Layout = ({ children }: Props) => {
    return (
        <div className={s.layout}>
            <div className={s.layout__content}>
                {children}
            </div>
        </div>
    )
}