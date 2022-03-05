import React, {useCallback, useEffect, useRef, useState} from 'react';
import './HistoryCategory.scss';

import API_history from 'api/account/history/history';
import { UserStore } from 'UserStore/UserStore';

function HistoryType(props) {
    let { account_idx } = UserStore;
    let category_idx = props.category_idx;
    let categoryWrapperRef = useRef();

    let type = UserStore.getType;
    let setCategory = props.set_category;

    let [getCategoryList, setCategoryList] = useState([]);

    let selectHistoryCategory = useCallback(async () => {
        let params = {type, account_idx};
        let result = await API_history.selectCategory(params);

        if(result.status !== 200){
            alert(result.data.message);
            return;
        }

        setCategoryList(result.data);
    }, [type, account_idx]);

    useEffect(() => {
        selectHistoryCategory()
    }, [ selectHistoryCategory ]);


    function selectCategoryIdx (item, e) {
        let target = e.currentTarget;

        resetCategoryItem();

        target.id = 'checked';

        setCategory(item.idx);
        UserStore.typeColorSetter('#'+item.color);
    }

    function resetCategoryItem () {
        let items = categoryWrapperRef.current.children;

        for(let item of items) {
            item.id = '';
        }
    }

    UserStore.resetCategoryItem = resetCategoryItem;
    UserStore.categoryReload = selectHistoryCategory;

    if(getCategoryList === undefined) return null;


    return (
        <div className={"history_category_wrapper"} ref={categoryWrapperRef}>
            {
                getCategoryList.map(item =>
                    <div key={item.idx} className={"history_category_items"}
                         id={category_idx === item.idx ? "checked" : ""}
                         onClick={selectCategoryIdx.bind(null, item)}>
                        <div className={"history_category_name"}>
                            {item.name}
                        </div>
                    </div>
                )
            }
        </div>
    );
}





export default HistoryType;
