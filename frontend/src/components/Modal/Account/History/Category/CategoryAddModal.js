import React, {useRef, useState} from 'react';
import './CategoryAddModal.scss';
import Button from "components/Button/Button";

import HistoryCategory from "components/Part/HistoryCategory/HistoryCategory";

import API_history from 'api/account/history/history';
import utils from "utils/utils";
import { UserStore } from "UserStore/UserStore";
import HistoryType from "components/Part/HistoryType/HistoryType";


function CategoryAddModal(props) {
    let setCategoryAddModal = props.set_add_category_modal;

    let [ name, setName ] = useState('');
    let nameRef = useRef();

    if(props.hidden) return null;

    let { getType, getCategory, setCategory, account_idx} = UserStore;

    function closeModal (e) {
        if(e === undefined){
            setCategoryAddModal(true);
            utils.enableScroll();
            UserStore.setHistoryItem(undefined);
            return;
        }

        let target_class = e.target.getAttribute('class');

        if(target_class.indexOf('category_add_modal') !== -1){
            setCategoryAddModal(true);
            utils.enableScroll();
            UserStore.setHistoryItem(undefined);
            return;
        }
    }

    async function insertCategory () {
        let params = {
            name,
            account_idx,
            type: getType
        };

        if(name === '' || name.toString().replace(/\s/g, '') === ''){
            alert('유형 이름을 입력해주세요.');
            nameRef.current.focus();
            return;
        }

        let result = await API_history.insertCategory(params);

        if(result.status !== 200){
            alert(result.data.message);
            return;
        }

        UserStore.categoryReload();
        setCategory(undefined);
        setName('');
    }

    async function updateCategory (){
        let params = {
            name,
            category_idx: getCategory,
            account_idx
        };

        if(name === '' || name.toString().replace(/\s/g, '') === ''){
            alert('유형 이름을 입력해주세요.');
            nameRef.current.focus();
            return;
        }

        if(getCategory === undefined){
            alert('수정할 유형을 선택해주세요.');
            return;
        }

        let result = await API_history.updateCategory(params);

        if(result.status !== 200){
            alert(result.data.message);
            return
        }

        setCategory(undefined);

        UserStore.categoryReload();
        UserStore.resetCategoryItem();
        UserStore.historyReset = true;
        UserStore.historyReload();

        setName('');
    }

    async function deleteCategory () {
        let params = {
            account_idx,
            category_idx: getCategory
        };

        if(getCategory === undefined){
            alert('삭제할 유형을 선택해주세요.');
            return;
        }

        let result = await API_history.deleteCategory(params);

        if(result.status !== 200){
            alert(result.data.message);
            return;
        }

        setCategory(undefined);
        UserStore.categoryReload();
        UserStore.resetCategoryItem();
        UserStore.historyReset = true;
        UserStore.historyReload();
    }

    return (
        <div>
            <div className={"category_add_modal modal_div"}
                 onClick={closeModal.bind(null)}>
                <div className={"category_modal_body"}>
                    <div className={"history_option_body"}>
                        <HistoryType/>

                        <div className={"history_category_area"}>
                            <HistoryCategory type={getType} set_category={setCategory}/>
                        </div>

                    </div>

                    <div className={"modal_input_wrapper"}>
                        <div className={"modal_input_div"}>
                            <input type={"text"} id={"category_name"}
                                   className={"modal_input"}
                                   placeholder={"이름"}
                                   value={name}
                                   ref={nameRef}
                                   onChange={(e) => {setName(e.target.value)}}
                            />
                        </div>
                    </div>

                    <div className={"history_modal_footer"}>
                        <Button.button name={"등록하기"} id={"insert_button"}
                                       action={() => insertCategory()}/>
                        <Button.button name={"수정하기"} id={"update_button"}
                                       action={() => updateCategory()}/>
                        <Button.button name={"취소"} action={() => closeModal()}/>
                        <Button.button name={"삭제하기"} id={"delete_button"}
                                       action={() => deleteCategory()}/>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default CategoryAddModal;
