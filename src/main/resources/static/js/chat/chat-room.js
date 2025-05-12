// ✅ 랜덤 닉네임 생성 또는 localStorage에서 가져오기
function getOrCreateNickname() {
    let nickname = localStorage.getItem('nickname');
    if (!nickname) {
        nickname = "User" + Math.floor(Math.random() * 1000);
        localStorage.setItem('nickname', nickname);
    }
    return nickname;
}

// ✅ URL에서 roomId 받기 + 닉네임 자동 설정
const urlParams = new URLSearchParams(location.search);
const roomId = urlParams.get("roomId");
const nickname = getOrCreateNickname();

if (!roomId) {
    alert("Room ID가 필요합니다. 예: ?roomId=123");
}

// ✅ 인증 토큰 가져오기
const token = localStorage.getItem('accessToken');
if (!token) {
    alert("로그인 필요: 인증 토큰이 없습니다.");
    window.location.href = '/member/login';  // 로그인 페이지로 리디렉션
}

// ✅ WebSocket 연결 설정 (인증 토큰 포함)
const socket = new SockJS('http://localhost:9006/chat');
const stompClient = Stomp.over(socket);

stompClient.connect(
    { Authorization: `Bearer ${token}` },  // 헤더로 토큰 전달
    () => {
        stompClient.subscribe(`/topic/room/${roomId}`, (msg) => {
            const message = JSON.parse(msg.body);
            const isMine = message.sender === nickname;
            const messageClass = isMine ? "my-message" : "other-message";
            const messageHtml = `<div class="${messageClass}">
          <b>${message.sender}</b>: ${message.message}
      </div>`;
            $('#chatBox').append(messageHtml);
            $('#chatBox').scrollTop($('#chatBox')[0].scrollHeight);
        });
    }
);

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("userInfo").innerText = `당신의 닉네임: ${nickname}`;
});




// 메시지 전송 함수
function sendMessage() {
    const message = {
        roomId: roomId,
        sender: nickname,
        message: $('#messageInput').val()
    };
    stompClient.send("/app/chat.send", {}, JSON.stringify(message));
    $('#messageInput').val('');
}

// 버튼 클릭 시 메시지 전송
$(document).ready(function () {
    $('#sendBtn').on('click', function () {
        sendMessage();
    });
    $('#messageInput').on('keypress', function (e) {
        if (e.which === 13) {  // 엔터 키를 누르면 메시지 전송
            sendMessage();
        }
    });
});
