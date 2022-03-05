import React, {useCallback, useRef} from 'react';
import _ from 'lodash';
import './MemberModifyModal.scss';
import utils from "utils/utils";
import Button from "components/Button/Button";
import API_sign from "api/sign";

const nickRule = /^[0-9a-zA-Z가-힣]*$/i;
const emailRule = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

function MemberModifyModal(props) {
    const modifyRef = useRef();

    const debounceHandler = useCallback(
        _.debounce(async (id, dom) => {
            await dup_check(id, dom);
        },400), []
    );

    if(props.hidden) return null;

    const setModifyModal = props.set_modify_modal;
    const member = props.member;
    const memberReload = props.member_reload;

    console.log(member)

    function closeModal (e) {
        utils.enableScroll();

        if(e === undefined){
            setModifyModal(true);
            return;
        }

        let target_class = e.target.getAttribute('class');

        if(target_class.indexOf('member_modify_modal') !== -1){
            setModifyModal(true);
            return;
        }
    }

    const onChange = (e) => {
        e.persist();

        let { id } = e.target;

        if((/^nickname$|^email$/).test(id)) {
            debounceHandler(id, e.target);
        }
    };

    async function modifyMember() {
        let requireKey = 'nickname, email';
        if(member.auth_id === null) requireKey += ',old_password';

        requireKey = requireKey.replace(/\s/g, '').split(',');

        requireKey = await utils.reg_or_maker(requireKey);

        console.log(requireKey)

        let values = {};

        let elements = modifyRef.current.children;

        let inputs = {};

        for(let e of elements){
            for(let c of e.children){
                if(c.tagName === 'INPUT') inputs[c.id] = c;
            }
        }
        console.log(inputs)

        for(let k in inputs){
            let e = inputs[k];

            let value = e.value;

            console.log(value.toString().replace(/\s/g, ''), (requireKey).test(k), k)

            if(value.toString().replace(/\s/g, '') === '' && (requireKey).test(k)){
                alert('입력하지 않은 항목이 있습니다');
                e.focus();
                return;
            }

            if((/^nickname$|^email$/).test(k)) {
                await dup_check(k, e);
            }

            if(value.toString().replace(/\s/g, '') !== '') {
                values[k] = value;
            }
        }

        if(values['password'] !== values['pwd_check']){
            alert('비밀번호와 비밀번호 확인이 서로 일치하지 않습니다.');
            inputs['pwd_check'].focus();
            return;
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

        let result = await API_sign.update_member(values);

        if(result.status !== 200){
            alert(result.data.message);
            return;
        }

        if(result.data) {
            alert('수정이 완료되었습니다.');
            setModifyModal(true);
            memberReload();
        }
    }

    async function dup_check (id, dom) {
        let value = dom.value;
        let checkApi, body;

        if(value === undefined || value.toString().replace(/\s/g, '') === '') return;

        if(id === 'nickname'){
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

    console.log(member)

    return (
        <div>
            <div className="member_modify_modal modal_div"
                 onClick={closeModal.bind(null)}
            >

                <div className={"modify_data_body"}>
                    <div className={"modify_data_wrapper"} ref={modifyRef}>
                        <div className={"modify_data"}>
                            <div className={"data_description"}>
                                닉네임
                            </div>
                            <input type="text" className={"data_nickname"}
                                   id={"nickname"}
                                   placeholder={"닉네임"}
                                   defaultValue={member.nickname}
                                   onChange={(e) => onChange(e)}
                            />
                        </div>
                        <div className={"modify_data"}>
                            <div className={"data_description"}>
                                이메일
                            </div>
                            <input type="text" className={"data_email"}
                                   id={"email"}
                                   placeholder={"이메일"}
                                   defaultValue={member.email}
                                   onChange={(e) => onChange(e)}
                            />
                        </div>
                        {
                            member.auth_id === null ?
                                <div className={"modify_data"}>
                                    <div className={"data_description"}>
                                        이전 비밀번호
                                    </div>
                                    <input type="password" className={"data_old_pwd"}
                                           id={"old_password"}
                                           placeholder={"이전 비밀번호"}
                                    />
                                </div> : ''
                        }
                        {
                            member.auth_id === null ?
                                <div className={"modify_data"}>
                                    <div className={"data_description"}>
                                        새 비밀번호
                                    </div>
                                    <input type="password" className={"data_password"}
                                           id={"password"}
                                           placeholder={"새 비밀번호"}
                                    />
                                </div> : ''
                        }
                        {
                            member.auth_id === null ?
                                <div className={"modify_data"}>
                                    <div className={"data_description"}>
                                        새 비밀번호 확인
                                    </div>
                                    <input type="password" className={"data_password"}
                                           id={"pwd_check"}
                                           placeholder={"새 비밀번호 확인"}
                                    />
                                </div> : ''
                        }
                        <div className={"modify_button_wrapper"}>
                            <Button.button name={"수정하기"} id={"update_button"}
                                           action={() => modifyMember()}/>
                            <Button.button name={"취소"} action={() => closeModal()}/>

                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}



export default MemberModifyModal;
