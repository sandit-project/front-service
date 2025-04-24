let userUid;

const MOCK_USER = {
    userUid:     1,
    userName:    '홍길동',
    email:       'jr0503@naver.com',
    phone:       '010-1234-1234',
    mainAddress: '서울시 강동구 풍성로 136-17',
    subAddress1: 'OO빌딩 3층'
};
const MOCK_CART_ITEMS = [
    { uid: 1, menuName: '샌드위치 A', price: 100, amount: 1, calorie: 300 },
    { uid: 2, menuName: '샌드위치 B', price: 200, amount: 2, calorie: 150 }
];

const MOCK_STORES = [
    { uid: 1, storeName: '강동점' },
    { uid: 2, storeName: '강남점' },
    { uid: 3, storeName: '잠실점' }
];

// 장바구니 항목 가져오기 (받아오는 주소에 맞춰서 수정 예정)
function getCartItems() {

    return Promise.resolve(MOCK_CART_ITEMS);
    // return $.ajax({
    //     url: '/carts',
    //     method: 'GET',
    //     contentType: 'application/json'
    // });
}

function getUserInfo() {
    return Promise.resolve(MOCK_USER);
}

//fillUserInfoForm 헬퍼 (폼에 값 채워넣기)
function fillUserInfoForm(user) {
    $('#name').val(user.userName);
    $('#phone').val(user.phone);
    $('#email').val(user.email);
    $('#mainAddress').val(user.mainAddress);
    $('#subAddress1').val(user.subAddress1 || '');
}

// 선택된 장바구니 항목 가져오기
async function renderCartItems(items) {
    const $container = $('#cartContainer');
    $container.empty();
    items.forEach(item => {
        const itemHtml = `
            <div class="cart-item" data-cart-item data-cart-uid="${item.uid}">
                <input type="checkbox" class="cart-check" checked>
                <span class="item-name">${item.menuName}</span>
                <span class="item-price">${item.price}원</span>
                <span class="item-calorie">${item.calorie} kcal</span>
                <input type="number" class="item-amount" value="${item.amount}" min="1" style="width: 50px;">
            </div>
        `;
        $container.append(itemHtml);
    });
}

// 주소 존재 여부 체크 API 호출
function checkUserAddress(userUid) {
    return true;
    // return $.ajax({
    //     url: `/users/${userUid}/check-address`,
    //     method: 'GET'
    // }).then(response => {
    //     return response.hasAddress;
    // });
}

//주소 검색 호출 함수
function execDaumPostcode() {
    new daum.Postcode({
        oncomplete: function(data) {
            // 도로명 주소 또는 지번 주소 넣기
            var addr = data.roadAddress ? data.roadAddress : data.jibunAddress;

            // 주소 입력란에 넣어주기
            document.getElementById('mainAddress').value = addr;
        }
    }).open();
}


// 스토어 리스트 가져오기
function getStores() {
    // return $.ajax({
    //     url: '/stores',
    //     method: 'GET',
    //     contentType: 'application/json'
    // }).promise();

    return Promise.resolve(MOCK_STORES);
}

// 드롭다운에 스토어 추가하기
function renderStoreDropdown() {
    getStores()
        .then(stores => {
            const $storeSelect = $('#storeSelect'); // 드롭다운 셀렉터
            $storeSelect.empty(); // 기존 옵션 삭제

            // 기본 옵션 추가
            $storeSelect.append('<option value="">스토어 선택</option>');

            stores.forEach(store => {
                const option = `<option value="${store.uid}">${store.storeName}</option>`;
                $storeSelect.append(option);
            });
        })
        .catch(error => {
            console.error('스토어 목록 불러오기 실패', error);
        });
}

let merchantUid = null;

