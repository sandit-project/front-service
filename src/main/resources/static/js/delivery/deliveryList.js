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
        $('#hiddenType').val(userInfo.type);
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

    $(document).on('click', '.start-delivery-btn', function() {
        // 버튼 클릭 시 data-* 속성에서 정보 가져오기
        const $btn = $(this);

        const deliveryInfo = {
            merchantUid: $btn.data('merchant-uid'),
            status: $btn.data('status'),
            addressStart: $btn.data('address-start'),
            addressDestination: $btn.data('address-destination'),
            deliveryAcceptTime: new Date().toISOString().slice(0, 19), // 현재 시간
            deliveredTime: null
        };

        startDelivery(deliveryInfo);
    });

    $(document).on('click', '.end-delivery-btn', function() {
        // 버튼 클릭 시 data-* 속성에서 정보 가져오기
        const $btn = $(this);

        const deliveryInfo = {
            merchantUid: $btn.data('merchant-uid'),
            status: $btn.data('status'),
            addressStart: $btn.data('address-start'),
            addressDestination: $btn.data('address-destination'),
            deliveryAcceptTime: $btn.data('delivery-accept-time'), // 현재 시간
            deliveredTime: new Date().toISOString().slice(0, 19)
        };

        startDelivery(deliveryInfo);
    });

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
                $('#delivery-count').text(`( ${response.length} 건 )`);

                response.forEach((o, index) => {
                    $tbody.append(`
                        <tr>
                            <td>${index + 1}</td>
                            <td>${o.merchantUid}</td>
                            <td>${o.addressStart}</td>
                            <td>${o.addressDestination}</td>
                            <td>
                                <button 
                                    class="start-delivery-btn"
                                    data-merchant-uid="${o.merchantUid}"
                                    data-status="${o.status}"
                                    data-address-start="${o.addressStart}"
                                    data-address-destination="${o.addressDestination}">
                                    배달시작
                                </button>
                            </td>
                        </tr>
                    `);
                });
            }else{
                $tbody.append(`
                    <tr>
                      <td colspan="5" style="text-align:center">내역이 없습니다.</td>
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
                $('#delivery-count').text(`( ${response.length} 건 )`);

                response.forEach((o, index) => {
                    $tbody.append(`
                        <tr>
                            <td>${index + 1}</td> <!-- 순번 -->
                            <td>${o.merchant_uid}</td>
                            <td>${o.addressStart}</td>
                            <td>${o.addressDestination}</td>
                            <td>
                                <button 
                                    class="end-delivery-btn"
                                    data-merchant-uid="${o.merchantUid}"
                                    data-status="${o.status}"
                                    data-address-start="${o.addressStart}"
                                    data-address-destination="${o.addressDestination}"
                                    data-delivery-accept-time="${o.deliveryAcceptTime}">
                                    배달완료
                                </button>
                            </td>
                        </tr>
                    `);
                });
            }else{
                $tbody.append(`
                    <tr>
                      <td colspan="5" style="text-align:center">내역이 없습니다.</td>
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

// 배달 시작 함수
let startDelivery = (info) => {
    const deliverymanType = $('#hiddenType').val();
    const deliverymanUid = $('#hiddenId').val();
    const now = new Date();
    const localDateTimeString = now.toISOString().slice(0, 19); // '2025-05-07T13:45:00'

    // 배달 정보 셋팅
    let deliveryInfo = {
        merchantUid: info.merchantUid,
        status: info.status,
        riderUserUid: deliverymanType === 'user' ? deliverymanUid : null,
        riderSocialUid: deliverymanType === 'social' ? deliverymanUid : null,
        addressStart: info.addressStart,
        addressDestination: info.addressDestination,
        deliveryAcceptTime: localDateTimeString,
        deliveredTime: null
    };

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
    let deliverymanType = $(`#hiddenType`).val();
    let deliverymanUid = $(`#hiddenId`).val();
    const now = new Date();
    const localDateTimeString = now.toISOString().slice(0, 19); // '2025-05-07T13:45:00'

    checkToken();
    setupAjax();

    let deliveryInfo = {
        merchantUid : info.merchantUid,
        status : info.status,
        riderUserUid : deliverymanType === "user" ? deliverymanUid:null,
        riderSocialUid : deliverymanType === "social" ? deliverymanUid:null,
        addressStart : info.addressStart,
        addressDestination : info.addressDestination,
        deliveryAcceptTime : info.deliveryAcceptTime,
        deliveredTime : localDateTimeString
    };

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
