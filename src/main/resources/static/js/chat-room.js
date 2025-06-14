(function () {
    let stompClient = null;
    let subscription = null;
    let globalUserInfo = null;
    const displayedMessages = new Set();
    checkToken();
    setupAjax();

    function getUserInfo() {
        return new Promise((resolve, reject) => {
            const token = localStorage.getItem('accessToken');
            if (!token) return reject('토큰 없음');

            const socialPrefixes = ['naver:', 'kakao:', 'google:'];
            const socialType = socialPrefixes.find(prefix => token.startsWith(prefix));

            if (socialType) {
                const parts = token.split(':');
                if (parts.length >= 2) {
                    return resolve({
                        userId: parts[1],
                        role: 'ROLE_USER',
                        type: socialType.slice(0, -1)
                    });
                } else {
                    return reject('소셜 토큰 형식 오류');
                }
            }

            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                resolve({
                    userId: payload.sub,
                    role: payload.role || 'ROLE_USER',
                    type: payload.type || 'normal'
                });
            } catch {
                reject('JWT 파싱 실패');
            }
        });
    }

    function hasChatPermission(role, userType) {
        if (role === 'ROLE_ADMIN' || role === 'ROLE_MANAGER') return true;
        const allowedSocialTypes = ['naver', 'kakao', 'google'];
        if (userType === 'normal') return true;
        return allowedSocialTypes.includes(userType);
    }

    function getRoleLabel(role) {
        switch (role) {
            case 'ROLE_ADMIN': return '관리자';
            case 'ROLE_MANAGER': return '매니저';
            default: return '고객';
        }
    }

    window.initChatRoom = async function (roomId) {
        try {
            cleanupWebSocket();
            await checkToken();
            setupAjax();
            globalUserInfo = await getUserInfo();

            if (!roomId) {
                Swal.fire({
                    icon: 'warning',
                    title: '채팅방 ID 누락',
                    text: 'roomId가 필요합니다. 예: ?roomId=123',
                    confirmButtonColor: '#f97316'
                });
                return;
            }

            const { userId, role, type: userType } = globalUserInfo;
            const roleLabel = getRoleLabel(role);
            $('#userInfo').text(` 로그인: ${userId} (${userType === 'normal' ? '일반' : userType}, ${roleLabel})`);

            if (!hasChatPermission(role, userType)) {
                Swal.fire({
                    icon: 'error',
                    title: '채팅 권한 없음',
                    text: '채팅 권한이 없습니다. 관리자에게 문의하세요.',
                    confirmButtonColor: '#f44336'
                });
                return;
            }

            displayedMessages.clear();
            $("#chatBox").empty();

            await loadChatHistory(roomId, userId);
            await connectWebSocket(roomId, userId, role, userType);
        } catch (e) {
            console.error('Error during initChatRoom:', e);
            Swal.fire("로그인이 필요합니다", "", "warning").then(() => {
                window.location.href = "/member/login";
            });
        }
    };

    async function loadChatHistory(roomId, userId) {
        try {
            const response = await $.get(`/chat/rooms/${roomId}/messages`);
            const messages = Array.isArray(response) ? response : response?.content ?? [];
            messages.forEach(message => addMessageIfNotDuplicate(message, userId));
            scrollToBottom();
        } catch (err) {
            console.error("채팅 기록 로딩 실패:", err);
            Swal.fire("채팅 기록을 불러오지 못했습니다.", "", "error");
        }
    }

    function addMessageIfNotDuplicate(message, userId) {
        if (!message || !message.message || !message.sender) return;

        const timestamp = message.createdAt || message.created_at || message.timestamp || '';
        const key = message.id
            ? `id_${message.id}`
            : `sender_${message.sender}_msg_${message.message}_time_${timestamp}`;

        if (displayedMessages.has(key)) return;
        displayedMessages.add(key);
        appendMessageToChatBox(message, userId);
    }

    function appendMessageToChatBox(message, userId) {
        const createdAtStr = message.createdAt || message.created_at || new Date().toISOString();
        const formattedTime = formatDate(createdAtStr);
        const isMine = message.sender === userId;

        let senderLabel = '🙋‍♂️ 고객';
        if (message.senderRole?.toLowerCase() === 'role_admin') senderLabel = '👨‍💼 관리자';
        else if (message.senderRole?.toLowerCase() === 'role_manager') senderLabel = '👩‍💼 매니저';

        if (!['ROLE_ADMIN', 'ROLE_MANAGER'].includes(message.senderRole)) {
            const typeLabel = message.senderType === 'normal' ? '일반' : message.senderType;
            senderLabel += ` (${typeLabel})`;
        }

        const messageClass = isMine ? "my-message" : "other-message";
        const messageHtml = `
            <div class="${messageClass}">
                <div><b>${senderLabel} - ${message.sender}</b></div>
                <div>${escapeHtml(message.message)}</div>
                <div class="timestamp">${formattedTime}</div>
            </div>
        `;
        $("#chatBox").append(messageHtml);
        scrollToBottom();
    }

    function connectWebSocket(roomId, userId, role, userType) {
        const token = localStorage.getItem("accessToken");
        if (!token) return Promise.reject("토큰 없음");

        return new Promise((resolve, reject) => {
            if (subscription) subscription.unsubscribe();
            if (stompClient && stompClient.connected) {
                stompClient.disconnect(() => {
                    console.log("기존 WebSocket 연결 종료 완료");
                    stompClient = null;
                    resolve();
                });
            } else {
                resolve();
            }
        }).then(() => {
            const socket = new SockJS(window.WEBSOCKET_URL);
            stompClient = Stomp.over(socket);

            return new Promise((res, rej) => {
                stompClient.connect({ Authorization: `Bearer ${token}` }, () => {
                    console.log("WebSocket 연결 성공");

                    subscription = stompClient.subscribe(`/topic/room/${roomId}`, (msg) => {
                        const message = JSON.parse(msg.body);
                        if (message.sender === userId) return;
                        addMessageIfNotDuplicate(message, userId);
                    });

                    $("#sendBtn").off("click").on("click", () => sendMessage(roomId, userId, role, userType));
                    $("#messageInput").off("keypress").on("keypress", (e) => {
                        if (e.which === 13) {
                            e.preventDefault();
                            sendMessage(roomId, userId, role, userType);
                        }
                    });

                    res();
                }, (error) => {
                    console.error("WebSocket 연결 실패", error);
                    Swal.fire("WebSocket 연결 실패", "잠시 후 다시 시도해주세요.", "error");
                    rej(error);
                });
            });
        });
    }

    function sendMessage(roomId, userId, role, userType) {
        if (!hasChatPermission(role, userType)) {
            Swal.fire({
                icon: 'error',
                title: '채팅 권한 없음',
                text: '메시지를 보낼 권한이 없습니다.',
                confirmButtonColor: '#f44336'
            });
            return;
        }

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

        addMessageIfNotDuplicate(message, userId);

        try {
            stompClient.send("/app/chat.send", {}, JSON.stringify(message));
        } catch (err) {
            console.error("메시지 전송 실패", err);
            Swal.fire({
                icon: 'error',
                title: '전송 실패',
                text: '메시지를 전송하지 못했습니다. 네트워크 상태를 확인해주세요.',
                confirmButtonColor: '#f44336'
            });
        }

        $("#messageInput").val("");
    }

    function formatDate(isoString) {
        try {
            const date = new Date(isoString);
            if (isNaN(date)) return "잘못된 날짜";
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, "0");
            const dd = String(date.getDate()).padStart(2, "0");
            const hh = String(date.getHours()).padStart(2, "0");
            const min = String(date.getMinutes()).padStart(2, "0");
            return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
        } catch {
            return "날짜 오류";
        }
    }

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function scrollToBottom() {
        const chatBox = document.getElementById("chatBox");
        if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
    }

    function cleanupWebSocket() {
        if (subscription) {
            subscription.unsubscribe();
            subscription = null;
        }
        if (stompClient && stompClient.connected) {
            stompClient.disconnect(() => {
                console.log("WebSocket 연결 종료됨");
            });
            stompClient = null;
        }

        $("#sendBtn").off("click");
        $("#messageInput").off("keypress");

        displayedMessages.clear();
        $("#chatBox").empty();
    }

    $(document).on('click', '#modalCloseBtn', function () {
        cleanupWebSocket();
        $('#modalContainer').hide();
        $('#modalContent').empty();
    });

    $(document).on('click', '#backToChatListBtn', function () {
        cleanupWebSocket();
        openModalWithContent('/chat');
    });
})();
