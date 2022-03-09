import React from 'react';
import './HelpSaleModal.scss';

import API_saleKeyword from 'api/sale/keyword';

import { UserStore } from "UserStore/UserStore";

import closeButton from "static/img/button/close/close_white_36dp_color_2.svg";

import Button from "components/Button/Button";

function HelpSaleModal() {
    const { showHelp, setShowHelp } = UserStore;

    function closeModal () {
        setShowHelp(false);
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
    
    return (
        <>
            {showHelp &&
            <div className={"modal_div"}>
                <div className={"help_sale"}>
                    <img className={"close_button"} onClick={closeModal}
                         src={closeButton} alt={"도움말 종료 버튼"}
                    />

                    <div className={"description"}>
                        <div className={"title"}>
                            할인정보설정이란?
                        </div>
                        등록한 키워드가 포함된 특가 정보를 이메일로 알려드리는 서비스 입니다.
                        <div><span className={"keyword"}> 펩시</span>를 등록해두면</div>
                        <div>&nbsp;</div>
                        <div className={"example_title"}>&lt;<span className={"keyword"}>펩시</span> 제로 콜라 355ml 24입&gt;</div>
                        <div className={"example_title"}>&lt;롯데칠성 <span className={"keyword"}>펩시</span>제로 라임향 240ml 24입&gt;</div>
                        <div>&nbsp;</div>
                        위와 같은 <span className={"keyword"}>펩시</span>키워드가 포함된 특가정보를 메일로 즉시 받아볼 수 있습니다.
                    </div>

                    <div className={"test_button"}>
                        <Button.button
                            name={"테스트 메일 발송"} id={"insert_button"}
                            action={() => sendTestMail()}
                        />
                    </div>

                </div>
            </div>
            }
        </>
    );
}



export default HelpSaleModal;
