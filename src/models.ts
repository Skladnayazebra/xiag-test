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
}

export type TStoreAction = {
    type: string,
    payload?: any,
}