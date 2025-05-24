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

                    const nameSpan = $('<span></span>')
                        .addClass('enter-chat-room')
                        .text(room.name)
                        .attr('data-room-id', room.id)
                        .css('cursor', 'pointer');

                    const badgeSpan = $('<span></span>')
                        .addClass('unread-badge')
                        .text('')
                        .css({
                            'background-color': 'red',
                            'width': '12px',
                            'height': '12px',
                            'border-radius': '50%',
                            'margin-left': '6px',
                            'vertical-align': 'middle',
                            'display': room.room_status? 'inline-block' : 'none' // 읽지 않은 메시지 있을 때만 표시
                        });

                    const ownerSpan = $('<span></span>')
                        .addClass('room-owner')
                        .text(` (ID: ${room.ownerId})`)
                        .css({
                            'font-size': '0.85em',
                            'color': '#666',
                            'margin-left': '8px'
                        });

                    const deleteButton = $('<button></button>')
                        .text('삭제')
                        .addClass('delete-btn')
                        .click(e => {
                            e.stopPropagation();
                            if (confirm(`'${room.name}' 방을 삭제하시겠습니까?`)) {
                                deleteRoom(room.id);
                            }
                        });

                    topLineDiv.append(nameSpan, badgeSpan, ownerSpan, deleteButton);

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

    // 읽음 처리 API 호출
    function markRoomAsRead(roomId) {
        const userInfo = getUserInfo();
        if (!userInfo) return;

        $.ajax({
            url: `/chat/rooms/${roomId}/read`,
            method: 'POST',
            data: {
                userId: userInfo.userId
            },
            success: function() {
                const roomEntry = $(`.enter-chat-room[data-room-id="${roomId}"]`);
                roomEntry.siblings('.unread-badge').hide();
            },
            error: function() {
                console.warn('읽음 처리 실패');
            }
        });
    }

    // 브라우저 알림 권한 요청
    function requestNotificationPermission() {
        if (!("Notification" in window)) {
            console.warn("이 브라우저는 Notification API를 지원하지 않습니다.");
            return;
        }
        if (Notification.permission === "default") {
            Notification.requestPermission().then(function(permission) {
                console.log("Notification permission:", permission);
            });
        }
    }

    // 브라우저 알림 표시
    function showBrowserNotification(title, body) {
        if (Notification.permission === "granted") {
            new Notification(title, {
                body: body,
                icon: '/favicon.ico' // 필요에 따라 아이콘 경로 수정하세요
            });
        }
    }

    // WebSocket 연결 및 메시지 수신 처리
    let stompClient = null;

    function connectWebSocket() {
        const socket = new SockJS("http://localhost:9006/chat");
        stompClient = Stomp.over(socket);

        stompClient.connect({}, function(frame) {
            console.log('Connected: ' + frame);

            const userInfo = getUserInfo();
            if (!userInfo) return;

            stompClient.subscribe(`/topic/chat/rooms/${userInfo.userId}`, function(message) {
                const payload = JSON.parse(message.body);
                console.log('WebSocket message received:', payload);

                const roomId = payload.roomId;
                const sender = payload.senderName || "새 메시지";
                const content = payload.content || "새로운 메시지가 도착했습니다.";

                if (!roomId) {
                    console.warn('roomId가 메시지에 없습니다!');
                    return;
                }

                const roomEntry = $(`.enter-chat-room[data-room-id="${roomId}"]`);
                if (roomEntry.length === 0) {
                    console.warn(`해당 roomId(${roomId})를 가진 채팅방 요소를 찾지 못했습니다.`);
                    return;
                }

                const badge = roomEntry.siblings('.unread-badge');
                if (badge.length) {
                    badge.show();
                    console.log(`채팅방 ${roomId} 뱃지 표시 완료`);
                } else {
                    console.warn('뱃지 요소를 찾지 못했습니다.');
                }

                // 브라우저 알림 띄우기
                showBrowserNotification(`${sender}님으로부터`, content);
            });
        });
    }

    // 채팅방 클릭 시 읽음 처리 및 뱃지 숨김
    $(document).on('click', '.enter-chat-room', function() {
        const roomId = $(this).data('room-id');

        markRoomAsRead(roomId);

        // 필요하면 채팅방 열기 함수 호출
        // openChatRoom(roomId);
    });

    // 초기화
    $(document).ready(function() {
        checkToken();
        setupAjax();
        fetchRooms();
        requestNotificationPermission();  // 알림 권한 요청
        connectWebSocket();

        $('#createRoomBtn').off('click').on('click', createRoom);

        $('#roomName').off('keypress').on('keypress', function(e) {
            if (e.which === 13) {
                createRoom();
            }
        });
    });

    window.createRoom = createRoom;
})();
