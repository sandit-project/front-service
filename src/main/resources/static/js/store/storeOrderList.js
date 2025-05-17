let storeInfo;

$(document).ready(async ()=>{

    let statusFilter = 'PAYMENT_COMPLETED'; // 기본 탭

    // 토큰 유효성 확인 및 AJAX 헤더 설정
    checkToken();
    setupAjax();

    // 2) 로그인한 유저 정보 조회
    let userInfo;
    try {
        userInfo = await getUserInfo();      // common.js 에 정의된 함수 호출
    } catch (err) {
        console.error('유저 정보 조회 실패:', err);
        alert('유저 정보를 불러오지 못했습니다. 다시 로그인 해주세요.');
        return;
    }

    const managerUid = userInfo.id;       // 여기에서 매니저 UID 획득
    console.log('로그인한 매니저 UID:', managerUid);

    //  매니저 UID로 storeUid 조회 후 초기 로드 및 스크롤 이벤트 등록

    storeInfo = await fetchStoreUidByManager(managerUid);

    if (storeInfo==null) {
        alert('지점 정보를 불러오는 데 실패했습니다.');
        return;
    }
    // 화면 헤더 텍스트 업데이트
    $('#welcome-text').text(`${storeInfo.storeName} 주문 목록`);
    // ** 새로고침 버튼 클릭 핸들러 **
    $('#refresh-btn').click(async ()=>{
       loadOrders();
    });

    // 상태 탭 클릭 핸들러
    $('#status-tabs li').click(function (){
        $('#status-tabs li').removeClass('active');
        $(this).addClass('active');
        statusFilter = $(this).data('status');
        loadOrders();
    })


    //최초 주문 목록 로드
    loadOrders();

    //주문 목록 단일 로드 함수
    async function loadOrders() {
       try {

        $('#storeContent').empty();
        $('#loading').show();

        const response =await $.ajax({
            type: 'GET',
            url: `/orders/store/${storeInfo.storeUid}?status=${statusFilter}`,
            dataType: 'json',
        });
        console.log("지점 주문 목록 ",response);

        const orders = Array.isArray(response)
            ? response
            :(response.storeOrderLists || []);

        console.log("parsed orders",orders);
        if (orders.length === 0) {
            $('#storeContent').append(`
                <tr>
                    <td colspan="7" style="text-align:center">주문 내역이 없습니다.</td>
                </tr>
            `);
        } else {
            const displayOrderList = mergeOrderList(orders);
            $('#order-count').text(`(${displayOrderList.length} 건)`);

            displayOrderList.forEach(o=> {
                const created = formatDate(o.createdDate);
                const reserve = o.reservationDate ? formatDate(o.reservationDate) : '-';
                const itemDetails = o.items.map(item =>
                    `${item.menuName}-${item.amount}개`
                ).join("<br>");
                $('#storeContent').append(`
                    <tr>
                        <td>${o.merchantUid}</td>
                        <td>${o.userUid}</td>
                        <td>${created}</td>
                        <td>${reserve}</td>
                        <td>${itemDetails}</td>
                        <td>${o.addressDestination || '-'}</td>
                        <td>
                          <button onclick="remoteOrder('confirm','${o.merchantUid}','${o.status}','${o.addressDestination}','${o.addressDestination}')">수락</button>
                          <button onclick="remoteOrder('cancel','${o.merchantUid}','${o.status}','${o.addressDestination}','${o.addressDestination}')">취소</button>
                          <button onclick="remoteOrder('cooking','${o.merchantUid}','${o.status}','${o.addressDestination}','${o.addressDestination}')">조리</button>
                        </td>
                    </tr>
                `);
            });
        }
     } catch (err){
           console.error('주문 목록 조회 실패 :',err);
           alert('주문 목록을 불러오는 중 오류가 발생했습니다.');
     } finally {
           $('#loading').hide();
       }

    }

});

/**
 * 매니저 UID로 storeUid를 조회
 * GET /stores/storeUid?managerUid={managerUid}
 */
function fetchStoreUidByManager(userUid) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: `/stores/storeUid?userUid=${userUid}`,
            dataType: 'json',
            success: response => {
                console.log("로그인 한 매니저의 지점명,지점번호 :",response);
                resolve(response);
            },
            error: xhr => {
                console.error('storeUid 조회 실패:', xhr.status);
                reject(null);
            }
        });
    });
}

// response 주문 정보 통합하는 함수
let mergeOrderList = (input) => {
    const merged = Object.values(
        input.reduce((acc, order) => {
            const { merchantUid, items, ...rest } = order;

            if (!acc[merchantUid]) {
                acc[merchantUid] = {
                    merchantUid,
                    ...rest,
                    items: []
                };
            }

            items.forEach(item => {
                const existing = acc[merchantUid].items.find(i => i.menuName === item.menuName);
                if (existing) {
                    existing.amount += item.amount;
                } else {
                    acc[merchantUid].items.push({ ...item });
                }
            });

            return acc;
        }, {})
    );

    console.log("merged list",merged);
    return merged;
}

// 주문 조작 함수 (취소를 빼서)
let remoteOrder = (action,merchantUid,status,addressStart,addressDestination) => {
    checkToken();
    setupAjax();

    let remoteOrderDate = {
        merchantUid : merchantUid,
        status : status,
        riderUserUid : null,
        riderSocialUid : null,
        addressStart : addressStart,
        addressDestination : addressDestination,
        deliveryAcceptTime : null,
        deliveredTime : null
    };

    $.ajax({
        type: 'PUT',
        url: '/stores/orders/' + action,
        data : JSON.stringify(remoteOrderDate),
        contentType : 'application/json; charset=utf-8',
        dataType : 'json',
        success: (response) => {
            console.log(response);
            alert(response.message);
        },
        error: (error) => {
            console.log('오류발생 : ', error);
            alert('요청 중 오류가 발생했습니다.');
        }
    });

}


