export const getActiveGame = state => state.games.active && state.games.byId[state.games.active];
