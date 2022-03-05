import React, {useEffect, useState} from 'react';
import './Account.scss';
import Button from "components/Button/Button";
import NavButton from 'components/Part/Nav/NavButton';
import AccountNav from "components/Nav/AccountNav";

import AccountAddModal from "components/Modal/Account/AccountAddModal";

import addButton from 'static/img/button/add/add_white_36dp.svg';
import deleteButton from "static/img/button/delete/delete_outline_white_36dp.svg";

import API_account from 'api/account/account';

import utils from "utils/utils";

import { UserStore } from "UserStore/UserStore"

function Index() {
    const [ getAccountList, setAccountList ] = useState([]);

    const [ hidden, setHidden ] = useState(true);

    const [ accountAddModal, setAccountAddModal ]= useState(true);

    const [ accountDeleteButton, setDeleteButton ] = useState(true);

    useEffect(() => {
        selectAccountList()
    }, []);

    if(getAccountList.length === 0) return null;

    function openNav () {
        setHidden(false);
        UserStore.nav_setter = setHidden;
    }

    function openAccountAddModal () {
        setAccountAddModal(false);
        utils.disableScroll();
    }

    async function selectAccountList () {
        let result = await API_account.selectList();

        if(result.status !== 200){
            alert(result.data.message);
            window.location = '/';
            return;
        }

        setAccountList(result.data);
    }

    function cancelDelete () {
        setDeleteButton(true);
    }

    async function deleteAccount (idx) {
        let result = await API_account.delete({account_idx : idx});

        if(result.status !== 200){
            alert(result.data.message);
            return;
        }

        await selectAccountList()
    }

    function selectAccount (idx, e) {
        let target_class = e.target.getAttribute('class');

        if(target_class === 'account_delete_button') return;

        window.location = '/member/account/' + idx + '/history';
    }

    return (
        <div className={"App_container"}>
            <AccountNav hidden={hidden} set_delete_button={setDeleteButton} />
            <AccountAddModal hidden={accountAddModal}
                             set_account_add_modal={setAccountAddModal}
                             account_reload={selectAccountList}
            />

            <NavButton action={() => openNav()}/>


            <div className="account_body">
                <div className={"account_title"}>
                    가계부 목록
                </div>

                <div className={"account_delete_cancel"} hidden={accountDeleteButton}>
                    <Button.button name={"삭제 그만하기"} action={() => cancelDelete()}/>
                </div>

                <div id="account_wrapper" className={"account_wrapper"}>
                    {
                        getAccountList.map(item =>
                            <div key={item.idx} name={"account_"+item.idx} className={'account_item'}
                                 onClick={selectAccount.bind(null, item.idx)}>
                                <div className={"account_content_wrapper"}>
                                    <div className={"account_name"}>
                                        {item.account_name}
                                    </div>
                                    <div className={"account_amount"}>
                                        {utils.commaParser(item.total_amount, undefined, item.invisible_amount)} ￦
                                    </div>
                                    <img className={"account_delete_button"} src={deleteButton} alt={"삭제버튼"}
                                         hidden={accountDeleteButton}
                                         onClick={() => deleteAccount(item.idx)}/>
                                </div>
                            </div>
                        )
                    }
                </div>

                <div className={"account_footer"}>
                    <div className={"add_button_wrapper"} onClick={() => openAccountAddModal()}>
                        <img className={"add_button"} src={addButton} alt={"등록버튼"}/>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default Index;
