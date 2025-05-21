let globalUserInfo = null;

$(document).ready(async () => {
    checkToken();
    setupAjax();

    // 사용자 정보 전역으로 불러오기
    await getUserInfo().then((userInfo) => {
        globalUserInfo = userInfo;
        console.log('User Info:', userInfo);

        if (userInfo) {
            initUserUI(userInfo);
        } else {
            renderGuestUI();
        }
    }).catch((error) => {
        console.error('user info error:', error);
    });

    // 메뉴 목록 불러오기
    await $.ajax({
        type: "GET",
        url: "/menus",
        success: function (menus) {
            const container = $(".menu-container");
            menus.forEach(menu => {
                const html = `
                    <div class="menu-item" data-menu-id="${menu.uid}">
                        <a href="/menus/name/${menu.menuName}">
                            <img src="${menu.img}" alt="메뉴 이미지">
                        </a>
                        <div class="menu-info">
                            <h2>${menu.menuName}</h2>
                            <p>${menu.price}원</p>
                            <form class="add-cart-form">
                                <input type="hidden" name="amount" value="1">
                                <button type="submit" class="add-to-cart-btn">장바구니 담기</button>
                                <button type="button" class="order-btn">바로 주문</button>
                            </form>
                        </div>
                    </div>
                `;
                container.append(html);
            });
        },
        error: function () {
            alert("메뉴 목록을 불러오는 데 실패했습니다.");
        }
    });

    // // 여기 1:1채팅 버튼 클릭 이벤트 추가
    // $('#oneOnOneChatBtn').on('click', function() {
    //     window.location.href = '/chat';  // 채팅방 목록 페이지로 이동
    // });

    // 장바구니 담기
    $(document).on("submit", ".add-cart-form", function (e) {
        e.preventDefault();

        if (!globalUserInfo) {
            Swal.fire('로그인이 필요합니다', '', 'warning');
            return;
        }

        const form = $(this);
        const parent = form.closest(".menu-item");
        const menuId = parent.data("menu-id");
        const amount = form.find("input[name='amount']").val();
        let userUid ;
        let socialUid ;
        let requestData = { menuId, amount ,userUid, socialUid};

        if (globalUserInfo.type === 'user') {
            requestData.userUid = globalUserInfo.id;
        } else if (globalUserInfo.type === 'social') {
            requestData.socialUid = globalUserInfo.id;
        }
        console.log(requestData);
        $.ajax({
            type: "POST",
            url: "/menus/cart/add",
            data: requestData,
            success: function () {
                Swal.fire({
                    title: '장바구니에 담겼습니다!',
                    text: '장바구니로 이동하시겠습니까?',
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: '장바구니 확인',
                    cancelButtonText: '쇼핑 계속하기',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = "/cart";
                    }
                });
            },
            error: function (xhr) {
                alert("주문 오류: " + xhr.responseText);
            }
        });
    });

    // 바로 주문
    $(document).on("click", ".order-btn", function (e) {
        e.preventDefault();

        if (!globalUserInfo || !globalUserInfo.type || !globalUserInfo.id) {
            Swal.fire('로그인이 필요합니다', '', 'warning');
            return;
        }

        const parent = $(this).closest(".menu-item");
        const menuId = parent.data("menu-id");
        const amount = parent.find("input[name='amount']").val();

        let requestData = { menuId, amount };

        if (globalUserInfo.type === 'user') {
            requestData.userUid = globalUserInfo.id;
        } else if (globalUserInfo.type === 'social') {
            requestData.socialUid = globalUserInfo.id;
        } else {
            Swal.fire('지원되지 않는 로그인 유형입니다.', '', 'error');
            return;
        }

        $.ajax({
            type: "POST",
            url: "/menus/cart/add",
            data: requestData,
            success: function () {
                Swal.fire({
                    title: '바로 주문하시겠습니까?',
                    text: '선택한 메뉴를 바로 결제하러 가시겠습니까?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: '주문하기',
                    cancelButtonText: '취소',
                }).then((result) => {
                    if (result.isConfirmed) {
                        const userParams = (globalUserInfo.type === 'user')
                            ? { userUid: globalUserInfo.id }
                            : (globalUserInfo.type === 'social')
                                ? { socialUid: globalUserInfo.id }
                                : null;

                        if (!userParams) {
                            Swal.fire('로그인 정보를 확인할 수 없습니다.', '', 'error');
                            return;
                        }

                        const queryParams = new URLSearchParams({
                            menuId,
                            amount,
                            ...userParams
                        }).toString();

                        window.location.href = `/order?${queryParams}`;
                    }
                });
            },
            error: function (xhr) {
                Swal.fire("카트에 추가하는 데 실패했습니다.", '', 'error');
            }
        });
    });
});





// 주석 풀고 git 올리기
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
                        .attr('data-room-id', room.id);

                    const deleteButton = $('<button></button>')
                        .text('삭제')
                        .addClass('delete-btn')
                        .click(e => {
                            e.stopPropagation();
                            if (confirm(`'${room.name}' 방을 삭제하시겠습니까?`)) {
                                deleteRoom(room.id);
                            }
                        });

                    topLineDiv.append(nameSpan);
                    topLineDiv.append(deleteButton);

                    const createdAt = new Date(room.createdAt);
                    const formattedDate = createdAt.getFullYear() + '-' +
                        String(createdAt.getMonth() + 1).padStart(2, '0') + '-' +
                        String(createdAt.getDate()).padStart(2, '0') + ' ' +
                        String(createdAt.getHours()).padStart(2, '0') + ':' +
                        String(createdAt.getMinutes()).padStart(2, '0');

                    const dateDiv = $('<div></div>')
                        .addClass('created-time')
                        .text(formattedDate);

                    roomDiv.append(topLineDiv);
                    roomDiv.append(dateDiv);

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

        $('#createRoomBtn').click(() => {
            createRoom();
        });

        $('#roomName').keypress(function(e) {
            if (e.which === 13) {  // Enter key
                createRoom();
            }
        });
    });

    // 인라인 이벤트에서 createRoom 호출해야 한다면, 아래 주석 해제
    window.createRoom = createRoom;

})();



