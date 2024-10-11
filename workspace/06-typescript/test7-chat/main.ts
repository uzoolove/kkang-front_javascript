// "use strict";//ts -> js 변환시 자동으로 들어간다..

// function Member(id, nickname, photo){
//   this.id = id
//   this.nickname = nickname
//   this.photo = photo
// }
//ts 에서 생성자 함수를 지원하지 않는 것은 아니지만.. 
//oop 를 클래스로 할 것을 권장.. 
//코드적으로도 클래스로 선언하는 것이 더 짧게.. 
class Member {
  constructor(public id: string, public nickname: string, public photo: string) { }
}


// function Emoji(emojiId){
//   this.emojiId = emojiId
//   this.count = 0
//   this.members = []
//   this.add = function(memberId){
//     this.count++
//     this.members.push(memberId)
//   }
// }
class Emoji {
  constructor(public emojiId: string) { }
  count: number = 0
  members: Array<string> = []
  add(memberId: string) {
    this.count++
    this.members.push(memberId)
  }
}

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

class Message {
  constructor(public msg: string, public member: Member) { }
  msgId: number = 0
  date: string = new Date().toLocaleString()
  emojis: Array<Emoji> = []
  addEmoji = function (emojiId: string, memberId: string) {
    if (this.emojis.every(item => item.emojiId !== emojiId)) {
      let emoji = new Emoji(emojiId)
      emoji.add(memberId)
      this.emojis.push(emoji)
    } else {
      let index = this.emojis.findIndex((item) => item.emojiId === emojiId)
      this.emojis[index].add(memberId)
    }
  }
}

let messages: Array<Message> = []
let member: Member;
let webSocket: WebSocket;


//dom node 의 기본 타입은 HTMLElement
//input 태그의 node 객체의 경우 value 변수로 입력 값을 획득해야 하는데.. 
//HTMLElement 에는 value 변수가 없다. HTMLElement 의 서브 클래스인 HTMLInputElement 로 사용해야
//document.getElementById() 은 HTMLElement 타입을 리턴한다. 이 타입을 as 예약어로 타입 변형..
let nicknameInputNode: HTMLInputElement = document.getElementById('nicknameInput') as HTMLInputElement
let idInputNode: HTMLInputElement = document.getElementById('idInput') as HTMLInputElement
let msgInputNode: HTMLInputElement = document.getElementById('msgInput') as HTMLInputElement
let chatMainNode: HTMLElement | null = document.getElementById('chat-main')
let nicknameForm: HTMLElement | null = document.getElementById('nicknameForm')
let msgForm: HTMLElement | null = document.getElementById('msgForm')

function printMessage(message: Message) {
  let menuImageNode: HTMLElement = document.createElement('img')
  menuImageNode.setAttribute('src', 'images/menu.jpg')
  let menuButton: HTMLElement = document.createElement('button')
  menuButton.setAttribute('class', 'msg-info-menu dropbtn')
  menuButton.appendChild(menuImageNode)

  let link1: HTMLElement = document.createElement('a')
  link1.setAttribute('href', '#')
  link1.setAttribute('onclick', `emojiClick('${message.msgId}','thumbup')`)
  let link1Text = document.createTextNode('좋아요')
  link1.appendChild(link1Text)

  let link2: HTMLElement = document.createElement('a')
  link2.setAttribute('href', '#')
  link2.setAttribute('onclick', `emojiClick('${message.msgId}','ok')`)
  let link2Text = document.createTextNode('넵')
  link2.appendChild(link2Text)

  let links: HTMLElement = document.createElement('div')
  links.setAttribute('class', 'dropdown-content')
  links.appendChild(link1)
  links.appendChild(link2)

  let dropdown: HTMLElement = document.createElement('div')
  dropdown.setAttribute('class', 'dropdown')
  dropdown.appendChild(menuButton)
  dropdown.appendChild(links)

  let name: HTMLElement = document.createElement('div')
  name.setAttribute('class', 'msg-info-name')
  name.appendChild(document.createTextNode(message.member.nickname))

  let date: HTMLElement = document.createElement('div')
  date.setAttribute('class', 'msg-info-time')
  date.appendChild(document.createTextNode(message.date))

  let msgInfo: HTMLElement = document.createElement('div')
  msgInfo.setAttribute('class', 'msg-info')
  msgInfo.appendChild(name)
  msgInfo.appendChild(date)
  msgInfo.appendChild(dropdown)

  let msgText: HTMLElement = document.createElement('div')
  msgText.setAttribute('class', 'msg-text')
  msgText.appendChild(document.createTextNode(message.msg))

  let msgBubble: HTMLElement = document.createElement('div')
  msgBubble.setAttribute('class', 'msg-bubble')
  msgBubble.appendChild(msgInfo)
  msgBubble.appendChild(msgText)

  let photoNode: HTMLElement = document.createElement('img')
  photoNode.setAttribute('src', message.member.photo)
  photoNode.setAttribute('class', 'msg-img')

  let mainNode: HTMLElement = document.createElement('div')
  mainNode.setAttribute('id', `msgId-${message.msgId}`)
  mainNode.setAttribute('class', 'msg left-msg')
  mainNode.appendChild(photoNode)
  mainNode.appendChild(msgBubble)

  //이 객체에 정상적으로 객체가 대입될 수도 있지만 null 일수도 있다..
  //null 인 경우 함수 호출하면 에러가 난다.. 
  //null 이면 함수 호출이 안되게 처리해 주어야 한다.. 
  //?. 으로.. 
  chatMainNode?.appendChild(mainNode)
}

