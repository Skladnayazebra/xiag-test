export type TOption = {
    id: number,
    value: string,
}

export interface TPoll {
    question: string,
    options: TOption[],
}

export type TVote = {
    name: string,
    optionId: number,
}


export interface TPollPublished extends TPoll {
    userVoted: boolean,
    votes: TVote[],
    id: string,
}

export type TStoreAction = {
    type: string,
    payload?: any,
}

export const isPollPublished = (poll: unknown): poll is TPollPublished => {
    return "userVoted" in (poll as TPollPublished)
}