$(document).ready(async () => {
    const IMP = window.IMP;
    IMP.init('imp54787882');

    const user = await getUserInfo();
    userUid = user.userUid;
    const items = await getCartItems();
    fillUserInfoForm(user);

    await renderCartItems(items);
    updateTotalPrice();
    renderStoreDropdown();

    // 예약 시간 입력 필드가 비어있다면 현재 시간으로 채워준다.
    const $reservationInput = $('#reservationDate');
    if (!$reservationInput.val()) {
        const now = new Date(); // 현재 시간
        // 포맷팅: yyyy-MM-ddTHH:mm
        const year = now.getFullYear();
        const month = ('0' + (now.getMonth() + 1)).slice(-2);
        const day = ('0' + now.getDate()).slice(-2);
        const hours = ('0' + now.getHours()).slice(-2);
        const minutes = ('0' + now.getMinutes()).slice(-2);
        const formatted = `${year}-${month}-${day}T${hours}:${minutes}`;
        $reservationInput.val(formatted);
    }
    console.log("예약 시간 값:", $reservationInput.val());

    $('#payButton').click(async () => {
        // 예약 시간 input의 값을 읽어오되, 값이 없으면 null로 처리
        let reservationDate = $('#reservationDate').val();
        if (!reservationDate || reservationDate.trim() === "") {
            reservationDate = null;
        }
        console.log("전송될 예약 시간:", reservationDate);

        try {
            const hasAddress = await checkUserAddress(userUid);
            if (!hasAddress) {
                alert('주소를 먼저 입력해야 주문할 수 있습니다.');
                //window.location.href = `/users/1/edit-address`;  // 주소 입력 페이지로 리다이렉션 (추후 수정)
                return;
            }
        } catch (error) {
            console.error('주소 체크 실패', error);
            alert('주소 확인 중 문제가 발생했습니다.');
            return;
        }

        //결제 로직
        const cartUids = getSelectedCartUids();
        const buyer = getBuyerInfo();
        const totalPrice = calculateTotal();
        const selectedItems = getSelectedCartItems();

        if (cartUids.length === 0) {
            alert('주문할 메뉴를 선택해주세요.');
            return;
        }

        let menuName = '';
        if (selectedItems.length === 1) {
            menuName = selectedItems[0].menuName;
        } else if (selectedItems.length > 1) {
            menuName = `${selectedItems[0].menuName} 외 ${selectedItems.length - 1}건`;
        }

        merchantUid = generateMerchantUid();
        const storeUid = $('#storeSelect').val();
        console.log("storeUid:", storeUid);

        if (!storeUid) {
            alert('스토어를 선택해주세요!');
            return;
        }

        // 커스텀 주문 옵션 데이터 수집 (만약 해당 영역이 있다면)
        let customOrderRequestDTO = null;
        if ($('#customOptions').length > 0 && $('#customOptions').is(':visible')) {
            customOrderRequestDTO = {
                bread: parseInt($('#bread').val()) || null,
                material1: parseInt($('#material1').val()) || null,
                material2: parseInt($('#material2').val()) || null,
                material3: parseInt($('#material3').val()) || null,
                vegetable1: parseInt($('#vegetable1').val()) || null,
                vegetable2: parseInt($('#vegetable2').val()) || null,
                vegetable3: parseInt($('#vegetable3').val()) || null,
                vegetable4: parseInt($('#vegetable4').val()) || null,
                vegetable5: parseInt($('#vegetable5').val()) || null,
                vegetable6: parseInt($('#vegetable6').val()) || null,
                vegetable7: parseInt($('#vegetable7').val()) || null,
                vegetable8: parseInt($('#vegetable8').val()) || null,
                sauce1: parseInt($('#sauce1').val()) || null,
                sauce2: parseInt($('#sauce2').val()) || null,
                sauce3: parseInt($('#sauce3').val()) || null
            };
        }

        try {
            await preparePayment(merchantUid, menuName, totalPrice, storeUid, userUid, reservationDate);
            console.log('사전 검증 성공');

            requestPayment(cartUids, buyer, totalPrice, merchantUid, reservationDate, customOrderRequestDTO);
        } catch (err) {
            console.error('사전 검증 실패', err);
            alert('사전 검증 실패');
        }
    });
});

// 장바구니 렌더링
async function renderCartItems() {
    const $container = $('#cartContainer');
    $container.empty(); // 이전 내용 비우기

    try {
        const items = await getCartItems(); // DB에서 가져옴
        items.forEach(item => {
            const itemHtml = `
                <div class="cart-item" data-cart-item data-cart-uid="${item.uid}">
                    <input type="checkbox" class="cart-check" checked>
                    <span class="item-name">${item.menuName}</span>
                    <span class="item-price">${item.price}</span>원
                    <span class="item-calorie">${item.calorie} kcal</span>
                    <input type="number" class="item-amount" value="${item.amount || 1}" min="1" style="width: 50px;">
                </div>
            `;
            $container.append(itemHtml);
        });
    } catch (error) {
        console.error('장바구니 불러오기 실패', error);
    }
}

