import React  from 'react';
import './AccountNav.scss';
import {UserStore} from "UserStore/UserStore";

import GlobalNavButtons from "components/Part/Nav/GlobalNavButtons";


function GlobalNav(props) {
    let nav_setter = UserStore.nav_setter;

    function closeNav (e) {
        let target_class = e.target.getAttribute('class');

        if(target_class === 'nav_modal'){
            nav_setter(true);
        }
    }

    return (
        <div>
            <div className={"nav_modal"} hidden={props.hidden} onClick={(e) => closeNav(e)}>
                <div className={"nav_button_wrapper"}>
                    <GlobalNavButtons/>
                </div>
            </div>
        </div>
    );
}





export default GlobalNav;
