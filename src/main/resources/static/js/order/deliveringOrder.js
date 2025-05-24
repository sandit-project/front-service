$(document).ready(async () => {
    checkToken();
    setupAjax();

    try {
        const profile = await fetchProfile();
        initUserUI(profile);
        const userUid = profile.uid;

        $('#order-info-box').on('click', () => {
            window.location.href = `/order/${userUid}`;
        });

        const orders = await fetchOrders(userUid);
        const delivering = orders
            .filter(o => o.status === 'ORDER_DELIVERING')
            .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))[0];

        if (delivering) {
            console.log(delivering);
            const storeName = await fetchStoreName(delivering.storeUid);
            const menuName = delivering.items[0]?.menuName || '—';
            const menuText = delivering.items.length > 1
                ? `메뉴: ${menuName} 외 ${delivering.items.length - 1}건`
                : `메뉴: ${menuName}`;
            const totalPrice = delivering.items.reduce((sum, item) => sum + item.unitPrice * item.amount, 0);
            const createdAt = formatDate(delivering.createdDate);

            $('#order-store-name').text(`가게: ${storeName}`);
            $('#order-menu-info').text(menuText);
            $('#order-total-price').text(`총 가격: ${totalPrice.toLocaleString()}원`);
            $('#order-created-at').text(`주문 시간: ${createdAt}`);
        } else {
            $('#latest-order-box').html('<p>현재 배달 중인 주문이 없습니다.</p>');
        }

    } catch (err) {
        console.error('주문 불러오기 실패', err);
    }
});

function fetchProfile() {
    return $.ajax({ url: '/profile', type: 'GET' });
}

// 주문 불러오기
function fetchOrders(userUid) {
    return $.ajax({
        url: `/orders/user/${userUid}`,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
}

// 매장 이름 불러오기
function fetchStoreName(storeUid) {
    return $.ajax({
        type: 'GET',
        url: `/stores/${storeUid}`
    }).then(res => res.storeName || '—');
}
