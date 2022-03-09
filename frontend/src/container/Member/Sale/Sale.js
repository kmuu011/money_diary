import React, {useEffect, useRef, useState} from 'react';
import './Sale.scss';
import NavButton from 'components/Part/Nav/NavButton';
import GlobalNav from "components/Nav/GlobalNav";

import HelpSaleModal from "components/Modal/Sale/Help/HelpSaleModal";

import API_sign from 'api/sign';
import API_saleKeyword from 'api/sale/keyword';

import { UserStore } from "UserStore/UserStore";

import deleteButton from "static/img/button/close/close_white_36dp_color_2.svg";

import Button from "components/Button/Button";

function Index() {
    const [ hidden, setHidden ] = useState(true);
    const [ showHelp, setShowHelp ] = useState(false);

    UserStore.showHelp = showHelp;
    UserStore.setShowHelp = setShowHelp;

    const keywordRef = useRef();

    const [ getKeyword, setKeyword ] = useState('');

    const [ getSaleKeywordCount, setSaleKeywordCount ] = useState(0);

    const [ getSaleKeywordList, setSaleKeywordList ] = useState([]);

    useEffect(() => {
        selectMember();
        selectKeyword()
    }, []);

    if(getSaleKeywordList === []) return;

    function onChange (e) {
        setKeyword(e.target.value);
    }

    function openNav () {
        setHidden(false);
        UserStore.nav_setter = setHidden;
    }

    async function selectMember () {
        let result = await API_sign.select_member();

        if(result.status !== 200){
            alert(result.data.message);
            return;
        }

        setSaleKeywordCount(result.data.max_sale_keyword_cnt);
    }

    async function selectKeyword () {
        let result = await API_saleKeyword.select();

        if(result.status !== 200){
            alert(result.data.message);
            return;
        }

        setSaleKeywordList(result.data.items);
    }

    async function insertKeyword () {
        if (getKeyword.length === 0 || getKeyword.toString().replace(/\s/g, '') === '') {
            alert('등록할 키워드를 입력해주세요.');
            keywordRef.current.focus();
            return;
        }

        let result = await API_saleKeyword.insert({keyword: getKeyword});

        if (result.status !== 200) {
            alert(result.data.message);
            return;
        }

        keywordRef.current.value = '';
        keywordRef.current.focus();

        selectKeyword();
    }

    async function deleteKeyword (keyword_idx) {
        let result = await API_saleKeyword.delete({keyword_idx});

        if(result.status !== 200){
            alert(result.data.message);
            return;
        }

        selectKeyword();
    }

    return (
        <div className={"App_container"}>
            <GlobalNav hidden={hidden} />

            <NavButton action={() => openNav()} show_help_button={true}/>
            <HelpSaleModal/>

            <div className="sale_keyword_page">
                <div className={"title"}>
                    할인정보설정
                </div>

                <form onSubmit={insertKeyword}>
                    <div className={'keyword_max_count'}>
                        <span className={"count"}>{getSaleKeywordList.length}/{getSaleKeywordCount}</span>
                        <input
                            ref={keywordRef}
                            type="text" id="keyword"
                            placeholder="키워드"
                            onChange={(e) => onChange(e)}
                            maxLength={20}
                        />
                    </div>

                    <div className={"keyword_button_body"}>
                        <Button.button name={"등록하기"} id={"insert_button"}
                                       action={() => insertKeyword()}/>
                    </div>
                </form>

                <div className={"keyword_list_body"}>
                    <div className={"keyword_list"}>
                        {
                            getSaleKeywordList.map(item =>
                                <div key={item.idx} className={"keyword_item"}>
                                    <div className={"keyword_name"}>
                                        {item.keyword}
                                    </div>
                                    <div className={"keyword_delete_button"}>
                                        <img className="delete_button" src={deleteButton} alt={"키워드삭제버튼"}
                                             onClick={() => deleteKeyword(item.idx)}/>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>


            </div>
        </div>
    );
}



export default Index;
