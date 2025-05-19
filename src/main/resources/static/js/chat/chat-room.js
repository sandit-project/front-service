let stompClient = null;
let globalUserInfo = null;

$(document).ready(async function () {
    checkToken();
    setupAjax();
    // 사용자 정보 전역으로 불러오기
    await getUserInfo().then((userInfo) => {
        globalUserInfo = userInfo;
        console.log('User Info:', userInfo);
    }).catch((error) => {
        console.error('user info error:', error);
        Swal.fire("로그인이 필요합니다", "", "warning").then(() => {
            window.location.href = "/member/login";
        });
    });

    const userId = globalUserInfo.userId;
    const role = globalUserInfo.role;
    const userType = globalUserInfo.type;

    const roomId = new URLSearchParams(window.location.search).get("roomId");
    if (!roomId) {
        alert("roomId가 필요합니다. 예: ?roomId=123");
        return;
    }

    const roleLabel = role === 'ROLE_ADMIN' ? '관리자' : '고객';
    $('#userInfo').text(`👤 로그인: ${userId} (${userType === 'social' ? '소셜' : '일반'}, ${roleLabel})`);

    await loadChatHistory(roomId, userId);
    connectWebSocket(roomId, userId, role, userType);
});

async function loadChatHistory(roomId, userId) {
    try {
        const response = await $.get(`/chat/rooms/${roomId}/messages`);
        response.forEach((message) => {
            appendMessageToChatBox(message, userId);
        });
        $("#chatBox").scrollTop($("#chatBox")[0].scrollHeight);
    } catch (err) {
        console.error("채팅 기록 로딩 실패:", err);
        Swal.fire("채팅 기록을 불러오지 못했습니다.", "", "error");
    }
}

function connectWebSocket(roomId, userId, role, userType) {
    const token = localStorage.getItem("accessToken");
    const socket = new SockJS("http://localhost:9006/chat");
    stompClient = Stomp.over(socket);

    stompClient.connect(
        { Authorization: `Bearer ${token}` },
        () => {
            stompClient.subscribe(`/topic/room/${roomId}`, (msg) => {
                const message = JSON.parse(msg.body);
                appendMessageToChatBox(message, userId);
                $("#chatBox").scrollTop($("#chatBox")[0].scrollHeight);
            });

            $("#sendBtn").click(() =>
                sendMessage(roomId, userId, role, userType)
            );

            $("#messageInput").keypress((e) => {
                if (e.which === 13) sendMessage(roomId, userId, role, userType);
            });
        },
        (error) => {
            console.error("WebSocket 연결 실패", error);
        }
    );
}

function appendMessageToChatBox(message, userId) {
    const createdAtStr = message.createdAt || new Date().toISOString();
    const formattedTime = formatDate(createdAtStr);

    const isMine = message.sender === userId;

    const senderLabel = (message.senderRole?.toLowerCase() === 'role_admin')
        ? '👨‍💼 관리자'
        : `🙋‍♂️ 고객 (${message.senderType === 'social' ? '소셜' : '일반'})`;

    const messageClass = isMine ? "my-message" : "other-message";

    const messageHtml = `
        <div class="${messageClass}">
            <div><b>${senderLabel} - ${message.sender}</b></div>
            <div>${message.message}</div>
            <div class="timestamp">${formattedTime}</div>
        </div>
    `;

    $("#chatBox").append(messageHtml);
}

function sendMessage(roomId, userId, role, userType) {
    const messageText = $("#messageInput").val().trim();
    if (!messageText) return;

    const message = {
        roomId,
        sender: userId,
        senderRole: role,
        senderType: userType,
        message: messageText,
        timestamp: new Date().toISOString()
    };

    stompClient.send("/app/chat.send", {}, JSON.stringify(message));
    $("#messageInput").val("");
}
