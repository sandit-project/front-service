let globalUserInfo;
$(document).ready(() => {
    checkToken(); // JWT 토큰 확인
    setupAjax();  // Ajax 헤더 설정

    getUserInfo().then((userInfo) => {
        globalUserInfo = userInfo;
        console.log('User Info:', userInfo);

        // 사용자 정보 세팅
        $('#welcome-message').text(userInfo.userName + '님 환영합니다!');
        $('#hiddenUserName').val(userInfo.userName);
        $('#hiddenUserId').val(userInfo.userId);
        $('#hiddenId').val(userInfo.id);
        $('#hiddenUserRole').val(userInfo.role);

        // 우측 상단 메뉴
        const rightMenu = $('.header-right').empty();
        rightMenu.append(`
            <a href="#" class="header-link" id="logoutBtn">로그아웃</a>
            <a href="/member/profile" class="header-link">프로필</a>
            <a href="/cart" class="header-link">장바구니</a>
        `);

        // 관리자 / 배달자 드롭다운 제어
        if (userInfo.role === "ROLE_ADMIN") {
            $('.dropdown-admin').show();
            $('.dropdown-delivery').hide();
        } else if (userInfo.role === "ROLE_DELIVERY") {
            $('.dropdown-delivery').show();
            $('.dropdown-admin').hide();
        } else {
            $('.dropdown-admin').hide();
            $('.dropdown-delivery').hide();
        }
    }).catch((error) => {
        console.error('user info error:', error);

        // 비로그인 사용자 메뉴
        const rightMenu = $('.header-right').empty();
        rightMenu.append(`
            <a href="/member/login" class="header-link">로그인</a>
            <a href="/member/join" class="header-link">회원가입</a>
            <a href="/cart" class="header-link">장바구니</a>
        `);
    });

    // 사이드 메뉴 목록 불러오기
    $.ajax({
        type: "GET",
        url: "/menus/sides",
        success: function (sides) {
            const container = $(".menu-container");
            sides.forEach(side => {
                const html = `
                    <div class="menu-item" data-menu-id="${side.uid}">
                        <a href="/sides/name/${side.menuName}">
                            <img src="${side.img}" alt="사이드 이미지" onerror="this.src='/images/no-image.png';">
                        </a>
                        <div class="menu-info">
                            <h2>${side.sideName}</h2>
                            <p>${side.price}원</p>
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
            alert("사이드 메뉴 목록을 불러오는 데 실패했습니다.");
        }
    });

    // 장바구니 담기
    $(document).on("submit", ".add-cart-form", function (e) {
        e.preventDefault();

        if (!globalUserInfo) {
            Swal.fire('로그인이 필요합니다', '', 'warning');
            return;
        }

        const form = $(this);
        const parent = form.closest(".menu-item");
        const sideId = parent.data("menu-id");
        const amount = form.find("input[name='amount']").val();
        let userUid ;
        let socialUid ;
        let requestData = {sideId, amount ,userUid, socialUid};

        if (globalUserInfo.type === 'user') {
            requestData.userUid = globalUserInfo.id;
        } else if (globalUserInfo.type === 'social') {
            requestData.socialUid = globalUserInfo.id;
        }
        console.log(requestData);
        $.ajax({
            type: "POST",
            url: "/menus/cart/add/side",
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
    $(document).on("click", ".order-btn", function () {
        if (!globalUserInfo) {
            Swal.fire('로그인이 필요합니다', '', 'warning');
            return;
        }

        const form = $(this);
        const parent = form.closest(".menu-item");
        const sideId = parent.data("menu-id");
        const amount = 1;
        let userUid ;
        let socialUid ;
        let requestData = { sideId, amount ,userUid, socialUid};

        if (globalUserInfo.type === 'user') {
            requestData.userUid = globalUserInfo.id;
        } else if (globalUserInfo.type === 'social') {
            requestData.socialUid = globalUserInfo.id;
        }

        $.ajax({
            type: "POST",
            url: "/menus/cart/add/side",

            data: requestData,
            success: function () {
                Swal.fire({
                    title: '바로 주문하시겠습니까?',
                    text: '선택한 메뉴를 결제하러 가시겠습니까?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: '주문하기',
                    cancelButtonText: '취소',
                }).then((result) => {
                    if (result.isConfirmed) {
                        const queryParams = new URLSearchParams({
                            menuId: sideId,
                            amount,
                            ...(globalUserInfo.type === 'user'
                                ? { userUid: globalUserInfo.id }
                                : { socialUid: globalUserInfo.id })
                        }).toString();

                        window.location.href = `/order?${queryParams}`;
                    }
                });
            },
            error: function () {
                Swal.fire("주문 실패", '', 'error');
            }
        });
    });

    // 로그아웃 처리
    $(document).on("click", "#logoutBtn", () => {
        Swal.fire({
            title: '로그아웃 하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '네, 로그아웃할게요',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) logout();
        });
    });

    // 회원 탈퇴
    $(document).on("click", "#deleteBtn", () => deleteAccount());

    // 프로필 이동
    $(document).on("click", "#profileBtn", () => requestProfile());
});

function logout() {
    setupAjax();
    $.ajax({
        type: 'POST',
        url: '/logout',
        success: () => {
            Swal.fire({
                icon: 'success',
                title: '로그아웃 성공',
                text: '다시 로그인해주세요.',
            }).then(() => {
                localStorage.removeItem('accessToken');
                window.location.href = '/member/login';
            });
        },
        error: () => {
            Swal.fire('오류', '로그아웃 중 오류가 발생했습니다.', 'error');
        }
    });
}

function deleteAccount() {
    setupAjax();
    $.ajax({
        type: 'DELETE',
        url: '/user',
        success: () => {
            alert('회원 탈퇴가 완료되었습니다.');
            localStorage.removeItem('accessToken');
            window.location.href = '/member/login';
        },
        error: () => {
            alert('회원 탈퇴 중 오류가 발생했습니다.');
        }
    });
}

function requestProfile() {
    setupAjax();
    window.location.href = "/member/profile";
}
