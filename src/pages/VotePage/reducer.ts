import { TStoreAction, TPollPublished } from "../../models";
import { VOTES_LIST_STEP } from "../../config/app";
import { Reducer } from "react";

export enum TGeneralError {
    loadPollError = 'loadPollError',
    sendVoteError = 'sendVoteError',
}

export type TVotePageState = {
    poll: TPollPublished | null,
    autoVote: boolean,
    votesToShow: number,
    generalError: TGeneralError | null,
}

export const initialState = {
    poll: null,
    autoVote: false,
    votesToShow: VOTES_LIST_STEP,
    generalError: null,
}

export enum ActionType {
    loadPoll = 'loadPoll',
    updatePoll = 'updatePoll',
    toggleAutoVote = 'toggleAutoVote',
    increaseVotesToShow = 'increaseVotesToShow',
    setGeneralError = 'setGeneralError',
}

export const votePageReducer: Reducer<any, any> = (state: TVotePageState, action: TStoreAction) => {
    switch(action.type) {
        case ActionType.loadPoll:
            return {
                ...state,
                poll: action.payload.poll,
            }
        case ActionType.updatePoll:
            return {
                ...state,
                poll: { ...state.poll, ...action.payload.poll },
            }
        case ActionType.toggleAutoVote:
            return {
                ...state,
                autoVote: !state.autoVote,
            }
        case ActionType.increaseVotesToShow:
            return {
                ...state,
                votesToShow: state.votesToShow + VOTES_LIST_STEP,
            }
    }
}