// 선택한 카트 항목들 cartUid 가져오기
function getSelectedCartUids() {
    const cartUids = [];
    $('[data-cart-item]').each(function () {
        if ($(this).find('.cart-check').is(':checked')) {
            const cartUid = $(this).data('cart-uid');
            if (cartUid !== undefined) {
                cartUids.push(cartUid);
            }
        }
    });
    return cartUids;
}

// 선택된 장바구니 항목 정보 가져오기
function getSelectedCartItems() {
    const selectedItems = [];
    $('[data-cart-item]').each(function () {
        const $item   = $(this);
        const $check  = $item.find('.cart-check');
        if ($check.is(':checked')) {
            const cartUid  = $item.data('cart-uid');
            const menuName = $item.find('.item-name').text().trim();
            const price    = parseInt($item.find('.item-price').text(), 10)      || 0;
            const amount   = parseInt($item.find('.item-amount').val(), 10)     || 0;
            const calorie  = parseInt($item.find('.item-calorie').text(), 10)   || 0;

            selectedItems.push({ cartUid, menuName, price, amount, calorie });
        }
    });
    return selectedItems;
}


// 수량 변경 이벤트
$(document).on('change', '.item-amount', function () {
    const $input = $(this);
    const newAmount = parseInt($input.val(), 10);

    if (isNaN(newAmount) || newAmount < 1) {
        alert('수량은 1 이상이어야 합니다.');
        $input.val(1);
        return;
    }

    // $.ajax({
    //     url: `/carts/${cartUid}/update-amount`,
    //     method: 'PATCH',
    //     contentType: 'application/json',
    //     data: JSON.stringify({ amount: newAmount }),
    //     success: function () {
    //         console.log('수량 업데이트 성공');
    //         updateTotalPrice(); // 수량 바뀌면 총 금액도 다시 계산
    //     },
    //     error: function (err) {
    //         console.error('수량 업데이트 실패', err.responseText);
    //         alert('수량 변경 실패');
    //     }
    // });

    const uid = $input.closest('[data-cart-item]').data('cart-uid');
    const item = MOCK_CART_ITEMS.find(i => i.uid === uid);
    if (item) item.amount = newAmount;

    updateTotalPrice();
});


// 결제자 정보
function getBuyerInfo() {
    return {
        name: $('#name').val(),
        phone: $('#phone').val(),
        email: $('#email').val(),
        mainAddress: $('#mainAddress').val(),
        subAddress1: $('#sub_address_1').val(),
        payMethod: $('#payMethod').val() || 'card'
    };
}

// 사전 검증 API 호출
function preparePayment(merchantUid, menuName, totalPrice, storeUid, userUid, reservationDate) {
    return $.ajax({
        url: '/orders/prepare',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            merchantUid: merchantUid,
            menuName: menuName,
            totalPrice: totalPrice,
            storeUid: storeUid,
            userUid: userUid,
            reservationDate: reservationDate
        })
    });
}

