import React, {useRef, useState} from 'react';
import './HistoryAddModal.scss';
import Button from "components/Button/Button";

import HistoryCategory from "components/Part/HistoryCategory/HistoryCategory";
import HistoryType from "components/Part/HistoryType/HistoryType";

import API_history from 'api/account/history/history';
import utils from "utils/utils";
import { UserStore } from "UserStore/UserStore";

function HistoryAddModal(props) {
    const amountRef = useRef();
    const contentRef = useRef();

    let [ getAmount, setAmount ] = useState('');
    let [ getContent, setContent ] = useState('');


    if(props.hidden === true) return null;

    let {
        account_idx, getType, getCategory, setCategory,
        timeData
    } = UserStore;

    let setAddHistoryModal = props.set_add_history_modal;

    function closeModal (e) {
        if(e === undefined){
            setAddHistoryModal(true);
            utils.enableScroll();
            setCategory(undefined);
            return;
        }

        let target_class = e?.target?.getAttribute('class');

        if(target_class === undefined) return;

        if(target_class.indexOf('history_add_modal') !== -1){
            setAddHistoryModal(true);
            utils.enableScroll();
            setCategory(undefined);
            return;
        }

    }

    async function addHistory (type, category, setCategory){
        let params = {};


        if(getAmount === undefined || getAmount === ''){
            alert('비용을 입력해주세요.');
            amountRef.current.focus();
            return;
        }

        if(getAmount < 0){
            alert('음수를 비용으로 입력할 수 없습니다.');
            setAmount('');
            amountRef.current.focus();
            return;
        }

        if(getContent === undefined || getContent === ''){
            alert('내용을 입력해주세요.');
            contentRef.current.focus();
            return;
        }

        if(type === undefined){
            alert('지출과 수입중 하나를 선택해주세요.');
            return;
        }

        if(category === undefined){
            alert('카테고리를 선택해주세요.');
            return;
        }

        params.account_idx = account_idx;
        params.amount = parseInt(getAmount);
        params.content = getContent;
        params.type = type;
        params.category = category;

        if(timeData !== null){
            params.created_at = timeData.year + utils.leftPadding(timeData.month, 2, '0') + utils.leftPadding(timeData.date, 2 ,'0');
        }

        let result = await API_history.insert(params);

        if(result.status !== 200){
            alert(result.data.message);
            return;
        }

        UserStore.getCategory = null;

        UserStore.historyReset = true;

        UserStore.historyReload();
        UserStore.accountReload();
        UserStore.calendarReload();
        UserStore.monthSituationReload();

        setAmount('');
        setContent('');
        setCategory(undefined);
        closeModal();
    }

    return (
        <div>
            <div className={"history_add_modal modal_div"}
                 onClick={(e) => closeModal(e)}>
                <div className={"history_modal_body"}>
                    <div className={"modal_input_wrapper"}>
                        <div className={"modal_input_div"}>
                            <input type={"number"} id={"amount"}
                                   className={"modal_input"}
                                   placeholder={"비용"}
                                   value={getAmount}
                                   ref={amountRef}
                                   onChange={(e) => setAmount(e.target.value)}
                                   min={0}
                            />
                        </div>
                        <div className={"modal_input_div"}>
                            <input type={"text"} id={"content"} className={"modal_input"} placeholder={"내용"}
                                   ref={contentRef}
                                   value={getContent}
                                   onChange={(e) => setContent(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={"history_option_body"}>
                        <HistoryType/>

                        <div className={"history_category_area"}>
                            <HistoryCategory type={getType} set_category={setCategory}/>
                        </div>

                    </div>

                    <div className={"history_modal_footer"}>
                        <Button.button name={"등록하기"} id={"insert_button"}
                                       action={() => addHistory(getType, getCategory, setCategory)}/>
                        <Button.button name={"취소"} action={() => closeModal()}/>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default HistoryAddModal;
