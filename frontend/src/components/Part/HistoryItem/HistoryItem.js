import React, {useState} from 'react';
import './HistoryItem.scss';

import { UserStore } from "UserStore/UserStore"

import API_history from 'api/account/history/history';

import utils from "utils/utils";

let page = 1;

function Index(props) {
    let setModifyHistoryModal = props.set_modify_history_modal;
    let typeInitialize = props.type_initialize;
    let paging_check = true;

    let [ getHistoryItem, setHistoryItem ] = useState([]);
    let [ getLast, setLast ] = useState(undefined);

    useState(() => {
        selectHistoryList()
    }, [ ]);

    UserStore.historyReload = selectHistoryList;

    if(getHistoryItem.length === 0) return null;

    function scrollCheck (e) {
        let parent = e.currentTarget;
        if(parent === undefined) return;

        let parent_rect = parent.getBoundingClientRect();

        let target = e.currentTarget.children[0];

        if(target === undefined) return;

        let target_rect = target.getBoundingClientRect();

        let window_Y = window.pageYOffset;

        let parent_top = parent_rect.top + window_Y;
        let wrapper_height = target_rect.height * e.currentTarget.children.length;

        let target_bottom = target_rect.bottom + window_Y;

        let scroll_position = wrapper_height+ target_bottom-parent_top-parent_rect.height;

        if(scroll_position < wrapper_height*0.1 && paging_check){
            if(page >= getLast) return;

            UserStore.historyReset = false;
            page = page + 1;

            selectHistoryList()

            paging_check = false;
        }

        // 페이징이 연속으로 여러번 되는거 방지
        if(scroll_position >= parent_rect.height*0.8) paging_check = true;
    }

    function openModifyModal (item) {
        setModifyHistoryModal(false);
        UserStore.setType(item.type);
        UserStore.setHistoryItem(item);
        UserStore.originalType = item.type;

        UserStore.setCategory(item.category_idx);

        utils.disableScroll();
    }

    async function selectHistoryList () {
        let params = { account_idx: UserStore.account_idx };
        paging_check = false;

        if(UserStore.historyReset){
            page = 1;
        }

        if(typeInitialize){
            UserStore.getType = null;
        }

        let result = await API_history.selectList({
            account_idx: params.account_idx,
            page,
            time: UserStore.timeData,
            year: UserStore.getYear,
            month: UserStore.getMonth,
            category: UserStore.getCategory,
            type: UserStore.getType
        });

        if(result.status !== 200){
            alert(result.data.message);
            window.location = '/';
            return;
        }

        let { items, last } = result.data;

        if(UserStore.historyReset){
            getHistoryItem = [];
        }

        items = getHistoryItem.concat(items);
        items = [...new Set(items.map(JSON.stringify))].map(JSON.parse);

        setHistoryItem(items);
        setLast(last);
    }

    return (
        <div className={"history_item_wrapper"} onScroll={scrollCheck.bind(null)}>
            {
                getHistoryItem.map(item =>
                    <div key={item.idx} className={"account_history_item"}
                         onClick={() => openModifyModal(item)}>

                        <div className={"account_history_data_wrapper"}>
                            <div className={"account_history_category"}>
                                { item.category_name }
                            </div>

                            <div className={"account_history_amount"}>
                                <div className={"amount_" + (item.type === 0 ? 'minus' : 'plus')}>
                                    { utils.commaParser(item.amount, item.type) }
                                </div>
                            </div>
                        </div>
                        
                        <div className={"account_history_content_wrapper"}>
                            <div className={"account_history_content"}>
                                { item.content }
                            </div>
                        </div>

                    </div>
                )
            }
        </div>

    );
}





export default Index;
