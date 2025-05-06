let hasMore = true;
let isLoading = false;
let statusFilter = 'ORDER_COOKING'; // 기본 탭

$(document).ready(async ()=>{
    // 1) 토큰 유효성 확인 및 AJAX 헤더 설정
    checkToken();
    setupAjax();
    getUserInfo().then((userInfo)=>{
        console.log(userInfo);
        $('#hiddenId').val(userInfo.id);
        // $('#hiddenType').val(userInfo.type);
        $('#hiddenUserRole').val(userInfo.role);
    }).catch((error)=>{
        console.error('board list user info error : ',error);
    });

    requestCookingOrder();

    // ** 새로고침 버튼 클릭 핸들러 **
    $('#refresh-btn').click(async ()=>{
        hasMore = true;
        $('#deliveryContent').empty();
    });

    // 상태 탭 클릭 핸들러
    $('#status-tabs li').click(function (){
        $('#status-tabs li').removeClass('active');
        $(this).addClass('active');
        statusFilter = $(this).data('status');
        hasMore = true;
        console.log(statusFilter);
        $('#storeContent').empty();
        changeStatus(statusFilter);
    })

    // 무한스크롤
    $(window).on('scroll',()=>{
        if ( !isLoading && hasMore
            && $(window).scrollTop() + $(window).height() >= $(document).height() - 100)
        {
            //requestCookingOrder();
        }
    });

    //상태 변경 호출
    window.changeStatus = (newStatus) => {
        console.log("상태 변경 호출 !!",newStatus);
        if(newStatus === "ORDER_COOKING"){
            requestCookingOrder();
        }else if(newStatus === "ORDER_DELIVERING"){
            requestDeliveringOrder();
        }else{
            console.log("잘못된 요청입니다!!");
        }
    };

});

// 조리중 리스트 요청 함수
let requestCookingOrder = () => {
    checkToken();
    setupAjax();

    if (!hasMore) return;
    isLoading = true;
    $('#loading').show();

    $.ajax({
        type: 'GET',
        url: '/api/delivery/cooking',
        success: (response) => {
            console.log(response);
            const $tbody = $('#deliveryContent').empty();

            if(response != null){
                let displayOrderList = mergeOrderList(response);

                $('#delivery-count').text(`( ${displayOrderList.length} 건 )`);

                displayOrderList.forEach((o, index) => {
                    const created = new Date(o.createdDate).toLocaleString();
                    const reserve = o.reservationDate
                        ? new Date(o.reservationDate).toLocaleString()
                        : '-';

                    const itemDetails = o.items
                        .map(item => `${item.menuName} - ${item.amount}개`)
                        .join("<br>");

                    $tbody.append(`
                        <tr>
                            <td>${index + 1}</td> <!-- 순번 -->
                            <td>${created}</td>
                            <td>${reserve}</td>
                            <td>${itemDetails}</td>
                            <td>${o.addressStart}</td>
                            <td>${o.addressDestination}</td>
                            <td>
                                <button onclick="startDelivery(${o})">배달시작</button>
                            </td>
                        </tr>
                    `);
                });
            }else{
                $tbody.append(`
                    <tr>
                      <td colspan="8" style="text-align:center">내역이 없습니다.</td>
                    </tr>
                `);
            }
        },
        error: (error) => {
            console.log('오류발생 : ', error);
            alert('요청 중 오류가 발생했습니다.');
        }
    });
}

// 배달중 리스트 요청 함수
let requestDeliveringOrder = () => {
    checkToken();
    setupAjax();

    if (!hasMore) return;
    isLoading = true;
    $('#loading').show();

    $.ajax({
        type: 'GET',
        url: '/api/delivery/delivering',
        success: (response) => {
            console.log(response);
            const $tbody = $('#deliveryContent').empty();

            if(response != null){
                let displayOrderList = mergeOrderList(response);

                $('#delivery-count').text(`( ${displayOrderList.length} 건 )`);

                displayOrderList.forEach((o, index) => {
                    const created = new Date(o.createdDate).toLocaleString();
                    const reserve = o.reservationDate
                        ? new Date(o.reservationDate).toLocaleString()
                        : '-';

                    const itemDetails = o.items
                        .map(item => `${item.menuName} - ${item.amount}개`)
                        .join("<br>");

                    $tbody.append(`
                        <tr>
                            <td>${index + 1}</td> <!-- 순번 -->
                            <td>${created}</td>
                            <td>${reserve}</td>
                            <td>${itemDetails}</td>
                            <td>${o.addressStart}</td>
                            <td>${o.addressDestination}</td>
                            <td>
                                <button onclick="endDelivery(${o})">배달완료</button>
                            </td>
                        </tr>
                    `);
                });
            }else{
                $tbody.append(`
                    <tr>
                      <td colspan="8" style="text-align:center">내역이 없습니다.</td>
                    </tr>
                `);
            }
        },
        error: (error) => {
            console.log('오류발생 : ', error);
            alert('요청 중 오류가 발생했습니다.');
        }
    });
}

// response 주문 정보 통합하는 함수
let mergeOrderList = (input) => {
    const merged = Object.values(
        input.reduce((acc, order) => {
            const {
                merchantUid,
                menuName,
                amount,
                price,
                ...rest
            } = order;

            if (!acc[merchantUid]) {
                acc[merchantUid] = {
                    merchantUid,
                    ...rest,
                    items: []
                };
            }

            acc[merchantUid].items.push({
                menuName,
                amount,
                price
            });

            return acc;
        }, {})
    );

    console.log("merged list", merged);
    return merged;
};

// 배달 시작 함수
let startDelivery = (info) => {
    // 배달원 정보 입력하는 창 추가로 필요함

    // 인풋 창에서 받아오는 정보 셋팅 필요함
    let deliverymanType = $(`#hiddenType`).val();
    let deliverymanUid = $(`#hiddenId`).val();

    checkToken();
    setupAjax();

    let deliveryInfo;

    info.items.forEach(item=>{
        deliveryInfo.push({
            ...info,
            amount : item.amount,
            menuName : item.menuName,
            price : item.price
        });
    })

    console.log(deliveryInfo);

    // 임시 템플릿
    $.ajax({
        type: 'POST',
        url: '/api/delivery/start',
        data: JSON.stringify(deliveryInfo),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
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

// 배달 종료 함수
let endDelivery = (info) => {
    // 배달원 정보 입력하는 창 추가로 필요함

    // 인풋 창에서 받아오는 정보 셋팅 필요함
    let deliverymanType = "USER";
    let deliverymanUid = "";

    checkToken();
    setupAjax();

    // 임시 템플릿
    $.ajax({
        type: 'POST',
        url: '/api/delivery/start',
        data: JSON.stringify(signInData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
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
