class Message extends Error {
    constructor(status, code, message) {
        super(message);

        this.status = status;
        this.code = code;
        this.message = message;
    }

    toJSON() {
        return {
            status: this.status,
            code: this.code,
            message: this.message
        };
    }

    /**
     * Not Founds
     */
    static INVALID_PARAM(name) {
        return new Message(400, `invalid_parameter_${name}`, name + '을(를) 입력해주세요.');
    }

    static WRONG_PARAM(name) {
        return new Message(400, 'wrong_param_' + name, name + '을(를) 잘못 입력했습니다.');
    }

    static INCLUDE_BAN_KEYWORD(name) {
        return new Message(400, 'include_ban_keyword_' + name, name + '에 사용할 수 없는 값이 포함되어있습니다.');
    }

    static ALREADY_EXIST(name) {
        return new Message(400, 'already_exist_' + name, '이미 존재하는 ' + name + ' 입니다.');
    }

    static get WRONG_ID_OR_PASSWORD() {
        return new Message(400, 'wrong_id_or_password', '아이디 혹은 비밀번호가 일치하지 않습니다.');
    }

    static NOT_EXIST(name) {
        return new Message(400, 'not_exist_' + name, '존재하지 않는 ' + name + ' 입니다.');
    }

    static get EXPIRED_TOKEN() {
        return new Message(400, 'expired_token', '토큰이 만료되었습니다.');
    }

    static get CAN_NOT_ACTION_DEFAULT() {
        return new Message(400, 'can_not_action_default', '기본값은 삭제 또는 변경할 수 없습니다.');
    }

    static DETAIL_ERROR(message) {
        return new Message(400, 'detail_error', message);
    }

    static get UNAUTHORIZED() {
        return new Message(401, 'unauthorized', '로그인 정보가 존재하지 않습니다. 로그인 해주세요.');
    }

    static get FORBIDDEN() {
        return new Message(403, 'forbidden', '권한 없음');
    }

    static TOO_LARGE_SIZE_FILE(size) {
        return new Message(400, 'too_large_size_file', size+'MB 이하 파일만 업로드 할 수 있습니다.');
    }

    static get CONNECTED_SNS() {
        return new Message(400, `connected_sns`, 'SNS로그인으로 연결된 계정입니다.\n' +
            '연결한 SNS로그인으로 시도해주세요.');
    }

    static MAX_SALE_KEYWORD(cnt) {
        return new Message(400, 'max_sale_keyword', '키워드는 ' + cnt + '개 까지만 등록할 수 있습니다.');
    }



    static get SERVER_ERROR() {
        return new Message(500, 'Server_error', 'Please try again.');
    }


    static is(target, message) {
        if (!(target instanceof Message)) {
            return false;
        }

        if (arguments.length === 1) {
            return true;
        }

        return target.status === message.status &&
            target.code === message.code;
    }

}


module.exports = Message;
