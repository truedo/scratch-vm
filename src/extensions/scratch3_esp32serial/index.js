// scratch-vm/src/extensions/scratch3_esp32serial/index.js
const formatMessage = require('format-message');
const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');

const { FormConnectPort,
    FormDisconnectPort,
    FormWriteValue,
   // FormReadValue,
    FormLedColorPick,
    FormLedColorVal,

    FormTextInput,
    FormTextAdd,
    FormTextClear,
    FormTextSet,
    FormTextPos,



} = require('./translation');

const iconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAABYlAAAWJQFJUiTwAAAF8klEQVR4Ae2cbWxTVRjH/7ctbVc2tyEMNpWBk0VIkLcEjSAQgglTE5HEaKqJi1E/mbCP/dJA0kQbvzgTQ0Ki2T7V6AeYGoEPLJmGKPiyzZDwEpYJCHSbQIcbdLvres1zOa13Xbvdu2eTDp9fst329Lnn5XfPPfece7tphmFAmDkuccdDBDIRgUxEIBMRyEQEMhGBTEQgExHIRAQyEYFMRCATEchEBDIRgUxEIBMRyEQEMhGBTEQgExHIxMPNIByNVQBoBUDb7kgo2KTS9wBoUmFNkVCwW6U3A1gP4JJKHwxHY/S+WcW2RkLBVhV7AMAOAIMAGlWstbyOSCh4QMU2Uoy1PBVL+a7IqZu1vOZIKNg20/azBarGvKxebw9HY22RULADwBFLTBcATQnZl4lVEimN4ssteXQrQfstebQpmW1q30xshyqvxRLbofYnYW9ZYgeV8C5LLOWlzbTxM3ouHI7GPgSwWx3Z0syBSBku6IYnlTbM+uQenJQaMnKHDaqAFnDrcCFbl3G1defEjas0a4N/Vz10OybyvapfrSX1sjpo+WIz0ME7QL3djgtHPTAcjb2mepw/b2ZaGh5NL5RnofR8R99dIC5fHusK5JsrCUpm7TSx21XvbcwTNwnbAsPR2GcA3qaG+H0LsHlDPZ7fca/ujZ+cRW9/Em5vCXzlNVhQUjFpf/3OTSRvXkKJz43Xt1bh1S1LUeq/5+njQ9/iVmLIfL1ieRU2b1iFtavztXNu6TrTi8PfnYI67WdPoOp5przV9Y8iuHdb9rOW9uumPI+vDIElddBckztPOqVn5X36Xj1WVQeynx1sOWbK83jc2PviM/dFXIYNax9H55leXLoyYHsfWwI14JCRRx7x5ckBU1oheYQ+1G9u39lVM0Hej7+cR7w/Yb7e9+5LqChfaLvixcK088BwNNZkAOV02ubK6+odwt3RcfOULSSPGEveG48bNj08If3kqXPmdtO6unkpDzYn0u/TLxrzcumJJ80Ut79sygzoFF6/siw75mUYupOEpmnY0/A0pw33FTsCa+hX5oJhZXgkZb5zub2O20CnL7EwkPeCPm+wI7CEBvi5wuOZ36tJW7X3uGXJXAgxk8P4eNpRPEvgskqfuR0Z/BNGejxvDM3/5gs0pboWv+motqybCc+tqUCzz43kaBJ/X+2eMjZ3ClNsjIzo5ioknXZ2b4AlkKYltLJoaY9jOJm/B0KJbtg4c4F/XOmH3+dF9dLKbBo1OD6QQGV56YQ55ODtO0jcHkZ1VSX8/n9nB9S7RkZ1rFy+NG8ZR9s70TeQQKDEh7vJUdt1Y9/OopXFB2/WcbMpyOexE9mlFS21aLlHMmKHfzBl0QT/hV2bzM9oLXv0xG8YGR0zpdLEn6RT2k+/XjDzoLX2G3u3TZBLUyral/Z5qCyAK1f/sl2/or+IWNel1Eji3MWrpjyCZHWqdNrSe6ieSHFERl4mP+q5GehgHGvvRGal5XI5uzU47f3A/R99YTgdF2wXrmkolr9ToZ5NvTjT4yOhoC2T057CJM/r9WDxoqmXa07R9THcuDVcMO8bt4ag6ynULKvkFjWBTLl0ugZKvNlyqLeSQKfYGgOpgXt2b5zVhlzrS+Dr451YvKg0b95txztxvS8xZ+VuXFuLJ5+oNgV+9c3PuHDxGs6cu+w4v//9RJo6x5bN9UgbBo4cPY1U6j+cSD8orFvzGFYuX4KxsRQGbth6FCICc9m5dY05HtN46AQRqPB5PWjY+ZT5RnMwkxGBFh5ZVmle9Z3MrGbjwfqccrC1vajrV7QCaVCfS6qrJj96nQlFK5CujPRT7MgYyEQEMhGBTGwJpAW4kJ9pBbo0zbx70X7y7AOv8HxP3LyB4YTpb2cZBt2iqL3QEwf9zDbX+waLca439QMeC7a+YBmOxugLiM/OTt2yaOoMoO+H6LOcNwf6xusrthsh/7mIh1yFmYhAJiKQiQhkIgKZiEAmIpCJCGQiApmIQCYikIkIZCICmYhAJiKQiQhkIgKZiEAmIpCJCGQiAjkA+AeOwQKMcWZqHgAAAABJRU5ErkJggg==';

let theLocale = null;


// index.js (파일 상단에 위치)

// 1. 파이썬 CommandType ENUM 변환 (명령어 코드)
const CommandType = {
    COMMAND_NONE: 0,
    COMMAND_GOGO: 1,
    COMMAND_LEFT: 2,
    COMMAND_RIGHT: 3,
    COMMAND_GOBACK: 4,
    COMMAND_WAIT: 5,
    COMMAND_WAIT1: 6,
    COMMAND_SPEAK: 7,
    COMMAND_HUMAN: 8,
    COMMAND_HAND: 9,
    COMMAND_LED: 10,

    COMMAND_COLOR_RED: 19,
    COMMAND_COLOR_GREEN: 20,
    COMMAND_CARD_NUM1: 21,
    COMMAND_CARD_NUM2: 22,
    COMMAND_CARD_NUM3: 23,
    COMMAND_MOTION_STOP: 25,

    COMMAND_GO_UNTIL_DIST: 26,
    COMMAND_FREE_TURN: 27,
    COMMAND_LINE_TRACE_DIST: 28,
    COMMAND_GO_INFINITE: 29,
    COMMAND_TRACE_INFINITE: 30,

    COMMAND_LED_CONTROL: 31,
    COMMAND_MOTOR1_INFINITE: 32,
    COMMAND_MOTOR2_INFINITE: 33,
    COMMAND_LED_INFINITE: 34,

    COMMAND_CONTROL_MODE1: 35,

    COMMAND_LINE_LEFT: 39,
    COMMAND_LINE_RIGHT: 40,

    COMMAND_MOTOR_TIME: 41,

    COMMAND_QUICK_GOGO: 50,
    COMMAND_QUICK_GOBACK: 51,
    COMMAND_QUICK_LEFT: 52,
    COMMAND_QUICK_RIGHT: 53,

    COMMAND_FREE_TURN_PYTHON: 70,

    COMMAND_GOSENSOR: 100,
    COMMAND_LINE_TRACING: 101,
    COMMAND_COLOR_TRACKING: 102,

    COMMAND_ROBOT_LINE: 103,
    COMMAND_ROBOT_AVOIDANCE: 104,
    COMMAND_ROBOT_FOLLOWER: 105,
    COMMAND_ROBOT_CLIFF: 106,

    COMMAND_SET_IR_THREADHOLD: 150,
    COMMAND_SET_MOTOR_DEGREE: 151,

    COMMAND_CONTROL_LED: 200,
    COMMAND_PATTERN_LED: 201,

    COMMAND_COLOR_TRACKING2: 211,
    COMMAND_COLOR_TRACKING3: 212,

    COMMAND_TEXT_INPUT: 230,
    COMMAND_TEXT_SET: 231,
    COMMAND_TEXT_ADD: 232,

    COMMAND_SCREEN_TOGGLE: 240,
    COMMAND_EMOTION_CHANGE: 241,
    COMMAND_PLAY_SOUND: 242,

    COMMAND_MOTOR_CALIBRATION_READ: 245,
    COMMAND_MOTOR_CALIBRATION_START: 247,
    // EndOfType: 0xFF,
};

// 2. 파이썬 CommandType_SIZE ENUM 변환 (커맨드 바이트 제외한 파라미터 개수)
// 파이썬 CommandType_SIZE[].value - 1 에 해당 (예: LED SIZE 3 -> 파라미터 3개)
const CommandType_DATA_LENGTH = {
    COMMAND_GOGO: 1,
    COMMAND_LEFT: 1,
    COMMAND_RIGHT: 1,
    COMMAND_GOBACK: 1,
    COMMAND_WAIT: 4,  // 총 4바이트 (커맨드 1 + 파라미터 3)
    COMMAND_WAIT1: 5, // 총 5바이트 (커맨드 1 + 파라미터 4)
    COMMAND_SPEAK: 8, // 총 8바이트 (커맨드 1 + 파라미터 7)
    COMMAND_HUMAN: 4, // 총 4바이트 (커맨드 1 + 파라미터 3)
    COMMAND_HAND: 9,  // 총 9바이트 (커맨드 1 + 파라미터 8)
    COMMAND_LED: 3,   // r, g, b 세 가지 파라미터

    COMMAND_COLOR_RED: 19,
    COMMAND_COLOR_GREEN: 20,
    COMMAND_CARD_NUM1: 21,
    COMMAND_CARD_NUM2: 22,
    COMMAND_CARD_NUM3: 23,
    COMMAND_MOTION_STOP: 25,

    COMMAND_GO_UNTIL_DIST: 26,
    COMMAND_FREE_TURN: 27,
    COMMAND_LINE_TRACE_DIST: 28,
    COMMAND_GO_INFINITE: 3,
    COMMAND_TRACE_INFINITE: 30,

    COMMAND_LED_CONTROL: 31,
    COMMAND_MOTOR1_INFINITE: 32,
    COMMAND_MOTOR2_INFINITE: 33,
    COMMAND_LED_INFINITE: 34,

    COMMAND_CONTROL_MODE1: 35,

    COMMAND_LINE_LEFT: 39,
    COMMAND_LINE_RIGHT: 40,

    COMMAND_MOTOR_TIME: 41,

    COMMAND_QUICK_GOGO: 1,
    COMMAND_QUICK_GOBACK: 1,
    COMMAND_QUICK_LEFT: 1,
    COMMAND_QUICK_RIGHT: 1,

    COMMAND_FREE_TURN_PYTHON: 4,

    COMMAND_GOSENSOR: 3,
    COMMAND_LINE_TRACING: 101,
    COMMAND_COLOR_TRACKING: 102,

    COMMAND_ROBOT_LINE: 103,
    COMMAND_ROBOT_AVOIDANCE: 104,
    COMMAND_ROBOT_FOLLOWER: 105,
    COMMAND_ROBOT_CLIFF: 106,

    COMMAND_SET_IR_THREADHOLD: 150,
    COMMAND_SET_MOTOR_DEGREE: 151,

    COMMAND_CONTROL_LED: 200,
    COMMAND_PATTERN_LED: 3,

    COMMAND_COLOR_TRACKING2: 211,
    COMMAND_COLOR_TRACKING3: 212,

    COMMAND_TEXT_INPUT: 1,
    COMMAND_TEXT_SET: 5,
    COMMAND_TEXT_ADD: 1,

    COMMAND_SCREEN_TOGGLE: 1,
    COMMAND_EMOTION_CHANGE: 1,
    COMMAND_PLAY_SOUND: 1,

    COMMAND_MOTOR_CALIBRATION_START: 0,
    COMMAND_MOTOR_CALIBRATION_READ: 0,
    // EndOfType: 0xFF,
};

