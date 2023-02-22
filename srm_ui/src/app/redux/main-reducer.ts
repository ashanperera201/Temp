import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './application-state';

import concurrencyReducer from './reducers/concurrency.reducer'

export const reducers: ActionReducerMap<AppState> = {
    concurrentData: concurrencyReducer
}