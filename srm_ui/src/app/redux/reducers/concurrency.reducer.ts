import { ConcurrencyActionType } from '../application-action-types';

const initialState = {
    commonConcurrency: undefined
}

const concurrencyReducer = (state = initialState, action: any): any => {
    switch (action.type) {
        case ConcurrencyActionType.SET_COMMON_CONCURRENCY:
            return {
                ...state,
                commonConcurrency: action.payload
            }
        case ConcurrencyActionType.UPDATE_COMMON_CONCURRENCY:
            return {
                ...state,
                commonConcurrency: action.payload
            }
        case ConcurrencyActionType.REMOVE_COMMON_CONCURRENCY:
            return {
                ...state,
                commonConcurrency: undefined
            }
        default:
            return {
                ...state
            }
    }
}

export default concurrencyReducer;