function connect(e: MouseEvent) {
  e.preventDefault()
  let id: string = idInputNode.value
  let nickname: string = nicknameInputNode.value
  if (id.trim().length == 0 || nickname.trim().length == 0) {
    alert('아이디, 닉네임을 입력해야 합니다.')
    return;
  } else {
    idInputNode.value = ''
    nicknameInputNode.value = ''

    member = new Member(id, nickname, `images/${id}.jpg`)
    webSocket = new WebSocket('ws://localhost:3000')

    webSocket.onmessage = onMessage
  }
}

function send(e: MouseEvent) {
  e.preventDefault()

  let msg: string = msgInputNode.value

  if (msg.trim().length == 0) {
    alert('메시지를 입력해야 합니다.')
    return;
  } else {
    msgInputNode.value = ''
    let message: Message = new Message(msg, member)
    //객체 멤버 접근...
    message['gubun'] = 'msg'

    webSocket.send(JSON.stringify(message))
  }

}

function printEmoji(message: Message) {
  let emojis: Array<Emoji> = message.emojis
  if (emojis.length > 0) {
    let messageBubble: HTMLElement | null = document.querySelector(`#msgId-${message.msgId} .msg-bubble`)
    let emojiNode: HTMLElement | null | undefined = messageBubble?.querySelector('.emojis')
    if (emojiNode) {
      messageBubble?.removeChild(emojiNode)
    }

    let emojisNode: HTMLElement = document.createElement('div')
    emojisNode.setAttribute('class', 'emojis')

    emojis.forEach((emoji) => {
      let img: HTMLElement = document.createElement('img')
      img.setAttribute('class', 'emoji dropbtn')
      img.setAttribute('src', `images/${emoji.emojiId}.jpg`)

      let span: HTMLElement = document.createElement('span')
      let nicknameTxt = emoji.members.join(',')
      span.appendChild(document.createTextNode(nicknameTxt))

      let dropdownContent: HTMLElement = document.createElement('div')
      dropdownContent.setAttribute('class', 'dropdown-content')
      dropdownContent.appendChild(span)

      let dropdown: HTMLElement = document.createElement('div')
      dropdown.setAttribute('class', 'dropdown')
      dropdown.appendChild(img)
      dropdown.appendChild(dropdownContent)

      let span2: HTMLElement = document.createElement('span')
      span2.setAttribute('class', 'emoji-count')
      span2.appendChild(document.createTextNode(`${emoji.count}`))

      emojisNode.appendChild(dropdown)
      emojisNode.appendChild(span2)
    })

    messageBubble?.appendChild(emojisNode)
  }

}

function emojiClick(msgId: number, emojiId: string) {

  let emoji = new Emoji(emojiId)
  emoji["memberId"] = member.id
  emoji["msgId"] = msgId
  emoji["gubun"] = 'emoji'

  webSocket.send(JSON.stringify(emoji))
}

function onMessage(event: MessageEvent) {
  //서버에서 받은 데이터를 타입으로 지정하기 애매한 상황.. any
  let serverData: any = JSON.parse(event.data)
  if (serverData.gubun === 'connect') {
    if (serverData.state === 'ok') {
      //node 의 속성 이용을 함수를 통해서 사용하게..
      nicknameForm?.setAttribute('style', 'display:none')
      msgForm?.removeAttribute('style')
    } else {
      alert('서버 연결에 실패 했습니다.')
    }
  } else if (serverData.gubun === 'msg') {
    let message: Message = new Message(serverData.msg, serverData.member)
    message.msgId = serverData.msgId
    messages.push(message)
    printMessage(message)
  } else if (serverData.gubun === 'emoji') {
    let index: number = messages.findIndex((item) => item.msgId == parseInt(serverData.msgId))
    messages[index].addEmoji(serverData.emojiId, serverData.memberId)
    printEmoji(messages[index])
  }
}
//npx tsc main.ts
// messages.findIndex((item) => item.msgId == parseInt(serverData.msgId)) 에서 에러
//findIndex
//==>ts 를 js 로 변형하면서 위의 에러 발생..
//문법 잘못은 아니고.. js 를 es5 스타일로 변형시킨다..
//Array 는 es5에도 있지만 Array 의 findIndex() 가 es6에서 추가된 함수이다..
//너네 문제될 수도 있는데.. 경고..