const storeMap = {};
let ordersList = [];
let groupedData = [];
let userUid = null;
let userType = null;

$(document).ready(() => {
    initPage();
});

async function initPage() {
    checkToken();
    setupAjax();

    $('#logout-link').on('click', () => {
        localStorage.removeItem('accessToken');
        window.location.href = '/member/login';
    });

    try {
        const profile = await fetchProfile();

        if (profile?.uid) {
            initUserUI(profile);
        }

        console.log('[DEBUG] profile:', profile);

        userType = profile.type;
        userUid = profile.uid;

        if (!userUid || isNaN(Number(userUid))) {
            Swal.fire({
                icon: 'error',
                title: '사용자 오류',
                text: '유효하지 않은 사용자 정보입니다. 다시 로그인 해주세요.',
                confirmButtonColor: '#f97316'
            });
            return;
        }

        await fetchOrders();

        $('#order-table tbody').on('click','tr',function(){
            const idx = $(this).data('group-index');
            const ordersGroup = groupedData[idx].orders;
            showModal(ordersGroup);
        });

        $('#close-modal, #order-modal-backdrop').on('click', () => {
            $('#order-modal-backdrop, #order-modal').hide();
        });

    } catch (err) {
        console.error('초기 데이터 로딩 실패', err);
        Swal.fire({
            icon: 'error',
            title: '로딩 실패',
            text: '데이터 로딩 중 오류가 발생했습니다. 네트워크 상태를 확인해주세요.',
            confirmButtonColor: '#f97316'
        });
    }
}

async function fetchOrders() {
    if (!userType || !userUid) {
        console.warn('사용자 정보 로딩 중입니다. 잠시만 기다려주세요!');
        return;
    }
    setupAjax();
    checkToken();

    const apiUrl = `/orders/user/${userType}/${userUid}`;
    console.log("▶️ 호출 URL:", apiUrl);

    try {
        const response = await $.ajax({
            url: apiUrl,
            type: 'GET',
            contentType: 'application/json',
        });
        ordersList = response;
        const uniqueStoreUids = [...new Set(ordersList.map(o => o.storeUid))];
        const missing = uniqueStoreUids.filter(uid => !storeMap[uid]);

        if (missing.length > 0) {
            const storeResponse = await $.ajax({
                url: `/stores/list?limit=1000&lastUid=0`,
                type: 'GET',
                contentType: 'application/json',
            });

            storeResponse.storeList.forEach(store => {
                storeMap[store.storeUid] = store.storeName;
            });
        }
        renderOrders();
    } catch (err) {
        console.error('주문 목록 불러오기 실패', err);
        Swal.fire({
            icon: 'error',
            title: '불러오기 실패',
            text: '주문 목록을 가져오는 데 실패했습니다. 잠시 후 다시 시도해주세요.',
            confirmButtonColor: '#f97316'
        });
    }
}

function fetchProfile() {
    return $.ajax({
        url: '/profile',
        type: 'GET'
    });
}


function renderOrders() {
    // 2-1) merchant_uid별 그룹핑
    const groupsMap = ordersList.reduce((acc, o) => {
        (acc[o.merchantUid] = acc[o.merchantUid] || []).push(o);
        return acc;
    }, {});

    // 2-2) [{ merchantUid, orders }, …] 구조로 변환
    groupedData = Object.entries(groupsMap).map(([muid, orders]) => ({
        merchantUid: muid,
        orders
    }));

    // 최신 주문이 위로 오도록 정렬 (createdDate 기준)
    groupedData.sort((a, b) => {
        const dateA = new Date(a.orders[0].createdDate);
        const dateB = new Date(b.orders[0].createdDate);
        return dateB - dateA; // 내림차순
    });

    // 2-3) 테이블에 그리기: data-group-index 로만 식별
    const $tbody = $('#order-table tbody').empty();
    groupedData.forEach((groupObj, idx) => {
        const first = groupObj.orders[0];
        const storeName = storeMap[first.storeUid] || '—';
        const baseName = first.items[0]?.menuName || '—';
        const extra = groupObj.orders.length - 1;
        const menuText = extra>0
            ? `${baseName} 외 ${extra}건`
            : baseName;

        const totalPrice = groupObj.orders
            .flatMap(o => o.items)
            .reduce((s,i)=>s+i.unitPrice*i.amount,0);
        const totalCount = groupObj.orders
            .flatMap(o => o.items)
            .reduce((s,i)=>s+i.amount,0);

        const createdDateTime = formatDate(first.createdDate).slice(0,-3);
        const res = first.reservationDate
        const reservationDateTime = res ? formatDate(res).slice(0,-3) : '';

        const $row = $(`
      <tr data-group-index="${idx}">
        <td>${first.uid}</td>
        <td>${mapOrderStatus(first.status)}</td>
        <td>${storeName}</td>
        <td>${menuText}</td>
        <td>${totalPrice.toLocaleString()}원</td>
        <td>${totalCount}</td>
        <td>${createdDateTime}</td>
        <td>${reservationDateTime}</td>
      </tr>
    `);
        $tbody.append($row);
    });
}

