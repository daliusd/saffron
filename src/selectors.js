export const getActiveGame = state => state.games.active && state.games.byId[state.games.active];

export const getActiveCardSet = state => state.cardsets.active && state.cardsets.byId[state.cardsets.active];
