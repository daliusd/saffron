// @flow
import { getActiveGame } from './selectors';

describe('getActiveGame', () => {
    it('runs getActiveGame with no active game defined', () => {
        expect(getActiveGame({ games: {} })).toBeUndefined();
    });

    it('returns active game', () => {
        expect(getActiveGame({ games: { active: 1, byId: { '1': { name: 'test' } } } })).toEqual({ name: 'test' });
    });
});
