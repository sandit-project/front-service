let userType;
let userUid;
let socialUid;
let cartItems = [];

// 장바구니 항목 가져오기
function getCartItems() {
    setupAjax();
    checkToken();
    console.log("Authorization 헤더", localStorage.getItem('accessToken'));

    const urlParams = new URLSearchParams(window.location.search);
    const selectedIds = urlParams.getAll('selectedIds');

    let url = '/menus/cart';
    if (userType === 'USER') {
        url += `?userUid=${userUid}`;
    } else if (userType != 'USER') {
        url += `?socialUid=${socialUid}`;
    }

    return $.ajax({
        url: url,
        type: 'GET',
        contentType: 'application/json',
    }).then(response => {
        const allItems = response.cartItems || [];
        if (selectedIds.length === 0) {
            return allItems; // fallback
        }

        return allItems.filter(item => selectedIds.includes(item.uid.toString()));
    });
}

async function fetchCustomCart(customCartId) {
    setupAjax();
    checkToken();
    return $.ajax({
        url: `/menus/custom-carts/${customCartId}`,
        type: 'GET'
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
        const isCustom   = item.menuName === '커스텀 샌드위치';
        const customId = isCustom ? item.customCartUid : null;
        const cartUid = item.uid; // cart 테이블의 PK
        const itemHtml = `
                <div class="cart-item" data-cart-item
                     data-cart-uid="${cartUid}"
                    data-custom-id="${customId ?? ''}"
                    data-is-custom="${isCustom}"
                    data-calorie="${item.calorie}">
                <input type="checkbox" class="cart-check" checked>
                <span class="item-name">${item.menuName}</span>
                <span class="item-unitPrice">${item.unitPrice}원</span>
                <span class="item-calorie">${item.calorie}kcal</span>
                <input type="number" class="item-amount" value="${item.amount}" min="1" style="width: 50px;">
            </div>
        `;
        $container.append(itemHtml);
    });
}

// custom_cart PK만
function getSelectedCustomIds() {
    return $('[data-cart-item]').filter((_,el) => {
        return $(el).find('.cart-check').is(':checked') && $(el).data('is-custom');
    }).map((_,el) => Number($(el).data('custom-id'))).get();
}

// 주소 존재 여부 체크 API 호출
function checkUserAddress() {
    const address = $('#mainAddress').val();
    return Promise.resolve(!!address && address.trim() !== '');
}

//주소 검색 호출 함수
function execDaumPostcode() {
    new daum.Postcode({
        oncomplete: function(data) {
            // 1) 주소 문자열
            const addr = data.roadAddress || data.jibunAddress;
            $('#mainAddress').val(addr);

            // 2) 좌표 값까지 hidden input 에 세팅
            $('#deliveryDestinationLat').val(data.y);
            $('#deliveryDestinationLan').val(data.x);
        }
    }).open();
}


// 스토어 리스트 가져오기
function getStores(limit = 100) {
    setupAjax();
    checkToken();
    return $.ajax({
        url: `/stores/list?limit=${limit}`,
        dataType: 'json',
        type: 'GET',
    }).then(response => response.storeList);
}

function renderStoreDropdown() {
    getStores()
        .then(stores => {
            const $select = $('#storeSelect')
                .empty()
                .append('<option value="">스토어 선택</option>');

            stores.forEach(s => {
                $select.append(`
          <option value="${s.storeUid}" data-lat="${s.storeLatitude}" data-lan="${s.storeLongitude}">${s.storeName}
          </option>
        `);
            });
        })
        .catch(err => {
            console.error('스토어 목록 불러오기 실패', err);
            alert('스토어 정보를 불러오는 중 오류가 발생했습니다.');
        });
}

