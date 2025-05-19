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