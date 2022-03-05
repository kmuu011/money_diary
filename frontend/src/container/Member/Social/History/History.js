import React, { useState } from 'react';
import './History.scss';
import NavButton from 'components/Part/Nav/NavButton';
import GlobalNav from "components/Nav/GlobalNav";

import PostAddModal from "components/Modal/Social/PostAddModal";

import { UserStore } from "UserStore/UserStore";

import Button from "components/Button/Button";

import searchButton from 'static/img/button/search/search.svg';
import sendButton from 'static/img/button/send.svg';
import photoButton from 'static/img/button/photo.svg';
import postAddButton from 'static/img/button/circle_add_button.svg';

function Index() {
    const [ hidden, setHidden ] = useState(true);
    const [ addPostHidden, setAddPostHidden ] = useState(false);

    function openNav () {
        setHidden(false);
        UserStore.nav_setter = setHidden;
    }

    function openAddPostModal () {
        setAddPostHidden(false);
    }
    
    return (
        <div className={"App_container_s_h"}>
            <GlobalNav hidden={hidden} />
            <NavButton action={() => openNav()}/>

            <PostAddModal hidden={addPostHidden} set_add_post_hidden={setAddPostHidden}/>

            <div className="s_h_search_wrapper">
                <div className="s_h_search_body">
                    <input id="keyword" type="text" placeholder={"검색"}/>
                </div>

                <img className="s_h_search_button" src={searchButton} alt={"검색버튼"}/>
            </div>

            <div className="s_h_add_wrapper" onClick={() => openAddPostModal()}>
                <div className={"s_h_add_area"}>
                    <img className="s_h_add_button" src={postAddButton} alt={"등록버튼"}/>
                </div>
            </div>

            <div className="s_h_item_wrapper">

                <div className="s_h_item">
                    <div className="s_h_user_info_area">
                        <div className="s_h_image_border">
                            <img className="s_h_profile_image" src="https://www.moneydiary.co.kr/imgs/profile/XN9PFCLSLVKPTLI5MW2CXGTY3YAL.jpg"
                            alt={"프로필사진"}/>
                        </div>
                        <div className="s_h_info_wrapper">
                            <div className="s_h_nickname">
                                닉네임
                            </div>
                            <div className="s_h_create_at">
                                30분전
                            </div>
                        </div>
                    </div>

                    <div className="s_h_content_area">
                        테스트 TEST
                    </div>

                    <div className="s_h_item_info">
                        <div className="s_h_good_cnt">
                            좋아요 100개
                        </div>
                        <div className="s_h_reply_cnt">
                            댓글 280개
                        </div>
                    </div>

                    <div className="s_h_reaction_area">
                        <div className="s_h_good_button">
                            <Button.button name="좋아요"/>
                        </div>
                        <div className="s_h_reply_button">
                            <Button.button name="댓글 달기"/>
                        </div>
                    </div>

                    <div className="s_h_reply_area">
                        <div className="s_h_reply_input_area">
                            <div className="s_h_reply_input">
                                <input id="reply_content" type="text" placeholder="댓글 입력"/>
                            </div>
                            <div className="s_h_reply_button_wrapper">
                                    <img className="photo_button" src={photoButton} alt={"사진 전송"}/>
                                    <img className="reply_send_button" src={sendButton} alt={"댓글 전송"}/>
                                <div className="s_h_photo_send_button">
                                </div>
                                <div className="s_h_reply_send_button">
                                </div>
                            </div>
                        </div>
                        <div className="s_h_reply_wrapper">
                            <div className="s_h_reply_item">

                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}




export default Index;
