import React, {useEffect, useRef, useState} from 'react';
import './Sale.scss';
import NavButton from 'components/Part/Nav/NavButton';
import GlobalNav from "components/Nav/GlobalNav";

import API_sign from 'api/sign';
import API_saleKeyword from 'api/sale/keyword';

import { UserStore } from "UserStore/UserStore";

import deleteButton from "static/img/button/close/close_white_36dp.svg";

import Button from "components/Button/Button";

function Index() {
    const [ hidden, setHidden ] = useState(true);
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
        if(getKeyword.length === 0 || getKeyword.toString().replace(/\s/g, '') === ''){
            alert('등록할 키워드를 입력해주세요.');
            keywordRef.current.focus();
            return;
        }

        let result = await API_saleKeyword.insert({keyword: getKeyword});

        if(result.status !== 200){
            alert(result.data.message);
            return;
        }

        keywordRef.current.value = '';
        keywordRef.current.focus();

        selectKeyword();
    }

    async function sendTestMail () {
        let result = await API_saleKeyword.sendTestMail();

        if(result.status !== 200){
            alert(result.data.message);
            return;
        }

        alert('이메일 발송이 완료되었습니다.' +
            '\n메일이 확인되지 않을경우 스팸 메일함을 확인해보시거나' +
            '\n이메일이 올바른지 확인해주세요.');
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

            <NavButton action={() => openNav()}/>

            <div className="sale_keyword_page">
                <div className={"title"}>
                    할인정보설정
                </div>

                <div className={"description"}>
                    ※등록한 키워드가 포함된 특가 정보를 이메일로 알려드려요.
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
                        <Button.button name={"테스트 메일 발송"} id={"insert_button"}
                                       action={() => sendTestMail()}/>
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
