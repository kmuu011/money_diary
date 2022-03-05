import React, {useRef, useState} from 'react';
import './Main.scss';
import Button from "components/Button/Button";

import API_sign from "api/sign";

import kakaoButton from 'static/img/button/sns/kakao/kakao.png';


function Index() {
    const [id, setId] = useState("");
    const [password, setPw] = useState("");
    const [keep_check, setCb] = useState(false);
    const idInputRef = useRef();
    const passwordInputRef = useRef();

    async function login (e) {
        e.preventDefault();

        let params;

        if(id === '' || id.toString().replace(/\s/g, '') === ''){
            alert('아이디를 입력해주세요.');
            idInputRef.current.focus();
            return;
        }

        if(password === '' || password.toString().replace(/\s/g, '') === ''){
            alert('비밀번호를 입력해주세요.');
            passwordInputRef.current.focus();
            return;
        }

        params = { id, password, keep_check };

        let result = await API_sign.login(params);

        if(result === undefined || result.status !== 200){
            alert(result.data.message);
            return;
        }

        localStorage.setItem('x-token', result.data['x-token']);

        window.location = '/member/account';
    }

    async function kakao_login () {
        const SERVER_TYPE = process.env.NODE_ENV;

        sessionStorage.setItem('keep_check', keep_check);

        let rd_uri;

        if(SERVER_TYPE === 'development'){
            rd_uri = 'http://127.0.0.1:8081';
        } else {
            rd_uri = document.location.origin;
        }

        rd_uri += '/api/auth/kakao';

        window.Kakao.Auth.authorize({
            redirectUri : rd_uri
        });
    }

  return (
      <div className="login_page">
          <div className="login_body">
              <div className="main_title">가계부</div>

              <div className="login_body_desc">
                  로그인
              </div>

              <form onSubmit={login}>
                  <div className="login_id">
                      <input ref={idInputRef} type="text" value={id} id="id" placeholder="아이디"
                             onChange={(e) => setId(e.target.value)} />
                  </div>

                  <div className="login_password">
                      <input ref={passwordInputRef} type="password" value={password} id="password" placeholder="비밀번호"
                             onChange={(e) => setPw(e.target.value)} />
                  </div>

                  <div className={"keep_login"}>
                      <input type={"checkbox"} id={"cb"} value={keep_check}
                      onChange={(e) => setCb(e.target.checked)} />
                      <label htmlFor={"cb"}>
                          <div className={"keep_login_label"}>
                              로그인 상태 유지
                          </div>
                      </label>
                  </div>

                  <div className="login_sign_in">
                      <Button.submit name={"로그인"}/>
                  </div>
              </form>

              <div className="login_sign_up">
                  <Button.location name={"회원가입"} url={"/sign_up"}/>
              </div>

              <div className="login_with_sns">
                  <div className="login_kakao_wrapper" onClick={kakao_login}>
                      <img className="login_kakao_button" src={kakaoButton} alt={"카카오 로그인"}/>
                  </div>
              </div>


          </div>
      </div>
  );

}



export default Index;
