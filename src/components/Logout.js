// @flow
import React from 'react';

type Props = {
    onLogout: () => void,
};

function Logout(props: Props) {
    return (
        <button onClick={() => props.onLogout()} className="btn btn-primary">
            Logout
        </button>
    );
}

export default Logout;
