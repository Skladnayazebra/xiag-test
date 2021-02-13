import { useEffect, useRef, useState } from "react";
import { TOption, TVote } from "../models";

const firstNames = ['Fabulous', 'Shy', 'Mighty', 'Lazy', 'Angry', 'Little', 'Beautiful', 'Funny', 'Brave']
const secondNames = ['Mongoose', 'Doge', 'Lion', 'Zebra', 'Tiger', 'Bee', 'Deer', 'Ant', 'Squirrel']


const randomNumberInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pickRandomFromArray = (array: unknown[]): unknown => array[randomNumberInRange(0, array.length - 1)]
const getRandomName = (): string => `${pickRandomFromArray(firstNames)} ${pickRandomFromArray(secondNames)}`

type Arguments = {
    options: TOption[],
    onVote: (vote: TVote) => void
}

export const useVoters = ({ options, onVote }: Arguments) => {
    const timeoutRef = useRef<number>()
    const [running, setRunning] = useState<boolean>(false)


    const startVote = () => {
        timeoutRef.current = window.setTimeout(() => {
            clearTimeout(timeoutRef.current);
            onVote(getRandomVote(options))
            startVote();
        }, randomNumberInRange(1000, 3000))
    }

    const stopVote = () => {
        clearTimeout(timeoutRef.current);
    }


    useEffect(() => {
        if (running) {
            startVote();
        } else {
            stopVote();
        }
    }, [running])

    const onVoteStart = () => setRunning(true)
    const onVoteEnd = () => setRunning(false)

    return { onVoteStart, onVoteEnd }
}

const getRandomVote = (options: TOption[]): TVote => {
    return ({
        name: getRandomName(),
        optionId: randomNumberInRange(1, options.length),
    })
}





