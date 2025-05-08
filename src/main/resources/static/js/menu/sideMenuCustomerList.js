$(document).ready(() => {
    checkToken();
    setupAjax();

    getUserInfo().then((userInfo) => {
        console.log(userInfo);

        // 공통 사용자 정보 세팅
        $('#welcome-message').text(userInfo.userName + '님 환영합니다!');
        $('#hiddenUserName').val(userInfo.userName);
        $('#hiddenUserId').val(userInfo.userId);
        $('#hiddenId').val(userInfo.id);
        $('#hiddenUserRole').val(userInfo.role);

        // 우측 메뉴 세팅
        const rightMenu = $('.header-right').empty();
        if (userInfo != null) {
            rightMenu.append(`
                <a href="#" class="header-link" id="logoutBtn">로그아웃</a>
                <a href="/member/profile" class="header-link">프로필</a>
                <a href="/cart" class="header-link">장바구니</a>
            `);
            if (userInfo.role === "ROLE_ADMIN") {
                $('.dropdown-admin').css('display', 'block');
                $('.dropdown-delivery').css('display', 'none');
            } else if (userInfo.role === "ROLE_DELIVERY") {
                $('.dropdown-delivery').css('display', 'block');
                $('.dropdown-admin').css('display', 'none');
            } else {
                $('.dropdown-admin').css('display', 'none');
                $('.dropdown-delivery').css('display', 'none');
            }
        } else {
            rightMenu.append(`
                <a href="/member/login" class="header-link">로그인</a>
                <a href="/member/join" class="header-link">회원가입</a>
                <a href="/cart" class="header-link">장바구니</a>
            `);
        }

    }).catch((error) => {
        console.error('board list user info error : ', error);
    });




    // 회원 탈퇴 버튼 (동적 요소 대응)
    $(document).on("click", "#deleteBtn", () => deleteAccount());

// 프로필 페이지 이동 버튼 (동적 요소 대응)
    $(document).on("click", "#profileBtn", () => requestProfile());


    // 사이드 메뉴 목록 불러오기
    $.ajax({
        type: "GET",
        url: "menus/sides",
        success: function (sides) {
            const container = $(".menu-container");

            sides.forEach(side => {
                const html = `
                <div class="menu-item">
                    <a href="/sides/name/${side.menuName}">
                        <img src="${side.img}" alt="사이드 이미지">
                    </a>
                    <div class="menu-info">
                        <h2>${side.sideName}</h2>
                        <p>${side.price}원</p>
                        <form class="add-cart-form" data-side-id="${side.uid}">
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

        const form = $(this);
        const sideId = form.data("side-id");
        const amount = form.find("input[name='amount']").val();

        $.ajax({
            type: "POST",
            url: "/menus/cart/add/side",
            contentType: "application/json",
            data: JSON.stringify({ uid: sideId, amount: amount }),
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

        const form = $(this).closest("form");
        const sideId = form.data("side-id");
        const amount = 1;

        $.ajax({
            type: "POST",
            url: "/menus/cart/add/side",
            contentType: "application/json",
            data: JSON.stringify({ uid: sideId, amount: amount }),
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
                        window.location.href = `/order?menuId=${sideId}&amount=${amount}`;
                    }
                });
            },
            error: function (xhr) {
                alert("카트에 추가하는 데 실패했습니다.");
            }
        });
    });
});

// 공통 함수 정의


// 로그아웃 버튼 (동적 요소 대응)
$(document).on("click", "#logoutBtn", () => {
    Swal.fire({
        title: '로그아웃 하시겠습니까?',
        text: '로그아웃 후 다시 로그인해야 합니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: '네, 로그아웃할게요',
        cancelButtonText: '취소'
    }).then((result) => {
        if (result.isConfirmed) {
            logout();
        }
    });
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
                text: '로그아웃이 완료되었습니다.',
                confirmButtonText: '확인'
            }).then(() => {
                localStorage.removeItem('accessToken');
                window.location.href = '/member/login';
            });
        },
        error: (error) => {
            console.log('오류 발생 : ', error);
            Swal.fire({
                icon: 'error',
                title: '오류 발생',
                text: '로그아웃 중 오류가 발생했습니다.'
            });
        }
    });
}


let deleteAccount = () => {
    setupAjax();
    $.ajax({
        type: 'DELETE',
        url: '/user',
        success: () => {
            alert('회원 탈퇴가 성공했습니다.');
            localStorage.removeItem('accessToken');
            window.location.href = '/member/login';
        },
        error: (error) => {
            console.log('오류 발생 : ', error);
            alert('회원 탈퇴 중 오류가 발생했습니다.');
        }
    });
}

let requestProfile = () => {
    setupAjax();
    $.ajax({
        type: 'GET',
        url: '/member/profile',
        success: () => {
            window.location.href = "/member/profile";
        },
        error: (error) => {
            console.log('오류 발생 : ', error);
        }
    });
}
