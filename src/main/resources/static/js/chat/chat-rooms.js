function getUserInfo() {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
            userId: payload.sub,
            role: payload.role || 'ROLE_USER'  // 기본 역할 지정
        };
    } catch (e) {
        return null;
    }
}

function fetchRooms() {
    const userInfo = getUserInfo();
    if (!userInfo) {
        alert("로그인이 필요합니다.");
        window.location.href = '/member/login';
        return;
    }

    $.ajax({
        url: '/chat/rooms',
        method: 'GET',
        success: function(data) {
            const roomListDiv = $('#roomList');
            roomListDiv.empty();

            // 관리자면 모든 방, 일반 회원이면 본인 소유 방만 필터링
            const roomsToShow = (userInfo.role === 'ROLE_ADMIN')
                ? data
                : data.filter(room => room.ownerId === userInfo.userId);

            if (!roomsToShow.length) {
                roomListDiv.append('<div>생성된 채팅방이 없습니다.</div>');
                return;
            }

            roomsToShow.forEach(room => {
                const roomDiv = $('<div></div>').addClass('room-entry');

                const nameSpan = $('<span></span>')
                    .text(room.name)
                    .css('cursor', 'pointer')
                    .click(() => {
                        window.location.href = '/chat-room?roomId=' + room.id;
                    });

                roomDiv.append(nameSpan);

                const deleteButton = $('<button></button>')
                    .text('삭제')
                    .addClass('delete-btn')
                    .click(e => {
                        e.stopPropagation();
                        if (confirm(`'${room.name}' 방을 삭제하시겠습니까?`)) {
                            deleteRoom(room.id);
                        }
                    });

                roomDiv.append(deleteButton);
                roomListDiv.append(roomDiv);
            });
        },
        error: function() {
            alert("채팅방 목록을 불러오는 데 실패했습니다.");
        }
    });
}

function createRoom() {
    const roomName = $('#roomName').val().trim();
    const userInfo = getUserInfo();

    if (!roomName || !userInfo) {
        alert("방 이름 또는 사용자 정보가 없습니다.");
        return;
    }

    $.ajax({
        url: '/chat/rooms',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ name: roomName, ownerId: userInfo.userId }),
        success: function() {
            $('#roomName').val('');
            fetchRooms();
        },
        error: function(xhr) {
            if (xhr.status === 409) {
                alert("이미 존재하는 방 이름입니다.");
            } else {
                alert("방 생성 중 오류가 발생했습니다.");
            }
        }
    });
}

function deleteRoom(roomId) {
    $.ajax({
        url: '/chat/rooms/' + roomId,
        method: 'DELETE',
        success: function() {
            fetchRooms();
        },
        error: function() {
            alert("채팅방 삭제에 실패했습니다.");
        }
    });
}

function checkToken() {
    const token = localStorage.getItem('accessToken');
    if (!token || token.trim() === '') {
        window.location.href = '/member/login';
    }
}

function setupAjax() {
    $.ajaxSetup({
        beforeSend: function(xhr) {
            const token = localStorage.getItem('accessToken');
            if (token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            }
        }
    });
}

// 초기 실행
$(document).ready(function() {
    checkToken();
    setupAjax();
    fetchRooms();

    $('#createRoomBtn').click(() => {
        createRoom();
    });

    $('#roomName').keypress(function(e) {
        if (e.which === 13) { // Enter키
            createRoom();
        }
    });
});
