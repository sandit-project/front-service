(function () {
    // 토큰 체크 및 로그인 리다이렉트
    function checkToken() {
        const token = localStorage.getItem('accessToken');
        if (!token || token.trim() === '') {
            window.location.href = '/member/login';
        }
    }

    // Ajax 요청 시 헤더에 Authorization 토큰 추가
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

    // JWT에서 userId, role 추출
    function getUserInfo() {
        const token = localStorage.getItem('accessToken');
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return {
                userId: payload.sub,
                role: payload.role || 'ROLE_USER'
            };
        } catch (e) {
            console.warn('JWT 파싱 실패:', e);
            return null;
        }
    }

    // 채팅방 목록 조회 및 렌더링
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

                const roomsToShow = (userInfo.role === 'ROLE_ADMIN')
                    ? data
                    : data.filter(room => room.ownerId === userInfo.userId);

                if (!roomsToShow.length) {
                    roomListDiv.append('<div>채팅을 시작하시려면 방을 생성해주세요.</div>');
                    return;
                }

                roomsToShow.forEach(room => {
                    const roomDiv = $('<div></div>').addClass('room-entry');

                    const topLineDiv = $('<div></div>');

                    // 방 이름 스팬
                    const nameSpan = $('<span></span>')
                        .addClass('enter-chat-room')
                        .text(room.name)
                        .attr('data-room-id', room.id);

                    // 생성자 아이디 스팬 (방 이름 옆에 작게 표시)
                    const ownerSpan = $('<span></span>')
                        .addClass('room-owner')
                        .text(` (ID: ${room.ownerId})`)
                        .css({
                            'font-size': '0.85em',
                            'color': '#666',
                            'margin-left': '8px'
                        });

                    // 삭제 버튼
                    const deleteButton = $('<button></button>')
                        .text('삭제')
                        .addClass('delete-btn')
                        .click(e => {
                            e.stopPropagation();
                            if (confirm(`'${room.name}' 방을 삭제하시겠습니까?`)) {
                                deleteRoom(room.id);
                            }
                        });

                    topLineDiv.append(nameSpan, ownerSpan, deleteButton);

                    const createdAt = new Date(room.createdAt);
                    const formattedDate = createdAt.getFullYear() + '-' +
                        String(createdAt.getMonth() + 1).padStart(2, '0') + '-' +
                        String(createdAt.getDate()).padStart(2, '0') + ' ' +
                        String(createdAt.getHours()).padStart(2, '0') + ':' +
                        String(createdAt.getMinutes()).padStart(2, '0');

                    const dateDiv = $('<div></div>')
                        .addClass('created-time')
                        .text(formattedDate);

                    roomDiv.append(topLineDiv, dateDiv);

                    roomListDiv.append(roomDiv);
                });
            },
            error: function() {
                alert("채팅방 목록을 불러오는 데 실패했습니다.");
            }
        });
    }

    // 채팅방 생성
    function createRoom() {
        const roomName = $('#roomName').val().trim();
        const userInfo = getUserInfo();

        if (!roomName) {
            alert("방 이름을 입력하세요.");
            return;
        }
        if (!userInfo) {
            alert("사용자 정보가 없습니다. 로그인 후 다시 시도해주세요.");
            window.location.href = '/member/login';
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

    // 채팅방 삭제
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

    // DOM 로드 후 초기화
    $(document).ready(function() {
        checkToken();
        setupAjax();
        fetchRooms();

        $('#createRoomBtn').off('click').on('click', createRoom);

        $('#roomName').off('keypress').on('keypress', function(e) {
            if (e.which === 13) {  // Enter key
                createRoom();
            }
        });
    });

    // 인라인 이벤트에서 createRoom 호출 필요 시
    window.createRoom = createRoom;

})();
