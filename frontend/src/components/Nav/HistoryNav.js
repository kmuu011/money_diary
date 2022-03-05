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

    function goDetail () {
        window.location = `/member/account/${UserStore.account_idx}/history`;
    }

    function goCalendar () {
        window.location = `/member/account/${UserStore.account_idx}/history/calendar`;
    }

    function goChart () {
        window.location = `/member/account/${UserStore.account_idx}/history/chart`;
    }

    return (
        <div>
            <div className={"nav_modal"} hidden={props.hidden} onClick={(e) => closeNav(e)}>
                <div className={"nav_button_wrapper"}>
                    <div className={"nav_button_body"} name={"nav_items"}
                         onClick={() => goDetail()}
                         id={"history"}
                    >
                        상세 보기
                    </div>

                    <div className={"nav_button_body"} name={"nav_items"}
                         onClick={() => goCalendar()}
                         id={"calendar"}
                    >
                        월별 보기
                    </div>

                    <div className={"nav_button_body"} name={"nav_items"}
                         onClick={() => goChart()}
                         id={"chart"}
                    >
                        통계 보기
                    </div>

                    <GlobalNavButtons/>
                </div>
            </div>
        </div>
    );
}




export default HistoryNav;
