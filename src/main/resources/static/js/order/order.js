let userUid;
let socialUid;
let expectedVersion = null;

const MOCK_CART_ITEMS = [
    { uid: 6, menuName: '샌드위치 A', unitPrice: 100, amount: 1, calorie: 300 },
    { uid: 7, menuName: '샌드위치 B', unitPrice: 200, amount: 2, calorie: 150 }
];

const MOCK_STORES = [
    { uid: 1, storeName: '강동점' , address: '서울시 강동구 천호동 24-2', lat: 37.1234, lan: 127.5678 },
    { uid: 2, storeName: '강남점' , address: '서울시 강남구 역삼동 818-1',lat: 37.1234, lan: 127.5678 },
    { uid: 3, storeName: '잠실점' , address: '서울시 송파구 신천동 7-28',lat: 37.1234, lan: 127.5678 }
];

// 장바구니 항목 가져오기
function getCartItems() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        return Promise.reject('로그인 토큰이 없습니다');
    }

    const urlParams = new URLSearchParams(window.location.search);
    const selectedIds = urlParams.getAll('selectedIds');

    return $.ajax({
        url: '/menus/cart',
        method: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(response => {
        const allItems = response.cartItems || [];
        if (selectedIds.length === 0) {
            return allItems; // fallback
        }

        return allItems.filter(item => selectedIds.includes(item.uid.toString()));
    });
}


//fillUserInfoForm 헬퍼 (폼에 값 채워넣기)
function fillUserInfoForm(user) {
    $('#name').val(user.userName);
    $('#phone').val(user.phone);
    $('#email').val(user.email);
    $('#mainAddress').val(user.mainAddress);
    $('#subAddress1').val(user.subAddress1 || '');
    $('#deliveryDestinationLat').val(user.mainLat);
    $('#deliveryDestinationLan').val(user.mainLan);

    userUid = user.uid;
    socialUid = user.socialUid;
}

// 선택된 장바구니 항목 가져오기
async function renderCartItems(items) {
    const $container = $('#cartContainer');
    $container.empty();
    items.forEach(item => {
        const cartUid = item.cartUid || item.uid;

        const itemHtml = `
    <div class="cart-item" data-cart-item data-cart-uid="${item.uid}" 
         style="display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #ccc;">
        
        <div style="margin-right: 15px;">
            <input type="checkbox" class="cart-check" checked>
        </div>
        
        <div style="margin-right: 15px; border-left: 1px solid #ddd; padding-left: 15px;">
            <span class="item-name">${item.menuName}</span>
        </div>
        
        <div style="margin-right: 15px; border-left: 1px solid #ddd; padding-left: 15px;">
            <span class="item-unitPrice">${item.unitPrice}원</span>
        </div>
        
        <div style="margin-right: 15px; border-left: 1px solid #ddd; padding-left: 15px;">
            <span class="item-calorie">${item.calorie} kcal</span>
        </div>
        
        <div style="margin-left: auto; display: flex; align-items: center; border-left: 1px solid #ddd; padding-left: 15px;">
    <span class="amount-label" style="margin-right: 5px;">수량</span>
    <input 
        type="number" 
        class="item-amount" 
        value="${item.amount || 1}" 
        min="1" 
        style="width: 70px; height: 32px; border-radius: 6px; padding: 5px; border: 1px solid #ccc;">
</div>

    </div>
`;

        $container.append(itemHtml);
    });
}

// 주소 존재 여부 체크 API 호출
function checkUserAddress(userUid) {
    const address = $('#mainAddress').val();
    return Promise.resolve(!!address && address.trim() !== '');
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
                const option = `<option value="${store.uid}" data-lat="${store.lat}" data-lan="${store.lan}">${store.storeName}</option>`;
                $storeSelect.append(option);
            });
        })
        .catch(error => {
            console.error('스토어 목록 불러오기 실패', error);
        });
}

function fetchProfileAndFillForm() {
    return $.ajax({
        type: 'GET',
        url: '/profile'
    }).then((response) => {
        fillUserInfoForm(response);
        if (response.uid != null) {
            userUid = response.uid;
        }
        if (response.userId != null) {
            socialUid = response.socialUid;
        }
        return response;
    }).catch((err) => {
        console.error('프로필 정보 불러오기 실패:', err);
    });
}

let merchantUid = null;

//예약 날짜 설정
function initReservationPicker() {
    flatpickr("#reservationDate", {
        enableTime: true,
        time_24hr: true,
        dateFormat: "Y-m-d\\TH:i",
        // ① 스텝: 5분 단위로 박히게
        minuteIncrement: 5,
        // ② 초기 minDate: 지금으로부터 1시간 뒤를 “5분 단위로 올림” 해서 설정
        minDate: roundUpMinutes(new Date(Date.now() + 60*60*1000), 5),
        // ③ 달력을 열 때마다 minDate 갱신
        onOpen: (selDates, dateStr, inst) => {
            inst.set('minDate', roundUpMinutes(new Date(Date.now() + 60*60*1000), 5));
        },
        onClose: (selDates, dateStr, inst) => {
            inst.input.value = dateStr;
        }
    });
}

