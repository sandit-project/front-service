(function () {
    let currentOpenRoomId = null; // 현재 열려있는 채팅방 ID

    function getUserInfo() {
        const token = localStorage.getItem('accessToken');
        if (!token) return null;

        const socialPrefixes = ['naver:', 'kakao:', 'google:'];
        const socialType = socialPrefixes.find(prefix => token.startsWith(prefix));

        if (socialType) {
            const parts = token.split(':');
            if (parts.length >= 2) {
                return {
                    userId: parts[1],
                    role: 'ROLE_USER',
                    type: socialType.slice(0, -1)
                };
            } else {
                console.warn('소셜 토큰 형식 오류');
                return null;
            }
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return {
                userId: payload.sub,
                role: payload.role || 'ROLE_USER',
                type: payload.type || 'normal'
            };
        } catch (e) {
            console.warn('JWT 파싱 실패:', e);
            return null;
        }
    }

    function hasChatPermission(role, userType) {
        if (role === 'ROLE_ADMIN') return true;
        const allowedSocialTypes = ['naver', 'kakao', 'google'];
        return userType === 'normal' || allowedSocialTypes.includes(userType);
    }

    function fetchRooms() {
        const userInfo = getUserInfo();
        if (!userInfo) {
            Swal.fire({
                icon: 'warning',
                title: '로그인이 필요합니다',
                text: '로그인 후 이용해 주세요.',
                confirmButtonColor: '#f97316'
            }).then(() => window.location.href = '/member/login');
            return;
        }

        if (!hasChatPermission(userInfo.role, userInfo.type)) {
            Swal.fire({
                icon: 'error',
                title: '권한 없음',
                text: '채팅을 사용할 권한이 없습니다.',
                confirmButtonColor: '#f97316'
            });
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
                    roomListDiv.append('<div>문의 사항을 선택하고 "1:1 채팅 시작" 버튼을 클릭하세요.</div>');
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

                    const isUnread = localStorage.getItem(`unread_${room.id}`) === 'true';

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
                            'display': isUnread ? 'inline-block' : 'none'
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

                            const isOwner = userInfo.userId === room.ownerId;
                            const isAdmin = userInfo.role === 'ROLE_ADMIN';

                            if (!isAdmin && !isOwner) {
                                Swal.fire({
                                    icon: 'error',
                                    title: '권한 없음',
                                    text: '본인이 생성한 채팅방만 삭제할 수 있습니다.',
                                    confirmButtonColor: '#f97316'
                                });
                                return;
                            }

                            Swal.fire({
                                icon: 'warning',
                                title: `'${room.name}' 방을 삭제하시겠습니까?`,
                                text: '삭제된 방은 복구할 수 없습니다.',
                                showCancelButton: true,
                                confirmButtonText: '삭제',
                                cancelButtonText: '취소',
                                confirmButtonColor: '#d33',
                                cancelButtonColor: '#3085d6'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    deleteRoom(room.id);
                                }
                            });
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
                Swal.fire({
                    icon: 'error',
                    title: '목록 불러오기 실패',
                    text: '채팅방 목록을 불러오는 데 실패했습니다.',
                    confirmButtonColor: '#f97316'
                });
            }
        });
    }

    function createRoom() {
        const roomName = $('#roomName').val().trim();
        const userInfo = getUserInfo();

        if (!roomName) {
            Swal.fire({
                icon: 'warning',
                title: '입력 필요',
                text: '방 이름을 입력하세요.',
                confirmButtonColor: '#f97316'
            });
            return;
        }

        if (!userInfo) {
            Swal.fire({
                icon: 'error',
                title: '사용자 정보 없음',
                text: '로그인 후 다시 시도해주세요.',
                confirmButtonColor: '#f97316'
            }).then(() => window.location.href = '/member/login');
            return;
        }

        if (!hasChatPermission(userInfo.role, userInfo.type)) {
            Swal.fire({
                icon: 'error',
                title: '권한 없음',
                text: '채팅방 생성 권한이 없습니다.',
                confirmButtonColor: '#f97316'
            });
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
                    Swal.fire({
                        icon: 'error',
                        title: '중복된 방 이름',
                        text: '이미 존재하는 방 이름입니다.',
                        confirmButtonColor: '#f97316'
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: '방 생성 실패',
                        text: '방 생성 중 오류가 발생했습니다.',
                        confirmButtonColor: '#f97316'
                    });
                }
            }
        });
    }

    function deleteRoom(roomId) {
        $.ajax({
            url: '/chat/rooms/' + roomId,
            method: 'DELETE',
            success: function() {
                localStorage.removeItem(`unread_${roomId}`);
                fetchRooms();
            },
            error: function() {
                Swal.fire({
                    icon: 'error',
                    title: '삭제 실패',
                    text: '채팅방 삭제에 실패했습니다.',
                    confirmButtonColor: '#f97316'
                });
            }
        });
    }

    // 채팅방 입장 이벤트 핸들러 (현재 열려있는 방 ID 저장 및 알림 제거)
    $(document).on('click', '.enter-chat-room', function() {
        const userInfo = getUserInfo();
        if (!userInfo || !hasChatPermission(userInfo.role, userInfo.type)) {
            Swal.fire({
                icon: 'error',
                title: '권한 없음',
                text: '채팅방에 입장할 권한이 없습니다.',
                confirmButtonColor: '#f97316'
            });
            return;
        }

        const roomId = $(this).data('room-id');
        currentOpenRoomId = roomId;  // 현재 채팅방 ID 저장

        localStorage.removeItem(`unread_${roomId}`);
        $(this).siblings('.unread-badge').hide();
    });

    // WebSocket 연결 및 알림 처리
    function connectWebSocketForNotifications() {
        const userInfo = getUserInfo();
        if (!userInfo) return;

        const socket = new SockJS(window.WEBSOCKET_URL);
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            console.log('🔔 WebSocket 연결 성공 - 알림 구독 시작');

            stompClient.subscribe('/topic/chat/notify', (msg) => {
                const data = JSON.parse(msg.body);
                const roomId = data.roomId;

                if (roomId === currentOpenRoomId) {
                    // 현재 열려있는 채팅방이면 알림 제거
                    localStorage.removeItem(`unread_${roomId}`);
                    $(`.enter-chat-room[data-room-id="${roomId}"]`).siblings('.unread-badge').hide();
                } else {
                    // 다른 방이면 알림 표시
                    localStorage.setItem(`unread_${roomId}`, 'true');
                    $(`.enter-chat-room[data-room-id="${roomId}"]`).siblings('.unread-badge').show();
                }
            });
        });
    }

    $(document).ready(function() {
        checkToken();
        setupAjax();
        fetchRooms();
        connectWebSocketForNotifications();

        $('#createRoomBtn').off('click').on('click', createRoom);
        $('#roomName').off('keypress').on('keypress', function(e) {
            if (e.which === 13) {
                createRoom();
            }
        });
    });

    window.createRoom = createRoom;
})();