// 4) showModal 은 ordersGroup 배열만 받고, merchantUid는 내부 JS에서 필요 시 꺼내 쓰되 UI엔 노출 안 함
function showModal(ordersGroup) {
    const first = ordersGroup[0];
    const merchantUid = first.merchantUid;
    $('#modal-status').text(mapOrderStatus(first.status));
    $('#modal-store-name').text(storeMap[first.storeUid]||'-');
    const $list = $('#modal-items-list').empty();
    ordersGroup.forEach(o =>
        o.items.forEach(it => {
            const itemHtml = `
          <div class="kiosk-item">
            <div class="menu-name">${it.menuName}</div>
            <div class="menu-detail">${it.amount}개 · ${it.unitPrice.toLocaleString()}원</div>
          </div>
        `;
            $list.append(itemHtml);
        })
    );


    const total = ordersGroup
        .flatMap(o => o.items)
        .reduce((s,i)=>s+i.unitPrice*i.amount,0);
    $('#modal-total-price').text(total.toLocaleString());

    // 주문 취소 버튼 토글
    const canCancel = first.status === 'PAYMENT_COMPLETED';
    $('#cancel-order-btn')
        .prop('disabled', !canCancel)
        .toggleClass('disabled', !canCancel)
        .off('click')
        .on('click', () => {
            // ① “주문 취소” 숨기고, 취소 사유 입력 섹션 보이기
            $('#cancel-order-btn').hide();
            $('#cancel-reason-section').show();
        });

    // “뒤로” 버튼: 사유 입력 취소하고 원래 화면으로
    $('#cancel-reason-back-btn').off('click').on('click', () => {
        $('#cancel-reason-section').hide();
        $('#cancel-reason-select').hide();
        $('#cancel-order-btn').show();
    });

    // “확인” 버튼: 실제 취소 요청
    $('#confirm-cancel-btn').off('click').on('click', async () => {
        const reason = $('#cancel-reason-select').val();
        if (!reason) {
            Swal.fire({
                icon: 'warning',
                title: '취소 사유 필요',
                text: '취소 사유를 선택해주세요.',
                confirmButtonColor: '#f97316'
            });
            return;
        }

        try {
            $('#loading-spinner').show(); // 로딩 시작

            console.log('merchantUid::', merchantUid);
            const result = await cancelOrder(merchantUid, reason);

            if (result.isSuccess) {
                $('#order-modal-backdrop, #order-modal').hide();
                await fetchOrders();
            }
        } finally {
            $('#loading-spinner').hide();
        }
    });


    // 모달 띄우기
    $('#order-modal-backdrop, #order-modal').show();
}

function mapOrderStatus(status) {
    switch (status) {
        case 'PAYMENT_COMPLETED': return '결제 완료';
        case 'ORDER_CONFIRMED': return '주문 확정';
        case 'ORDER_CANCELLED': return '주문 취소';
        case 'ORDER_COOKING': return '조리 중';
        case 'ORDER_DELIVERING': return '배달 중';
        case 'ORDER_DELIVERED': return '배달 완료';
    }
}