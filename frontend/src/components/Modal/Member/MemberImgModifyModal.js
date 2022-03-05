import React, {useEffect, useState} from 'react';
import './MemberImgModifyModal.scss';

import utils from "utils/utils";
import Button from "components/Button/Button";
import API_sign from "api/sign";
import NoImage from "static/img/profile/nb_NoImage.svg";

function MemberImgModifyModal(props) {
    let setImgModifyModal = props.set_img_modify_modal;
    let member = props.member;
    let memberReload = props.member_reload;

    const [ getSrc, setSrc ] = useState();
    const [ getImg, setImg ] = useState();

    useEffect(() => {
        setImg(null);
        setSrc(member.profile_img_key === null ? NoImage : utils.getLocation() + member.profile_img_key);
    },[member.profile_img_key]);

    if(props.hidden) return null;

    function closeModal (e) {
        utils.enableScroll();

        if(e === undefined){
            setImgModifyModal(true);
            return;
        }

        let target_class = e?.target?.getAttribute('class');

        if(target_class.indexOf('member_modify_modal') !== -1){
            setImgModifyModal(true);
            return;
        }
    }

    async function modifyMember () {
        let params = new FormData();

        params.append('file', getImg);

        let result = await API_sign.update_profile_img(params);

        if(result.status !== 200){
            alert(result.data.message);
            return;
        }

        if(result.data) {
            alert('수정이 완료되었습니다.');
            setImgModifyModal(true);
            memberReload();
        }
    }

    function loadImage (image){
        if(image.length !== 0) {
            setSrc(URL.createObjectURL(image[0]));
            setImg(image[0]);
        }else{
            setSrc(NoImage);
        }
    }

    return (
        <div>
            <div className="member_modify_modal modal_div"
                 onClick={closeModal.bind(null)}
            >

                <div className={"modify_img_body"}>
                    <div className={"modify_data_wrapper"}>
                        <div className={"profile_img_wrapper"}>
                            <div className={"profile_img_border"}>
                                <img className={"profile_image"}
                                     id={"preview_img"}
                                     src={getSrc}
                                     alt={"profile_image"}

                                />
                            </div>
                        </div>

                        <div className={"modify_data"}>
                            <input type="file" className={"data_img"}
                                   id={"img"}
                                   onChange={(e) => loadImage(e.target.files)}
                            />
                        </div>

                        <div className={"modify_button_wrapper"}>
                            <Button.button name={"수정하기"} id={"update_button"}
                                           action={() => modifyMember()}/>
                            <Button.button name={"취소"} action={() => closeModal()}/>

                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}


export default MemberImgModifyModal;
