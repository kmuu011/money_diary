import React, {useState} from 'react';
import './Chart.scss';

import PieChart from "components/Part/Chart/PieChart";

import NavButton from 'components/Part/Nav/NavButton';
import HistoryNav from "components/Nav/HistoryNav";

import HistoryAddModal from "components/Modal/Account/History/HistoryAddModal";
import HistoryModifyModal from "components/Modal/Account/History/HistoryModifyModal";

import Button from "components/Button/Button";

import {UserStore} from "UserStore/UserStore"

import utils from "utils/utils";
import HistoryType from "components/Part/HistoryType/HistoryType";
import HistoryDateModal from "components/Modal/Account/History/HistoryDateModal";
import HistoryItem from 'components/Part/HistoryItem/HistoryItem';
import CategoryModifyModal from "components/Modal/Account/History/Category/CategoryModifyModal";
import editButton from "../../../../static/img/button/edit/edit_white_36dp.svg";

function Chart({match}) {
    let params = match.params;
    let {account_idx} = params;

    const [getPage, setPage] = useState(1);

    const [hidden, setHidden] = useState(true);

    const [addHistoryModal, setAddHistoryModal] = useState(true);

    const [modifyHistoryModal, setModifyHistoryModal] = useState(true);

    const [modifyCategoryModal, setModifyCategoryModal] = useState(true);

    const [historyDateModal, setHistoryDateModal] = useState(true);

    const [getHistoryItem, setHistoryItem] = useState(undefined);
    const [getType, setType] = useState(0);
    const [getCategory, setCategory] = useState(undefined);

    const [getYear, setYear] = useState(new Date().getFullYear());
    const [getMonth, setMonth] = useState(new Date().getMonth() + 1);

    const [getTotalAmountPie, setTotalAmountPie] = useState(0);

    const [getTypeAmount, setTypeAmount] = useState(0);

    UserStore.categoryReset = true;

    UserStore.account_idx = account_idx;

    UserStore.getHistoryDateModal = historyDateModal;
    UserStore.setHistoryDateModal = setHistoryDateModal;

    UserStore.getModifyCategoryModal = modifyCategoryModal;
    UserStore.setModifyCategoryModal = setModifyCategoryModal;

    UserStore.getTotalAmountPie = getTotalAmountPie;
    UserStore.setTotalAmountPie = setTotalAmountPie;

    UserStore.getPage = getPage;
    UserStore.setPage = setPage;

    UserStore.getTypeAmount = getTypeAmount;
    UserStore.setTypeAmount = setTypeAmount;

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

    function openNav() {
        setHidden(false);
        UserStore.nav_setter = setHidden;
    }

    function openDateModal() {
        UserStore.setHistoryDateModal(false);
        utils.disableScroll();
    }

    function openModifyCategoryModal() {
        UserStore.setModifyCategoryModal(false);
        utils.disableScroll();
    }


    return (
        <div className={"App_container_chart"}>
            <HistoryNav hidden={hidden}/>
            <HistoryAddModal hidden={addHistoryModal}
                             set_add_history_modal={setAddHistoryModal}
            />
            <HistoryModifyModal hidden={modifyHistoryModal}
                                set_modify_history_modal={setModifyHistoryModal}
            />
            <HistoryDateModal hidden={historyDateModal}/>
            <CategoryModifyModal hidden={modifyCategoryModal}/>

            <NavButton action={() => openNav()}/>

            <div className={"chart_history_type"}>
                <HistoryType reload={true}/>
            </div>

            <div className={"chart_date_selector"}>
                <Button.button action={openDateModal}
                               name={UserStore.getMonth !== undefined ?
                                   UserStore.getYear + '년 ' + UserStore.getMonth + '월' :
                                   UserStore.getYear + '년'
                               }/>
            </div>

            <div className="chart_body">
                
                <div className={"chart_history_header"}>
                    <div className={"chart_amount_wrapper"}>
                        <div className={"chart_total_amount"}>
                            {'총 금액 : '}
                            {UserStore.getTotalAmountPie}
                        </div>
                        <div className={"chart_type_amount"}>
                            {'금액 : '}
                            {UserStore.getTypeAmount}
                        </div>
                    </div>

                    <div className={"chart_modify_category"}>
                        <img className={"edit_button"} src={editButton} alt={"색상편집버튼"}
                             onClick={() => openModifyCategoryModal()}/>
                    </div>
                </div>

                <div className={"chart_history_body"}>
                    <PieChart/>
                </div>

                <div className={"chart_history_items"}>
                    <HistoryItem
                        set_modify_history_modal={setModifyHistoryModal}
                    />
                </div>

            </div>

        </div>
    );
}



export default Chart;
