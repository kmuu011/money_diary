import React, { useState } from 'react';
import './Banking.scss';
import Button from "components/Button/Button";
import NavButton from 'components/Part/Nav/NavButton';
import GlobalNav from "components/Nav/GlobalNav";
import API_banking from "api/account/banking/banking";

import Axios from 'utils/axios';

import { UserStore } from "UserStore/UserStore"

function Index() {
    const [ hidden, setHidden ] = useState(true);

    function openNav () {
        setHidden(false);
        UserStore.nav_setter = setHidden;
    }

    async function testBanking () {
        let data_obj = {
            response_type: 'code',
            client_id : 'c75b24c5-07ee-4ab4-bf7e-4c2f62545e59',
            redirect_uri : 'http://127.0.0.1:8080/banking',
            scope :'login+inquiry+transfer',
            state : 'b80BLsfigm9OokPTjy03elbJqRHOfGSY',
            auth_type : '0',
            cellphone_cert_yn: 'Y',
            authorized_cert_yn: 'Y',
            account_hold_auth_yn: 'N',
            register_info: 'A',
            client_info: 'ㄷㄷ'
        };

        // let url = 'https://openapi.openbanking.or.kr/oauth/2.0/authorize?';
        let url = 'https://developers.kftc.or.kr/proxy/oauth/2.0/authorize?';

        Object.keys(data_obj).forEach((v, i) => {
            url += v + '=' + data_obj[v];
            if(i !== Object.keys(data_obj).length-1) url += '&'
        });

        let data = await Axios.call('GET', url);

        console.log(data);

        window.open(data.headers.location);
    }

    async function connectBank () {
        let token_data = document.location.search;

        let data = await API_banking.check(4, token_data);

        console.log(data);
    }

    return (
        <div className={"App_container"}>
            <GlobalNav hidden={hidden} />
            <NavButton action={() => openNav()}/>

            <div className={"banking_title"}>
                오픈뱅킹 테스트
            </div>

            <div className={"banking_page"}>
                <Button.button name={"뱅킹 테스트"} action={() => testBanking()}/>
                <Button.button name={"연결 되나?"} action={() => connectBank()}/>
            </div>


        </div>
    );
}





export default Index;
