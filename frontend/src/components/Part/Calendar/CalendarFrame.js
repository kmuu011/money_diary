import React, {useCallback, useEffect, useRef, useState} from 'react';
import './CalendarFrame.scss';
import {UserStore} from "UserStore/UserStore";
import utils from "utils/utils";
import API_history from 'api/account/history/history';

function CalendarFrame() {
    let [ getCalendarMatrix, setCalendarMatrix ] = useState(undefined);

    const calendarRef = useRef();

    let {
        previousMonthAction, nextMonthAction,
        account_idx
    } = UserStore;

    let calendarCreator  = useCallback(async () => {
        let year = UserStore.getYear;
        let month = UserStore.getMonth;
        let second = new Date(month + '/01/' + year).getTime();
        let calendar_matrix = [[]];
        let this_time = new Date(second);
        let this_day = this_time.getDay();

        let today = new Date();

        let week_cnt = 0;
        let one_day = 60 * 60 * 24 * 1000;

        let checker = true;

        for(let i=this_day ; i>0 ; i--){
            let time = new Date(second - one_day*i);
            let td_class = 'calendar_date_td disable';

            if(time.getFullYear() === year && time.getMonth()+1 === month && time.getDate() === today.getDate()){
                td_class += ' today';
            }

            calendar_matrix[0].push({
                year: time.getFullYear(),
                month: time.getMonth()+1,
                date: time.getDate(),
                day: time.getDay(),
                td_class
            });
        }

        let cnt = 0;

        while (checker) {
            let time = new Date(second + one_day * cnt);

            let time_year = time.getFullYear();
            let time_month = time.getMonth() + 1;
            let time_date = time.getDate();
            let time_day = time.getDay();
            let td_class = 'calendar_date_td';
            let id = "unchecked";

            let tomorrow_month = new Date(second + (one_day * cnt) + one_day).getMonth()+1;

            if(month !== tomorrow_month && time_day === 6){
                checker = false;
            }

            if(time_year === year && time_month === today.getMonth()+1 && time_date === today.getDate()){
                td_class += ' today';
            }

            if(time_month === month){
                td_class += ' active';
            }else{
                td_class += ' disable';
            }

            calendar_matrix[week_cnt].push({
                year: time_year,
                month: time_month,
                date: time_date,
                day: time_day,
                td_class,
                id
            });

            if(month === tomorrow_month && time_day === 6){
                week_cnt++;
                calendar_matrix[week_cnt] = [];
            }

            cnt++;

            if(cnt > 50){
                break;
            }
        }

        let startAt = calendar_matrix[0][0];
        let endAt = calendar_matrix[calendar_matrix.length-1][calendar_matrix[calendar_matrix.length-1].length-1];

        startAt = startAt.year + '' + utils.leftPadding(startAt.month, 2, '0') + utils.leftPadding(startAt.date, 2, '0');
        endAt = endAt.year + '' + utils.leftPadding(endAt.month, 2, '0') + utils.leftPadding(endAt.date, 2, '0');

        let dailySituation = await API_history.selectDailySituation({
            account_idx,
            start: startAt,
            end: endAt
        });

        if(dailySituation.status !== 200){
            alert(dailySituation.data.message);
            return;
        }

        dailySituation = dailySituation.data;

        for(let i=0 ; i<calendar_matrix.length ; i++){
            for(let j=0 ; j<calendar_matrix[i].length ; j++){
                let data = calendar_matrix[i][j];
                let day = data.year + utils.leftPadding(data.month, 2, '0') + utils.leftPadding(data.date, 2 ,'0');

                if(dailySituation[day] !== undefined) {
                    calendar_matrix[i][j].income = utils.commaParser(dailySituation[day].income);
                    calendar_matrix[i][j].outcome = utils.commaParser(dailySituation[day].outcome);
                }
            }
        }

        setCalendarMatrix(calendar_matrix);
    },[account_idx]);


    useEffect(() => {
       calendarCreator()
    }, [calendarCreator]);

    UserStore.calendarReload = calendarCreator;
    UserStore.resetCalendarChecked = resetCalendarChecked;

    if (getCalendarMatrix === undefined) return null;

    let start_x, end_x;

    function dragAction (action, e) {
        let element_width = e.currentTarget.getBoundingClientRect().width;
        let touch = e.changedTouches[0];

        if(action === 'start') {
            start_x = touch.clientX;
        }else{
            end_x = touch.clientX;

            let touch_action_value = start_x - end_x + element_width/4;

            if(touch_action_value <= 0){
                previousMonthAction();
            }

            if(touch_action_value >= element_width/2){
                nextMonthAction();
            }
        }
    }

    function selectOne (td, e) {
        for(let week of calendarRef.current.children){
            for(let day of week.children){
                day.id = "unchecked"
            }
        }

        let target = e.currentTarget;

        target.id = "checked";

        UserStore.timeData = td;
        UserStore.historyReset = true;
        UserStore.historyReload();
    }

    function resetCalendarChecked () {
        for(let week of calendarRef.current.children){
            for(let day of week.children){
                day.id = "unchecked"
            }
        }
    }

    return (
        <div className={"calendar_frame_table"}>
            <div className={"calendar_week"}>
                <div className={"calendar_day"}>
                    일
                </div>
                <div className={"calendar_day"}>
                    월
                </div>
                <div className={"calendar_day"}>
                    화
                </div>
                <div className={"calendar_day"}>
                    수
                </div>
                <div className={"calendar_day"}>
                    목
                </div>
                <div className={"calendar_day"}>
                    금
                </div>
                <div className={"calendar_day"}>
                    토
                </div>
            </div>

            <div className={"calendar_frame_body"} onTouchStart={dragAction.bind(null, 'start')}
                 onTouchEnd={dragAction.bind(null, 'end')}
                 ref={calendarRef}
            >
                {
                    getCalendarMatrix.map((tr, trIdx) =>
                        <div key={trIdx} className={"calendar_row"}>
                            {
                                tr.map((td, tdIdx) =>
                                    <div key={tdIdx} className={td.td_class}
                                         onClick={selectOne.bind(null, td)}
                                         id={td.id}
                                    >
                                        <div className={"calendar_data_wrapper"}>
                                            <div className={"calendar_data calendar_date_text"}>
                                                {td.date}
                                            </div>
                                            <div className={"calendar_data amount_income_text"}>
                                                {td.income}
                                            </div>
                                            <div className={"calendar_data amount_outcome_text"}>
                                                {td.outcome}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </div>
        </div>
    );

}


export default CalendarFrame;
