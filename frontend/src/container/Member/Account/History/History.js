import React, {useCallback, useEffect, useState} from 'react';
import './History.scss';

import NavButton from 'components/Part/Nav/NavButton';
import HistoryNav from "components/Nav/HistoryNav";

import HistoryAddModal from "components/Modal/Account/History/HistoryAddModal";
import HistoryModifyModal from "components/Modal/Account/History/HistoryModifyModal";
import CategoryAddModal from "components/Modal/Account/History/Category/CategoryAddModal";

import HistoryItem from 'components/Part/HistoryItem/HistoryItem';

import settingButton from 'static/img/button/setting/settings_white_36dp.svg';
import addButton from 'static/img/button/add/add_white_36dp.svg';
import editButton from 'static/img/button/edit/edit_white_36dp.svg';

import { UserStore } from "UserStore/UserStore"

import API_account from 'api/account/account';

import utils from "utils/utils";
import AccountModifyModal from "components/Modal/Account/AccountModifyModal";

function Index({match}) {
    let params = match.params;
    let { account_idx } = params;
    const [ getAccount, setAccount ] = useState(undefined);

    UserStore.account_idx = account_idx;

    const [ getPage, setPage ] = useState(1);
    UserStore.getPage = getPage;
    UserStore.setPage = setPage;

    const selectAccount = useCallback(async () => {
        let params = {account_idx};
        let result = await API_account.selectOne(params);

        if(result.status !== 200){
            alert(result.data.message);
            window.location = '/';
            return;
        }

        setAccount(result.data);
    },[account_idx]);

    useEffect(() => {
        selectAccount()
    }, [selectAccount]);

    UserStore.accountReload = selectAccount;

    const [ hidden, setHidden ] = useState(true);

    const [ addHistoryModal, setAddHistoryModal ] = useState(true);

    const [ modifyHistoryModal, setModifyHistoryModal ] = useState(true);

    const [ getCategoryAddModal, setCategoryAddModal ] = useState(true);

    const [ getAccountModifyModal, setAccountModifyModal ] = useState(true);

    const [ getHistoryItem, setHistoryItem ] = useState(undefined);
    const [ getType, setType ] = useState(0);
    const [ getCategory, setCategory ] = useState(undefined);
    const [ getCategoryList, setCategoryList ] = useState([]);

    if(getAccount === undefined) return null;

    UserStore.getHistoryItem = getHistoryItem;
    UserStore.setHistoryItem = setHistoryItem;

    UserStore.getType = getType;
    UserStore.setType = setType;

    UserStore.getCategory = getCategory;
    UserStore.setCategory = setCategory;

    UserStore.getCategoryList = getCategoryList;
    UserStore.setCategoryList = setCategoryList;


    function openNav () {
        setHidden(false);
        UserStore.nav_setter = setHidden;
    }

    function openAddModal () {
        UserStore.setType(0);
        setAddHistoryModal(false);
        utils.disableScroll();
    }

    function openAccountModifyModal () {
        setAccountModifyModal(false);
        utils.disableScroll();
    }

    function openCategoryAddModal () {
        UserStore.setType(0);
        setCategoryAddModal(false);
        utils.disableScroll();
    }
    
    return (
        <div className={"App_container"}>
            <HistoryNav hidden={hidden} />
            <HistoryAddModal hidden={addHistoryModal}
                             set_add_history_modal={setAddHistoryModal}
            />
            <HistoryModifyModal hidden={modifyHistoryModal}
                                set_modify_history_modal={setModifyHistoryModal}
            />
            <CategoryAddModal hidden={getCategoryAddModal}
                              set_add_category_modal={setCategoryAddModal}
            />

            <AccountModifyModal hidden={getAccountModifyModal}
                                set_modify_account_modal={setAccountModifyModal}
                                account_name={getAccount.account.account_name}
                                invisible_amount={getAccount.account.invisible_amount}
            />

            <NavButton action={() => openNav()}/>

            <div className={"account_history_title"}>
                {getAccount.account.account_name}
            </div>

            <div className="history_body">
                                <div className={"account_history_total_amount"}>
                    {utils.commaParser(getAccount.account.total_amount)} 원
                </div>

                <div className={"account_history_body"}>
                    <HistoryItem
                        set_modify_history_modal={setModifyHistoryModal}
                        reload_account={selectAccount}
                        type_initialize={true}
                    />
                </div>

                <div className={"button_wrapper"} >
                    <div className={"setting_button_wrapper"}>
                        <img className="setting_button" src={settingButton} alt={"환경설정버튼"}
                             onClick={() => openAccountModifyModal()}/>
                    </div>

                    <div className={"type_modify_button"}>
                        <img className={"edit_button"} src={editButton} alt={"유형편집버튼"}
                             onClick={() => openCategoryAddModal()}/>
                    </div>

                    <div className={"add_button_wrapper"}>
                        <img className={"add_button"} src={addButton} alt={"등록버튼"}
                             onClick={() => openAddModal()}/>
                    </div>
                </div>
            </div>

        </div>
    );
}





export default Index;