// 3. 파이썬 RequestType ENUM 변환
// 비트 플래그로 사용됨 (예: this._currentRequest에 OR 연산)
const RequestType = {
    REQUEST_ENTRY_FACE_DETECT: 0x01,
    REQUEST_ENTRY_COLOR_DETECT: 0x02,
    REQUEST_ENTRY_APRIL_DETECT: 0x04,
   // REQUEST_ENTRY_EULER: 0x08,
    REQUEST_ENTRY_CAT_DETECT: 0x10,
};

// PacketDataIndex Enum을 대체하는 상수 객체
const PacketIndex = {
    // 패킷 헤더 길이 (파이썬의 self.headerLen)
    //HEADER_LENGTH: 2,

    // 상태 플래그
    DATA_COM: 2,
    DATA_INFO: 2, // 파이썬과 동일하게 2
    DATA_REQ: 3,
    DATA_PSTAT: 4,

    // IR 센서
    DATA_SEN_FR: 5,
    DATA_SEN_FL: 6,
    DATA_SEN_BR: 7,
    DATA_SEN_BC: 8,
    DATA_SEN_BL: 9,

    // 객체 감지 및 좌표
    DATA_DETECT_FACE: 10,
    DATA_DETECT_FACE_X: 11,
    DATA_DETECT_FACE_Y: 12,

    DATA_DETECT_COLOR: 13,
    DATA_DETECT_COLOR_X: 14,
    DATA_DETECT_COLOR_Y: 15,

    DATA_DETECT_MARKER: 16,
    DATA_DETECT_MARKER_X: 17,
    DATA_DETECT_MARKER_Y: 18,

    // 기타
    DATA_BTN_INPUT: 19,
    DATA_BATTERY: 20,

    DATA_DETECT_CAT: 23,
    DATA_DETECT_CAT_X: 24,
    DATA_DETECT_CAT_Y: 25
};

class Scratch3Esp32Serial {
    constructor (runtime) {

       // the_locale = this._setLocale();
        this.runtime = runtime;
        this.serialPort = null;
        this.reader = null;
       // this.writer = null;
        this.receivedData = '';




        // Web Serial API 지원 여부 확인
        if ('serial' in navigator) {
            console.log("Web Serial API is supported.");
        } else {
            console.error("Web Serial API is not supported in this browser.");
        }


        // 통신 상태 (StateLoading)
        this.StateLoading = {
            Ready: 0x00,
            Receiving: 0x01,
            Loaded: 0x02,
            Failure: 0x03
        };

        // 패킷 섹션 (Section)
        this.Section = {
            Start: 0x00,
            Header:0x01,  // 헤더
            Data: 0x02,
            End: 0x03 // 파이썬 코드에서 Header 섹션이 Data와 통합된 것으로 보여 생략
        };

        // 패킷 길이 및 헤더 (파이썬 Receiver와 통일)
        this.PACKET_DATA_LENGTH = 24; // 파이썬 Receiver.call의 index == 23에 대응
        this.PACKET_START_BYTE1 = 0x24; // $
        this.PACKET_START_BYTE2 = 0x52; // R
        this.HEADER_LENGTH = 2; // 파이썬 SerialConnectionHandler의 headerLen

        this._current_request = 0;


        // 스크래치 확장 클래스 생성자 (Constructor) 내에 정의될 변수들
        // this.receiverData는 최종 패킷을 저장
        this.connectState = false;         // 현재 연결 상태 (초기: false)
        this.connectionTimeoutHandler = null; // 타이머 핸들러를 저장할 변수
        this.CONNECTION_TIMEOUT_MS = 3000; // 연결 확인 타임아웃 시간 (예: 3초)


        this.receiverState = this.StateLoading.Ready;
        this.receiverSection = this.Section.Start;
        this.receiverIndex = 0;
        this.receiverBuffer = [];
        this.receiverData = [];
        this.receiverMessage = null;
        this.receiverSectionOld = this.Section.End;

        // === [상태 플래그 및 기본 데이터] ===
        this.reqINFO = 0;
        this.reqREQ = 0;
        this.reqPSTAT = 0;
        this.btn = 0;
        this.battery = 0;

        // === [IR 센서 값] ===
        this.senFL = 0;
        this.senFR = 0;
        this.senBL = 0;
        this.senBC = 0;
        this.senBR = 0;

        // === [객체 감지 데이터] ===
        this.zumiFaceDetected = false;
        this.zumiFaceCenter = [0, 0];
        this.zumiColorDetected = 0;
        this.zumiColorCenter = [0, 0];
        this.zumiMarkerDetected = 0;
        this.zumiMarkerCenter = [0, 0];
        this.zumiCatDetected = 0;
        this.zumiCatCenter = [0, 0];

        this.connectPort();

    }

        _setLocale () {
        let nowLocale = '';
        //nowLocale = formatMessage.setup().locale;
       // console.log(nowLocale)
        switch (formatMessage.setup().locale) {
        case 'ko':
            nowLocale = 'ko';
            break;
        // case 'ja':
        //     nowLocale = 'ja';
        //     break;
        default:
            nowLocale = 'en';
            break;
        }
        return nowLocale;
    }

