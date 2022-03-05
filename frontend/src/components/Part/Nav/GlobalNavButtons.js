import React  from 'react';
import './GlobalNavButtons.scss';


function GlobalNavButtons() {

    return (
        <div className={"nav_footer_wrapper"}>
            <div className={"nav_button_bottom"} onClick={goAccount}>
                가계부 목록
            </div>
            <div className={"nav_button_bottom"} onClick={goLotto}>
                로또
            </div>
            <div className={"nav_button_bottom"} onClick={goSale}>
                할인정보설정
            </div>
            <div className={"nav_button_bottom"} onClick={goMyPage}>
                마이페이지
            </div>
            <div className={"nav_button_bottom"} onClick={logOut}>
                로그아웃
            </div>
        </div>
    );
}


function goMyPage () {
    window.location = '/member/my_page';
}

function logOut () {
    sessionStorage.removeItem('x-token');
    localStorage.removeItem('x-token');
    window.location = '/';
}

function goAccount () {
    window.location = '/member/account';
}

function goLotto () {
    window.location = '/lotto';
}

function goSale () {
    window.location = '/member/sale';
}


export default GlobalNavButtons;