function roundUpMinutes(date, step) {
    const ms  = 1000 * 60 * step;
    return new Date(Math.ceil(date.getTime() / ms) * ms);
}


$(document).ready(async () => {
    const IMP = window.IMP;
    IMP.init('imp54787882');

    const user = await fetchProfileAndFillForm();
    //const items = await getCartItems();
    const cartItems = await getCartItems();
    const customList = JSON.parse(localStorage.getItem('customSandwiches')) || [];

    cartItems.forEach(item => {
        if (item.menuName === '커스텀 샌드위치') {
            const match = customList.find(c =>
                parseInt(c.price) === item.unitPrice &&
                parseInt(c.calorie) === item.calorie
            );
            if (match) {
                item.cartUid = match.cartUid; // ✅ UUID 설정
            }
        }
    });
    initReservationPicker();

    await renderCartItems(cartItems);
    updateTotalPrice();
    renderStoreDropdown();

    $('#payButton').click(async () => {
        // 예약 시간 input의 값을 읽어오되, 값이 없으면 null로 처리

        // 1) flatpickr 에서 넘어오는 "YYYY-MM-DDTHH:mm" 문자열을 가져온다
        const raw = $('#reservationDate').val();
        let reservationDate = null;

        if (raw && raw.trim() !== '') {
            // 2) JS Date 로 변환해서 1시간 이상 차이가 나면 유효시간으로 본다
            const selectedDate = new Date(raw);
            const diff = selectedDate.getTime() - Date.now();
            if (diff >= 60 * 60 * 1000) {
                // 3) LocalDateTime 포맷(yyyy-MM-ddTHH:mm:ss) 으로 직접 포맷팅
                const pad = v => String(v).padStart(2, '0');
                const yyyy = selectedDate.getFullYear();
                const MM   = pad(selectedDate.getMonth() + 1);
                const dd   = pad(selectedDate.getDate());
                const hh   = pad(selectedDate.getHours());
                const mm   = pad(selectedDate.getMinutes());
                reservationDate = `${yyyy}-${MM}-${dd}T${hh}:${mm}:00`;
            }
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

        try {
            await preparePayment(merchantUid, menuName, totalPrice, storeUid, userUid, reservationDate);
            console.log('사전 검증 성공');

            requestPayment(cartUids, buyer, totalPrice, merchantUid, reservationDate);
        } catch (err) {
            console.error('사전 검증 실패', err);
            alert('결제 실패했습니다! 다시 시도해주세요!');
        }
    });
});

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
    const customList = JSON.parse(localStorage.getItem('customSandwiches')) || [];

    $('[data-cart-item]').each(function () {
        const $item = $(this);
        const $check = $item.find('.cart-check');
        if (!$check.is(':checked')) return;

        let cartUid = $item.data('cart-uid');
        const menuName = $item.find('.item-name').text().trim();
        const isCustom = menuName === '커스텀 샌드위치';
        const rawText = $item.find('.item-unitPrice').text();
        const numeric = rawText.replace(/\D/g, '');
        const unitPrice = parseInt(numeric, 10);
        const amount = parseInt($item.find('.item-amount').val(), 10);
        const calorie = parseInt($item.find('.item-calorie').text(), 10) || 0;

        if (isNaN(unitPrice) || unitPrice < 1 || isNaN(amount) || amount < 1) return;

        let uid;

        if (isCustom) {
            const match = customList.find(c => String(c.cartUid) === String(cartUid));
            if (!match) {
                console.warn(`customList에서 cartUid=${cartUid} 찾을 수 없음`);
            } else {
                uid = match.uid;  // 서버 전달용
                // cartUid는 이미 위에서 정의되어 있으므로 그대로 유지
            }
        } else {
            uid = cartUid; // 완제품이면 uid == cartUid
        }

        selectedItems.push({
            uid,
            cartUid,  // 이건 항상 cart 기준 값!
            isCustom,
            menuName,
            unitPrice,
            amount,
            calorie
        });
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

    const uid = $input.closest('[data-cart-item]').data('cart-uid');
    const item = MOCK_CART_ITEMS.find(i => i.uid === uid);
    if (item) item.amount = newAmount;

    updateTotalPrice();
});


// 결제자 정보
function getBuyerInfo() {
    return {
        userUid: userUid,
        socialUid: socialUid,
        name: $('#name').val(),
        phone: $('#phone').val(),
        email: $('#email').val(),
        mainAddress: $('#mainAddress').val(),
        subAddress1: $('#subAddress1').val(),
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
            reservationDate: reservationDate,
            //expectedVersion: expectedVersion
        })
    });
}

