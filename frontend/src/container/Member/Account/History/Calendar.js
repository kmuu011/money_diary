import React, {useCallback, useEffect, useState} from 'react';
import './Calendar.scss';

import NavButton from 'components/Part/Nav/NavButton';
import HistoryNav from "components/Nav/HistoryNav";

import HistoryAddModal from "components/Modal/Account/History/HistoryAddModal";
import HistoryModifyModal from "components/Modal/Account/History/HistoryModifyModal";

import HistoryItem from 'components/Part/HistoryItem/HistoryItem';

import CalendarFrame from 'components/Part/Calendar/CalendarFrame';

import {UserStore} from "UserStore/UserStore"

import API_history from 'api/account/history/history';

import utils from "utils/utils";
import addButton from "static/img/button/add/add_white_36dp.svg";

function Calendar({match}) {
    let params = match.params;
    let {account_idx} = params;
    UserStore.account_idx = account_idx;

    const [getPage, setPage] = useState(1);
    UserStore.getPage = getPage;
    UserStore.setPage = setPage;

    const [hidden, setHidden] = useState(true);

    const [addHistoryModal, setAddHistoryModal] = useState(true);

    const [modifyHistoryModal, setModifyHistoryModal] = useState(true);

    const [getHistoryItem, setHistoryItem] = useState(undefined);
    const [getType, setType] = useState(0);
    const [getCategory, setCategory] = useState(undefined);

    const [getYear, setYear] = useState(new Date().getFullYear());
    const [getMonth, setMonth] = useState(new Date().getMonth() + 1);

    const [monthSituation, setMonthSituation] = useState(undefined);

    UserStore.getHistoryItem = getHistoryItem;
    UserStore.setHistoryItem = setHistoryItem;

    UserStore.getType = getType;
    UserStore.setType = setType;

    UserStore.getCategory = getCategory;
    UserStore.setCategory = setCategory;

    UserStore.getYear = getYear;
    UserStore.setYear = setYear;

    UserStore.getMonth = getMonth;
    UserStore.setMonth = setMonth;

    UserStore.timeData = UserStore.timeData === null ? {year: getYear, month: getMonth, date: new Date().getDate()} : UserStore.timeData;

    let income, outcome;

    UserStore.nextMonthAction = nextMonth;
    UserStore.previousMonthAction = previousMonth;

    let selectMonthSituation = useCallback(async () => {
        let result = await API_history.selectMonthSituation({
            account_idx,
            year:getYear,
            month:getMonth
        });

        if(result.status !== 200){
            alert(result.data.message);
            return;
        }

        setMonthSituation(result.data);
    }, [ account_idx, getYear, getMonth ]);

    useEffect(() => {
        selectMonthSituation()
    }, [selectMonthSituation]);


    function openNav() {
        setHidden(false);
        UserStore.nav_setter = setHidden;
    }

    function openAddModal() {
        setType(0);
        setAddHistoryModal(false);
        utils.disableScroll();
    }

    function nextMonth() {
        if (getMonth === 12) {
            setMonth(1);
            setYear(UserStore.getYear + 1);
            UserStore.getMonth = 1;
            UserStore.getYear = UserStore.getYear + 1;
        } else {
            setMonth(getMonth+1);
            UserStore.getMonth = getMonth+1;
        }

        UserStore.calendarReload();
        UserStore.resetCalendarChecked();
        UserStore.historyReload();

        selectMonthSituation();
    }

    function previousMonth() {
        if (getMonth === 1) {
            setMonth(12);
            setYear(getYear - 1);
            UserStore.getMonth = 12;
            UserStore.getYear = getYear - 1;
        } else {
            setMonth(getMonth - 1);
            UserStore.getMonth = getMonth-1;
        }

        UserStore.calendarReload();
        UserStore.resetCalendarChecked();
        UserStore.historyReload();

        selectMonthSituation();
    }

    if(monthSituation !== undefined) {
        income = utils.commaParser(monthSituation.income);
        outcome = utils.commaParser(monthSituation.outcome);
    }

    UserStore.monthSituationReload = selectMonthSituation;

    return (
        <div className={"App_container_calendar"}>
            <HistoryNav hidden={hidden}/>
            <HistoryAddModal hidden={addHistoryModal}
                             set_add_history_modal={setAddHistoryModal}
            />
            <HistoryModifyModal hidden={modifyHistoryModal}
                                set_modify_history_modal={setModifyHistoryModal}
            />

            <NavButton action={() => openNav()}/>

            <div className={"calendar_button_header"}>
                <div className={"add_button_wrapper"}>
                    <img className={"add_button"} src={addButton} alt={"등록버튼"}
                         onClick={() => openAddModal()}/>
                </div>
            </div>

            <div className={"calendar_header"}>
                <div className={"calendar_time_zone"}>
                    <div className={"previous_month"} onClick={previousMonth}>◀&nbsp;</div>
                    <div className={"calendar_year"}>{getYear}년&nbsp;</div>
                    <div className={"calendar_month"}>{getMonth}월</div>
                    <div className={"next_month"} onClick={nextMonth}>&nbsp;▶</div>
                </div>
            </div>

            <div className="calendar_body">
                <div className={"calendar_history_body"}>
                    <div className={"calendar_frame_div"}>
                        <CalendarFrame/>
                    </div>

                    <div className={"calendar_history_items"} >
                        <HistoryItem
                            set_modify_history_modal={setModifyHistoryModal}
                            reload_account={selectMonthSituation}
                        />
                    </div>
                </div>

                <div className={"calendar_history_footer"}>
                    <div className={"month_outcome_wrapper"}>
                        <div className={"month_outcome_text"}>
                            월 지출
                        </div>
                        <div className={"month_outcome_amount"}>
                            {outcome}원
                        </div>
                    </div>

                    <div className={"month_income_wrapper"}>
                        <div className={"month_income_text"}>
                            월 수익
                        </div>
                        <div className={"month_income_amount"}>
                            {income}원
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Calendar;
