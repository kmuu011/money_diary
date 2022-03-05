import React from 'react';
import ReactDOM from 'react-dom';
import './reset.scss';
import './index.scss';
import App from './container/App';

global.path = __dirname;

ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById('root')
);

const ignore_url = /^sign_up$|^lotto$|^api\b|^auth\b/;

(function(){
    let url = document.location.pathname.toLocaleLowerCase().substring(1);
    let token = localStorage.getItem('x-token');

    if(url === ''){
        if(token !== null){
            window.location = '/member/account';
        }else{
            localStorage.removeItem('x-token');
        }
    }else if(!ignore_url.test(url)){
        if(token === null){
            localStorage.removeItem('x-token');
            window.location = '/';
            alert('로그인 정보가 존재하지 않습니다. 다시 로그인 해주세요.');
        }
    }


}());
