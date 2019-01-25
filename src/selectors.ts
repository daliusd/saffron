import { State } from './reducers';

export const getActiveGame = (state: State) => (state.games.active ? state.games.byId[state.games.active] : null);

export const getActiveCardSet = (state: State) =>
    state.cardsets.active ? state.cardsets.byId[state.cardsets.active] : null;
