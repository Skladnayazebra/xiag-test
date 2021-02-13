export interface TPoll {
    question: string,
    options: { value: string, id: number }[],
}

export type TVote = {
    name: string,
    optionId: number,
}


export interface TPollPublished extends TPoll {
    userVoted: boolean,
    votes: TVote[],
}
