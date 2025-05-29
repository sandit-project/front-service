$(function () {
     connectWebSocket();// 최초 1회 WebSocket 연결
});

// --- 전역 변수 ---
let chatRoomOpenedAt = null;
let stompClient = null;
let sock = null;
let isConnected = false;
let currentRoomId = null;
let subscription = null;
let globalSubscription = null;
const receivedMessageIds = new Set();


// --- WebSocket 연결 ---


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

    unsubscribeFromCurrentRoom();
    currentRoomId = roomId;
    chatRoomOpenedAt = Date.now();
    resetMessageCache();

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

    if (message.sender === userId) {
        console.log('[WebSocket] 내 메시지라 무시:', message.id || '');
        return;
    }

    if (message.createdAt) {
        const msgTime = new Date(message.createdAt).getTime();
        if (chatRoomOpenedAt && msgTime < chatRoomOpenedAt) {
            console.log('[WebSocket] 과거 메시지 무시');
            return;
        }
    }

    const isModalOpen = $('#modalContainer').is(':visible');
    const isInCurrentRoom = currentRoomId && message.roomId === currentRoomId;

    if (isModalOpen && isInCurrentRoom) {
        addMessageIfNotDuplicate(message);
        $('#chatBox').scrollTop($('#chatBox')[0].scrollHeight);
    } else {
        console.log('[WebSocket] 모달 닫힘 or 다른 방 → 뱃지 생략');
    }
}

// --- 메시지 중복 방지 및 출력 ---
function addMessageIfNotDuplicate(message) {
    if (!message.id) {
        $('#chatBox').append(`<div><b>${escapeHtml(message.sender)}:</b> ${escapeHtml(message.message)}</div>`);
        return;
    }

    if (!receivedMessageIds.has(message.id)) {
        $('#chatBox').append(`<div id="msg-${message.id}"><b>${escapeHtml(message.sender)}:</b> ${escapeHtml(message.message)}</div>`);
        receivedMessageIds.add(message.id);
    } else {
        console.log('[WebSocket] 중복 메시지 무시됨:', message.id);
    }
}

function resetMessageCache() {
    receivedMessageIds.clear();
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
    return $('#currentUserId').val() || 'unknownUser';
}

// --- WebSocket 및 구독, 메시지 캐시 정리 ---
function cleanupWebSocket() {
    return new Promise((resolve) => {
        unsubscribeFromCurrentRoom();
        resetMessageCache();
        $("#chatBox").empty();
        resolve();
    });
}

// --- 모달 열기 ---
function openModalWithContent(url, onLoadCallback) {
    console.log('[Modal] openModalWithContent 호출:', url);

    // 👉 버튼 숨기기
    $('#oneOnOneChatBtn').hide();

    unsubscribeFromCurrentRoom();
    resetMessageCache();
    $('#chatBox').empty();
    chatRoomOpenedAt = Date.now();

    $('#modalContent').html('<p>로딩 중...</p>');
    $('#modalContainer').show();

    $.get(url)
        .done(function (data) {
            $('#modalContent').html(data);
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

    // 👉 버튼 다시 보이기
    $('#oneOnOneChatBtn').show();

    return cleanupWebSocket().then(() => {
        console.log('[Modal] closeModal 끝, 방 구독 정리 완료');
    });
}

// --- 이벤트 바인딩 ---
$(document).on('click', '#modalCloseBtn', function () {
    closeModal();
});


// 1:1 채팅 버튼 클릭
$(document).on('click', '#oneOnOneChatBtn', function () {
    if ($('#modalContainer').is(':visible')) {
        closeModal().then(() => {
            setTimeout(() => openModalWithContent('/chat'), 300);
        });
    } else {
        openModalWithContent('/chat');
    }
});

// 채팅방 입장 버튼 클릭
$(document).on('click', '.enter-chat-room', function () {
    const roomId = $(this).data('roomId') || $(this).attr('data-room-id');
    if (!roomId) {
        console.warn('[Chat] roomId 없음');
        return;
    }

    const loadRoom = () => openModalWithContent('/chat-room?roomId=' + encodeURIComponent(roomId), () => {
        initChatRoom(roomId);
    });

    if ($('#modalContainer').is(':visible')) {
        closeModal().then(() => {
            setTimeout(loadRoom, 300);
        });
    } else {
        loadRoom();
    }
});

// --- 페이지 이탈 시 정리 ---
$(window).on('beforeunload', function () {
    cleanupWebSocket();
});
