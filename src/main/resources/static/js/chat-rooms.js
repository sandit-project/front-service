(function () {
    // 토큰 체크 및 로그인 리다이렉트

    // JWT 또는 소셜 토큰에서 userId, role, type 추출
    function getUserInfo() {
        const token = localStorage.getItem('accessToken');
        if (!token) return null;

        // 소셜 토큰 접두사: naver:, kakao:, google:
        const socialPrefixes = ['naver:', 'kakao:', 'google:'];
        const socialType = socialPrefixes.find(prefix => token.startsWith(prefix));

        if (socialType) {
            const parts = token.split(':');
            if (parts.length >= 2) {
                return {
                    userId: parts[1],
                    role: 'ROLE_USER',
                    type: socialType.slice(0, -1) // 'naver', 'kakao', 'google'
                };
            } else {
                console.warn('소셜 토큰 형식 오류');
                return null;
            }
        }

        // 일반 JWT 처리
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

    // 채팅 권한 확인 (관리자 무조건 허용, 그 외 소셜 또는 일반 가입자 허용)
    function hasChatPermission(role, userType) {
        if (role === 'ROLE_ADMIN') return true;
        const allowedSocialTypes = ['naver', 'kakao', 'google'];
        if (userType === 'normal') return true;
        if (allowedSocialTypes.includes(userType)) return true;
        return false;
    }

    // 채팅방 목록 조회 및 렌더링
    function fetchRooms() {
        const userInfo = getUserInfo();
        if (!userInfo) {
            Swal.fire({
                icon: 'warning',
                title: '로그인이 필요합니다',
                text: '로그인 후 이용해 주세요.',
                confirmButtonColor: '#f97316'
            }).then(() => {
                window.location.href = '/member/login';
            });
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

                // 관리자는 모든 방, 일반/소셜은 자신의 방만
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
                            'display': 'none'
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

    // 채팅방 생성
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
            }).then(() => {
                window.location.href = '/member/login';
            });
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

    // 채팅방 삭제
    function deleteRoom(roomId) {
        $.ajax({
            url: '/chat/rooms/' + roomId,
            method: 'DELETE',
            success: function() {
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

    // 채팅방 클릭 시 읽음 처리 및 뱃지 숨김, 권한 체크 추가
    $(document).on('click', '.enter-chat-room', function() {
        const userInfo = getUserInfo();
        if (!userInfo || !hasChatPermission(userInfo.role, userInfo.type)) {
            Swal.fire({
                icon: 'error',
                title: '권한 없음',
                text: '채팅방에 입장할 권한이 없습니다.',
                confirmButtonColor: '#f97316'
            });

        }


    });

    // 초기화
    $(document).ready(function() {
        checkToken();
        setupAjax();
        fetchRooms();

        $('#createRoomBtn').off('click').on('click', createRoom);

        $('#roomName').off('keypress').on('keypress', function(e) {
            if (e.which === 13) {
                createRoom();
            }
        });
    });

    window.createRoom = createRoom;
})();
