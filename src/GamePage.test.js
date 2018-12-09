import { shallow } from 'enzyme';
import React from 'react';

import { GamePage } from './GamePage';

describe('<GamePage />', () => {
    it('Generates GamePage', () => {
        const dispatch = jest.fn();
        shallow(<GamePage dispatch={dispatch} match={{ params: {} }} />);
        expect(dispatch.mock.calls.length).toBe(1);
    });
});
