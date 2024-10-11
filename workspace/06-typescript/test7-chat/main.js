// "use strict";//ts -> js 변환시 자동으로 들어간다..
// function Member(id, nickname, photo){
//   this.id = id
//   this.nickname = nickname
//   this.photo = photo
// }
//ts 에서 생성자 함수를 지원하지 않는 것은 아니지만.. 
//oop 를 클래스로 할 것을 권장.. 
//코드적으로도 클래스로 선언하는 것이 더 짧게.. 
var Member = /** @class */ (function () {
    function Member(id, nickname, photo) {
        this.id = id;
        this.nickname = nickname;
        this.photo = photo;
    }
    return Member;
}());
// function Emoji(emojiId){
//   this.emojiId = emojiId
//   this.count = 0
//   this.members = []
//   this.add = function(memberId){
//     this.count++
//     this.members.push(memberId)
//   }
// }
var Emoji = /** @class */ (function () {
    function Emoji(emojiId) {
        this.emojiId = emojiId;
        this.count = 0;
        this.members = [];
    }
    Emoji.prototype.add = function (memberId) {
        this.count++;
        this.members.push(memberId);
    };
    return Emoji;
}());
// function Message(msg, member) {
//   this.msg = msg
//   this.member = member
//   this.date = new Date().toLocaleString()
//   this.emojis = []
//   this.addEmoji = function (emojiId, memberId) {
//     if (this.emojis.every(item => item.emojiId !== emojiId)) {
//       let emoji = new Emoji(emojiId)
//       emoji.add(memberId)
//       this.emojis.push(emoji)
//     } else {
//       let index = this.emojis.findIndex((item) => item.emojiId === emojiId)
//       this.emojis[index].add(memberId)
//     }
//   }
// }
var Message = /** @class */ (function () {
    function Message(msg, member) {
        this.msg = msg;
        this.member = member;
        this.msgId = 0;
        this.date = new Date().toLocaleString();
        this.emojis = [];
        this.addEmoji = function (emojiId, memberId) {
            if (this.emojis.every(function (item) { return item.emojiId !== emojiId; })) {
                var emoji = new Emoji(emojiId);
                emoji.add(memberId);
                this.emojis.push(emoji);
            }
            else {
                var index = this.emojis.findIndex(function (item) { return item.emojiId === emojiId; });
                this.emojis[index].add(memberId);
            }
        };
    }
    return Message;
}());
var messages = [];
var member;
var webSocket;
//dom node 의 기본 타입은 HTMLElement
//input 태그의 node 객체의 경우 value 변수로 입력 값을 획득해야 하는데.. 
//HTMLElement 에는 value 변수가 없다. HTMLElement 의 서브 클래스인 HTMLInputElement 로 사용해야
//document.getElementById() 은 HTMLElement 타입을 리턴한다. 이 타입을 as 예약어로 타입 변형..
var nicknameInputNode = document.getElementById('nicknameInput');
var idInputNode = document.getElementById('idInput');
var msgInputNode = document.getElementById('msgInput');
var chatMainNode = document.getElementById('chat-main');
var nicknameForm = document.getElementById('nicknameForm');
var msgForm = document.getElementById('msgForm');
function printMessage(message) {
    var menuImageNode = document.createElement('img');
    menuImageNode.setAttribute('src', 'images/menu.jpg');
    var menuButton = document.createElement('button');
    menuButton.setAttribute('class', 'msg-info-menu dropbtn');
    menuButton.appendChild(menuImageNode);
    var link1 = document.createElement('a');
    link1.setAttribute('href', '#');
    link1.setAttribute('onclick', "emojiClick('".concat(message.msgId, "','thumbup')"));
    var link1Text = document.createTextNode('좋아요');
    link1.appendChild(link1Text);
    var link2 = document.createElement('a');
    link2.setAttribute('href', '#');
    link2.setAttribute('onclick', "emojiClick('".concat(message.msgId, "','ok')"));
    var link2Text = document.createTextNode('넵');
    link2.appendChild(link2Text);
    var links = document.createElement('div');
    links.setAttribute('class', 'dropdown-content');
    links.appendChild(link1);
    links.appendChild(link2);
    var dropdown = document.createElement('div');
    dropdown.setAttribute('class', 'dropdown');
    dropdown.appendChild(menuButton);
    dropdown.appendChild(links);
    var name = document.createElement('div');
    name.setAttribute('class', 'msg-info-name');
    name.appendChild(document.createTextNode(message.member.nickname));
    var date = document.createElement('div');
    date.setAttribute('class', 'msg-info-time');
    date.appendChild(document.createTextNode(message.date));
    var msgInfo = document.createElement('div');
    msgInfo.setAttribute('class', 'msg-info');
    msgInfo.appendChild(name);
    msgInfo.appendChild(date);
    msgInfo.appendChild(dropdown);
    var msgText = document.createElement('div');
    msgText.setAttribute('class', 'msg-text');
    msgText.appendChild(document.createTextNode(message.msg));
    var msgBubble = document.createElement('div');
    msgBubble.setAttribute('class', 'msg-bubble');
    msgBubble.appendChild(msgInfo);
    msgBubble.appendChild(msgText);
    var photoNode = document.createElement('img');
    photoNode.setAttribute('src', message.member.photo);
    photoNode.setAttribute('class', 'msg-img');
    var mainNode = document.createElement('div');
    mainNode.setAttribute('id', "msgId-".concat(message.msgId));
    mainNode.setAttribute('class', 'msg left-msg');
    mainNode.appendChild(photoNode);
    mainNode.appendChild(msgBubble);
    //이 객체에 정상적으로 객체가 대입될 수도 있지만 null 일수도 있다..
    //null 인 경우 함수 호출하면 에러가 난다.. 
    //null 이면 함수 호출이 안되게 처리해 주어야 한다.. 
    //?. 으로.. 
    chatMainNode === null || chatMainNode === void 0 ? void 0 : chatMainNode.appendChild(mainNode);
}
function connect(e) {
    e.preventDefault();
    var id = idInputNode.value;
    var nickname = nicknameInputNode.value;
    if (id.trim().length == 0 || nickname.trim().length == 0) {
        alert('아이디, 닉네임을 입력해야 합니다.');
        return;
    }
    else {
        idInputNode.value = '';
        nicknameInputNode.value = '';
        member = new Member(id, nickname, "images/".concat(id, ".jpg"));
        webSocket = new WebSocket('ws://localhost:3000');
        webSocket.onmessage = onMessage;
    }
}
function send(e) {
    e.preventDefault();
    var msg = msgInputNode.value;
    if (msg.trim().length == 0) {
        alert('메시지를 입력해야 합니다.');
        return;
    }
    else {
        msgInputNode.value = '';
        var message = new Message(msg, member);
        //객체 멤버 접근...
        message['gubun'] = 'msg';
        webSocket.send(JSON.stringify(message));
    }
}
function printEmoji(message) {
    var emojis = message.emojis;
    if (emojis.length > 0) {
        var messageBubble = document.querySelector("#msgId-".concat(message.msgId, " .msg-bubble"));
        var emojiNode = messageBubble === null || messageBubble === void 0 ? void 0 : messageBubble.querySelector('.emojis');
        if (emojiNode) {
            messageBubble === null || messageBubble === void 0 ? void 0 : messageBubble.removeChild(emojiNode);
        }
        var emojisNode_1 = document.createElement('div');
        emojisNode_1.setAttribute('class', 'emojis');
        emojis.forEach(function (emoji) {
            var img = document.createElement('img');
            img.setAttribute('class', 'emoji dropbtn');
            img.setAttribute('src', "images/".concat(emoji.emojiId, ".jpg"));
            var span = document.createElement('span');
            var nicknameTxt = emoji.members.join(',');
            span.appendChild(document.createTextNode(nicknameTxt));
            var dropdownContent = document.createElement('div');
            dropdownContent.setAttribute('class', 'dropdown-content');
            dropdownContent.appendChild(span);
            var dropdown = document.createElement('div');
            dropdown.setAttribute('class', 'dropdown');
            dropdown.appendChild(img);
            dropdown.appendChild(dropdownContent);
            var span2 = document.createElement('span');
            span2.setAttribute('class', 'emoji-count');
            span2.appendChild(document.createTextNode("".concat(emoji.count)));
            emojisNode_1.appendChild(dropdown);
            emojisNode_1.appendChild(span2);
        });
        messageBubble === null || messageBubble === void 0 ? void 0 : messageBubble.appendChild(emojisNode_1);
    }
}
function emojiClick(msgId, emojiId) {
    var emoji = new Emoji(emojiId);
    emoji["memberId"] = member.id;
    emoji["msgId"] = msgId;
    emoji["gubun"] = 'emoji';
    webSocket.send(JSON.stringify(emoji));
}
function onMessage(event) {
    //서버에서 받은 데이터를 타입으로 지정하기 애매한 상황.. any
    var serverData = JSON.parse(event.data);
    if (serverData.gubun === 'connect') {
        if (serverData.state === 'ok') {
            //node 의 속성 이용을 함수를 통해서 사용하게..
            nicknameForm === null || nicknameForm === void 0 ? void 0 : nicknameForm.setAttribute('style', 'display:none');
            msgForm === null || msgForm === void 0 ? void 0 : msgForm.removeAttribute('style');
        }
        else {
            alert('서버 연결에 실패 했습니다.');
        }
    }
    else if (serverData.gubun === 'msg') {
        var message = new Message(serverData.msg, serverData.member);
        message.msgId = serverData.msgId;
        messages.push(message);
        printMessage(message);
    }
    else if (serverData.gubun === 'emoji') {
        var index = messages.findIndex(function (item) { return item.msgId == parseInt(serverData.msgId); });
        messages[index].addEmoji(serverData.emojiId, serverData.memberId);
        printEmoji(messages[index]);
    }
}
