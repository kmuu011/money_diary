import React from 'react';
import { BrowserRouter as Router,
    Route, Switch } from "react-router-dom";

import Main from "./Main/Main";
import SignUp from "./SignUp/SignUp";
import LoadingKakao from "./Member/Auth/Kakao";

import Account from "./Member/Account/Account";
import History from "./Member/Account/History/History";
import Calendar from "./Member/Account/History/Calendar";
import Chart from "./Member/Account/History/Chart";

import SocialHistory from "./Member/Social/History/History";

import MyPage from "./Member/MyPage/MyPage";

import Lotto from "./Lotto/Lotto";

import Sale from "./Member/Sale/Sale";

import Banking from "./Banking/Banking";

import NotFound from "components/NotFound/NotFound.js";

const location = {
    home : "/",
    sign_up : "/sign_up",
    loading_kakao : "/auth/kakao",

    account : "/member/account",
    history : "/member/account/:account_idx/history",
    calendar : "/member/account/:account_idx/history/calendar",
    chart : "/member/account/:account_idx/history/chart",

    social_history : "/social/history",

    my_page : "/member/my_page",

    lotto : "/lotto",

    sale : "/member/sale",

    banking : "/banking",

    not_found : "/*",
};

function router() {
    return (
        <div className="App-page">
            <Router>
                <Switch>
                    <Route exact path={location.home} component={Main}/>
                    <Route exact path={location.sign_up} component={SignUp}/>
                    <Route exact path={location.loading_kakao} component={LoadingKakao}/>

                    <Route exact path={location.account} component={Account}/>
                    <Route exact path={location.history} component={History}/>
                    <Route exact path={location.calendar} component={Calendar}/>
                    <Route exact path={location.chart} component={Chart}/>

                    <Route exact path={location.social_history} component={SocialHistory}/>

                    <Route exact path={location.my_page} component={MyPage}/>
                    <Route exact path={location.lotto} component={Lotto}/>
                    <Route exact path={location.sale} component={Sale}/>
                    <Route exact path={location.banking} component={Banking}/>

                    <Route exact path={location.not_found} component={NotFound}/>
                </Switch>
            </Router>
        </div>
    );
}


export default router;
