import React, {useState, useRef} from 'react';
import './CategoryModifyModal.scss';
import Button from "components/Button/Button";

import HistoryCategory from "components/Part/HistoryCategory/HistoryCategory";

import API_history from 'api/account/history/history';
import utils from "utils/utils";
import { UserStore } from "UserStore/UserStore";
import HistoryType from "components/Part/HistoryType/HistoryType";


function CategoryModifyModal(props) {
    let [getColor, setColor] = useState('#000000');
    const colorRef = useRef();
    UserStore.getColor = getColor;
    UserStore.setColor = setColor;

    if(props.hidden) return null;

    function typeColorSetter (color) {
        colorRef.current.value = color;
        UserStore.getColor = color;
        UserStore.setColor(color);
    }
    
    UserStore.typeColorSetter = typeColorSetter;

    function closeModal (e) {
        if(e === undefined){
            UserStore.setModifyCategoryModal(true);
            utils.enableScroll();
            UserStore.setHistoryItem(undefined);
            return;
        }

        let target_class = e.target.getAttribute('class');

        if(target_class.indexOf('category_modify_modal') !== -1){
            UserStore.setModifyCategoryModal(true);
            utils.enableScroll();
            UserStore.setHistoryItem(undefined);
            return;
        }

    }

    async function updateCategory (){
        if(getColor === '' || getColor.toString().replace(/\s/g, '') === ''){
            alert('색상을 선택해주세요.');
            colorRef.current.focus();
            return;
        }

        let params = {
            color: getColor.replace('#', ''),
            category_idx: UserStore.getCategory,
            account_idx: UserStore.account_idx
        };

        if(UserStore.getCategory === undefined){
            alert('수정할 유형을 선택해주세요.');
            return;
        }

        let result = await API_history.updateCategory(params);

        if(result.status !== 200){
            alert(result.data.message);
            return
        }

        UserStore.setCategory(undefined);

        UserStore.categoryReload();
        UserStore.resetCategoryItem();
        UserStore.pieChartReload();
    }


    return (
        <div>
            <div className={"category_modify_modal modal_div"}
                 onClick={(e) => closeModal(e)}>
                <div className={"category_modal_body"}>
                    <div className={"history_option_body"}>
                        <HistoryType />

                        <div className={"history_category_area"}>
                            <HistoryCategory
                                type={UserStore.getType}
                                set_category={UserStore.setCategory}
                            />
                        </div>
                    </div>

                    <div className={"modal_input_wrapper"}>
                        <div className={"modal_input_div"}>
                            <input type={"color"} id={"category_color"}
                                   className={"modal_input"}
                                   defaultValue={UserStore.getColor}
                                   onChange={(e) =>
                                   setColor(e.target.value)}
                                   ref={colorRef}
                            />
                        </div>
                    </div>

                    <div className={"history_modal_footer"}>
                        <Button.button name={"수정하기"} id={"update_button"}
                                       action={() => updateCategory()}/>
                        <Button.button name={"취소"} action={() => closeModal()}/>
                    </div>
                </div>
            </div>
        </div>
    );
}



export default CategoryModifyModal;
