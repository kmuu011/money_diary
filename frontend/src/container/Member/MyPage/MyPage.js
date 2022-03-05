import React, {useEffect, useState} from 'react';
import './MyPage.scss';
import NavButton from 'components/Part/Nav/NavButton';
import GlobalNav from "components/Nav/GlobalNav";

import API_sign from 'api/sign';

import { UserStore } from "UserStore/UserStore";

import NoImage from "static/img/profile/nb_NoImage.svg";
import MemberModifyModal from "components/Modal/Member/MemberModifyModal";
import Button from "components/Button/Button";
import utils from "utils/utils";
import MemberImgModifyModal from "components/Modal/Member/MemberImgModifyModal";

function Index() {
    const [ hidden, setHidden ] = useState(true);

    const [ getModifyModal, setModifyModal ] = useState(true);

    const [ getImgModifyModal, setImgModifyModal ] = useState(true);

    const [ getMemberInfo, setMemberInfo ] = useState(undefined);

    useEffect(() => {
        selectMember();
    }, []);

    if(getMemberInfo === undefined) return null;

    function openNav () {
        setHidden(false);
        UserStore.nav_setter = setHidden;
    }

    function openModifyModal () {
        setModifyModal(false);
        utils.disableScroll();
    }

    function openImgModifyModal () {
        setImgModifyModal(false);
        utils.disableScroll();
    }

    async function selectMember () {
        let result = await API_sign.select_member();

        if(result.status !== 200){
            alert(result.data.message);
            return;
        }

        setMemberInfo(result.data);
    }

    return (
        <div className={"App_container"}>
            <GlobalNav hidden={hidden} />
            <MemberModifyModal
                hidden={getModifyModal}
                set_modify_modal={setModifyModal}
                member={getMemberInfo}
                member_reload={selectMember}
            />
            <MemberImgModifyModal
                hidden={getImgModifyModal}
                set_img_modify_modal={setImgModifyModal}
                member={getMemberInfo}
                member_reload={selectMember}
            />

            <NavButton action={() => openNav()}/>

            <div className={'my_page_title'}>
                마이페이지
            </div>

            <div className="my_page">
                <div className={"profile_img_wrapper"}>
                    <div className={"profile_img_border"}>
                        <img className={"profile_image"} src={getMemberInfo.profile_img_key === null ? NoImage : utils.getLocation() + getMemberInfo.profile_img_key}
                             alt={"profile_image"}
                             onClick={() => openImgModifyModal()}
                        />
                    </div>
                </div>

                <div className={"profile_data_wrapper"}>
                    <div className={"profile_data_body"}>
                        <div className={"profile_data"}>
                            <div className={"profile_description"}>
                                아이디
                            </div>
                            <div className={"profile_value"}>
                                {getMemberInfo.id}
                            </div>
                        </div>
                        <div className={"profile_data"}>
                            <div className={"profile_description"}>
                                닉네임
                            </div>
                            <div className={"profile_value"}>
                                {getMemberInfo.nickname}
                            </div>
                        </div>
                        <div className={"profile_data"}>
                            <div className={"profile_description"}>
                                이메일
                            </div>
                            <div className={"profile_value"}>
                                {getMemberInfo.email}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className={"profile_button_body"}>
                    <Button.button name={"수정하기"} id={"update_button"}
                                   action={() => openModifyModal()}/>
                </div>
            </div>
        </div>
    );
}



export default Index;
