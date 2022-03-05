import React  from 'react';
import './PostAddModal.scss';


import Button from "components/Button/Button";
import utils from "utils/utils";

import photoButton from 'static/img/button/photo.svg';

function PostAddModal(props) {
    if(props.hidden) return null;

    let set_add_post_hidden = props.set_add_post_hidden;
    
    function closeModal (e) {
        utils.enableScroll();

        if(e === undefined){
            set_add_post_hidden(true);
            return;
        }
        
        let target_class = e.target.getAttribute('class');

        if(target_class.indexOf('s_h_add_modal') !== -1){
            set_add_post_hidden(true);
            return;
        }

    }

    return (
        <div>
            <div className="s_h_add_modal modal_div"
                 onClick={(e) => closeModal(e)}
            >

                <div className="s_h_add_modal_body">
                    <div className="modal_body_title">
                        게시글 등록하기
                    </div>

                    <div className="add_user_info_area">
                        <div className="s_h_image_border">
                            <img className="s_h_profile_image" 
                                 src="https://www.moneydiary.co.kr/imgs/profile/XN9PFCLSLVKPTLI5MW2CXGTY3YAL.jpg"
                                 alt={"프로필이미지"}
                            />
                        </div>
                        <div className="s_h_info_wrapper">
                            <div className="s_h_nickname">
                                닉네임
                            </div>
                        </div>
                    </div>

                    <div className="add_content_input_area">
                        <textarea
                            // type="text"
                               className="add_content_textarea"
                               placeholder="게시글의 내용을 적어주세요."
                        />
                    </div>

                    <div className="add_content_other_area">
                        <img className="photo_button" src={photoButton} alt={"사진 전송"}/>
                    </div>

                    <div className="add_content_insert_area">
                        <div className="insert_button">
                            <Button.button name="등록하기"/>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}




export default PostAddModal;
