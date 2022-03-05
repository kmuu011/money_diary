import React, {useState, useEffect, useRef} from 'react';
import './HistoryDateModal.scss';
import Button from "components/Button/Button";


import utils from "utils/utils";
import { UserStore } from "UserStore/UserStore";


function HistoryDateModal(props) {
    const [monthRange, setMonthRange] = useState(true);
    const buttonsRef = useRef();

    let [ month, setMonth ] = useState(UserStore.getMonth);
    let [ year, setYear ] = useState(UserStore.getYear);

    useEffect(() => {
        dateTypeActiveCheck();
    });

    if(props.hidden) return null;

    let now = new Date();

    let year_list = [];
    let month_list = [1,2,3,4,5,6,7,8,9,10,11,12];

    for(let i=now.getFullYear() ; i>= 2019 ; i--){
        year_list.push(i);
    }

    function dateTypeActiveCheck() {
        if(year === null || month === null || !buttonsRef.current) return;
        
        let buttons = buttonsRef.current.children;

        for(let b of buttons){
            b.id = "unchecked";
        }

        if(monthRange){
            buttons[0].id = "checked";
        }else{
            buttons[1].id = "checked"
        }

    }

    function closeModal (e) {
        if(e === undefined){
            UserStore.setHistoryDateModal(true);
            utils.enableScroll();
            UserStore.setCategory(undefined);
            return;
        }

        let target_class = e.target.getAttribute('class');

        if(target_class.indexOf('modal_div') !== -1){
            UserStore.setHistoryDateModal(true);
            utils.enableScroll();
            UserStore.setCategory(undefined);
            return;
        }

    }

    function chooseRange (e) {
        let chooseMonth = e.className === "range_month";

        setMonthRange(chooseMonth);

        let buttons = buttonsRef.current.children;

        for(let b of buttons){
            if(b.className === e.className){
                b.id = "checked";
                continue;
            }

            b.id = "unchecked";
        }
    }

    function confirmDate () {
        if(!monthRange){
            month = undefined;
        }


        UserStore.getYear = year;
        UserStore.setYear(year);
        UserStore.getMonth = month;
        UserStore.setMonth(month);

        UserStore.historyReset = true;
        UserStore.historyReload();
        UserStore.pieChartReload();

        closeModal();
    }

    return (
        <div className={"modal_div"}
             onClick={closeModal.bind(null)}
        >
            <div className={"date_modal_body"}>
                <div className={"date_range_type"} ref={buttonsRef}>
                    <div className={"range_month"}
                         onClick={(e) => chooseRange(e.target)}>
                        월간
                    </div>
                    <div className={"range_year"}
                         onClick={(e) => chooseRange(e.target)}>
                        연간
                    </div>
                </div>
                <div className={"date_type_wrapper"}>
                    <div className={"date_year"}>
                        <select className={"select_date"} id={"year"}
                                defaultValue={UserStore.getYear}
                                onChange={(e) => setYear(e.target.value)}
                        >
                            {
                                year_list.map((y, idx) =>
                                    <option key={idx} value={y}>{y}</option>
                                )
                            }
                        </select>
                    </div>
                    <div className={"date_month"} hidden={!monthRange}>
                        <select className={"select_date"} id={"month"}
                                defaultValue={UserStore.getMonth}
                                onChange={(e) => setMonth(e.target.value)}
                        >
                            {
                                month_list.map((m, idx) =>
                                    <option key={idx} value={m}>
                                        {m}
                                    </option>
                                )
                            }
                        </select>
                    </div>
                </div>

                <div className={"date_button_wrapper"}>
                    <Button.button name={"적용"} action={() => confirmDate()}/>
                    <Button.button name={"취소"} action={() => closeModal()}/>

                </div>

            </div>
        </div>
    );
}

export default HistoryDateModal;
