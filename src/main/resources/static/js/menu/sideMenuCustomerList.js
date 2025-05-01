$(document).ready(function () {
    checkToken();
    setupAjax();
    // 메뉴 목록 Ajax로 불러오기
    $.ajax({
        type: "GET",
        url: "menus/sides",  // 이 엔드포인트는 MenuService에서 활성 상태 메뉴 반환해야 함

        success: function (sides) {
            const container = $(".menu-container");

            sides.forEach(side => {
                const html = `
                <div class="menu-item">
                    <a href="/sides/name/${side.menuName}">
                        <img src="${side.img}" alt="tkdlem 이미지">
                    </a>
                    <div class="menu-info">
                        <h2>${side.sideName}</h2>
                        <p>${side.price}원</p>
                        <form class="add-cart-form" data-side-id="${side.uid}">
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
    // 주문 Ajax
    $(document).on("submit", ".add-cart-form", function (e) {
        e.preventDefault();

        const form = $(this);
        const sideId = form.data("side-id");
        const amount = form.find("input[name='amount']").val();

        $.ajax({
            type: "POST",
            url: "/menus/cart/add/side",
            contentType: "application/json", // JSON으로 보내기
            data: JSON.stringify({
                uid: sideId,       // DTO 필드명과 맞춰야 함
                amount: amount
            }),
            success: function () {
                window.location.href = "/cart";
            },
            error: function (xhr) {
                alert("주문 오류: " + xhr.responseText);
            }
        });
    });

});
