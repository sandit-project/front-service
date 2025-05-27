let globalUserInfo = null;
let sideList = [];

$(document).ready(async () => {
    checkToken();
    setupAjax();

    // 사용자 정보 불러오기
    try {
        globalUserInfo = await getUserInfo();
        console.log("User Info:", globalUserInfo);

        if (globalUserInfo) {
            initUserUI(globalUserInfo);
        } else {
            renderGuestUI();
        }
    } catch (err) {
        console.error("User info error:", err);
        renderGuestUI();
    }

    // 사이드 메뉴 불러오기
    try {
        const response = await $.get("/menus/sides");
        sideList = response;

        const container = $(".menu-container").empty();
        sideList.forEach(side => {
            container.append(renderSideItem(side));
        });
    } catch (err) {
        console.error("사이드 메뉴 로딩 오류:", err);
        Swal.fire({
            icon: 'error',
            title: '불러오기 실패',
            text: '사이드 메뉴 목록을 불러오는 데 실패했습니다.',
            confirmButtonColor: '#f97316'
        });
    }

    // 장바구니 담기
    $(document).on("submit", ".add-cart-form", async function (e) {
        e.preventDefault();
        if (!globalUserInfo) return Swal.fire('로그인이 필요합니다', '', 'warning');

        const $form = $(this);
        const $parent = $form.closest(".menu-item");
        const sideId = $parent.data("menu-id");
        const amount = $form.find("input[name='amount']").val();

        const requestData = buildCartRequest(sideId, amount);
        try {
            await $.post("/menus/cart/add/side", requestData);
            Swal.fire({
                title: '장바구니에 담겼습니다!',
                text: '장바구니로 이동하시겠습니까?',
                icon: 'success',
                showCancelButton: true,
                confirmButtonText: '장바구니 확인',
                cancelButtonText: '쇼핑 계속하기',
            }).then((result) => {
                if (result.isConfirmed) window.location.href = "/cart";
            });
        } catch (err) {
            console.error("장바구니 오류:", err);
            Swal.fire('오류', '장바구니 추가 실패', 'error');
        }
    });

    // 바로 주문
    $(document).on("click", ".order-btn", async function () {
        if (!globalUserInfo) return Swal.fire('로그인이 필요합니다', '', 'warning');

        const $btn = $(this);
        const $parent = $btn.closest(".menu-item");
        const sideId = $parent.data("menu-id");
        const amount = 1;

        const requestData = buildCartRequest(sideId, amount);

        try {
            await $.post("/menus/cart/add/side", requestData);
            Swal.fire({
                title: '바로 주문하시겠습니까?',
                text: '선택한 메뉴를 결제하러 가시겠습니까?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '주문하기',
                cancelButtonText: '취소',
            }).then(result => {
                if (result.isConfirmed) {
                    const params = new URLSearchParams({
                        menuId: sideId,
                        amount,
                        ...(globalUserInfo.type === 'user'
                            ? { userUid: globalUserInfo.id }
                            : { socialUid: globalUserInfo.id })
                    });
                    window.location.href = `/order?${params.toString()}`;
                }
            });
        } catch (err) {
            console.error("주문 실패:", err);
            Swal.fire('오류', '주문 처리 실패', 'error');
        }
    });

    // 로그아웃
    $(document).on("click", "#logoutBtn", () => {
        Swal.fire({
            title: '로그아웃 하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '네, 로그아웃할게요',
            cancelButtonText: '취소'
        }).then(result => {
            if (result.isConfirmed) logout();
        });
    });

    // 회원 탈퇴
    $(document).on("click", "#deleteBtn", () => deleteAccount());

    // 프로필
    $(document).on("click", "#profileBtn", () => requestProfile());
});

// ==== 함수들 ====

function renderSideItem(side) {
    return `
        <div class="menu-item" data-menu-id="${side.uid}">
            <a href="/sidesInfo/${side.sideName}">
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
}


function buildCartRequest(sideId, amount) {
    const requestData = { sideId, amount };
    if (globalUserInfo.type === 'user') {
        requestData.userUid = globalUserInfo.id;
    } else if (globalUserInfo.type === 'social') {
        requestData.socialUid = globalUserInfo.id;
    }
    return requestData;
}

function initUserUI(userInfo) {
    $('#welcome-message').text(`${userInfo.userName}님 환영합니다!`);
    $('#hiddenUserName').val(userInfo.userName);
    $('#hiddenUserId').val(userInfo.userId);
    $('#hiddenId').val(userInfo.id);
    $('#hiddenUserRole').val(userInfo.role);

    const rightMenu = $('.header-right').empty();
    rightMenu.append(`
        <a href="#" class="header-link" id="logoutBtn">로그아웃</a>
        <a href="/member/profile" class="header-link">프로필</a>
        <a href="/cart" class="header-link">장바구니</a>
    `);

    if (userInfo.role === "ROLE_ADMIN") {
        $('.dropdown-admin').show();
        $('.dropdown-delivery').hide();
    } else if (userInfo.role === "ROLE_DELIVERY") {
        $('.dropdown-delivery').show();
        $('.dropdown-admin').hide();
    } else {
        $('.dropdown-admin, .dropdown-delivery').hide();
    }
}

function renderGuestUI() {
    const rightMenu = $('.header-right').empty();
    rightMenu.append(`
        <a href="/member/login" class="header-link">로그인</a>
        <a href="/member/join" class="header-link">회원가입</a>
        <a href="/cart" class="header-link">장바구니</a>
    `);
}

function logout() {
    setupAjax();
    $.post('/logout')
        .done(() => {
            Swal.fire('로그아웃 성공', '다시 로그인해주세요.', 'success').then(() => {
                localStorage.removeItem('accessToken');
                window.location.href = '/member/login';
            });
        })
        .fail(() => {
            Swal.fire('오류', '로그아웃 중 오류가 발생했습니다.', 'error');
        });
}

function deleteAccount() {
    setupAjax();
    $.ajax({
        type: 'DELETE',
        url: '/user'
    }).done(() => {
        Swal.fire('회원 탈퇴 완료', '이용해 주셔서 감사합니다.', 'success').then(() => {
            localStorage.removeItem('accessToken');
            window.location.href = '/member/login';
        });
    }).fail(() => {
        Swal.fire('탈퇴 실패', '회원 탈퇴 중 오류가 발생했습니다.', 'error');
    });
}

function requestProfile() {
    setupAjax();
    window.location.href = "/member/profile";
}