// 실제 결제 요청
function requestPayment(cartUids, buyer, totalPrice, merchantUid, reservationDate) {
    const IMP = window.IMP;
    const selectedItems = getSelectedCartItems();
    const customData = JSON.parse(localStorage.getItem('customSandwich') || 'null');
    const isCustom = customData !== null;

    let menuName = '';

    if (selectedItems.length === 1) {
        menuName = selectedItems[0].menuName;
    } else if (selectedItems.length > 1) {
        menuName = `${selectedItems[0].menuName} 외 ${selectedItems.length - 1}건`;
    }

    console.log('선택된 아이템:', selectedItems);
    const selectedStoreUid = parseInt($('#storeSelect').val(), 10);
    const store = MOCK_STORES.find(s => s.uid === selectedStoreUid);

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
                    merchantUid: response.merchant_uid,
                    //expectedVersion: expectedVersion
                }),
                success: function(updateRes) {
                    alert(updateRes.message || "결제 성공!");
                    //const allCartUids = getSelectedCartUids();   // 숫자ID + UUID 모두 여기 담김

                    sendGeneralOrderRequest(buyer, response, totalPrice, reservationDate)
                        .then(({ customResults }) => sendCustomOrderData(customResults, response))
                        .then(() => {
                            // 2) 삭제할 ID 배열 미리 뽑아두기
                            const allCartUids = getSelectedCartUids();                   // ["1","2","uuid-abc",…]
                            const numericIds  = allCartUids.filter(id => /^\d+$/.test(id)).map(Number);
                            const customList  = JSON.parse(localStorage.getItem('customSandwiches')) || [];
                            const customIds   = allCartUids
                                .filter(id => !/^\d+$/.test(id))
                                .map(cartUid => {
                                    const rec = customList.find(c => c.cartUid === cartUid);
                                    return rec && rec.uid;    // custom_cart PK
                                })
                                .filter(Boolean);

                            // 3) API 호출 → cart 테이블 먼저 지우고, custom_cart 지우기
                            return Promise.all([
                                clearCart(numericIds),
                                clearCustomCart(customIds)
                            ]).then(() => allCartUids);  // 다음 then()에 allCartUids 전달
                        })
                        .then(allCartUids => {
                            // 4) 화면에서도 삭제
                            allCartUids.forEach(uid => {
                                $(`.cart-item[data-cart-uid="${uid}"]`).remove();
                            });
                            updateTotalPrice();
                            localStorage.removeItem('customSandwiches');
                            alert("주문 저장 및 카트 삭제 완료!");
                            window.location.reload();
                        })
                        .catch(err => {
                            console.error('주문 저장 실패', err);
                            alert('주문 처리 중 오류 발생!');
                        });
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

function sendGeneralOrderRequest(buyer, paymentResponse, totalPrice, reservationDate) {
    const selectedItems  = getSelectedCartItems();
    const generalItems   = selectedItems.filter(i => !i.isCustom);
    const customItems    = selectedItems.filter(i => i.isCustom);
    const allCustoms     = JSON.parse(localStorage.getItem('customSandwiches')) || [];

    let addressIncluded = false;

    // 실제 AJAX 요청을 보내는 공통 함수
    function makeOneRequest(item) {
        const includeAddress = !addressIncluded;
        if (includeAddress) addressIncluded = true;

        const dto = {
            userUid: buyer.userUid,
            socialUid: buyer.socialUid,
            payment: buyer.payMethod,
            items: [item],
            merchantUid: paymentResponse.merchant_uid,
            paymentSuccess: true,
            storeUid: parseInt($('#storeSelect').val(), 10),
            reservationDate,
            totalPrice: item.unitPrice * item.amount
        };

        if (includeAddress) {
            // 첫 호출에만 주소 붙이기
            dto.deliveryAddress = {
                addressStart: $('#storeSelect option:selected').text(),
                addressStartLat: parseFloat($('#storeSelect option:selected').data('lat')),
                addressStartLan: parseFloat($('#storeSelect option:selected').data('lan')),
                addressDestination: buyer.mainAddress,
                addressDestinationLat: parseFloat($('#deliveryDestinationLat').val()),
                addressDestinationLan: parseFloat($('#deliveryDestinationLan').val())
            };
        }

        return $.ajax({
            type: 'POST',
            url: '/orders',
            contentType: 'application/json',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` },
            data: JSON.stringify(dto)
        }).then(res => res.orderUid);
    }

    // 일반 메뉴는 그대로 요청
    const generalPromises = generalItems.map(item =>
        makeOneRequest(item)
    );

    // 커스텀 메뉴는 요청 후 customData를 붙여서 반환
    const customPromises = customItems.map(item =>
        makeOneRequest(item)
            .then(orderUid => ({
                cartUid:    item.cartUid,
                menuName:   item.menuName,
                orderUid,
                unitPrice:  item.unitPrice,
                amount:     item.amount,
                calorie:    item.calorie,
                customData: allCustoms.find(c => String(c.cartUid) === String(item.cartUid))
            }))
    );

    return Promise.all([
        Promise.all(generalPromises),
        Promise.all(customPromises)
    ]).then(([generalUids, customResults]) => ({
        generalUids,
        customResults
    }));
}

let isSubmitting = false;

function sendCustomOrderData(customItemsWithUid, paymentResponse) {
    if (isSubmitting) {
        console.warn("중복 전송 방지: 이미 요청 중");
        return;
    }
    isSubmitting = true;

    const convertToInt = (v) => {
        if (v === "" || v === undefined || v === null) return null;
        const n = parseInt(v, 10);
        return isNaN(n) ? null : n;
    };

    const customOrderList = customItemsWithUid.map(item => {
        const customData = item.customData;
        return {
            uid: item.orderUid,
            bread: convertToInt(customData.bread),
            material1: convertToInt(customData.material1),
            material2: convertToInt(customData.material2),
            material3: convertToInt(customData.material3),
            cheese: convertToInt(customData.cheese),
            vegetable1: convertToInt(customData.vegetable1),
            vegetable2: convertToInt(customData.vegetable2),
            vegetable3: convertToInt(customData.vegetable3),
            vegetable4: convertToInt(customData.vegetable4),
            vegetable5: convertToInt(customData.vegetable5),
            vegetable6: convertToInt(customData.vegetable6),
            vegetable7: convertToInt(customData.vegetable7),
            vegetable8: convertToInt(customData.vegetable8),
            sauce1: convertToInt(customData.sauce1),
            sauce2: convertToInt(customData.sauce2),
            sauce3: convertToInt(customData.sauce3),
            price: convertToInt(customData.price),
            calorie: parseFloat(customData.calorie) || 0,
            version: 0
        };
    });

    const address = {
        addressStart: $('#storeSelect option:selected').text(),
        addressStartLat: parseFloat($('#storeSelect option:selected').data('lat')),
        addressStartLan: parseFloat($('#storeSelect option:selected').data('lan')),
        addressDestination: $('#mainAddress').val(),
        addressDestinationLat: parseFloat($('#deliveryDestinationLat').val()),
        addressDestinationLan: parseFloat($('#deliveryDestinationLan').val())
    };

    const payload = {
        orderRequestDTO: {
            userUid: userUid,
            storeUid: parseInt($('#storeSelect').val(), 10),
            merchantUid: paymentResponse.merchant_uid,
            deliveryAddress: address, // 주소는 여기만 포함
            payment: $('#payMethod').val() || 'card',
            reservationDate: $('#reservationDate').val(),
            paymentSuccess: true,
            totalPrice: calculateTotal(),
            items: customItemsWithUid.map(item => ({
                uid: item.orderUid,
                menuName: item.menuName,
                amount: item.amount,
                unitPrice: item.unitPrice,
                calorie: item.calorie
            }))
        },
        customOrderRequestDTO: customOrderList
    };

    console.log('[sendCustomOrderData] payload:', JSON.stringify(payload, null, 2));

    return $.ajax({
        type: 'POST',
        url: '/orders/custom/final',
        contentType: 'application/json',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        data: JSON.stringify(payload),
        complete: function () {
            isSubmitting = false;
        }
    });
}



// 총 금액 계산
function calculateTotal() {
    let total = 0;
    $('[data-cart-item]').each(function () {
        if ($(this).find('.cart-check').is(':checked')) {
            const rawText = $(this).find('.item-unitPrice').text();
            const numeric = rawText.replace(/\D/g, '');
            const unitPrice   = parseInt(numeric, 10) || 0;
            const amount = parseInt($(this).find('.item-amount').val(), 10)    || 0;
            total += unitPrice * amount;
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
function clearCart(numericIds) {
    const token = localStorage.getItem('accessToken');
    if (!numericIds.length || !token) return Promise.resolve();

    const query = numericIds.map(id => `selectedIds=${id}`).join('&');
    return $.ajax({
        url: `/menus/cart/delete-selected?${query}`,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
    });
}

function clearCustomCart(customIds) {
    const token = localStorage.getItem('accessToken');
    if (!customIds.length || !token) return Promise.resolve();

    // 서버 custom_cart PK를 직접 DELETE
    const deletes = customIds.map(uid =>
        $.ajax({
            url: `/menus/custom-carts/${uid}`,
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        }).catch(() => null)
    );
    return Promise.all(deletes);
}

// 체크박스 변경시 금액 업데이트
$(document).on('change', '.cart-check', function () {
    updateTotalPrice();
});
