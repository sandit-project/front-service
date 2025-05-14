$(document).ready(async ()=>{
    checkToken();
    setupAjax();

    await requestDeliveringOrder();

    // 배달원 위치 수신하는 함수 (merchantUid를 경로에 전달해서 수신함)
    receiveDeliveryManLocation();

    // 카카오맵 렌더링 (위에서 받은 좌표 전달)
    renderKakaomap();

    $('#updateProfileBtn').on("click",() => {
        window.location.href = "/member/profile/update"
    });
});

let requestDeliveringOrder = async () => {
    checkToken();
    setupAjax();

    try {
        const profile = await fetchProfile();
        const userUid = profile.uid;
        const userType = profile.type;

        $('#order-info-box').on('click', () => {
            window.location.href = `/order/details`;
        });

        const orders = await fetchOrders(userUid,userType);
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
};

function fetchProfile() {
    checkToken();
    setupAjax();

    return $.ajax({
        url: '/profile',
        type: 'GET',
        success: (response) => {
            $('#welcome-message').text(response.userName + '님 환영합니다!');
            $('#hiddenUserName').val(response.userName);
            $('#hiddenUserUId').val(response.uid);
            $('#hiddenUserType').val(response.type);
            $('#hiddenUserId').val(response.userId);
            $('#hiddenUserRole').val(response.role);
            $('#user_name').text(response.userName);
            $('#user_email').text(response.email);
            $('#user_phone').text(response.phone);
            $('#created_date').text(response.createdDate);
            $('#user_point').text(response.point);
            $('#user_type').text(response.type);
            $('#main_address').text(response.mainAddress);
            $('#sub_address1').text(response.subAddress1);
            $('#sub_address2').text(response.subAddress2);

            console.log(response);
            return response;
        },
        error : (error) => {
            console.error('profile in error :: ',error);
            alert('프로필 요청 중 오류가 발생했습니다.');
            if(error.status === 401){
                // 토큰 만료 에러 메세지에 따라 refreshToken 보냄
                handleTokenExpiration();
            }
        }
    });
}

// 주문 불러오기
function fetchOrders(userUid, userType) {
    checkToken();
    setupAjax();

    console.log(userUid,userType);

    return $.ajax({
        url: `/orders/user/${userType}/${userUid}`,
        type: 'GET',
        contentType: 'application/json',
    });
}

// 매장 이름 불러오기
function fetchStoreName(storeUid) {
    checkToken();
    setupAjax();

    return $.ajax({
        type: 'GET',
        url: `/stores/${storeUid}`
    }).then(res => res.storeName || '—');
}

// 회원 탈퇴 버튼 (동적 요소 대응)
$(document).on("click", "#deleteBtn", () => {
    Swal.fire({
        title: '정말 탈퇴하시겠습니까?',
        text: '탈퇴하면 계정 정보가 모두 삭제됩니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: '네, 탈퇴할게요',
        cancelButtonText: '취소'
    }).then((result) => {
        if (result.isConfirmed) {
            deleteAccount();
        }
    });
});

function deleteAccount() {
    checkToken();
    setupAjax();

    $.ajax({
        type: 'DELETE',
        url: '/user',
        success: () => {
            Swal.fire({
                icon: 'success',
                title: '탈퇴 완료',
                text: '회원 탈퇴가 성공적으로 처리되었습니다.',
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
                text: '회원 탈퇴 중 오류가 발생했습니다.'
            });
        }
    });
}

