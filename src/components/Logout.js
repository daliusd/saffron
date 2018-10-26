// @flow
import React from 'react';

type Props = {
    onLogoutClick: () => void
};

function Logout(props: Props) {
    return (
        <button
            onClick={() => props.onLogoutClick()}
            className="btn btn-primary"
        >
            Logout
        </button>
    );
}

export default Logout;
