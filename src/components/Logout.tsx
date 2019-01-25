import React from 'react';

interface Props {
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
