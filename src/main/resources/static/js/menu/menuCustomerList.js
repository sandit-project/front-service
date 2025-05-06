$(document).ready(function () {
    checkToken();
    setupAjax();
    getUserInfo().then((userInfo)=>{
        console.log(userInfo);

        $('#hiddenId').val(userInfo.id);
        // $('#hiddenType').val(userInfo.type);
        $('#hiddenUserRole').val(userInfo.role);

        const rightMenu = $('.header-right').empty();

        if(userInfo != null){
            rightMenu.append(`
                <a href="/member/profile" class="header-link">프로필</a>
                <a href="/cart" class="header-link">장바구니</a>
            `);
            if(userInfo.role === "ROLE_ADMIN"){
                $('.dropdown-admin').css('display', 'block');
                $('.dropdown-delivery').css('display', 'none');
            }else if(userInfo.role === "ROLE_DELIVERY"){
                $('.dropdown-delivery').css('display', 'block');
                $('.dropdown-admin').css('display', 'none');
            }else{
                $('.dropdown-admin').css('display', 'none');
                $('.dropdown-delivery').css('display', 'none');
            }
        }else{
            rightMenu.append(`
                <a href="/member/login" class="header-link">로그인</a>
                <a href="/member/join" class="header-link">회원가입</a>
                <a href="/cart" class="header-link">장바구니</a>
            `);
        }

    }).catch((error)=>{
        console.error('board list user info error : ',error);
    });

    // 메뉴 목록 Ajax로 불러오기
    $.ajax({
        type: "GET",
        url: "/menus",  // 이 엔드포인트는 MenuService에서 활성 상태 메뉴 반환해야 함

        success: function (menus) {
            const container = $(".menu-container");

            menus.forEach(menu => {
                const html = `
                <div class="menu-item">
                    <a href="/menus/name/${menu.menuName}">
                        <img src="${menu.img}" alt="메뉴 이미지">
                    </a>
                    <div class="menu-info">
                        <h2>${menu.menuName}</h2>
                        <p>${menu.price}원</p>
                        <form class="add-cart-form" data-menu-id="${menu.uid}">
                            <input type="hidden" name="amount" value="1">
                            <button type="submit" class="add-to-cart-btn">주문하기</button>
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

    // 주문 Ajax
    $(document).on("submit", ".add-cart-form", function (e) {
        e.preventDefault();

        const form = $(this);
        const menuId = form.data("menu-id");
        const amount = form.find("input[name='amount']").val();

        $.ajax({
            type: "POST",
            url: "/menus/cart/add",
            data: { menuId: menuId, amount: amount },
            success: function () {
                window.location.href = "/cart";
            },
            error: function (xhr) {
                alert("주문 오류: " + xhr.responseText);
            }
        });
    });
});
