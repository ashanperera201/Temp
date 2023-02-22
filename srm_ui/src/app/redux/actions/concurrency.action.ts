import { ConcurrencyActionType } from '../application-action-types';


export const setCommonConcurrency = (concurrencyPayload: any) => ({
    type: ConcurrencyActionType.SET_COMMON_CONCURRENCY,
    payload: concurrencyPayload
})

export const updateCommonConcurrency = (concurrencyPayload: any) => ({
    type: ConcurrencyActionType.UPDATE_COMMON_CONCURRENCY,
    payload: concurrencyPayload
})

export const removeCommonConcurrency = () => ({
    type: ConcurrencyActionType.REMOVE_COMMON_CONCURRENCY,
})