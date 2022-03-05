import React, { useState } from 'react';
import './Lotto.scss';
import Button from "components/Button/Button";
import NavButton from 'components/Part/Nav/NavButton';
import LottoNav from "components/Nav/LottoNav";


import { UserStore } from "UserStore/UserStore"

function Index() {
    const [ hidden, setHidden ] = useState(true);

    const [ numbers0, setNumbers0 ] = useState(['?', '?', '?', '?', '?', '?']);
    const [ numbers1, setNumbers1 ] = useState(['?', '?', '?', '?', '?', '?']);
    const [ numbers2, setNumbers2 ] = useState(['?', '?', '?', '?', '?', '?']);
    const [ numbers3, setNumbers3 ] = useState(['?', '?', '?', '?', '?', '?']);
    const [ numbers4, setNumbers4 ] = useState(['?', '?', '?', '?', '?', '?']);

    function lotto_creator () {
        let number_list = [];

        Loop1:
            for(let i=0 ; i<6 ; i++){
                let num = Math.ceil(Math.random()*45);

                for(let v of number_list){
                    if(num === v){
                        i--;
                        continue Loop1;
                    }
                }

                number_list.push(num);
            }

        for(let i=0 ; i<number_list.length ; i++){
            for(let j=i+1 ; j<number_list.length ; j++){
                if(number_list[i] > number_list[j]){
                    let temp = number_list[i];
                    number_list[i] = number_list[j];
                    number_list[j] = temp;
                }
            }
        }

        return number_list;
    }

    function openNav () {
        setHidden(false);
        UserStore.nav_setter = setHidden;
    }

    function create_number (setNumbers0, setNumbers1, setNumbers2, setNumbers3, setNumbers4) {
        setNumbers0(lotto_creator());
        setNumbers1(lotto_creator());
        setNumbers2(lotto_creator());
        setNumbers3(lotto_creator());
        setNumbers4(lotto_creator());
    }

    return (
        <div className={"App_container"}>
            <LottoNav hidden={hidden} />
            <NavButton action={() => openNav()}/>

            <div className={"lotto_title"}>
                로또 번호 생성기
            </div>

            <div className="lotto_page">
                <div className={"lotto_body"}>
                    <div className={"lotto_number_wrapper"}>
                        {
                            numbers0.map((item, key) =>
                                <div className={"lotto_number"} key={key}>
                                    <div className={"lotto_number_text"} name={"lotto_number"}>
                                        { item }
                                    </div>
                                </div>
                            )
                        }

                    </div>
                </div>
                <div className={"lotto_body"}>
                    <div className={"lotto_number_wrapper"}>
                        {
                            numbers1.map((item, key) =>
                                <div className={"lotto_number"} key={key}>
                                    <div className={"lotto_number_text"} name={"lotto_number"}>
                                        { item }
                                    </div>
                                </div>
                            )
                        }

                    </div>
                </div>

                <div className={"lotto_body"}>
                    <div className={"lotto_number_wrapper"}>
                        {
                            numbers2.map((item, key) =>
                                <div className={"lotto_number"} key={key}>
                                    <div className={"lotto_number_text"} name={"lotto_number"}>
                                        { item }
                                    </div>
                                </div>
                            )
                        }

                    </div>
                </div>

                <div className={"lotto_body"}>
                    <div className={"lotto_number_wrapper"}>
                        {
                            numbers3.map((item, key) =>
                                <div className={"lotto_number"} key={key}>
                                    <div className={"lotto_number_text"} name={"lotto_number"}>
                                        { item }
                                    </div>
                                </div>
                            )
                        }

                    </div>
                </div>

                <div className={"lotto_body"}>
                    <div className={"lotto_number_wrapper"}>
                        {
                            numbers4.map((item, key) =>
                                <div className={"lotto_number"} key={key}>
                                    <div className={"lotto_number_text"} name={"lotto_number"}>
                                        { item }
                                    </div>
                                </div>
                            )
                        }

                    </div>
                </div>

                <div className={"lotto_create_button"}>
                    <Button.button name={"로또 번호 생성"} action={() => create_number(
                        setNumbers0, setNumbers1, setNumbers2, setNumbers3, setNumbers4,
                        )}/>
                </div>

            </div>

        </div>
    );
}

export default Index;
