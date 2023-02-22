import { createSelector } from '@ngrx/store';
import { AppState } from '../application-state';

export const selectFeature = (state: AppState) => state.concurrentData;

export const selectConcurrentInfo = createSelector(
    selectFeature,
    (state: any) => state
)
