import React, {useEffect, useRef, useState} from 'react';
import './Kakao.scss';

import API_kakao from "api/auth/kakao";

import Button from "components/Button/Button";
import API_sign from "api/sign";

import AccountLink from "components/Modal/Auth/Kakao/AccountLink";
import utils from "utils/utils";

function Index() {
    const [ hidden, setHidden ] = useState(true);
    const [ getAuthInto, setAuthInfo ] = useState(undefined);

    const nicknameRef = useRef();
    const emailRef = useRef();

    useEffect(() => {
        kakao_check();
    }, [])

    if(getAuthInto === undefined) return null;

    let nickname = getAuthInto.nickname;
    let email = getAuthInto.email;

    let nickRule = /^[0-9a-zA-Z가-힣]*$/i;
    let emailRule = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    async function kakao_check () {
        let token_data = document.location.search;

        token_data += '&keep_check=' + sessionStorage.getItem('keep_check');

        let result = await API_kakao.sign_check(token_data);

        if(result.status === 200){
            if(result.data['x-token'] !== undefined){
                localStorage.setItem('x-token', result.data['x-token']);

                window.location = '/member/account';
                return;
            }

            setAuthInfo(result.data);
        } else {
            alert(result.data.message);
            window.location = '/';
            return;
        }
    }

    async function open_link_modal () {
        setHidden(false);
        utils.disableScroll();
    }

    async function email_check(email) {
        if(email === undefined || email.toString().replace(/\s/g, '') === ''){
            return;
        }

        if(!emailRule.test(email)){
            emailRef.current.style['border-color'] = 'red';
            return;
        }

        let result = await API_sign.email_check({email});

        if(result.status !== 200){
            emailRef.current.style['border-color'] = 'red';
            return false;
        }else{
            emailRef.current.style['border-color'] = 'green';
            return true;
        }

    }

    async function nick_check(nickname) {
        if(nickname === undefined || nickname.toString().replace(/\s/g, '') === ''){
            return;
        }

        let result = await API_sign.nick_check({nickname});

        if(result.status !== 200){
            nicknameRef.current.style['border-color'] = 'red';
            return false;
        }else{
            nicknameRef.current.style['border-color'] = 'green';
            return true;
        }
    }


    async function sign_up() {
        let refList = [nicknameRef, emailRef];
        let values = {};

        for(let e of refList){
            e = e.current;

            if(e.value === '' || e.value.toString().replace(/\s/g, '') === ''){
                alert('입력하지 않은 항목이 있습니다.');
                e.focus();
                return;
            }

            values[e.id] = e.value;
        }

        if(!nickRule.test(values.nickname)){
            alert('닉네임에 사용할 수 없는 문자가 포함되어있습니다.');
            nicknameRef.current.focus();
            return
        }

        if(!await nick_check(values.nickname)){
            alert('이미 존재하는 닉네임 입니다.');
            nicknameRef.current.focus();
            return;
        }

        if(!emailRule.test(values.email)){
            alert('사용할 수 없는 이메일 입니다.');
            emailRef.current.focus();
            return
        }

        if(!await email_check(values.email)){
            alert('이미 존재하는 이메일 입니다.');
            emailRef.current.focus();
            return;
        }

        delete getAuthInto.nickname;
        delete getAuthInto.email;
        values.auth_data = getAuthInto;

        let result = await API_kakao.sign_up(values);

        if(result.status === 200){
            let data = result.data;

            alert('회원가입이 완료되었습니다.');

            if(data['x-token'] !== undefined){
                localStorage.setItem('x-token', result.data['x-token']);
                window.location = '/member/account';
                return;
            }

            window.location = '/';
        }else{
            alert(result.data.message);
        }
    }

    return (
        <div>
            <AccountLink
                hidden={hidden}
                set_member_link_modal={setHidden}
                auth_data={getAuthInto}
            />

            <div className="loading_kakao_login">
                <div className="sign_up_title">
                    회원가입
                </div>

                <div className={"sign_up_body"}>
                    <div className="sign_up_nickname">
                        <div className={"input_text"}>닉네임</div>
                        <input type="text" id="nickname" placeholder="닉네임"
                               defaultValue={nickname}
                               onChange={(e) => nick_check(e.target.value)}
                               ref={nicknameRef}
                        />

                    </div>

                    <div className="sign_up_email">
                        <div className={"input_text"}>이메일</div>
                        <input type="text" id="email" placeholder="이메일"
                               defaultValue={email}
                               onChange={(e) => email_check(e.target.value)}
                               ref={emailRef}
                        />
                    </div>
                </div>

                <div className="sign_up_footer">
                    <div className={"member_link_button"}>
                        <Button.button name={"기존 계정 연동"} action={() => open_link_modal()}/>
                    </div>
                    <div className="sign_up_button">
                        <Button.button name={"회원가입"} action={() => sign_up()}/>
                    </div>

                    <div className="sign_up_home">
                        <Button.location name={"홈"} url={"/"}/>
                    </div>
                </div>
            </div>
        </div>
    );
}




export default Index;
