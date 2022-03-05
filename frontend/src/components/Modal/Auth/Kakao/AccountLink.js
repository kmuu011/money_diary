import React from 'react';
import './AccountLink.scss';
import utils from "utils/utils";
import Button from "components/Button/Button";
import API_kakao from "api/auth/kakao";


function AccountLink(props) {
    if(props.hidden) return null;

    let setAccountLinkModal = props.set_member_link_modal;
    let auth_data = props.auth_data;

    async function member_link () {
        let id = document.querySelector('#id').value;
        let password = document.querySelector('#password').value;
        let token = auth_data.token;

        let result = await API_kakao.member_link({id, password, token});

        if(result.status === 200){
            alert('계정 연동이 완료되었습니다.');
            sessionStorage.setItem('x-token', result.data['x-token']);
            window.location = '/member/account';
            return;
        }else{
            alert(result.data.message);
            return;
        }


    }

    function closeModal (e) {
        utils.enableScroll();

        if(e === undefined){
            setAccountLinkModal(true);
            return;
        }

        let target_class = e.target.getAttribute('class');

        if(target_class === null) return;

        if(target_class.indexOf('kakao_link_modal') !== -1){
            setAccountLinkModal(true);
            return;
        }

    }

    return (
        <div>
            <div className="kakao_link_modal modal_div"
                 hidden={props.hidden}
                 onClick={(e) => closeModal(e)}
            >
                <div className={"k_a_link_body"}>
                    <div className={"k_a_input_wrapper"}>
                        <div className="k_a_input_id">
                            <div className={"input_text"}>아이디</div>
                            <input type="text" id="id" placeholder="아이디"/>
                        </div>
    
                        <div className="k_a_input_password">
                            <div className={"input_text"}>비밀번호</div>
                            <input type="password" id="password" placeholder="비밀번호"/>
                        </div>
                    </div>

                    <div className={"k_a_button_wrapper"}>
                        <Button.button name={"연동하기"} action={() => member_link()}/>
                        <Button.button name={"취소"} action={() => closeModal()}/>
                    </div>
                </div>
            </div>
        </div>
    );
}



export default AccountLink;
