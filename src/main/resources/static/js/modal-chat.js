// 페이지 로드 시 뱃지 제거
$(function() {
    removeChatBadge();
});

// --- 모달 관련 함수 ---
let chatRoomOpenedAt = Date.now();

function openModalWithContent(url, onLoadCallback) {
    console.log('[Modal] openModalWithContent 호출:', url);
    $('#modalContent').html('<p>로딩 중...</p>');
    $('#modalContainer').show();

    $.get(url, function (data) {
        $('#modalContent').html(data);
        removeChatBadge();  // 모달 열 때 뱃지 제거
        chatRoomOpenedAt = Date.now();

        if (typeof onLoadCallback === 'function') {
            onLoadCallback();
        }
    }).fail(function () {
        $('#modalContent').html('<p>컨텐츠를 불러오는데 실패했습니다.</p>');
    });
}

function closeModal() {
    console.log('[Modal] closeModal 호출');
    $('#modalContainer').hide();
    $('#modalContent').html('');
}

$(document).on('click', '#modalCloseBtn', closeModal);
$(document).on('click', '#modalOverlay', closeModal);

$(document).on('click', '#oneOnOneChatBtn', function () {
    openModalWithContent('/chat');
});

$(document).on('click', '.enter-chat-room', function () {
    const roomId = $(this).data('room-id');
    console.log('[Chat] 채팅방 클릭, roomId:', roomId);
    openModalWithContent('/chat-room?roomId=' + roomId, function () {
        if (typeof initChatRoom === 'function') {
            initChatRoom(roomId);
        }
    });
});

function showToast(message, duration = 4000) {
    const $toast = $('#toast');
    $toast.text(message).fadeIn(300);
    setTimeout(() => $toast.fadeOut(300), duration);
}

function showChatBadge() {
    if ($('#chatBadge').length === 0) {
        $('#oneOnOneChatBtn').append('<span id="chatBadge" class="chat-badge"></span>');
        console.log('[Badge] 뱃지 생성됨');
    }
}

function removeChatBadge() {
    if ($('#chatBadge').length) {
        $('#chatBadge').remove();
        console.log('[Badge] 뱃지 제거됨');
    }
}

function initChatRoom(roomId) {
    console.log('[WebSocket] initChatRoom 시작, roomId:', roomId);
    const socket = new SockJS('http://localhost:9006/chat');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, function () {
        console.log('[WebSocket] 연결 성공');

        stompClient.subscribe(`/topic/room/${roomId}`, function (msg) {
            const message = JSON.parse(msg.body);
            const userId = getCurrentUserId();

            console.log('[WebSocket] 메시지 수신:', message);

            if (message.sender === userId) {
                console.log('[WebSocket] 내 메시지라 무시');
                return;
            }
            if (message.roomId !== roomId) {
                console.log('[WebSocket] 다른 방 메시지라 무시');
                return;
            }

            if (message.createdAt) {
                const msgTime = new Date(message.createdAt).getTime();
                if (msgTime < chatRoomOpenedAt) {
                    console.log('[WebSocket] 과거 메시지라 무시');
                    return;
                }
            }

            addMessageIfNotDuplicate(message);

            const isModalHidden = $('#modalContainer').is(':hidden');
            const hasBadge = $('#chatBadge').length > 0;

            console.log('[WebSocket] 모달 숨김 상태:', isModalHidden, '뱃지 존재 여부:', hasBadge);

            if (isModalHidden) {
                if (!hasBadge) {
                    console.log('[WebSocket] 뱃지 생성 및 토스트 표시');
                    showChatBadge();
                    showToast(`새 메시지 from ${message.sender}: ${message.message}`);
                } else {
                    console.log('[WebSocket] 이미 뱃지가 있음, 토스트만 표시');
                    showToast(`새 메시지 from ${message.sender}: ${message.message}`);
                }
            }

            $("#chatBox").scrollTop($("#chatBox")[0].scrollHeight);
        });
    }, function (error) {
        console.error('[WebSocket] 연결 실패:', error);
    });

    function getCurrentUserId() {
        const id = $('#currentUserId').val() || 'unknownUser';
        console.log('[User] 현재 로그인 유저 ID:', id);
        return id;
    }

    function addMessageIfNotDuplicate(message) {
        $('#chatBox').append(`<div><b>${message.sender}:</b> ${message.message}</div>`);
    }
}
