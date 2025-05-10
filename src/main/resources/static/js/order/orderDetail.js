const storeMap = {};
let ordersList = [];
let groupedData = [];

$(document).ready(async () => {
    checkToken();
    setupAjax();

    try {
        const profile = await fetchProfile();
        userUid = profile.uid;
        await fetchStores();
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
        alert('데이터 로딩 중 오류가 발생했습니다.');
        window.location.href = '/login';
    }
});
function fetchStores() {
    return $.ajax({
        type: 'GET',
        url: `/stores/list?limit=1000`
    }).then(response => {
        response.storeList.forEach(store => {
            storeMap[store.storeUid] = store.storeName;
        });
    });
}

function fetchProfile() {
    return $.ajax({ url: '/profile', type: 'GET' });
}

function fetchOrders() {
    return $.ajax({
        url: `/orders/user/${userUid}`,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
        .then(response => {
            ordersList = response;
            renderOrders();
        })
        .catch(err => {
            console.error('주문 목록 불러오기 실패', err);
            alert('주문 목록을 가져오는 데 실패했습니다.');
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
        o.items.forEach(it=>
            $list.append(`<li>${it.menuName} : ${it.amount}개 (${it.unitPrice.toLocaleString()}원)</li>`)
        )
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
        $('#cancel-reason-text').val('');
        $('#cancel-reason-section').hide();
        $('#cancel-order-btn').show();
    });

    // “확인” 버튼: 실제 취소 요청
    $('#confirm-cancel-btn').off('click').on('click', async () => {
        const reason = $('#cancel-reason-text').val().trim();
        if (!reason) {
            alert('취소 사유를 입력해주세요.');
            return;
        }
        try {
            const token = localStorage.getItem('accessToken');
            await $.ajax({
                url: `/orders/payments/cancel`,
                type: 'POST',
                contentType: 'application/json',
                headers: { 'Authorization': `Bearer ${token}` },
                data: JSON.stringify({
                    merchantUid: merchantUid,
                    reason: reason
                })
            });
            alert('결제 취소 및 상태 업데이트 완료');
            $('#order-modal-backdrop, #order-modal').hide();
            fetchOrders();  // 최신 목록 다시 불러오기
        } catch (err) {
            console.error('취소 처리 중 오류', err);
            alert('결제 취소 처리 중 오류가 발생했습니다.');
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
        //default: return status;
    }
}