    /**
     * 확장자 정보를 정의합니다.
     */
    getInfo () {

        // 기존의 'const locale = this.runtime.getLocale();' 이 줄을 제거해야 합니다.

       // the_locale = this._setLocale();
        //this.connectPort();
        //console.log("_setLocale");
        theLocale = this._setLocale (); //언어 설정 읽어오기

        return {
            id: 'zumiAI',

            // color1: '#4C97FF',
            // color2: '#3373CC',
            // color3: '#2853A6',

            // color1: '#5CB85C',
            // color2: '#4A944A',
            // color3: '#387738',

            // color1: '#4A6FA5',
            // color2: '#3A5884',
            // color3: '#2B4263',

            color1: '#204ECF', // 블록 기본 색
            color2: '#193EAA', // 블록 테두리/음영
            color3: '#132F85', // 입력 영역 강조




            name: '주미 AI', // 확장자 메뉴 이름 (필요시 translation.js에서 가져오는 것으로 변경 가능)
            //blockIconURI: iconURI, // 아이콘 URI
            //blockIconURI: 'data:image/svg+xml;base64,PHN2ZyB2aW... [긴 SVG 문자열]', // 예시 코드
           // blockIconURI: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxNy41IiBmaWxsPSIjRkY2Njg4Ii8+PHRleHQgZmlsbD0iI0ZGRiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiB4PSIxMiIgeT0iMjgiPlM8L3RleHQ+PC9zdmc+',
            //blockIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAcCAYAAACdz7SqAAAABHNCSVQICAgIfAhkiAAAAAFzUkdCAK7OHOkAAAAEZ0FNQQAAsY8L/GEFAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAxJJREFUSEu9l01oE0EUx/+zm22atlSrtiC0FEWstH6AiJciKh40pRc9pJ4sCOJFpApCwYN3T1o9GjwXRfyAUsST14AIniqKUKjWgtWkpslmszu+tzv52M3GxsT2l0x25u3O/Pe9+YyQxPtlB1deWlizJCICkPQBKFONZFszSFj0e26vgZm44VrEu6+2nHhSwI4YoGssFCLIhJgagbxyW8yYAkO7gKeJKMRoMictG4jootl2N4ZUWXo1B9w5FYG2kgUM8nDTBBlqXAiBrjbg9WcJzdA841agk9a3NRJV5S1DI8UaUbfb+csDoMXktaMarkIMP8zJnpjg++4TeqQd6KBQUPxbxaYBaq9TxjSpT4GiI7GzQ/NEt5OoIFURi8JZSuFL8iqyq2kIjkWTsKed7QYGLkwjNjoJK23CJltZlD2FbkDPLODt9WFV7f9x/EYSbUcvw8rnXVHlioRo07A0d88rhjCeSKhcOGfiZ9HevU2V/Hx6dhcGdVmpf8vx45jbdlGV/MwkH+HV7CzGL4YL9+8ZxJu5eaRSKWXxQy75hqy/00R4H9oFXj1pEeE3C4MnIGEVTfcaJFgrXCWIios7DcJQ5rr3AzQmWuYfH69DQ62Upo5WJ7yauzvx/cZeyv9UnfDkaagz6zme6bX8SqfdK81A91pDoF2fqMErRAjTU1MYPDCE+ecvlMVPZuUHdg/248jIiLIEkI5PV4kKOAWg98QlrxjC4sJHlQtneXFJ5WoZOD2JYlWQKp5aJvT9J3Hs5mN0x2h1IhMfXfiA0UyKUIpR64cSt9Bz/jZsXn/JxlSWQYZCIKJRGN1UiWr5gl2nu1zCe8UNqZkBnHUWpLMSlXt9a28Z3pZU1oXv1Wl1Q7x2hTtWBCzaZfoqa281tOPQ1KgkWsSobnOJ63qCJbikeT78zROu0GoqIWA7NjTH8WK/FTgc3i4dWl+npB29+m02B3bsN03LsX3Up/fjUfzM08iygwPIg00tJ/rJFCQO9wlMHIzwAVzKD98dXJuzsJz1/lZUw5VagevzYT5OHj4Y44MX8AckpVAZykJ1kwAAAABJRU5ErkJggg==',
            blockIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAfCAMAAACxiD++AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKdUExURQAAADOZ5jyZ9zye9zyg+zyf+zuf+Tyf+Tyg+zug+zee+Tmc9lWq/0mS/zyc+Tud+UCs/z+n/z+m/z6n/z2m/zqc+Dmc+VWq/zqe9zyd+j6m/zud+Dud9zud+Duc9zue+T6k/zuc+Dma8zmb+D6l/zue+jyc9Tud+j2j/z2i/zud+Dud+juc+Dud+Duf+jyh/T2h/Tyg/Dye9juZ6TqW5TqX5TuX5Tya7Due+Dyf+juX6i9upBw/XxY1URY2Uxg3UyNJbTR8vT2g+jud+T2g+C1roQsSGAAAAAIAABgvQTaAwDyh/zyf/DmR4Bs/WwoKCiUpKB0gIAgICCQmJSImJQIDAwQFBCRQdECp/z2h/zyg/jaI0hczSkBCQ83S04+TlAQIBzI0M73Av6KlpRcbHAEAABxCY0Gs/zaI0xc0S1hbXP///7m7uxAWFEZIR/b5+M/R0SswMB1DZRc0TFVYWLa4uBEXFUNGRe/y8szNziwwMB1DZFRXWLa3uBAWFe/z8svMzSsvMLa4uREXFkRGRvDz88vNzVVXWLi6uhAUE0JFRPD09M7P0CktLTs9Pb/FxYmMjAQGBiosLK2ysaCiohUXFzyg/TmO2xw8VgEBAQQFBgMEBAQFBQYHBwQEBCFNckCq/z2f9ipjkwYIChIlMzN5tzuf+zqX5ythjhQpPBAlOBAmORAmOBAlNxo1TTFyqjqd+EGn/0Ck+EGk+UGk+kCk+UGl+zyj/zqc+Dud+jud+jyd+Dud+Dyi/zqd9zqc9jyf+zqd+Tic+Dmc9Due+Tyh/jud+Tuf+Cuq/zud9zyd+Duf/Dyh/Tyg/Dug/Dug/Tyg/Tyf+zuc+D+c+jOZ/zmg9zmd9zud+Due+jqd+Tud+Tuc+juc+Dqc9Tyc9Fro8bMAAADfdFJOUwAKPISvsrKys6yBNgYHVdj//////9NQA0LW//7//////9k/lP//nb7//77GvsT//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8TEtv+9jf/9lUPU/85FBlvS+Pv7+/v7+NBdBUOXubq5ubq3mkjoNDx5AAAACXBIWXMAAA7DAAAOwwHHb6hkAAABwUlEQVQ4T2NgYGRiZmFlAwF2VhTAwcnFzcPAwMvHLyAoJAgGQqhAWERUTJxBQlJKWgYKZFGBnLyCohKDsgqUiw2oyqsxqGtAOViBphaDliaUjRVoajPo4FegCzFBT98AExiqwhXoGRmbmKIBEzNzCz2oAksraxtbO3Rg7+DoBFHg7OLq5o4FeHh6eYMV+Pj6gQX8AwLBtHtQcEgoiA4Lj4jUBfoiKjoGLB4bF58AZiQmJaeA6NS0dKACLc2ojEyweFZ2Ti6YkZdfUAiiU4tgCorB4iXZpWVgRnlFZRWITq1GVVCTXVsHZpTXNzSCaHQFJdlNzWBGS2sbxAo0Be3ZHZ1gRld3Ty+IBirwBvsC6si+/gkTwYxJk6dMBdEeUBOmTZ8BFp85azaYdnefMxdMzZu/AKxAfuGixWABNJC6ZCkkJGWXLV+xctVqNLBm7br1KhugsamqsHHT5s1bUMDWbRu37wBFFiTBODs770QHzqAEswtsAm6guZuQAl2GPXhT9d59DPsjgUkPFzhw8BDD4SNHfVRxgAM+x44znDh56vSZs0BwDh2cv3Dx0mUGBoYrV69dv3Hz5s1b6OD2nbv3GBgAt7keqNrw6tEAAAAASUVORK5CYII=',


            blocks: [

                {
                    opcode: 'getConnectState',
                    blockType: BlockType.REPORTER,
                    text: '주미 AI 연결 상태',
                    arguments: {}
                },
                {
                    opcode: 'connectPort',
                    blockType: BlockType.COMMAND,
                    text: FormConnectPort[theLocale],
                },

                {
                    opcode: 'disconnectPort',
                    blockType: BlockType.COMMAND,
                    text: FormDisconnectPort[theLocale],
                },
                '---',
                // {
                //     opcode: 'writeValue',
                //     blockType: BlockType.COMMAND,
                //     text: FormWriteValue[theLocale],
                //     arguments: {
                //         TEXT: {
                //             type: ArgumentType.STRING,
                //             defaultValue: 'Hello Zumi'
                //         }
                //     }
                // },
                // {
                //     opcode: 'readValue',
                //     blockType: BlockType.REPORTER,
                //     text: FormReadValue[theLocale],
                // },

                //-------------------------------------------//
                // LED
                '---',
                // 색상을 선택 수정된 COMMAND_LED 블록 정의
                {
                    opcode: 'ledControlByColor', // 새로운 Opcode 정의
                    blockType: BlockType.COMMAND,
                    text: FormLedColorPick[theLocale],
                    arguments: {
                        COLOR: {
                            type: ArgumentType.COLOR, // 색상 선택기 UI 사용
                            defaultValue: '#FF0000' // 기본값은 빨간색 (HEX 코드)
                        }
                    }
                },

                // 색상 값을 변수로 받음
                {
                    opcode: 'ledControl',
                    blockType: BlockType.COMMAND,
                    text: FormLedColorVal[theLocale],
                    arguments: {

                        R_VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10,
                            acceptReporters: true,
                        },
                        G_VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10,
                            acceptReporters: true,
                        },
                        B_VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10,
                            acceptReporters: true,

                        }
                    }
                },

