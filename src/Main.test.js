// @flow
import { shallow } from 'enzyme';
import React from 'react';

import Main from './Main';

describe('<App />', () => {
    it('Generates App', () => {
        shallow(<Main />);
    });
});
