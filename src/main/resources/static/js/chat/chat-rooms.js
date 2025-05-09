function fetchRooms() {
    $.ajax({
        url: '/chat/rooms',
        method: 'GET',
        success: function(data) {
            const roomListDiv = $('#roomList');
            roomListDiv.empty();

            data.forEach(room => {
                const roomDiv = $('<div></div>')
                    .text(room.name)
                    .click(() => {
                        window.location.href = '/chat-room?roomId=' + room.id;
                    });
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
    if (!roomName) {
        alert("방 이름을 입력하세요.");
        return;
    }

    $.ajax({
        url: '/chat/rooms',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ name: roomName }),
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

let checkToken = () => {
    let token = localStorage.getItem('accessToken');
    if (token == null || token.trim() === '') {
        window.location.href = '/member/login';
    }
};

let setupAjax = () => {
    $.ajaxSetup({
        beforeSend: (xhr) => {
            let token = localStorage.getItem('accessToken');
            if (token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            }
        }
    });
};

// ✅ 초기 로딩 시점에 호출
$(document).ready(function() {
    checkToken();     // 먼저 토큰 검사
    setupAjax();      // Ajax 설정 먼저 적용
    fetchRooms();     // 이후 방 목록 가져오기
});
