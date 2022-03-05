import React, {useRef} from 'react';
import './HistoryModifyModal.scss';
import Button from "components/Button/Button";

import HistoryCategory from "components/Part/HistoryCategory/HistoryCategory";

import API_history from 'api/account/history/history';
import utils from "utils/utils";
import { UserStore } from "UserStore/UserStore";
import HistoryType from "components/Part/HistoryType/HistoryType";

function HistoryModifyModal(props) {
    let setModifyHistoryModal = props.set_modify_history_modal;
    let modifyRef = useRef();

    let { getHistoryItem, getType, getCategory, setCategory } = UserStore;
    let history_idx;

    if(getHistoryItem === undefined) return null;

    history_idx = getHistoryItem.idx;

    function closeModal (e) {
        if(e === undefined){
            setModifyHistoryModal(true);
            utils.enableScroll();
            UserStore.setHistoryItem(undefined);
            UserStore.setCategory(undefined);
            return;
        }

        let target_class = e?.target?.getAttribute('class');

        if(target_class === undefined) return;

        if(target_class.indexOf('history_modify_modal') !== -1){
            setModifyHistoryModal(true);
            utils.enableScroll();
            UserStore.setHistoryItem(undefined);
            UserStore.setCategory(undefined);
            return;
        }
    }

    async function updateHistory (){
        let values = {};
        let inputs = {};
        let params = {};

        let elements = modifyRef.current.children;

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

            values[e.id] = value;
        }

        let { amount, content } = values;

        if(amount === undefined || amount === ''){
            alert('비용을 입력해주세요.');
            inputs['amount'].focus();
            return;
        }

        if(amount < 0){
            alert('음수를 비용으로 입력할 수 없습니다.');
            inputs['amount'].value = '';
            inputs['amount'].focus();
            return;
        }

        if(content === undefined || content === ''){
            alert('내용을 입력해주세요.');
            inputs['content'].focus();
            return;
        }

        if(getType === undefined){
            alert('지출과 수입중 하나를 선택해주세요.');
            return;
        }

        if(getCategory === undefined){
            alert('카테고리를 선택해주세요.');
            return;
        }

        params.history_idx = history_idx;
        params.account_idx = UserStore.account_idx;
        params.amount = parseInt(amount);
        params.content = content;
        params.type = getType;
        params.category = getCategory;

        let result = await API_history.update(params);

        if(result.status !== 200){
            alert(result.data.message);
            return;
        }

        UserStore.historyReset = true;

        if(UserStore.categoryReset) {
            UserStore.setHistoryItem(undefined);
            UserStore.setCategory(undefined);
            UserStore.getCategory = null;
        }

        UserStore.getType = UserStore.originalType;

        UserStore.historyReload();
        UserStore.accountReload();
        UserStore.calendarReload();
        UserStore.monthSituationReload();

        UserStore.pieChartReload();

        closeModal();
    }

    async function deleteHistory() {
        let params = {
            account_idx:UserStore.account_idx,
            history_idx
        };

        let result = await API_history.delete(params);

        if(result.status !== 200){
            alert(result.data.message);
            return;
        }

        UserStore.historyReset = true;

        UserStore.setHistoryItem(undefined);
        UserStore.getCategory = undefined;

        UserStore.historyReload();
        UserStore.accountReload();
        UserStore.calendarReload();
        UserStore.monthSituationReload();

        UserStore.pieChartReload();

        closeModal();
    }

    return (
        <div>
            <div className={"history_modify_modal modal_div"}
                 onClick={(e) => closeModal(e)}>
                <div className={"history_modal_body"}>
                    <div className={"modal_input_wrapper"} ref={modifyRef}>
                        <div className={"modal_input_div"}>
                            <input type={"number"} id={"amount"}
                                   className={"modal_input"}
                                   placeholder={"비용"}
                                   min={0}
                                   defaultValue={getHistoryItem.amount}
                                   onKeyPress={(event => {
                                       if(event.key === 'Enter') updateHistory();
                                   })}
                            />
                        </div>
                        <div className={"modal_input_div"}>
                            <input type={"text"} id={"content"}
                                   className={"modal_input"} placeholder={"내용"}
                                   defaultValue={getHistoryItem.content}
                                   onKeyPress={(event => {
                                       if(event.key === 'Enter') updateHistory();
                                   })}
                            />
                        </div>
                    </div>

                    <div className={"history_option_body"}>
                        <HistoryType/>

                        <div className={"history_category_area"}>
                            <HistoryCategory type={getType} set_category={setCategory} category_idx={getHistoryItem.category_idx}/>
                        </div>
                    </div>

                    <div className={"history_modal_footer"}>
                        <Button.button name={"수정하기"} id={"update_button"}
                                       action={() => updateHistory()}/>
                        <Button.button name={"취소"} action={() => closeModal()}/>
                        <Button.button name={"삭제하기"} id={"delete_button"}
                                       action={() => deleteHistory()}/>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default HistoryModifyModal;
