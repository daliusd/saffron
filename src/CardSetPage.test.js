import { shallow } from 'enzyme';
import React from 'react';

import { CardSetPage } from './CardSetPage';

describe('<CardSetPage />', () => {
    it('Generates CardSetPage', () => {
        const dispatch = jest.fn();
        shallow(<CardSetPage dispatch={dispatch} match={{ params: {} }} />);
        expect(dispatch.mock.calls.length).toBe(1);
    });
});
