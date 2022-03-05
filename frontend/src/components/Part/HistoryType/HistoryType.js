import React, {useEffect, useRef} from 'react';
import './HistoryType.scss';

import { UserStore } from "UserStore/UserStore";

function HistoryType(props) {
    let { setType, setCategory } = UserStore;
    let { reload } = props;
    const typeRef = useRef();

    useEffect(() => {
        activeCheck();
    }, []);

    function activeCheck () {
        let typeChildren = typeRef.current.children;
        let item = UserStore.getHistoryItem;

        if(item !== undefined) {
            let value = item.type;

            for (let i = 0; i < typeChildren.length; i++) {
                if (value === i) {
                    typeChildren[i].className = 'checked';
                    continue;
                }
                typeChildren[i].className = 'unchecked';
            }
            return;
        }

        typeChildren[0].className = 'checked';
    }

    function changeType (e){
        let typeChildren = typeRef.current.children;
        let type = e.id;
        let item = UserStore.getHistoryItem;
        let value = type === 'outcome' ? 0 : 1;

        if(item !== undefined){
            // item.type = value;
            item.category_idx = null;

            UserStore.setHistoryItem(item);
        }

        if(reload){
            UserStore.getCategory = null;
        }

        //차트에서 아래처럼 하지 않으면 지출 수입 왔다갔다 할때 한번에 안보임;
        UserStore.getType = value;
        setType(value);

        for(let i=0 ; i<typeChildren.length ; i++){
            if(value === i) {
                typeChildren[i].className = 'checked';
                continue;
            }
            typeChildren[i].className = 'unchecked';
        }

        if(reload){
            UserStore.pieChartReload();
            UserStore.historyReset = true;
            UserStore.historyReload();
        }

        setCategory(undefined);
    }


    return (
        <div className={"history_type"} ref={typeRef}>
            <div className={"unchecked"} id={"outcome"}
                 onClick={(e) => changeType(e.target)}
            >
                지출
            </div>
            <div className={"unchecked"} id={"income"}
                 onClick={(e) => changeType(e.target)}
            >
                수입
            </div>
        </div>
    );
}



export default HistoryType;
