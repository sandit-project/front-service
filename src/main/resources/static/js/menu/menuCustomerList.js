let globalUserInfo = null;
let menuList = [];

$(document).ready(async () => {
    checkToken();
    setupAjax();

    // 사용자 정보 전역으로 불러오기
    await getUserInfo().then((userInfo) => {
        globalUserInfo = userInfo;
        console.log('User Info:', userInfo);

        if (userInfo) {
            initUserUI(userInfo);
            hideUnauthorizedNav(userInfo);
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
            menuList = menus; // menus 전체를 저장해 둠
            console.log("메뉴리스트 :",menuList);
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
            Swal.fire({
                icon: 'error',
                title: '로딩 실패',
                text: '메뉴 목록을 불러오는 데 실패했습니다.',
                confirmButtonColor: '#f97316'
            });

        }
    });


    // 장바구니 담기
    $(document).on("submit", ".add-cart-form", async function (e) {
        e.preventDefault();

        if (!globalUserInfo) {
            Swal.fire('로그인이 필요합니다', '', 'warning');
            return;
        }

        const form = $(this);
        const parent = form.closest(".menu-item");
        const menuId = parent.data("menu-id");
        const amount = form.find("input[name='amount']").val();

        // ★★★★★ 여기서 menusList에서 해당 메뉴 객체 찾기
        const menuObj = menuList.find(menu=>menu.uid === menuId);
        console.log("menuObj :",menuObj);
        if (!menuObj) {
            Swal.fire("메뉴 정보를 찾을 수 없습니다.", '', 'error');
            return;
        }
        // *** 재료명 추출 ***
        const ingredients = extractIngredients(menuObj);

        console.log("메뉴정보에서의 재료들 :",ingredients);

        // === 유저 알러지 정보 가져오기 ===
        let allergyList = [];
        if (globalUserInfo.type === 'user') {
            allergyList = await fetchUserAllergies(globalUserInfo.id); // user_uid로 호출
        } else if (globalUserInfo.type === 'social') {
            //소셜 로그인은 별도 처리 필요
            allergyList = [];
        }

        // ==== 알러지 체크 로직 ===
        let allergyReqBody = {
            user_uid: (globalUserInfo.type === 'user') ? globalUserInfo.id : null,
            social_uid: (globalUserInfo.type === 'social') ? globalUserInfo.id : null,
            allergy: allergyList,
            ingredients: ingredients
        };
        console.log("allergyReqBody :",allergyReqBody);

        const allergyResult = await checkAllergyAPI(allergyReqBody);

        if (allergyResult.risk) {
            Swal.fire({
                icon: 'error',
                title: '⚠️ 알러지 위험 경고',
                html: `
                        <b>위험 원인:</b> ${allergyResult.cause && allergyResult.cause.length ? allergyResult.cause.join(', ') : '원인 불명'}<br>
                        <b>설명:</b> ${allergyResult.detail || ''}
                      `
            });
            return;
        }

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
                Swal.fire({
                    icon: 'error',
                    title: '주문 실패',
                    text: xhr.responseText || '알 수 없는 오류가 발생했습니다.',
                    confirmButtonColor: '#f97316'
                });
            }
        });
    });

    // 바로 주문
    $(document).on("click", ".order-btn", async function (e) {
        e.preventDefault();

        if (!globalUserInfo || !globalUserInfo.type || !globalUserInfo.id) {
            Swal.fire('로그인이 필요합니다', '', 'warning');
            return;
        }

        const parent = $(this).closest(".menu-item");
        const menuId = parent.data("menu-id");
        const amount = parent.find("input[name='amount']").val();

        // ★★★★★ 여기서 menusList에서 해당 메뉴 객체 찾기
        const menuObj = menuList.find(menu=>menu.uid === menuId);
        console.log("menuObj :",menuObj);
        if (!menuObj) {
            Swal.fire("메뉴 정보를 찾을 수 없습니다.", '', 'error');
            return;
        }
        // *** 재료명 추출 ***
        const ingredients = extractIngredients(menuObj);

        console.log("메뉴정보에서의 재료들 :",ingredients);

        // === 유저 알러지 정보 가져오기 ===
        let allergyList = [];
        if (globalUserInfo.type === 'user') {
            allergyList = await fetchUserAllergies(globalUserInfo.id); // user_uid로 호출
        } else if (globalUserInfo.type === 'social') {
            //소셜 로그인은 별도 처리 필요
            allergyList = [];
        }

        // ==== 알러지 체크 로직 ===
        let allergyReqBody = {
            user_uid: (globalUserInfo.type === 'user') ? globalUserInfo.id : null,
            social_uid: (globalUserInfo.type === 'social') ? globalUserInfo.id : null,
            allergy: allergyList,
            ingredients: ingredients
        };
        console.log("allergyReqBody :",allergyReqBody);

        const allergyResult = await checkAllergyAPI(allergyReqBody);

        if (allergyResult.risk) {
            Swal.fire({
                icon: 'error',
                title: '⚠️ 알러지 위험 경고',
                html: `
                        <b>위험 원인:</b> ${allergyResult.cause && allergyResult.cause.length ? allergyResult.cause.join(', ') : '원인 불명'}<br>
                        <b>설명:</b> ${allergyResult.detail || ''}
                      `
            });
            return;
        }

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