                // 색상 값을 변수로 받음
                {
                    opcode: 'ledPattern',
                    blockType: BlockType.COMMAND,
                    text: 'LED 패턴[PATTERN] 시간[TIME] 설정',
                    arguments: {
                        PATTERN: {
                            type: ArgumentType.STRING,
                            menu: 'ledPattern', // 위에서 정의한 드롭다운 메뉴 사용
                            defaultValue: '1'
                        },
                        TIME: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1,
                            acceptReporters: true,
                        }
                    }
                },


                '---',

                //사운드
                {
                    opcode: 'play_sound_command',
                    blockType: BlockType.COMMAND,
                    text: '사운드 재생 [NOTE]',
                    arguments: {
                        NOTE: {
                            type: ArgumentType.STRING,
                            menu: 'soundSelector',
                            defaultValue: '0'
                        }
                    }
                },

                //화면 전환
                {
                    opcode: 'show_camera_command',
                    blockType: BlockType.COMMAND,
                    text: '화면 변경 [STATE]',
                    arguments: {
                        STATE: {
                            type: ArgumentType.STRING,
                            menu: 'screenSelector',
                            defaultValue: 'camera'
                        }
                    }
                },
                //표정
                {
                    opcode: 'change_emotion_command',
                    blockType: BlockType.COMMAND,
                    text: '표정 변경 [EMOTION]',
                    arguments: {
                        EMOTION: {
                            type: ArgumentType.STRING,
                            menu: 'emotionSelector',
                            defaultValue: '3'
                        },
                    }
                },


                //-------------------------------------------//
                // text
                '---',
                //text 추가
                {
                    opcode: 'display_text_command',
                    blockType: BlockType.COMMAND,
                    text: FormTextInput[theLocale],
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello Zumi!'
                        },
                        STATE: {
                            type: ArgumentType.STRING,
                            menu: 'lineChangeSelector',
                            defaultValue: 'on'
                        }
                    }
                },
                //text 이어쓰기
                {
                    opcode: 'display_text_add_command',
                    blockType: BlockType.COMMAND,
                    text: FormTextAdd[theLocale],
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello Zumi!'
                        },
                        STATE: {
                            type: ArgumentType.STRING,
                            menu: 'lineChangeSelector',
                            defaultValue: 'on'
                        }
                    }
                },


                // 글자 색상 및 크기 설정
                {
                    opcode: 'display_text_set_command',
                    blockType: BlockType.COMMAND,
                    text: FormTextSet[theLocale],
                    arguments: {
                        TEXT_COLOR_VALUE: {
                            type: ArgumentType.STRING,
                            menu: 'textColorSelector', // 위에서 정의한 드롭다운 메뉴 사용
                            defaultValue: '1'
                        },
                        TEXT_SIZE_VALUE: {
                            type: ArgumentType.STRING,
                            menu: 'textSizeSelector', // 위에서 정의한 드롭다운 메뉴 사용
                            defaultValue: '5'
                        }

                        // TEXT_COLOR_VALUE: {
                        //     type: ArgumentType.NUMBER,
                        //     defaultValue: 0,
                        //     acceptReporters: true,
                        // },
                        // TEXT_SIZE_VALUE: {
                        //     type: ArgumentType.NUMBER,
                        //     defaultValue: 0,
                        //     acceptReporters: true,
                        // },

                    }
                },

                // 글자 위치
                {
                    opcode: 'display_text_pos_command',
                    blockType: BlockType.COMMAND,
                    text: FormTextPos[theLocale],
                    arguments: {
                        TEXT_X_VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                            acceptReporters: true,
                        },
                        TEXT_Y_VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                            acceptReporters: true,
                        },
                    }
                },

                // texr 지우기
                {
                    opcode: 'display_text_clear_command',
                    blockType: BlockType.COMMAND,
                    text: FormTextClear[theLocale],
                },


                //---------------------------------------------------//
                // move
                '---',
                // 지정된 거리 만큼 이동
                {
                    opcode: 'forward_dist',
                    blockType: BlockType.COMMAND,
                    text: '[MOVE_DIRECTION] 방향으로 [MOVE_SPEED] 속도로 거리만큼 [MOVE_DIST] 이동',
                    arguments: {
                        MOVE_DIRECTION: {
                            type: ArgumentType.STRING,
                            menu: 'moveDirection', // 위에서 정의한 드롭다운 메뉴 사용
                            defaultValue: '0'
                        },

                        MOVE_SPEED: {
                            type: ArgumentType.STRING,
                            menu: 'moveSpeed', // 위에서 정의한 드롭다운 메뉴 사용
                            defaultValue: '2'
                        },
                        MOVE_DIST: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10,
                            acceptReporters: true,
                        },
                    }
                },
                // 지정된 각도만큼 회전
                {
                    opcode: 'turn_angle',
                    blockType: BlockType.COMMAND,
                    text: '[TURN_DIRECTION] 방향으로 [TURN_ANGLE] 도를 [TURN_SPEED] 속도로 회전',
                    arguments: {
                        TURN_DIRECTION: {
                            type: ArgumentType.STRING,
                            menu: 'turnDirection', // 위에서 정의한 드롭다운 메뉴 사용
                            defaultValue: '0'
                        },
                        TURN_ANGLE: {
                            type: ArgumentType.ANGLE,
                            defaultValue: 90,
                            acceptReporters: true,
                        },
                        TURN_SPEED: {
                            type: ArgumentType.STRING,
                            menu: 'moveSpeed', // 위에서 정의한 드롭다운 메뉴 사용
                            defaultValue: '2'
                        },


                    }
                },


                //-- 버튼 값 --///
                {
                    // 이 opcode(고유 ID)는 위의 JavaScript 함수 이름과 일치해야 합니다.
                    opcode: 'getBtnReading',
                    // 이 블록은 숫자 값을 반환하므로 REPORTER 타입입니다.
                    blockType: BlockType.REPORTER,
                    // 스크래치 블록에 표시될 텍스트입니다.
                    text: '버튼 값',
                    // 이 블록은 인수를 받지 않습니다.
                    arguments: {
                        // SENSOR: {
                        //     // 드롭다운 타입
                        //     type: ArgumentType.STRING,
                        //     // 위에서 정의한 메뉴 키를 참조합니다.
                        //     menu: 'detectorBtn',
                        //     // 드롭다운의 기본값 (선택 사항)
                        //     defaultValue: '0'
                        // }
                    }
                },

                //-- 버튼 값 --///
                {
                    // 이 opcode(고유 ID)는 위의 JavaScript 함수 이름과 일치해야 합니다.
                    opcode: 'getBatReading',
                    // 이 블록은 숫자 값을 반환하므로 REPORTER 타입입니다.
                    blockType: BlockType.REPORTER,
                    // 스크래치 블록에 표시될 텍스트입니다.
                    text: '배터리 잔량',
                    // 이 블록은 인수를 받지 않습니다.
                    arguments: {
                        // SENSOR: {
                        //     // 드롭다운 타입
                        //     type: ArgumentType.STRING,
                        //     // 위에서 정의한 메뉴 키를 참조합니다.
                        //     menu: 'detectorBtn',
                        //     // 드롭다운의 기본값 (선택 사항)
                        //     defaultValue: '0'
                        // }
                    }
                },


                '---',

                //-- 센서 값 --///
                // {
                //     // 이 opcode(고유 ID)는 위의 JavaScript 함수 이름과 일치해야 합니다.
                //     opcode: 'getSensorFR',
                //     // 이 블록은 숫자 값을 반환하므로 REPORTER 타입입니다.
                //     blockType: BlockType.REPORTER,
                //     // 스크래치 블록에 표시될 텍스트입니다.
                //     text: 'IR 센서 앞오른쪽 값',
                //     // 이 블록은 인수를 받지 않습니다.
                //     arguments: {}
                // },
                {
                    opcode: 'getIRSensorReading', // JS에서 실행될 함수 이름
                    blockType: BlockType.REPORTER,
                    text: '[SENSOR] IR 센서 값',
                    arguments: {
                        SENSOR: {
                            // 드롭다운 타입
                            type: ArgumentType.STRING,
                            // 위에서 정의한 메뉴 키를 참조합니다.
                            menu: 'irSensorSelector',
                            // 드롭다운의 기본값 (선택 사항)
                            defaultValue: 'senFR'
                        }
                    }
                },




                '---',
                {
                    opcode: 'detector_request',
                    blockType: BlockType.COMMAND,
                    text: '[DETECTOR] 감지 [STATE]',
                    arguments: {
                        DETECTOR: {
                            // 드롭다운 타입
                            type: ArgumentType.STRING,
                            menu: 'detectorSelector',
                            defaultValue: 'REQUEST_ENTRY_FACE_DETECT'
                        },
                        STATE: {
                            // 드롭다운 타입
                            type: ArgumentType.STRING,
                            menu: 'lineChangeSelector',
                            defaultValue: 'on'
                        }
                    }
                },
                '---',



                {
                    opcode: 'getHumanDetectReading', // JS에서 실행될 함수 이름
                    blockType: BlockType.REPORTER,
                    text: '사람 얼굴 [DETECT]',
                    arguments: {
                        DETECT: {
                            // 드롭다운 타입
                            type: ArgumentType.STRING,
                            // 위에서 정의한 메뉴 키를 참조합니다.
                            menu: 'humanFaceSelector',
                            // 드롭다운의 기본값 (선택 사항)
                            defaultValue: 'zumiFaceDetected'
                        }
                    }
                },
                {
                    opcode: 'getCatDetectReading', // JS에서 실행될 함수 이름
                    blockType: BlockType.REPORTER,
                    text: '고양이 얼굴 [DETECT]',
                    arguments: {
                        DETECT: {
                            // 드롭다운 타입
                            type: ArgumentType.STRING,
                            // 위에서 정의한 메뉴 키를 참조합니다.
                            menu: 'catFaceSelector',
                            // 드롭다운의 기본값 (선택 사항)
                            defaultValue: 'zumiCatDetected'
                        }
                    }
                },

                {
                    opcode: 'getMarkerDetectReading', // JS에서 실행될 함수 이름
                    blockType: BlockType.REPORTER,
                    text: '마커 [DETECT]',
                    arguments: {
                        DETECT: {
                            // 드롭다운 타입
                            type: ArgumentType.STRING,
                            // 위에서 정의한 메뉴 키를 참조합니다.
                            menu: 'markerSelector',
                            // 드롭다운의 기본값 (선택 사항)
                            defaultValue: 'zumiMarkerDetected'
                        }
                    }
                },
                {
                    opcode: 'getColorDetectReading', // JS에서 실행될 함수 이름
                    blockType: BlockType.REPORTER,
                    text: '색상 [DETECT]',
                    arguments: {
                        DETECT: {
                            // 드롭다운 타입
                            type: ArgumentType.STRING,
                            // 위에서 정의한 메뉴 키를 참조합니다.
                            menu: 'colorSelector',
                            // 드롭다운의 기본값 (선택 사항)
                            defaultValue: 'zumiColorDetected'
                        }
                    }
                },

            ],

            // menu boolean on/off
            menus: {  // blocks와 같은 계층
                    lineChangeSelector: {
                        acceptReporters: false,
                        items: [
                            { text: '켜기', value: 'on' },
                            { text: '끄기', value: 'off' }
                        ]
                    },



                    // detectorBtn: {
                    //     acceptReporters: false,
                    //     items: [
                    //         { text: '없음', value: '0'},
                    //         { text: '빨강', value: '1'},
                    //         { text: '파랑', value: '2'},
                    //         { text: '초록', value: '4'},
                    //         { text: '노랑', value: '8'},
                    //     ]
                    // },


                    detectorSelector: {
                        acceptReporters: false,
                        items: [
                            { text: '얼굴', value: 'REQUEST_ENTRY_FACE_DETECT'},
                            { text: '고양이', value: 'REQUEST_ENTRY_CAT_DETECT'},
                            { text: '색상', value: 'REQUEST_ENTRY_COLOR_DETECT'},
                            { text: '마커', value: 'REQUEST_ENTRY_APRIL_DETECT'},
                        ]
                    },

                    screenSelector: {
                        acceptReporters: false,
                        items: [
                            { text: '카메라', value: 'camera' },
                            { text: '표정', value: 'emotion' }
                        ]
                    },

                    soundSelector: {
                        acceptReporters: false,
                        items: [
                            { text: '고양이 울음소리', value: '0' },
                            { text: '카메라 셔터', value: '1' },
                            { text: '실패음1', value: '2' },
                            { text: '실패음2', value: '3' },
                            { text: '경적1', value: '4' },
                            { text: '경적2', value: '5' },
                            { text: '사이렌', value: '6' },
                            { text: '성공', value: '7' },
                        ]
                    },

                    emotionSelector: {
                        acceptReporters: false,
                        items: [
                            { text: '끄기', value: '0' },
                            { text: '정지', value: '2' },
                            { text: '깜박임', value: '3' },
                            { text: '웃음', value: '4' },
                            { text: '사랑', value: '5' },
                            { text: '충격', value: '6' },
                            { text: '놀람', value: '7' },
                            { text: '기쁨', value: '8' },
                            { text: '분노', value: '9' },
                            { text: '졸림', value: '10' },
                            { text: '슬픔', value: '11' },
                            { text: '어지러움', value: '12' },
                            { text: '잠들기', value: '13' },
                            { text: '윙크', value: '14' },
                            { text: '감지', value: '15' },
                        ]
                    },


                    ledPattern: {
                        items: [
                            { text: '켜짐 유지', value: '0' },     // LED_NORMAL
                            { text: '깜박임', value: '1' },
                            { text: '두 번 깜박임', value: '2' },
                            { text: '밝아졌다 어두어짐', value: '3' },
                            { text: '점점 어두워짐', value: '4' },
                            { text: '점점 밝아짐', value: '5' },
                            { text: '무지개색 변환', value: '6' }
                        ]
                    },

                    moveDirection: {
                        items: [
                            { text: '앞', value: '0' },
                            { text: '뒤', value: '1' }
                        ]
                    },

                    turnDirection: {
                        items: [
                            { text: '왼쪽', value: '0' }, // 0: 좌회전 (left_turn)
                            { text: '오른쪽', value: '1' }  // 1: 우회전 (right_turn)
                        ]
                    },
                    moveSpeed: {
                        items: [
                            { text: '느리게', value: '1' },
                            { text: '보통', value: '2' },
                            { text: '빠르게', value: '3' }
                        ]
                    },

                    textColorSelector: {
                        items: [

                            { text: '현재 색상', value: '0' },
                            { text: '흰색', value: '1' },
                            { text: '검정', value: '2' },

                            { text: '남색', value: '3' },
                            { text: '파랑', value: '4' },
                            { text: '하늘색', value: '5' },
                            { text: '청록색', value: '6' },
                            { text: '틸색', value: '7' },
                            { text: '초록', value: '8' },
                            { text: '연두', value: '9' },
                            { text: '라임색', value: '10' },
                            { text: '노랑', value: '11' },
                            { text: '호박색', value: '12' },
                            { text: '주황', value: '13' },
                            { text: '짙은 주황', value: '14' },
                            { text: '갈색', value: '15' },
                            { text: '청회색', value: '16' },
                            { text: '회색', value: '17' },
                        ]
                    },
                    textSizeSelector: {
                        items: [
                            { text: '현재 크기', value: '0' },
                            { text: '1', value: '1' },
                            { text: '2', value: '2' },
                            { text: '3', value: '3' },
                            { text: '4', value: '4' },
                            { text: '5', value: '5' },
                        ]
                    },
                    irSensorSelector: {
                        // 이 키(센서 목록 이름)는 블록 정의에서 사용됩니다.
                        //acceptReporters: true,
                        items: [
                            { text: '앞 오른쪽', value: 'senFR' }, // 사용자에게 보이는 텍스트: '앞 오른쪽', JS에서 사용할 값: 'senFR'
                            { text: '앞 왼쪽', value: 'senFL' },
                            { text: '바닥 오른쪽', value: 'senBR' },
                            { text: '바닥 왼쪽', value: 'senBL' },
                            { text: '바닥 가운데', value: 'senBC' }
                        ]
                    },
                    catFaceSelector: {
                        items: [
                            { text: '감지 상태', value: 'zumiCatDetected' }, // 사용자에게 보이는 텍스트: '앞 오른쪽', JS에서 사용할 값: 'senFR'
                            { text: 'X 좌표', value: 'zumiCatCenter[0]' },
                            { text: 'Y 좌표', value: 'zumiCatCenter[1]' },
                        ]
                    },
                    humanFaceSelector: {
                        items: [
                            { text: '감지 상태', value: 'zumiFaceDetected' }, // 사용자에게 보이는 텍스트: '앞 오른쪽', JS에서 사용할 값: 'senFR'
                            { text: 'X 좌표', value: 'zumiFaceCenter[0]' },
                            { text: 'Y 좌표', value: 'zumiFaceCenter[1]' },
                        ]
                    },
                    markerSelector: {
                        items: [
                            { text: '감지 ID', value: 'zumiMarkerDetected' }, // 사용자에게 보이는 텍스트: '앞 오른쪽', JS에서 사용할 값: 'senFR'
                            { text: 'X 좌표', value: 'zumiMarkerCenter[0]' },
                            { text: 'Y 좌표', value: 'zumiMarkerCenter[1]' },
                        ]
                    },
                    colorSelector: {
                        items: [
                            { text: '감지 색상', value: 'zumiColorDetected' }, // 사용자에게 보이는 텍스트: '앞 오른쪽', JS에서 사용할 값: 'senFR'
                            { text: 'X 좌표', value: 'zumiColorCenter[0]' },
                            { text: 'Y 좌표', value: 'zumiColorCenter[1]' },
                        ]
                    },


                }

            };
        }

    // --- 블록 함수 구현 ---

    /**
     * 시리얼 포트 연결 및 설정
     */
    async connectPort () {
        if (this.serialPort) return;

        try {
            // 사용자에게 포트 선택 요청
            this.serialPort = await navigator.serial.requestPort();

            // 포트 열기 (ESP32 표준 보드레이트: 115200)
            await this.serialPort.open({ baudRate: 115200 });

            // 리더/라이터 설정
         //   this.writer = this.serialPort.writable.getWriter();
            this.readSerial(); // 데이터 수신 시작

        } catch (error) {
            console.error('Serial port connection failed:', error);
            this.serialPort = null;
        }
    }


    /**
     * 시리얼 포트 연결 끊기
     */
    async disconnectPort () {
        if (this.serialPort) {
            if (this.reader) await this.reader.cancel();
           // if (this.writer) await this.writer.releaseLock();
            await this.serialPort.close();
            this.serialPort = null;
            this.reader = null;
           // this.writer = null;
            this.receivedData = '';
        }
    }

    /**
     * 시리얼 연결 상태
     */
    getConnectState()
    {
        return this.connectState;
        // if (this.serialPort)
        // {
        //     return this.connectState;
        // }
        // else
        // {
        //     return this.connectState;
        // }
    }


    /**
     * 시리얼 포트로 데이터 쓰기
     * @param {object} args - 블록에서 전달된 인수
     */
    async writeValue (args) {

        // const encoder = new TextEncoder();
        // const writer = port.writable.getWriter();
        // await writer.write(encoder.encode(sendData));
        // writer.releaseLock();

        let writer = null;

        try {
            //await this.writer.write(encoder.encode(data));

            writer = this.serialPort.writable.getWriter();
            // const data = String(args.TEXT) + '\n'; // ESP32가 줄바꿈을 인식하도록 추가
            // const encoder = new TextEncoder();

            const encoder = new TextEncoder(); // TextEncoder는 기본적으로 UTF-8을 사용하지만, 명시적으로 확인
            const data = encoder.encode(args.TEXT + '\n'); // 텍스트에 줄바꿈(\n) 추가


            await writer.write(data);

            console.log("SUCCESS: writeValue.");

        } catch (error) {
            console.error('Serial write failed:', error);
        } finally {
                // 4. 오류 여부와 관계없이 락 해제
                if (writer) {
                    writer.releaseLock();
                }
            }

    }


    /**
     * 드롭다운 메뉴로 선택된 고양이 감지 값을 반환합니다.
     * 이 함수는 ZumiExtension 클래스의 속성에 직접 접근합니다.
     * @param {object} args - 블록 인수를 포함하는 객체 (예: { SENSOR: 'senFR' })
     * @returns {number} 선택된 센서의 최신 값
     */
    getCatDetectReading(args) {
        const detectKey = args.DETECT;
        return this._detectReading(detectKey)
    }

    getHumanDetectReading(args) {
        const detectKey = args.DETECT;
        return this._detectReading(detectKey)
    }

    getMarkerDetectReading(args) {
        const detectKey = args.DETECT;
       return this._detectReading(detectKey)
    }

    getColorDetectReading(args) {
        const detectKey = args.DETECT;
       return this._detectReading(detectKey)
    }



    _detectReading(detectKey) {
        if (this.hasOwnProperty(detectKey)) {
            return this[detectKey];
        }
        return 0;
    }








    /**
     * 드롭다운 메뉴로 선택된 IR 센서 값을 반환합니다.
     * 이 함수는 ZumiExtension 클래스의 속성에 직접 접근합니다.
     * @param {object} args - 블록 인수를 포함하는 객체 (예: { SENSOR: 'senFR' })
     * @returns {number} 선택된 센서의 최신 값
     */
    getIRSensorReading(args) {
        const sensorKey = args.SENSOR; // 'senFR', 'senFL', 'senBC' 등의 문자열

        // this.dataStore 대신, this 객체의 속성(this[sensorKey])에 직접 접근하여 값을 가져옵니다.
        if (this.hasOwnProperty(sensorKey)) {
            return this[sensorKey];
        }

        // 해당 속성이 없거나 유효하지 않은 경우 0을 반환합니다.
        return 0;
    }

    /**
     * 버튼 값을 반환합니다.
     */
    getBtnReading() {
        // this.dataStore는 ZumiDataStore의 인스턴스입니다.
       // console.log(this.btn);

        if(this.btn == 8) {
            return '빨강';
        }
        else if(this.btn == 4) {
            return '파랑';
        }
        else if(this.btn == 2) {
            return '초록';
        }
        else if(this.btn == 1) {
            return '노랑';
        }
        else {
            return '없음';
        }

      //  return this.btn;
    }

    getBatReading() {
        // this.dataStore는 ZumiDataStore의 인스턴스입니다.
        return this.battery;
    }

    /**
     * IR 센서 앞 오른쪽(senFR) 값을 반환합니다.
     */
    getSensorFR() {
        // this.dataStore는 ZumiDataStore의 인스턴스입니다.
        return this.senFR;
    }

    /**
     * 연결 타임아웃 타이머를 시작/재설정하고, 타임아웃 발생 시 연결 상태를 false로 변경합니다.
     */
    _resetConnectionTimeout() {
        // 1. 기존 타이머가 있다면 취소합니다. (이전 패킷 수신이 성공했으므로)
        if (this.connectionTimeoutHandler) {
            clearTimeout(this.connectionTimeoutHandler);
        }

        // 2. 새로운 타이머를 설정합니다. 지정된 시간 내에 다음 패킷이 오지 않으면 실행됩니다.
        this.connectionTimeoutHandler = setTimeout(() => {
            // 타임아웃 발생!
            if (this.connectState === true) {
                this.connectState = false; // 연결 상태를 끊김(false)으로 변경
                // console.warn("Connection Timeout: No data received for", this.CONNECTION_TIMEOUT_MS, "ms");

                // (선택 사항) 스크래치 런타임에 연결 끊김 이벤트를 알릴 수 있습니다.
                // this.runtime.emit(this.runtime.constructor.PERIPHERAL_CONNECTION_LOST, this);
            }
        }, this.CONNECTION_TIMEOUT_MS);
    }

    _updateDataStore(dataArray) {
        //console.log(dataArray);
        // this.dataStore 인스턴스가 존재한다고 가정

        // 이 함수 내에서 PacketDataIndex 상수와 HEADER_LENGTH를 사용하여
        // 파이썬의 __handler 로직을 그대로 구현합니다.
        //this.dataStore.updateData(dataArray, this.PacketDataIndex, this.HEADER_LENGTH);

        // 파이썬의 `self.headerLen`에 해당하는 오프셋 값을 가져옵니다.
        const offset = this.HEADER_LENGTH;

        // 1. 상태 플래그 업데이트
        // 참고: 파이썬 코드에서 DATA_COM과 DATA_INFO가 모두 인덱스 2를 참조했으나,
        // 여기서는 파이썬 핸들러가 참조했던 DATA_INFO, DATA_REQ, DATA_PSTAT만 업데이트합니다.
        this.reqINFO = dataArray[PacketIndex.DATA_INFO - offset];
        this.reqREQ = dataArray[PacketIndex.DATA_REQ - offset];
        this.reqPSTAT = dataArray[PacketIndex.DATA_PSTAT - offset];
        this.btn = dataArray[PacketIndex.DATA_BTN_INPUT - offset];
        this.battery = dataArray[PacketIndex.DATA_BATTERY - offset];

        // 2. IR 센서 업데이트
        this.senFR = dataArray[PacketIndex.DATA_SEN_FR - offset];
        this.senFL = dataArray[PacketIndex.DATA_SEN_FL - offset];
        this.senBR = dataArray[PacketIndex.DATA_SEN_BR - offset];
        this.senBC = dataArray[PacketIndex.DATA_SEN_BC - offset];
        this.senBL = dataArray[PacketIndex.DATA_SEN_BL - offset];

        // 3. 객체 감지 데이터 업데이트 (Boolean과 좌표)
        // 얼굴
        this.zumiFaceDetected = dataArray[PacketIndex.DATA_DETECT_FACE - offset] === 1;
        this.zumiFaceCenter[0] = dataArray[PacketIndex.DATA_DETECT_FACE_X - offset];
        this.zumiFaceCenter[1] = dataArray[PacketIndex.DATA_DETECT_FACE_Y - offset];

        // 색상
        this.zumiColorDetected = dataArray[PacketIndex.DATA_DETECT_COLOR - offset];
        this.zumiColorCenter[0] = dataArray[PacketIndex.DATA_DETECT_COLOR_X - offset];
        this.zumiColorCenter[1] = dataArray[PacketIndex.DATA_DETECT_COLOR_Y - offset];

        // 마커
        this.zumiMarkerDetected = dataArray[PacketIndex.DATA_DETECT_MARKER - offset];
        this.zumiMarkerCenter[0] = dataArray[PacketIndex.DATA_DETECT_MARKER_X - offset];
        this.zumiMarkerCenter[1] = dataArray[PacketIndex.DATA_DETECT_MARKER_Y - offset];

        // 고양이
        this.zumiCatDetected = dataArray[PacketIndex.DATA_DETECT_CAT - offset] === 1;
        this.zumiCatCenter[0] = dataArray[PacketIndex.DATA_DETECT_CAT_X - offset];
        this.zumiCatCenter[1] = dataArray[PacketIndex.DATA_DETECT_CAT_Y - offset];

        //console.log(this.senFR);
    }

    /**
     * 시리얼 포트로부터 데이터 읽기 (비동기 리스너)
     */
    _processReceiverByte(data) {
        // 1. Failure 상태 초기화
        if (this.receiverState === this.StateLoading.Failure) {
            this.receiverState = this.StateLoading.Ready;
        }

        // 2. Ready 상태: 초기화 및 Start 섹션 진입
        if (this.receiverState === this.StateLoading.Ready) {
            this.receiverSection = this.Section.Start;
            this.receiverIndex = 0;
        }

        else if (this.receiverState === this.StateLoading.Loaded){
            //console.log('return loaded');
            return this.receiverState;
        }



        // 2. section check
        if (this.receiverSection !== this.receiverSectionOld) {
            this.receiverIndex = 0;
            this.receiverSectionOld = this.receiverSection;
            //console.log('change section');
        }





        // 3. Section.Start: 헤더 확인
        if (this.receiverSection === this.Section.Start) {
            if (this.receiverIndex === 0) {
                if (data === this.PACKET_START_BYTE1) { // 0x24 ($)
                    this.receiverState = this.StateLoading.Receiving;
                    //console.log('0x24');
                } else {
                    this.receiverState = this.StateLoading.Failure;
                    this.receiverMessage = "Error: Invalid Start Byte 1";
                    console.log(receiverMessage);
                    return this.receiverState;
                }
            } else if (this.receiverIndex === 1) {
                if (data === this.PACKET_START_BYTE2) { // 0x52 (R)
                    this.receiverSection = this.Section.Data; // 데이터 섹션으로 이동
                    this.receiverBuffer = []; // 데이터 저장 버퍼 초기화
                    //console.log('0x52');
                } else {
                    this.receiverState = this.StateLoading.Failure;
                    this.receiverMessage = "Error: Invalid Start Byte 2";
                    console.log(receiverMessage);
                    return this.receiverState;
                }
            }
        }

        // 4. Section.Data: 데이터 본문 수집
        else if (this.receiverSection === this.Section.Data) {
            this.receiverBuffer.push(data);
            //console.log(this.receiverIndex);
            if (this.receiverIndex === (this.PACKET_DATA_LENGTH - 1)) {
                this.receiverSection = this.Section.End; // End 섹션으로 이동
                //console.log("go end section");
            }
        }

        // 5. Section.End: 패킷 완료 (파이썬 코드에서 CRC/꼬리가 생략된 것으로 추정)
        else if (this.receiverSection === this.Section.End) {
            //console.log("Section.End");
            // 파이썬 코드에서는 index == 1에서 Loaded 상태가 됩니다.
            if (this.receiverIndex === 1) {
                this.receiverData = [...this.receiverBuffer]; // 최종 데이터 복사
                this.receiverState = this.StateLoading.Loaded;
                this.receiverMessage = "Success: Receive complete";
                //console.log(this.receiverMessage);

                // =======================================================
                // 수신 완료 시 연결 상태 설정 및 타이머 재설정
                this.connectState = true;
                this._resetConnectionTimeout(); // 다음 패킷을 기다리는 타이머 시작!
                // =======================================================

                return this.receiverState;
            }
        }

        // 6. 인덱스 증가 (Receiving 상태일 때만)
        if (this.receiverState === this.StateLoading.Receiving) {
            this.receiverIndex++;
        }


        //console.log('return state',this.receiverState);
        return this.receiverState;
    }

    // Receiver 상태를 초기화하는 보조 함수
    _resetReceiverState() {
        this.receiverState = this.StateLoading.Ready;
        this.receiverSection = this.Section.Start;
        this.receiverIndex = 0;
        this.receiverBuffer = []; // 수신 버퍼 클리어
        this.receiverMessage = null;
        // this.receiverData는 Loaded 상태일 때만 업데이트되므로 유지
    }


