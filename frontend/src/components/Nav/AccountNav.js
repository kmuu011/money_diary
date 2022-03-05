import React  from 'react';
import './AccountNav.scss';
import {UserStore} from "UserStore/UserStore";

import GlobalNavButtons from "components/Part/Nav/GlobalNavButtons";



function AccountNav(props) {
    let nav_setter = UserStore.nav_setter;
    let set_delete_button = props.set_delete_button;

    function closeNav (e) {
        let target_class = e.target.getAttribute('class');

        if(target_class === 'nav_modal'){
            nav_setter(true);
        }
    }

    function accountDeleteOn () {
        set_delete_button(false);
        nav_setter(true);
    }

    return (
        <div>
            <div className={"nav_modal"} hidden={props.hidden} onClick={(e) => closeNav(e)}>
                <div className={"nav_button_wrapper"}>
                    <div className={"nav_button_body"} onClick={() => accountDeleteOn()}>
                        가계부 삭제하기
                    </div>

                    <GlobalNavButtons/>
                </div>
            </div>
        </div>
    );
}




export default AccountNav;
