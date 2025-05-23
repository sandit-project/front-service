$(function () {
    connectWebSocket();
});

// --- 전역 변수 ---
let chatRoomOpenedAt = null;
let stompClient = null;
let isConnected = false;
let currentRoomId = null;
let subscription = null;
let globalSubscription = null;

// --- WebSocket 연결 ---
function connectWebSocket() {
    if (isConnected) {
        console.log('[WebSocket] 이미 연결된 상태');
        return;
    }

    const socket = new SockJS(WEBSOCKET_URL);
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        console.log('[WebSocket] 연결 성공:', frame);
        isConnected = true;
        subscribeToGlobalMessages();
    }, function (error) {
        console.error('[WebSocket] 연결 실패:', error);
        isConnected = false;
        stompClient = null;
        setTimeout(connectWebSocket, 5000);
    });
}

// --- 공통 메시지 구독 ---
function subscribeToGlobalMessages() {
    if (globalSubscription) {
        globalSubscription.unsubscribe();
    }

    globalSubscription = stompClient.subscribe('/topic/messages', function (msg) {
        const message = JSON.parse(msg.body);
        console.log('[WebSocket] 공통 메시지 수신:', message);
        handleIncomingMessage(message);
    });

    console.log('[WebSocket] 공통 메시지 구독 시작');
}

// --- 채팅방 초기화 ---
function initChatRoom(roomId) {
    console.log('[WebSocket] initChatRoom 시작, roomId:', roomId);

    if (!isConnected || !stompClient) {
        console.warn('[WebSocket] 연결 안 됨, 재연결 시도');
        connectWebSocket();
        setTimeout(() => initChatRoom(roomId), 1000);
        return;
    }

    if (currentRoomId === roomId) {
        console.log('[WebSocket] 이미 같은 방에 구독 중');
        return;
    }

    if (subscription) {
        subscription.unsubscribe();
        subscription = null;
        console.log('[WebSocket] 이전 방 구독 해제');
    }

    currentRoomId = roomId;
    chatRoomOpenedAt = Date.now();

    subscription = stompClient.subscribe(`/topic/room/${roomId}`, function (msg) {
        const message = JSON.parse(msg.body);
        console.log(`[WebSocket] 방(${roomId}) 메시지 수신:`, message);
        handleIncomingMessage(message);
    });

    console.log(`[WebSocket] 방(${roomId}) 구독 시작`);
}

// --- 채팅방 구독 해제 ---
function unsubscribeFromCurrentRoom() {
    if (subscription) {
        subscription.unsubscribe();
        subscription = null;
        console.log('[WebSocket] 방 구독 해제 완료');
    }
    currentRoomId = null;
}

// --- 메시지 처리 ---
function handleIncomingMessage(message) {
    const userId = getCurrentUserId();
    console.log('[WebSocket] 메시지 처리:', message);

    // 내 메시지는 무시
    if (message.sender === userId) {
        console.log('[WebSocket] 내 메시지라 무시:', message.id || '');
        return;
    }

    // 과거 메시지 무시
    if (message.createdAt) {
        const msgTime = new Date(message.createdAt).getTime();
        if (chatRoomOpenedAt && msgTime < chatRoomOpenedAt) {
            console.log('[WebSocket] 과거 메시지 무시');
            return;
        }
    }

    const isModalOpen = $('#modalContainer').is(':visible');
    const isInCurrentRoom = currentRoomId && message.roomId === currentRoomId;

    console.log('[WebSocket] 모달 열림:', isModalOpen, ', 현재 방:', currentRoomId, ', 메시지 방:', message.roomId);

    if (isModalOpen && isInCurrentRoom) {
        addMessageIfNotDuplicate(message);
        $('#chatBox').scrollTop($('#chatBox')[0].scrollHeight);
    } else {
        console.log('[WebSocket] 모달 닫혔거나 다른 방 메시지라 알림 없음 (뱃지 알림 기능 제거)');
        // 뱃지 알림 함수 호출 삭제
    }
}

// --- 메시지 중복 방지 및 출력 ---
function addMessageIfNotDuplicate(message) {
    if (!message.id) {
        $('#chatBox').append(`<div><b>${escapeHtml(message.sender)}:</b> ${escapeHtml(message.message)}</div>`);
        return;
    }

    if ($(`#msg-${message.id}`).length === 0) {
        $('#chatBox').append(`<div id="msg-${message.id}"><b>${escapeHtml(message.sender)}:</b> ${escapeHtml(message.message)}</div>`);
    } else {
        console.log('[WebSocket] 중복 메시지 무시됨:', message.id);
    }
}

// --- XSS 방지 escape ---
function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// --- 현재 로그인 유저 ID 조회 ---
function getCurrentUserId() {
    const userId = $('#currentUserId').val() || 'unknownUser';
    console.log('[Debug] 현재 유저 ID:', userId);
    return userId;
}

// --- 모달 열기 ---
function openModalWithContent(url, onLoadCallback) {
    console.log('[Modal] openModalWithContent 호출:', url);
    $('#modalContent').html('<p>로딩 중...</p>');
    $('#modalContainer').show();
    // 뱃지 숨기기 코드 삭제

    $.get(url)
        .done(function (data) {
            $('#modalContent').html(data);
            chatRoomOpenedAt = Date.now();

            if (typeof onLoadCallback === 'function') {
                onLoadCallback();
            }
        })
        .fail(function () {
            $('#modalContent').html('<p>컨텐츠 불러오기 실패</p>');
        });
}

// --- 모달 닫기 ---
function closeModal() {
    console.log('[Modal] closeModal 호출');
    $('#modalContainer').hide();
    $('#modalContent').html('');
    // 구독 유지 (알림용)
}

// --- 이벤트 바인딩 ---
$(document).on('click', '#modalCloseBtn', closeModal);
$(document).on('click', '#modalOverlay', closeModal);

$(document).on('click', '#oneOnOneChatBtn', function () {
    openModalWithContent('/chat');
});

$(document).on('click', '.enter-chat-room', function () {
    const roomId = $(this).data('roomId') || $(this).attr('data-room-id');
    if (!roomId) {
        console.warn('[Chat] roomId 없음');
        return;
    }

    openModalWithContent('/chat-room?roomId=' + encodeURIComponent(roomId), function () {
        initChatRoom(roomId);
    });
});
