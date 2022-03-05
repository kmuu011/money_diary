import React, { useCallback, useRef} from 'react';
import _ from 'lodash';
import './SignUp.scss';
import Button from "components/Button/Button";

import API_sign from "api/sign";

function Index() {
    let idRule = /^[0-9a-zA-Z]*$/i;
    let nickRule = /^[0-9a-zA-Z가-힣]*$/i;
    let emailRule = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    const signUpRef = useRef();

    const debounceHandler = useCallback(
        _.debounce(async (id, dom) => {
            await dup_check(id, dom);
        },400), []
    );

    const onChange = (e) => {
        e.persist();

        let { id } = e.target;

        if((/^id$|^nickname$|^email$/).test(id)) {
            debounceHandler(id, e.target);
        }
    };

    async function sign_up() {
        let values = {};
        let inputs = {};

        let elements = signUpRef.current.children;

        for(let e of elements){
            for(let c of e.children){
                if(c.tagName === 'INPUT') inputs[c.id] = c;
            }
        }

        for(let k in inputs){
            let e = inputs[k];

            let value = e.value;

            if(value.toString().replace(/\s/g, '') === ''){
                alert('입력하지 않은 항목이 있습니다');
                e.focus();
                return;
            }

            if((/^id$|^nickname$|^email$/).test(e.id)) {
                await dup_check(e.id, e);
            }

            values[e.id] = value;
        }

        if(values['password'] !== values['pwd_check']){
            alert('비밀번호와 비밀번호 확인이 서로 일치하지 않습니다.');
            inputs['pwd_check'].focus();
            return;
        }

        if(!idRule.test(values['id'])){
            alert('아이디에 사용할 수 없는 문자가 포함되어 있습니다.');
            inputs['id'].focus();
            return
        }

        if(!nickRule.test(values['nickname'])){
            alert('닉네임에 사용할 수 없는 문자가 포함되어 있습니다.');
            inputs['nickname'].focus();
            return
        }

        if(!emailRule.test(values['email'])){
            alert('사용할 수 없는 이메일 입니다.');
            inputs['email'].focus();
            return
        }

        let result = await API_sign.sign_up(values);

        if(result.status === 200){
            alert('회원가입이 완료되었습니다.');
            window.location = '/';
        }else{
            alert(result.data.message);
        }
    }

    async function dup_check (id, dom) {
        let value = dom.value;
        let checkApi, body;

        if(value === undefined || value.toString().replace(/\s/g, '') === '') return;

        if(id === 'id'){
            if(!idRule.test(value)){
                dom.style['border-color'] = 'red';
                return;
            }

            checkApi = API_sign.id_check;
        }else if(id === 'nickname'){
            checkApi = API_sign.nick_check
        }else if(id === 'email'){
            if(!emailRule.test(value)){
                dom.style['border-color'] = 'red';
                return;
            }
            checkApi = API_sign.email_check;
        }

        body = {[id]: value};

        let result = await checkApi(body);

        if(result.status !== 200){
            dom.style['border-color'] = 'red';
            return false;
        }else{
            dom.style['border-color'] = 'green';
            return true;
        }
    }

    return (
        <div className="sign_up_page">

            <div className={"sign_up_body"} ref={signUpRef}>
                <div className="sign_up_title">
                    회원가입
                </div>
                <div className="sign_up_id">
                    <div className={"input_text"}>아이디</div>
                    <input type="text" id="id" placeholder="아이디" onChange={onChange}/>
                </div>

                <div className="sign_up_password">
                    <div className={"input_text"}>비밀번호</div>
                    <input type="password" id="password" placeholder="비밀번호" onChange={onChange}/>
                </div>

                <div className="sign_up_password">
                    <div className={"input_text"}>비밀번호 확인</div>
                    <input type="password" id="pwd_check" placeholder="비밀번호 확인" onChange={onChange}/>
                </div>

                <div className="sign_up_nickname">
                    <div className={"input_text"}>닉네임</div>
                    <input type="text" id="nickname" placeholder="닉네임" onChange={onChange}/>
                </div>

                <div className="sign_up_email">
                    <div className={"input_text"}>이메일</div>
                    <input type="text" id="email" placeholder="이메일" onChange={onChange}/>
                </div>

            </div>

            <div className="sign_up_footer">
                <div className="sign_up_button">
                    <Button.button name={"회원가입"} action={sign_up}/>
                </div>

                <div className="sign_up_home">
                    <Button.location name={"홈"} url={"/"}/>
                </div>
            </div>

        </div>

    );
}






export default Index;
