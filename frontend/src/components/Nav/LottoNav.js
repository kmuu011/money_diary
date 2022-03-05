import React, {useEffect} from 'react';
import {UserStore} from "UserStore/UserStore";

import GlobalNavButtons from "components/Part/Nav/GlobalNavButtons";


function HistoryNav(props) {
    let nav_setter = UserStore.nav_setter;

    useEffect(() => {
        locationChecker();
    }, []);

    function locationChecker () {
        let items = document.querySelectorAll('div[name="nav_items"]');
        let location = window.location.pathname;

        if(location[location.length-1] === '/') location = location.substring(0, location.length-1);
        location = location.substring(location.lastIndexOf('/')+1);

        for(let item of items) {
            if (item.id === location){
                item.style['color'] = '#ffffff';
                item.style['background-color'] = '#a089f0';
                item.style['border-color'] = '#a089f0';
                break;
            }
        }
    }

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
                    <div className={"nav_button_body"} name={"nav_items"}

                         id={"history"}
                    >
                        준비중
                    </div>


                    <GlobalNavButtons/>
                </div>
            </div>
        </div>
    );
}


export default HistoryNav;
