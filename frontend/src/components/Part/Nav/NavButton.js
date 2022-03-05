import React from 'react';
import './NavButton.scss';

function SimpleNav(props) {
    return (
        <div className={"nav_menu_wrapper"} onClick={props.action}>
            <div className={"nav_menu"}>
                <span />
                <span />
                <span />
            </div>
        </div>
    );
}

export default SimpleNav;
