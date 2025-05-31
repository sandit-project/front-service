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
    return {
        sideId,
        amount,
        ...(globalUserInfo.type === 'user'
            ? { userUid: globalUserInfo.id }
            : { socialUid: globalUserInfo.id })
    };
}
