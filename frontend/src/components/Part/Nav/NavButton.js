import React from 'react';
import './NavButton.scss';
import helpButton from "static/img/button/help/help_outline_white_36dp.svg";
import { UserStore } from "UserStore/UserStore";

function SimpleNav(props) {
    let showHelpButton = props.show_help_button;
    let { setShowHelp } = UserStore;

    function openHelp () {
        setShowHelp(true);
    }

    return (
        <div className={"nav"}>
            <div className={"menu_wrapper"} onClick={props.action}>
                <div className={"menu"}>
                    <span />
                    <span />
                    <span />
                </div>
            </div>

            {showHelpButton &&
            <div className={"question_button"} onClick={openHelp}>
                <img src={helpButton} alt={"도움말 버튼"}/>
            </div>
            }
        </div>

    );
}

export default SimpleNav;