// 실제 결제 요청
function requestPayment(cartUids, buyer, totalPrice, merchantUid, reservationDate, customOrderRequestDTO) {
    const IMP = window.IMP;
    const selectedItems = getSelectedCartItems();
    let menuName = '';

    if (selectedItems.length === 1) {
        menuName = selectedItems[0].menuName;
    } else if (selectedItems.length > 1) {
        menuName = `${selectedItems[0].menuName} 외 ${selectedItems.length - 1}건`;
    }

    console.log('선택된 아이템:', selectedItems);

    IMP.request_pay({
        pg: 'html5_inicis',
        pay_method: buyer.payMethod,
        merchant_uid: merchantUid,
        name: menuName,
        amount: totalPrice,
        buyer_name: buyer.name,
        buyer_phone: buyer.phone,
        buyer_email: buyer.email,
        buyer_addr: buyer.mainAddress,
        buyer_addr_sub: buyer.subAddress1,
    }, function (response) {
        if (response.success) {
            // 결제 성공 시 업데이트 요청
            $.ajax({
                url: '/orders/update-success',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    merchantUid: response.merchant_uid
                }),
                success: function(updateRes) {
                    alert(updateRes.message || "결제 성공!");
                    // 커스텀 옵션 데이터(customOrderRequestDTO)가 존재하면 최종 주문 연동 API 호출
                    if (customOrderRequestDTO) {
                        const finalOrderPayload = {
                            orderRequestDTO: {
                                userUid: buyer.userUid,
                                storeUid: parseInt($('#storeSelect').val()),
                                reservationDate: reservationDate,
                                payment: buyer.payMethod,
                                merchantUid: merchantUid,
                                totalPrice: totalPrice,
                                items: selectedItems.map(item => ({
                                    cartUid: item.cartUid,
                                    menuName: item.menuName,
                                    amount: item.amount || 1,
                                    price: item.price,
                                    calorie: item.calorie
                                }))
                            },
                            customOrderRequestDTO: customOrderRequestDTO
                        };

                        $.ajax({
                            type: "POST",
                            url: "/orders/custom/final",
                            contentType: "application/json",
                            data: JSON.stringify(finalOrderPayload),
                            success: function(finalRes) {
                                alert(finalRes.message || "최종 주문 생성 완료!");
                                window.location.reload();
                            },
                            error: function(error) {
                                console.error("최종 주문 생성 실패:", error.responseText);
                                alert("최종 주문 생성 실패: " + error.responseText);
                            }
                        });
                    }
                },
                error: function(err) {
                    console.error('상태 업데이트 실패', err);
                    alert('결제는 성공했지만, 주문 처리 중 문제가 발생했습니다. 고객센터에 문의하세요.');
                }
            });
        } else {
            // 결제 실패 시
            $.ajax({
                url: '/orders/update-fail',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    merchantUid: response.merchant_uid
                })
            })
                .done(function() {
                    alert('결제 실패!');
                })
                .fail(function(err) {
                    console.error('상태 업데이트 실패', err);
                    alert('주문 상태 업데이트 중 오류가 발생했습니다.');
                });
        };
    });
}

// 결제 후 서버에 주문 전송
function sendOrderRequest(cartUids, buyer, paymentResponse, paymentSuccess, totalPrice, reservationDate) {
    return new Promise((resolve, reject) => {
        const selectedItems = getSelectedCartItems();
        const reservationDate = $('#reservationDate').val();

        const items = selectedItems.map(item => ({
            cartUid: item.cartUid,  // 장바구니 ID
            menuName: item.menuName,
            price: item.price,
            calorie: item.calorie,
        }));

        const storeUid = $('#storeSelect').val();

        $.ajax({
            type: 'POST',
            url: '/orders',
            contentType: 'application/json',
            data: JSON.stringify({
                userUid: 1,
                items: items,
                payment: buyer.payMethod,
                merchantUid: paymentResponse.merchant_uid,
                paymentSuccess: paymentSuccess,
                storeUid: storeUid,
                buyerName: buyer.name,
                buyerPhone: buyer.phone,
                buyerEmail: buyer.email,
                buyerAddr: buyer.mainAddress,
                buyerAddrSub: buyer.subAddress1,
                price: totalPrice,
                reservationDate: reservationDate
            }),
            success: function(response) {
                console.log('주문 저장 성공', response);
                resolve(response);
            },
            error: function(xhr, status, error) {
                console.error('주문 저장 실패', xhr.responseText);
                reject(error);
            }
        });
    });
}

// 총 금액 계산
function calculateTotal() {
    let total = 0;
    $('[data-cart-item]').each(function () {
        if ($(this).find('.cart-check').is(':checked')) {
            const price  = parseInt($(this).find('.item-price').text(), 10) || 0;
            const amount = parseInt($(this).find('.item-amount').val(), 10)    || 0;
            total += price * amount;
        }
    });
    return total;
}

// 총 금액 표시 업데이트
function updateTotalPrice() {
    const totalPrice = calculateTotal();
    $('#totalPrice').text(`${totalPrice.toLocaleString('ko-KR')}원`);
}

// merchant_uid 생성
function generateMerchantUid() {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
    return `merchant_${today}_${randomSixDigits}`;
}

// 장바구니 비우기
function clearCart() {
    $('[data-cart-item]').remove();
    updateTotalPrice();
    alert('장바구니를 비웠습니다.');
}

// 체크박스 변경시 금액 업데이트
$(document).on('change', '.cart-check', function () {
    updateTotalPrice();
});