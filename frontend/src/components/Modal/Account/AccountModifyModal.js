import React from 'react';
import './AccountModifyModal.scss';
import Button from "components/Button/Button";

import API_account from 'api/account/account';

import utils from "utils/utils";

import { UserStore } from "UserStore/UserStore"

function AccountModifyModal(props) {
    if(props.hidden) return null;

    let setAccountModifyModal = props.set_modify_account_modal;

    function closeModal (e) {
        utils.enableScroll();

        if(e === undefined){
            setAccountModifyModal(true);
            return;
        }

        let target_class = e.target.getAttribute('class');

        if(target_class === null) return;

        target_class = target_class.split(' ');

        if(target_class.indexOf('account_modify_modal') !== -1){
            setAccountModifyModal(true);
            return;
        }

    }

    async function modifyAccount () {
        let account_name = document.querySelector('#account_name');
        let invisible_amount = document.querySelector('#cb');

        invisible_amount = invisible_amount.checked === true ? 1 : 0;

        if(account_name.value.toString().replace(/\s/g, '') === ''){
            alert('가계부 이름을 입력해주세요.');
            account_name.focus();
            return;
        }

        let result = await API_account.update({
            account_idx: UserStore.account_idx,
            account_name: account_name.value,
            invisible_amount
        });

        if(result.status !== 200){
            alert(result.data.message);
            return;
        }

        UserStore.accountReload();

        closeModal();
    }

    return (
        <div>
            <div className={"account_modify_modal modal_div"}
                 onClick={(e) => closeModal(e)}
            >
                <div className={"account_modify_modal_body"}>
                    <div className={"account_modify_modal_wrapper"}>
                        <div className={"account_modify_modal_input"}>
                            <input type={"text"} id={"account_name"} className={"modal_input"}
                                   placeholder={"가계부 이름"} defaultValue={props.account_name}
                                   onKeyPress={(event => {
                                       if (event.key === 'Enter') modifyAccount();
                                   })}
                            />
                        </div>

                        <div className={"invisible_amount_cb"}>
                            <input type={"checkbox"} id={"cb"} defaultChecked={props.invisible_amount}/>
                            <label htmlFor={"cb"}>
                                <div className={"invisible_amount_label"}>
                                    목록에서 금액 숨기기
                                </div>
                            </label>
                        </div>

                        <div className={"account_modify_modal_button_wrapper"}>
                            <Button.button name={"수정하기"} action={() => modifyAccount()}/>
                            <Button.button name={"취소"} action={() => closeModal()}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccountModifyModal;
