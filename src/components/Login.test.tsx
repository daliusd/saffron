import { mount, shallow } from 'enzyme';
import React from 'react';

import Login from './Login';

describe('<Login />', () => {
    it('Generates Login', () => {
        shallow(<Login onLogin={() => {}} />);
    });

    it('simulates click event', () => {
        const onLogin = jest.fn();
        const wrapper = mount(<Login onLogin={onLogin} onLoginFailure={jest.fn()} />);
        wrapper.setState({ username: 'test', password: 'test' });
        wrapper.find('form').simulate('submit');
        expect(onLogin.mock.calls.length).toBe(1);
    });
});
