import React  from 'react';
import './AccountAddModal.scss';
import Button from "components/Button/Button";

import API_account from 'api/account/account';

import utils from "utils/utils";

function AccountAddModal(props) {
    if(props.hidden) return null;

    let setAccountAddModal = props.set_account_add_modal;
    let accountReload = props.account_reload;

    function closeModal (e) {
        utils.enableScroll();

        if(e === undefined){
            setAccountAddModal(true);
            return;
        }

        let target_class = e.target.getAttribute('class');

        target_class = target_class.split(' ');

        if(target_class.indexOf('account_add_modal') !== -1){
            setAccountAddModal(true);
            return;
        }
    }

    async function addAccount () {
        let account_name = document.querySelector('#account_name');

        if(account_name.value.toString().replace(/\s/g, '') === ''){
            alert('가계부 이름을 입력해주세요.');
            account_name.focus();
            return;
        }

        let result = await API_account.insert({account_name : account_name.value});

        if(result.status !== 200){
            alert(result.data.message);
            return;
        }

        accountReload();

        account_name.value = '';

        closeModal();
    }

    return (
        <div>
            <div className={"account_add_modal modal_div"}
                 onClick={(e) => closeModal(e)}>
                <div className={"account_add_modal_body"}>
                    <div className={"account_add_modal_wrapper"}>
                        <div className={"account_add_modal_input"}>
                            <input type={"text"} id={"account_name"} className={"modal_input"} placeholder={"가계부 이름"} onKeyPress={(event => {
                                if(event.key === 'Enter') addAccount();
                            })}/>
                        </div>
                        <div className={"account_add_modal_button_wrapper"}>
                            <Button.button name={"등록하기"} action={() => addAccount()}/>
                            <Button.button name={"취소"} action={() => closeModal()}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default AccountAddModal;
