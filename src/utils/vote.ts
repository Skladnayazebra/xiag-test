import { TOption, TVote } from "../models";
import { pickRandomFromArray, randomNumberInRange } from "./random";

const firstNames = ['Fabulous', 'Shy', 'Mighty', 'Lazy', 'Angry', 'Little', 'Beautiful', 'Funny', 'Brave']
const secondNames = ['Mongoose', 'Doge', 'Lion', 'Zebra', 'Tiger', 'Bee', 'Deer', 'Ant', 'Squirrel']

const getRandomName = (): string => `${pickRandomFromArray(firstNames)} ${pickRandomFromArray(secondNames)}`

export const getRandomVote = (options: TOption[]): TVote => {
    return ({
        name: getRandomName(),
        optionId: randomNumberInRange(1, options.length),
    })
}