function fetchProfileAndFillForm() {
    setupAjax();
    checkToken();
    return $.ajax({
        type: 'GET',
        url: '/profile'
    }).then((response) => {
        console.log(response);
        fillUserInfoForm(response);

        userType = response.type;

        if (userType === "USER") {
            userUid = response.uid;
        } else {
            socialUid = response.uid;
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
        time_24hr: false,
        altInput: true,
        altFormat: "Y년 n월 j일 K h시 i분",
        dateFormat: "Y-m-d\\TH:i",
        locale: "ko",
        // ① 스텝: 5분 단위로 박히게
        minuteIncrement: 5,
        // ② 초기 minDate: 지금으로부터 1시간 뒤를 “5분 단위로 올림” 해서 설정
        minDate: roundUpMinutes(new Date(Date.now() + 60*60*1000), 5),
        // ③ 달력을 열 때마다 minDate 갱신
        onOpen: (selDates, dateStr, inst) => {
            inst.set('minDate', roundUpMinutes(new Date(Date.now() + 60*60*1000), 5));
        },
    });
}

function roundUpMinutes(date, step) {
    const ms  = 1000 * 60 * step;
    return new Date(Math.ceil(date.getTime() / ms) * ms);
}


$(document).ready(async () => {
    $('#logout-link').on('click', () => {
        localStorage.removeItem('accessToken');
        window.location.href = '/member/login';
    });

    const IMP = window.IMP;
    IMP.init('imp54787882');

    const user = await fetchProfileAndFillForm();
    cartItems = await getCartItems();
    console.log('[DEBUG] cartItems from 서버 →', cartItems);

    initReservationPicker();

    await renderCartItems(cartItems);
    updateTotalPrice();
    renderStoreDropdown();

    // 선택 시 hidden input 에 세팅
    $('#storeSelect').on('change', function() {
        const $o = $(this).find('option:selected');
        $('#storeLatitude').val($o.data('lat'));
        $('#storeLongitude').val($o.data('lan'));
    });

    $('#payButton').click(async () => {
        console.log('pay button clicked');
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
        const selectedItems = await getSelectedCartItems();
        console.log('[DEBUG] selectedItems 결과:', selectedItems);

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
        const storeLatitude  = $('#storeLatitude').val();
        const storeLongitude = $('#storeLongitude').val();
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
async function getSelectedCartItems() {
    const $items = $('[data-cart-item]');

    // 각 엘리먼트에 대해 서버에서 한 건씩 custom-cart 조회하거나,
    // 일반 메뉴면 바로 uid 꺼내고
    const tasks = $items.map(async (_, el) => {
        const $item     = $(el);
        const checked   = $item.find('.cart-check').is(':checked');
        if (!checked) return null;

        const cartUid   = $item.data('cart-uid');
        const customId  = $item.data('custom-id');
        const menuName  = $item.find('.item-name').text().trim();
        const unitPrice = parseInt($item.find('.item-unitPrice').text().replace(/\D/g, ''), 10);
        const amount    = parseInt($item.find('.item-amount').val(), 10) || 0;
        const calorie = parseFloat($item.data('calorie')) || 0;

        let uid, detail;

        if (menuName === '커스텀 샌드위치') {
            if (!customId) {
                console.warn(`customId가 없습니다. cartUid=${cartUid} 건은 스킵합니다.`);
                return null;
            }
            detail = await fetchCustomCart(customId);
            if (!detail?.uid) {
                console.warn(`custom-cart 조회 실패: id=${customId}`);
                return null;
            }
            uid = detail.uid;
        } else {
            uid = cartUid;
        }

        return {
            uid,
            menuName,
            unitPrice,
            amount,
            ...detail,
            calorie,
            isCustom: !!detail,
            bread: detail?.bread ?? null,
            material: !!detail?.material ?? null,
            material2: !!detail?.material2 ?? null,
            material3: !!detail?.material3 ?? null,
            cheese: !!detail?.cheese ?? null,
            vegetable1: !!detail?.vegetable1 ?? null,
            vegetable2: !!detail?.vegetable2 ?? null,
            vegetable3: !!detail?.vegetable3 ?? null,
            vegetable4: !!detail?.vegetable4 ?? null,
            vegetable5: !!detail?.vegetable5 ?? null,
            vegetable6: !!detail?.vegetable6 ?? null,
            vegetable7: !!detail?.vegetable7 ?? null,
            vegetable8: !!detail?.vegetable8 ?? null,
            sauce1: !!detail?.sauce1 ?? null,
            sauce2: !!detail?.sauce2 ?? null,
            sauce3: !!detail?.sauce3 ?? null,
        };
    }).get();

    // 모든 프로미스 끝날 때까지 기다린 다음, null 필터링
    const results = await Promise.all(tasks);
    return results.filter(item => item !== null);
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
    const item = cartItems.find(i => i.uid === uid);
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
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            merchantUid: merchantUid,
            menuName: menuName,
            totalPrice: totalPrice,
            storeUid: storeUid,
            userUid: userUid,
            reservationDate: reservationDate,
        })
    });
}

// 실제 결제 요청
async function requestPayment(cartUids, buyer, totalPrice, merchantUid, reservationDate) {
    console.log('requestPayment 진입')
    const IMP = window.IMP;
    const selectedItems = await getSelectedCartItems();
    console.log('[DEBUG] selectedItems 결과:', selectedItems);

    let menuName = '';

    if (selectedItems.length === 1) {
        menuName = selectedItems[0].menuName;
    } else if (selectedItems.length > 1) {
        menuName = `${selectedItems[0].menuName} 외 ${selectedItems.length - 1}건`;
    }

    console.log('선택된 아이템:', selectedItems);
    // 1) 선택된 스토어 ID
    const storeUid = parseInt($('#storeSelect').val(), 10);
    // 2) hidden에 세팅해 둔 위도/경도
    const storeLatitude = parseFloat($('#storeLatitude').val());
    const storeLongitude = parseFloat($('#storeLongitude').val());
    // 3) (필요하면) 화면에 보이는 스토어 이름
    const storeName = $('#storeSelect option:selected').text().trim();

    console.log('storeUid:', storeUid, 'lat:', storeLatitude, 'lan:', storeLongitude);

    IMP.request_pay({
        pg: 'html5_inicis',
        pay_method: buyer.payMethod,
        merchant_uid: merchantUid,
        name: menuName,
        amount: totalPrice,
        buyer_name: buyer.name,
        buyer_tel: buyer.phone,
        buyer_email: buyer.email,
        buyer_addr: buyer.mainAddress,
        buyer_addr_sub: buyer.subAddress1,
    }, function (response) {
        console.log(response);
        if (response.success) {
            // 결제 성공 시 업데이트 요청
            $.ajax({
                url: '/orders/update-success',
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    merchantUid: response.merchant_uid,
                }),
                success: function(updateRes) {
                    alert(updateRes.message || "결제 성공!");
                    submitOrders(buyer, response, reservationDate)
                        .then(() => {
                            const allCartUids   = getSelectedCartUids();
                            const allCustomIds  = getSelectedCustomIds();
                            return clearCart(allCartUids)
                                .then(() => clearCustomCart(allCustomIds));
                        })
                        .then(() => {
                            getSelectedCartUids().forEach(uid => {
                                $(`.cart-item[data-cart-uid="${uid}"]`).remove();
                            });
                            updateTotalPrice();
                            alert('주문 저장 및 카트 삭제 완료!');
                            window.location.reload();
                        })
                        .catch(err => {
                            console.error('주문 처리 오류', err);
                            alert('주문 저장 중 오류가 발생했습니다.');
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
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    merchantUid: response.merchant_uid
                })
            })
                //실패 구분하기
                //포트원 승인되었으나 우리 DB 안 붙을 때
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

async function submitOrders(buyer, paymentResponse, reservationDate) {
    setupAjax();
    checkToken();
    console.log("Authorization 헤더", localStorage.getItem('accessToken'));

    const items = await getSelectedCartItems();
    const generalItems = items.filter(i => !i.isCustom);
    const customItems = items.filter(i => i.isCustom);
    const storeUid = parseInt($('#storeSelect').val(), 10);
    const deliveryAddress = {
        // 출발지는 가게 정보
        addressStart:       $('#storeSelect option:selected').text().trim(),
        addressStartLat:    parseFloat($('#storeLatitude').val()),
        addressStartLan:    parseFloat($('#storeLongitude').val()),
        // 도착지는 사용자 입력 주소
        addressDestination: $('#mainAddress').val(),
        addressDestinationLat:  parseFloat($('#deliveryDestinationLat').val()),
        addressDestinationLan:  parseFloat($('#deliveryDestinationLan').val())
    };

    // 1) 일반 주문 먼저 저장
    let generalOrderUids = [];
    if (generalItems.length) {
        const payload = {
            merchantUid: paymentResponse.merchant_uid,
            userUid: buyer.userUid,
            socialUid: buyer.socialUid,
            storeUid,
            deliveryAddress,
            payment: buyer.payMethod,
            paymentSuccess: true,
            reservationDate,
            totalPrice: generalItems.reduce((s, i) => s + i.unitPrice * i.amount, 0),
            items: generalItems.map(i => ({
                uid: i.uid,
                menuName: i.menuName,
                amount: i.amount,
                unitPrice: i.unitPrice,
                calorie: i.calorie || 0,
                //version: expectedVersion || 0
            }))
        };
        // 응답에서 orderUids 가져오기
        const resp = await $.ajax({
            type: 'POST',
            url: '/orders',
            contentType: 'application/json',
            data: JSON.stringify(payload)
        });
        generalOrderUids = resp.orderUids || [resp.orderUid];
    }

    // 2) custom 주문 전에도 /orders 호출 → orderUid 얻기
    let customOrderUids = [];
    if (customItems.length) {
        const customPayload = {
            merchantUid: paymentResponse.merchant_uid,
            userUid: buyer.userUid,
            socialUid: buyer.socialUid,
            storeUid,
            deliveryAddress,
            payment: buyer.payMethod,
            paymentSuccess: true,
            reservationDate,
            totalPrice: customItems.reduce((s, i) => s + i.unitPrice * i.amount, 0),
            items: customItems.map(i => ({
                uid: i.uid,         // 이건 custom-cart id → 서버는 무시
                menuName: i.menuName,
                amount: i.amount,
                unitPrice: i.unitPrice,
                calorie: i.calorie || 0,
                //version: expectedVersion || 0
            }))
        };
        const resp2 = await $.ajax({
            type: 'POST',
            url: '/orders',
            contentType: 'application/json',
            data: JSON.stringify(customPayload)
        });
        customOrderUids = resp2.orderUids || [resp2.orderUid];
    }

    // 3) 방금 생성된 Order PK로 custom_order 저장
    if (customItems.length) {
        const customOrderList = customItems.map((i, idx) => ({
            uid: customOrderUids[idx], // 여기 반드시 orders.uid
            bread: i.breadId,
            material1: i.material1Id,
            material2: i.material2Id,
            material3: i.material3Id,
            cheese: i.cheeseId,
            vegetable1: i.vegetable1Id,
            vegetable2: i.vegetable2Id,
            vegetable3: i.vegetable3Id,
            vegetable4: i.vegetable4Id,
            vegetable5: i.vegetable5Id,
            vegetable6: i.vegetable6Id,
            vegetable7: i.vegetable7Id,
            vegetable8: i.vegetable8Id,
            sauce1: i.sauce1Id,
            sauce2: i.sauce2Id,
            sauce3: i.sauce3Id,
            // version: 0
        }));

        await $.ajax({
            type: 'POST',
            url: '/orders/custom/final',
            contentType: 'application/json',
            data: JSON.stringify({
                orderRequestDTO: {
                    merchantUid: paymentResponse.merchant_uid,
                    userUid: buyer.userUid,
                    socialUid: buyer.socialUid,
                    storeUid,
                    deliveryAddress,
                    payment: buyer.payMethod,
                    paymentSuccess: true,
                    reservationDate,
                    totalPrice: customItems.reduce((s, i) => s + i.unitPrice * i.amount, 0),
                    items: customItems.map(i => ({
                        uid: i.uid,
                        menuName: i.menuName,
                        amount: i.amount,
                        unitPrice: i.unitPrice,
                        calorie: i.calorie || 0
                    }))
                },
                customOrderRequestDTO: customOrderList
            })
        });
    }
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
    setupAjax();
    checkToken();
    const token = localStorage.getItem('accessToken');
    if (!numericIds.length || !token) return Promise.resolve();

    const query = numericIds.map(id => `selectedIds=${id}`).join('&');
    return $.ajax({
        url: `/menus/cart/delete-selected?${query}`,
        type: 'POST',
    });
}

// 커스텀 카트 비우기
function clearCustomCart(customIds) {
    setupAjax();
    checkToken();
    const token = localStorage.getItem('accessToken');
    if (!customIds.length || !token) return Promise.resolve();

    // 서버 custom_cart PK를 직접 DELETE
    const deletes = customIds.map(uid =>
        $.ajax({
            url: `/menus/custom-carts/${uid}`,
            type: 'DELETE',
        }).catch(() => null)
    );
    return Promise.all(deletes);
}

// 체크박스 변경시 금액 업데이트
$(document).on('change', '.cart-check', function () {
    updateTotalPrice();
});