/**
 * 웹 시리얼 포트에서 수신된 원시 데이터(Uint8Array)를 처리하고
 * 패킷을 재조립하여 데이터 저장소를 업데이트합니다.
 * * @param {Uint8Array} data - 시리얼 포트에서 읽은 원시 바이트 데이터.
 */
    processRawData(data) {

        //console.log('data',data);

        // 1. 수신된 원시 데이터를 내부 버퍼에 추가합니다.
        // this.bufferHandler는 bytearray (Uint8Array)와 유사한 역할입니다.
        // 여기서는 간단히 배열로 처리하겠습니다.
        if (!this.bufferHandler) {
            this.bufferHandler = []; // 초기화
        }

        // Uint8Array의 각 요소를 일반 배열에 추가
        for (const byte of data) {
            this.bufferHandler.push(byte);
        }


        // 2. 버퍼에 데이터가 남아있는 한, 바이트 단위로 Receiver 로직을 수행합니다.
        while (this.bufferHandler.length > 0) {
            // 버퍼의 첫 번째 바이트를 꺼내서 처리합니다. (파이썬의 pop(0)과 유사)
            const byte = this.bufferHandler.shift();

            // **3. Receiver 로직 (State Machine) 실행**
            const stateLoading = this._processReceiverByte(byte);

            //console.log('state',stateLoading);

            // 4. 패킷 완료 확인 및 처리
            if (stateLoading === this.StateLoading.Loaded) {

                //console.log("packet end");
                // 데이터 저장소 업데이트 (파이썬의 __handler 역할)

                this._updateDataStore(this.receiverData);


                // Receiver 상태 초기화 (다음 패킷을 받을 준비)
                this._resetReceiverState();

                // 경고/디버그 출력 (선택 사항)
                //console.log("Packet received and data store updated.");

                // 루프를 다시 시작하여 버퍼에 남아있는 데이터가 있는지 확인합니다.
                continue;
            }
            // 5. 오류 처리 (파이썬의 StateLoading.Failure)
            if (stateLoading === this.StateLoading.Failure) {
                // 오류 메시지 출력 (파이썬의 self._debugger._printError 역할)
                // console.error("Receiver Error:", this.receiverMessage);

                // Receiver 상태 초기화
                this._resetReceiverState();
                // 버퍼에 남아있는 데이터는 다음 패킷의 시작일 수 있으므로 버퍼를 비우지 않습니다.
            }
        }
    }

    async readSerial() {
        if (!this.serialPort || !this.serialPort.readable) return;

        //const decoder = new TextDecoder('utf-8');
        this.reader = this.serialPort.readable.getReader();

        //let buffer = ''; // 줄바꿈을 기다리는 임시 버퍼

        while (true) {
            try {
                const { value, done } = await this.reader.read();
               // console.log('value',value);
                if (done) break;

                this.processRawData(value); // Receiver 역할 수행

                //buffer += decoder.decode(value); // 데이터를 버퍼에 누적
                // // 줄바꿈 문자('\n')를 기준으로 데이터 처리
                // let newlineIndex;
                // while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
                //     // 완전한 한 줄(line) 추출
                //     const line = buffer.substring(0, newlineIndex).trim();
                //     // 버퍼에서 처리된 부분 제거
                //     buffer = buffer.substring(newlineIndex + 1);
                //     if (line.length > 0) {
                //         // 1. 최신 데이터 저장
                //         this.receivedData = line;
                //         // 2. [선택적] VM에 데이터 업데이트 알림
                //         // 이 코드가 없어도 리포터 블록은 값을 가져가지만,
                //         // Scratch의 라이브 변수 등 실시간 업데이트에 필요할 수 있습니다.
                //         // this.runtime.emit(this.runtime.constructor.PROJECT_RUN_START);
                //     }
                // }

            } catch (error) {
                // 포트가 닫힌 경우 등
                break;
            }
        }
    }

    /**
     * 현재까지 수신된 데이터를 리포트 블록으로 반환
     */
    // readValue () {
    //     // 읽은 후 데이터를 비우는 로직을 추가하여 최신 데이터만 가져오게 할 수도 있습니다.
    //     const data = this.receivedData;
    //     this.receivedData = ''; // 데이터를 반환한 후 비우기
    //     return data;
    // }


    // ===============================================
    // 1. 개별 블록 함수 (파이썬의 led_control() 역할)
    // ===============================================

    ledControlByColor (args) {
        // 1. Scratch 블록에서 전달받은 HEX 색상 문자열 추출
        const hexColor = args.COLOR; // 예: "#FF0000"

        // 2. HEX 코드를 R, G, B 10진수 값 (0~255)으로 변환
        // HEX 문자열에서 # 제거 후 R, G, B 값을 각각 16진수에서 10진수로 파싱
        // substr(1)로 # 제거, substr(1, 2)는 R, substr(3, 2)는 G, substr(5, 2)는 B
        const r255 = parseInt(hexColor.substr(1, 2), 16);
        const g255 = parseInt(hexColor.substr(3, 2), 16);
        const b255 = parseInt(hexColor.substr(5, 2), 16);

        // 3. Zumi 프로토콜 요구사항에 맞게 0~255 값을 0~10 범위로 정규화
        // (10 / 255)를 곱하여 0~10 범위로 변환 후, 정수(바이트)로 변환
        const r10 = Math.round(r255 * (10 / 255));
        const g10 = Math.round(g255 * (10 / 255));
        const b10 = Math.round(b255 * (10 / 255));

        // 4. sendCommand 함수 호출
        // sendCommand(커맨드 타입, param1(R), param2(G), param3(B))
        return this.sendCommand(
            CommandType.COMMAND_LED,
            r10,
            g10,
            b10
        );
    }


    // opcode: 'ledControl'
    ledControl (args) {
        // 24 52 0A 00 0A 0A 0A

        const r = parseInt(args.R_VALUE);
        const g = parseInt(args.G_VALUE);
        const b = parseInt(args.B_VALUE);
        // COMMAND_LED와 3개의 파라미터를 전달
        console.log(r,g,b)
        return this.sendCommand(CommandType.COMMAND_LED, r, g, b);
    }

    // ===============================================
    // 개별 블록 함수 (text 역할)
    // ===============================================
    // 1-1. display_text (새로운 텍스트 출력)

    /**
     * 스크래치 드롭다운에서 선택된 문자열 값을 불리언(true/false) 값으로 변환하여 반환합니다.
     * @param {object} args - 스크래치 블록에서 전달된 인수 객체.
     * args.VALUE: 드롭다운에서 선택된 문자열 ('참' 또는 '거짓').
     * @returns {boolean} 변환된 불리언 값 (true 또는 false).
     */

    display_text_command(args) {
        let newlineVal = 0
        if (args.STATE === 'on') {
            newlineVal = 1
        }
        return this._sendTextBase(CommandType.COMMAND_TEXT_INPUT, args.TEXT, newlineVal);
    }

    // 1-2. display_text_add (텍스트 이어 출력)
    display_text_add_command(args) {
        let newlineVal = 0
        if (args.STATE === 'on') {
            newlineVal = 1
        }
        return this._sendTextBase(CommandType.COMMAND_TEXT_ADD, args.TEXT, newlineVal);
    }

    // 2. display_text_clear (디스플레이 초기화)
    display_text_clear_command() {
        // 파이썬 로직: self.display_text("")
        // 빈 문자열을 출력하고 줄바꿈은 '안함'으로 설정하여, 현재 줄 위치를 초기화하는 효과도 냄
        return this._sendTextBase(CommandType.COMMAND_TEXT_INPUT, '', 0);
    }

    // 3. display_text_set (색상 및 크기 설정)
    display_text_set_command(args) {
        // 인수는 0-255 범위의 정수여야 하지만, 파이썬에서 이미 0~22, 0~5로 제한됨.
        const color = args.TEXT_COLOR_VALUE; // 텍스트 색상 코드 (0-22)
        const size = args.TEXT_SIZE_VALUE;   // 텍스트 크기 (0-5)
        const usePos = 0;         // 위치 설정 안함 (0)

        console.log(color);

        // 파이썬 로직: self.sendCommand(CommandType.COMMAND_TEXT_SET, color ,size, usePos, 0, 0)
        // sendCommand 함수를 사용하여 간단한 명령어와 매개변수 전송 (this.sendCommand 가정)
        return this.sendCommand(
            CommandType.COMMAND_TEXT_SET,
            color,
            size,
            usePos,
            0,
            0
        );
    }

    // 4. display_text_pos (위치 설정 및 비트 연산)
    display_text_pos_command(args) {
        // 1. 인수 추출
        let posX = parseInt(args.TEXT_X_VALUE);
        let posY = parseInt(args.TEXT_Y_VALUE);

        console.log(posX)
        console.log(posY)

        const usePos = 1; // 위치 설정 사용 (1)

        // 2. 오프셋 설정 (파이썬 로직: pos_x = pos_x + 500)
        posX += 500;
        posY += 500;

        console.log(posX)
        console.log(posY)

        // 3. 범위 확인 (파이썬과 동일하게 에러 처리/무시)
        // 스크래치 확장에서는 보통 에러 대신 경고를 출력하거나 유효한 범위 내로 클램프합니다.
        if (!(0 <= posX && posX <= 2047 && 0 <= posY && posY <= 2047)) {
            console.error("Error: pos_x and pos_y must be between 0 and 2047 after offset.");
            // 유효하지 않은 경우 통신을 시도하지 않고 종료할 수 있습니다.
            // return Promise.resolve();
        }

        // 4. 비트 연산 및 바이트 구성 (파이썬 로직을 JS 비트 연산으로 변환)

        // pos_x와 pos_y는 이제 0-2047 범위의 값입니다. (11비트 필요)

        // buf2: pos_x의 하위 8비트 추출
        // 파이썬: buf2 = pos_x & 0xFF
        const buf2 = posX & 0xFF;

        // buf3: pos_y의 하위 8비트 추출
        // 파이썬: buf3 = pos_y & 0xFF
        const buf3 = posY & 0xFF;

        // buf1 구성
        let buf1 = 0;

        // pos_x의 상위 3비트 추출 및 buf1의 비트 6, 5, 4 위치에 저장
        // 파이썬: upper_bits_pos_x = (pos_x >> 8) & 0x07; buf1 |= upper_bits_pos_x << 4
        const upper_bits_pos_x = (posX >> 8) & 0x07;
        buf1 |= upper_bits_pos_x << 4;

        // pos_y의 상위 3비트 추출 및 buf1의 비트 3, 2, 1 위치에 저장
        // 파이썬: upper_bits_pos_y = (pos_y >> 8) & 0x07; buf1 |= upper_bits_pos_y << 1
        const upper_bits_pos_y = (posY >> 8) & 0x07;
        buf1 |= upper_bits_pos_y << 1;

        // usePos 플래그 비트 추출 및 buf1의 비트 7 위치에 저장
        // 파이썬: usePos_bit = usePos & 0x01; buf1 |= usePos_bit << 7
        const usePos_bit = usePos & 0x01;
        buf1 |= usePos_bit << 7;

        // 파이썬 로직: self.sendCommand(CommandType.COMMAND_TEXT_SET, 0 ,0, buf1 ,buf2, buf3)
        // NOTE: 파이썬의 display_text_set 함수와 동일한 COMMAND_TEXT_SET을 사용하고,
        // color와 size는 0으로 고정하여 좌표 설정 명령만 전달합니다.
        return this.sendCommand(
            CommandType.COMMAND_TEXT_SET,
            0, // color (파이썬과 동일하게 0)
            0, // size (파이썬과 동일하게 0)
            buf1,
            buf2,
            buf3
        );
    }


    _sendTextBase(commandType, text, newlineOption) {
        console.log("_sendTextBase")
        const encoder = new TextEncoder();
        let encoded_bytes = encoder.encode(text);

        // 최대 길이(27 바이트) 제한 적용
        if (encoded_bytes.length > 27) {
            encoded_bytes = encoded_bytes.slice(0, 27);
        }

        // 텍스트 바이트 배열 구성: [CommandType, ...encoded_bytes, (\n), \x00]
        let final_bytes_array = [commandType];

        for (const byte of encoded_bytes) {
            final_bytes_array.push(byte);
        }

        // 줄바꿈 (\n, ASCII 10) 추가
        if (newlineOption === 1) {
            final_bytes_array.push(10);
            console.log("newlineOption = 1")
        }

        // 종료 바이트 (\x00, ASCII 0) 추가
        final_bytes_array.push(0);

        const final_bytes = new Uint8Array(final_bytes_array);

        // 통신 함수 호출 (파이썬의 self.transfer(final_bytes)에 해당)
        return this.transferData(final_bytes);
    }

    // ===============================================
    // 개별 블록 함수 (move 역할)
    // ===============================================

    //지정된 거리만큼 주미를 전진시킵니다.
    forward_dist(args) {

        return this._send_move_dist(parseInt(args.MOVE_SPEED), parseInt(args.MOVE_DIST), parseInt(args.MOVE_DIRECTION));
    }

    _send_move_dist(speed, dist, dir)
    {
        if(speed < 1) {speed = 1};
        if(speed > 3) {speed = 3};

        if(dist < 0) {dist = 0};
        if(dist > 300) {dist = 300};

        if(dir < 0) {dir = 0};
        if(dir > 1) {dir = 1};

        return this.sendCommand(
            CommandType.COMMAND_GO_UNTIL_DIST,
            speed,
            dist,
            dir
        );
    }

    // 회전
    /**
     * 지정된 방향, 각도, 속도로 주미 로봇을 회전시키는 명령을 전송합니다.
     * 이 함수는 파이썬의 send_turn 역할을 수행합니다.
     * @param {object} args - { DIRECTION: string (0|1), DEGREE: number, SPEED: string (1|2|3) }
     */

    turn_angle(args) {
        // 1. 인수 가져오기 및 범위 확인 (파이썬 로직 반영)
        let dir = parseInt(args.TURN_DIRECTION); // 0 (왼쪽) 또는 1 (오른쪽)
        let deg = Math.round(parseFloat(args.TURN_ANGLE)); // 각도는 정수화
        let speed = parseInt(args.TURN_SPEED);

        return this._sendTurnCommand(speed, deg, dir);
    }


    _sendTurnCommand(speed, deg, dir) {
        // // 1. 인수 가져오기 및 범위 확인 (파이썬 로직 반영)
        // let speed = parseInt(args.SPEED);
        // let deg = Math.round(parseFloat(args.DEGREE)); // 각도는 정수화
        // let dir = parseInt(args.DIRECTION); // 0 (왼쪽) 또는 1 (오른쪽)


        // 속도 제한 (1~3)
        if (speed < 1) speed = 1;
        if (speed > 3) speed = 3;

        // 방향 제한 (0~1) - 드롭다운에서 이미 보장되지만 코드 무결성을 위해 유지
        if (dir < 0) dir = 0;
        if (dir > 1) dir = 1;

        // 2. 각도 바이트 분할 (파이썬 로직 반영)
        let degHigh = 0;
        let degLow = 0;

        if (deg < 256) { // 256도 미만 (0x00FF 이하)
            degLow = deg;
        } else {
            degHigh = Math.floor(deg / 256); // 상위 바이트 (몫)
            degLow = deg % 256;              // 하위 바이트 (나머지)
        }


        // 파이썬: self.sendCommand(COMMAND_FREE_TURN_PYTHON, speed, deg_low, deg_high, dir)
        // 인수의 순서가 중요합니다: 속도, 각도_하위, 각도_상위, 방향
        return this.sendCommand(
            CommandType.COMMAND_FREE_TURN_PYTHON,
            speed,
            degLow,
            degHigh,
            dir
        );
        // 이 함수는 command 블록이므로 값을 반환하지 않거나 Promise를 반환합니다.
    }






    // ===============================================
    // 개별 블록 함수 (기타)
    // ===============================================


    // led_pattern(self, pattern:int=1, time:int=1){
    // }
    ledPattern(args){
        // 24 52 0A 00 0A 0A 0A
        const pattern = parseInt(args.PATTERN);
        const timeInSeconds = parseInt(args.TIME);

        // console.log(r,g,b)

        // if not isinstance(pattern, LED_effectType):
        //     try:
        //         pattern = LED_effectType(pattern)
        //     except ValueError:
        //         pattern = LED_effectType.LED_NORMAL  # 기본값
        // time_high = 0
        // time_low = 0
        // time = int(time *1000)
        // if(time < 255) : time_low = time
        // else :
        //     time_high = time // 256  # 상위 바이트 (몫)
        //     time_low = time % 256   # 하위 바이트 (나머지)
        //return this.sendCommand(CommandType.COMMAND_PATTERN_LED, pattern, time);


        // 2. 시간 계산 및 바이트 분할 (파이썬 로직 반영)
        // 파이썬: time = int(time * 1000)
        let timeInMs = Math.floor(timeInSeconds * 1000); // 밀리초(ms) 단위로 변환

        // 255ms 초과 여부에 따라 상위/하위 바이트를 분리합니다.
        let timeHigh = 0;
        let timeLow = 0;

        if (timeInMs < 256) { // 256ms 미만 (0x00FF 이하)
            timeLow = timeInMs;
        } else {
            timeHigh = Math.floor(timeInMs / 256); // 상위 바이트 (몫)
            timeLow = timeInMs % 256;              // 하위 바이트 (나머지)
        }

        // 3. sendCommand 호출 (통신 프로토콜)
        // self.sendCommand(CommandType.COMMAND_PATTERN_LED, pattern.value, time_high, time_low)를 모방

        const COMMAND_PATTERN_LED = 0xAA; // 예시: 실제 프로토콜에서 해당 명령어 코드 사용

        // 이 함수는 실제 통신 모듈(Web Serial, Bluetooth 등)을 통해 데이터를 전송합니다.
        return this.sendCommand(
            CommandType.COMMAND_PATTERN_LED, // 통신 명령 코드
            pattern,             // LED 패턴 값 (0~6)
            timeHigh,            // 시간 상위 바이트
            timeLow              // 시간 하위 바이트
        );
    }

    play_sound_command(args) {

        return this.sendCommand(
            CommandType.COMMAND_PLAY_SOUND,
            args.NOTE
        );
    }

    change_emotion_command(args) {

        return this.sendCommand(
            CommandType.COMMAND_EMOTION_CHANGE,
            args.EMOTION
        );
    }

    show_camera_command(args) {
        let cameraON = 2
        if (args.STATE === 'camera') {
            cameraON = 1
        }

        return this.sendCommand(
            CommandType.COMMAND_SCREEN_TOGGLE,
            cameraON
        );
    }

    // =========================================================
    // 2. 핵심 전송 함수 (파이썬의 sendCommand + transfer 역할)
    // =========================================================
    // async sendCommand1(commandType, ...params) {
    //     console.log("sendCommand1")
    //     // if (!this.port || !this.port.writable) {
    //     //     console.warn("Serial port is not connected or writable. Cannot send command.");
    //     //     return;
    //     // }
    //     if (!this.writer) return;

    //     const commandName = Object.keys(CommandType).find(key => CommandType[key] === commandType);
    //     if (!commandName) {
    //         console.error(`Unknown commandType: ${commandType}`);
    //         return;
    //     }
    // }
        // """
        // 전역적으로 사용할 request 값을 설정합니다.
        // 이 값은 따로 none 처리하기 전까지 계속 유지됩니다.
        // """


    detector_request(args){

        const requestKey = args.DETECTOR;
        console.log(requestKey);

    if (RequestType.hasOwnProperty(requestKey)) {

        // 2. 동적 접근: RequestType[requestKey]를 사용하여 실제 비트 값을 가져옵니다.
        const requestValue = RequestType[requestKey];

        console.log(requestValue);


        if(args.STATE == 'on')
        {
            //console.log('on');
            return this.set_request(requestValue)
        }
        else{
            //console.log('off');
            return this.clear_request(requestValue)
        }


        // 3. 기존 요청 값에 새로운 요청 값을 비트 단위 OR 연산으로 추가(병합)
        // this._current_request 변수는 클래스 멤버 변수라고 가정합니다.
        //this._current_request |= requestValue;

        // (디버깅용)
        // console.log(`요청 '${requestKey}' (값: 0x${requestValue.toString(16)})가 현재 요청 상태에 병합되었습니다.`);
    }
    else {
        console.error(`오류: 알 수 없는 요청 키이거나 정의되지 않은 값입니다: ${requestKey}`);
    }




       // self.current_request |= request;
       // return this.set_request(request)
    }


    set_request(request){
        this._current_request |= request;
        return this.sendCommand(CommandType.COMMAND_NONE)
    }

    // """
    // 전역적으로 설정된 request 값에서 특정 request 값을 제거합니다.
    // """
    clear_request(request){
        this._current_request &= ~request;
        return this.sendCommand(CommandType.COMMAND_NONE)
    }


    async sendCommand(commandType, ...params) {

       // if (!this.writer) return;

        console.log("sendCommand")
        // if (!this.port || !this.port.writable) {
        //     console.warn("Serial port is not connected or writable. Cannot send command.");
        //     return;
        // }
       // if (!this.writer) return;

        const commandName = Object.keys(CommandType).find(key => CommandType[key] === commandType);
        if (!commandName) {
            console.error(`Unknown commandType: ${commandType}`);
            return;
        }

        // 1. 데이터 본문 구성 (파이썬 Command_variable_byte.toArray()의 일부)
        const paramLength = CommandType_DATA_LENGTH[commandName] || 0;
        // 커맨드 바이트(1) + 파라미터(N)
        const payloadBytes = new Uint8Array(1 + paramLength);

        payloadBytes[0] = commandType;

        for (let i = 0; i < params.length && i < paramLength; i++) {
            // 파라미터는 1바이트 크기로 전송
            payloadBytes[i + 1] = params[i] & 0xFF;
        }

        //console.log(paramLength)
        return this.transferData(payloadBytes)
        /*
        //this._currentRequest = 0x01; //test

        // 2. 전체 전송 데이터 배열 구성 (파이썬 makeTransferDataArray 역할)
        const HEADER1 = 0x24; // '$'
        const HEADER2 = 0x52; // 'R'
        const REQUEST_BYTE = this._currentRequest || 0x00;

        // 전체 메시지 길이: 헤더(2) + 커맨드(1) + 리퀘스트(1) + 파라미터(paramLength)
        const fullMessageLength = 4 + paramLength;

        const dataArray = new Uint8Array(fullMessageLength);
        let index = 0;

        // 2.1 헤더 ($R)
        dataArray[index++] = HEADER1;
        dataArray[index++] = HEADER2;

        // 2.2 커맨드 바이트
        dataArray[index++] = payloadBytes[0];

        // 2.3 리퀘스트 바이트
        dataArray[index++] = REQUEST_BYTE;

        // 2.4 파라미터 데이터
        // payloadBytes.slice(1)은 commandType을 제외한 파라미터들만 포함 (파이썬 data[1:]에 해당)
        dataArray.set(payloadBytes.slice(1), index);

        // 3. 전송
        //const writer = this.port.writable.getWriter();
        // try {
        //     //await writer.write(dataArray);
        //     await this.writer.write(dataArray);
        //     console.log("Sent Data Array (Hex):", Array.from(dataArray).map(b => b.toString(16).padStart(2, '0')).join(' '));
        //     this.writer.releaseLock();
        // } catch (error) {
        //     console.error("Serial Write Error:", error);
        // } finally {
        // }

        let writer = null;
        try {
                // 2. 명령을 보낼 때마다 새로운 writer 객체를 획득 (락 획득)
                writer = this.serialPort.writable.getWriter();

                // 3. 쓰기 작업
                await writer.write(dataArray);

                console.log("SUCCESS: sendCommand.");

            } catch (error) {
                // 락 획득 또는 쓰기 작업 중 오류 발생 시
                console.error("Serial Write Error:", error);

            } finally {
                // 4. 오류 여부와 관계없이 락 해제
                if (writer) {
                    writer.releaseLock();
                }
            }
    */


    }

    async transferData(payloadBytes) {

        //this._currentRequest = 0x01; //test

        // 2. 전체 전송 데이터 배열 구성 (파이썬 makeTransferDataArray 역할)
        const HEADER1 = 0x24; // '$'
        const HEADER2 = 0x52; // 'R'
        const REQUEST_BYTE = this._currentRequest || 0x00;


        //console.log(payloadBytes.length)


        // 전체 메시지 길이: 헤더(2) + 커맨드(1) + 리퀘스트(1) + 파라미터(paramLength)
        const fullMessageLength = 4 + payloadBytes.length-1;

        const dataArray = new Uint8Array(fullMessageLength);
        let index = 0;

        // 2.1 헤더 ($R)
        dataArray[index++] = HEADER1;
        dataArray[index++] = HEADER2;

        // 2.2 커맨드 바이트
        dataArray[index++] = payloadBytes[0];

        // 2.3 리퀘스트 바이트
        dataArray[index++] = this._current_request;

        // 2.4 파라미터 데이터
        // payloadBytes.slice(1)은 commandType을 제외한 파라미터들만 포함 (파이썬 data[1:]에 해당)
        dataArray.set(payloadBytes.slice(1), index);

        // 3. 전송
        //const writer = this.port.writable.getWriter();
        // try {
        //     //await writer.write(dataArray);
        //     await this.writer.write(dataArray);
        //     console.log("Sent Data Array (Hex):", Array.from(dataArray).map(b => b.toString(16).padStart(2, '0')).join(' '));
        //     this.writer.releaseLock();
        // } catch (error) {
        //     console.error("Serial Write Error:", error);
        // } finally {
        // }

        let writer = null;
        try {
                // 2. 명령을 보낼 때마다 새로운 writer 객체를 획득 (락 획득)
                writer = this.serialPort.writable.getWriter();

                // 3. 쓰기 작업
                await writer.write(dataArray);

               // console.log(dataArray);

                //console.log("SUCCESS: sendCommand.");

            } catch (error) {
                // 락 획득 또는 쓰기 작업 중 오류 발생 시
                console.error("Serial Write Error:", error);

            } finally {
                // 4. 오류 여부와 관계없이 락 해제
                if (writer) {
                    writer.releaseLock();
                }
            }
    }



}

module.exports = Scratch3Esp32Serial;