// @flow
import { getActiveCardSet, getActiveGame } from './selectors';

describe('getActiveGame', () => {
    it('runs getActiveGame with no active game defined', () => {
        expect(getActiveGame({ games: {} })).toBeNull();
    });

    it('returns active game', () => {
        expect(getActiveGame({ games: { active: 1, byId: { '1': { name: 'test' } } } })).toEqual({ name: 'test' });
    });
});

describe('getActiveCardSet', () => {
    it('runs getActiveCardSet with no active cardset defined', () => {
        expect(getActiveCardSet({ cardsets: {} })).toBeNull();
    });

    it('returns active cardset', () => {
        expect(getActiveCardSet({ cardsets: { active: 1, byId: { '1': { name: 'test' } } } })).toEqual({
            name: 'test',
        });
    });
});
