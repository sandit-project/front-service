let globalUserInfo = null;

$(document).ready(function () {
    checkToken();
    setupAjax();

    getUserInfo().then((userInfo) => {
        globalUserInfo = userInfo;

        if (!userInfo) {
            Swal.fire("로그인이 필요합니다", "", "warning").then(() => {
                window.location.href = "/member/login";
            });
            return;
        }

        initUserUI(userInfo);
        loadCartItems();
    });

    // 선택/해제 처리
    $("#selectAll").on("change", function () {
        $(".item-checkbox").prop("checked", this.checked);
    });

    $(document).on("change", ".item-checkbox", function () {
        const allChecked = $(".item-checkbox").length === $(".item-checkbox:checked").length;
        $("#selectAll").prop("checked", allChecked);
    });

    // 수량 변경
    $(document).on("click", ".update-btn", function () {
        const row = $(this).closest("tr");
        const id = row.data("id");
        const newAmount = parseInt(row.find(".amount-input").val());

        if (!newAmount || newAmount < 1) {
            Swal.fire({
                icon: 'warning',
                title: '수량 오류',
                text: '수량은 1 이상이어야 합니다.',
                confirmButtonColor: '#f97316'
            });
            return;
        }

        updateCartItemAmount(id, newAmount);
    });

    // 개별 삭제
    $(document).on("click", ".delete-btn", function () {
        const row = $(this).closest("tr");
        const id = row.data("id");

        Swal.fire({
            title: '정말 삭제하시겠습니까?',
            text: '이 항목은 복구할 수 없습니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteCartItem(id, row);
            }
        });

    });

    // 선택 삭제
    $("#deleteSelected").click(function () {
        const selectedIds = $(".item-checkbox:checked").map(function () {
            return $(this).val();
        }).get();

        if (selectedIds.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: '삭제 실패',
                text: '삭제할 항목을 선택하세요.',
                confirmButtonColor: '#f97316'
            });
            return;
        }

        Swal.fire({
            title: `${selectedIds.length}개 항목을 삭제할까요?`,
            text: "삭제된 항목은 복구할 수 없습니다.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "삭제",
            cancelButtonText: "취소",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6"
        }).then((result) => {
            if (result.isConfirmed) {
                const requestData = {
                    selectedIds,
                    ...getUserParams()
                };

                $.post("/menus/cart/delete-selected", requestData)
                    .done(response => renderCartItems(response.cartItems))
                    .fail(() => {
                        Swal.fire({
                            icon: 'error',
                            title: '삭제 실패',
                            text: '선택한 항목 삭제 중 오류가 발생했습니다.',
                            confirmButtonColor: '#f97316'
                        });
                    });
            }
        });
    });

    // 주문하기
    $("#checkout").click(async function () {
        const selectedIds = $(".item-checkbox:checked").map(function () {
            return parseInt($(this).val(), 10);
        }).get();

        if (selectedIds.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: '선택 없음',
                text: '주문할 항목을 선택하세요.',
                confirmButtonColor: '#f97316'
            });
            return;
        }

        const userInfo = getUserParams();

        // 선택한 UID를 sessionStorage에 저장
        sessionStorage.setItem("checkoutData", JSON.stringify({
            selectedIds,
            userInfo
        }));

        // 안전하게 /order 이동
        window.location.href = "/order";
    });

    $("#backToHome").click(function () {
        window.location.href = "/";
    });
});

function getUserParams() {
    if (!globalUserInfo) return {};
    if (globalUserInfo.type === 'user') return { userUid: globalUserInfo.id };
    if (globalUserInfo.type === 'social') return { socialUid: globalUserInfo.id };
    return {};
}

function loadCartItems() {
    const params = getUserParams();
    $.get("/menus/cart", params, function (response) {
        renderCartItems(response.cartItems);
    }).fail(() => {
        Swal.fire({
            icon: 'error',
            title: '로딩 실패',
            text: '장바구니 로딩 중 오류가 발생했습니다.',
            confirmButtonColor: '#f97316'
        });
    });
}

function renderCartItems(cartItems) {
    const $tbody = $("#cartTableBody").empty();
    let totalQuantity = 0;
    let totalPrice = 0;

    cartItems.forEach(item => {
        const rowHtml = `
    <tr data-id="${item.uid}">
        <td><input type="checkbox" class="item-checkbox" value="${item.uid}" checked></td>
        <td class="menu-name" style="display: flex; align-items: center; gap: 10px;">
            <img src="${item.img}" alt="${item.menuName}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;">
            <span>${item.menuName}</span>
        </td>
        <td>
            <input type="number" min="1" value="${item.amount}" class="amount-input">
            <button type="button" class="update-btn">변경</button>
        </td>
        <td class="item-price">${item.unitPrice.toLocaleString()}</td>
        <td class="total-cell">${(item.unitPrice * item.amount).toLocaleString()}</td>
        <td><button type="button" class="delete-btn">삭제</button></td>
    </tr>
    `;
        $tbody.append(rowHtml);
        totalQuantity += item.amount;
        totalPrice += item.unitPrice * item.amount;
    });

    $("#totalQuantity").text(totalQuantity);
    $("#totalPrice").text(totalPrice.toLocaleString());
}

function updateCartItemAmount(id, newAmount) {
    const data = {
        amount: newAmount,
        ...getUserParams()
    };

    $.ajax({
        url: `/menus/cart/update/${id}`,
        type: "POST",
        data,
        success: function (response) {
            renderCartItems(response.cartItems);
        },
        error: function () {
            Swal.fire({
                icon: 'error',
                title: '수량 변경 실패',
                text: '수량 변경 중 오류가 발생했습니다.',
                confirmButtonColor: '#f97316'
            });
        }
    });
}

function deleteCartItem(id, row) {
    const data = getUserParams();

    $.ajax({
        url: `/menus/cart/delete/${id}`,
        type: "POST",
        data,
        success: function (response) {
            row.remove();
            renderCartItems(response.cartItems);
            Swal.fire({
                icon: 'success',
                title: '삭제 완료',
                text: '항목이 삭제되었습니다.',
                confirmButtonColor: '#f97316'
            });
        },
        error: function () {
            Swal.fire({
                icon: 'error',
                title: '삭제 실패',
                text: '항목 삭제 중 오류가 발생했습니다.',
                confirmButtonColor: '#f97316'
            });
        }
    });
}
