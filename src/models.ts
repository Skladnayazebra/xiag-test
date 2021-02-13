export interface TPoll {
    question: string,
    options: { value: string, id: number }[],
}

export type TVote = {
    name: string,
    optionId: number,
}
