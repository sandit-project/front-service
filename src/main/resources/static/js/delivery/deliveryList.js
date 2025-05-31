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

        initUserUI(userInfo);

        if(userInfo.role === "ROLE_DELIVERY" || userInfo.role === "ROLE_ADMIN"){
            // 웹소켓에 위치 전달 하는 함수
            sendDeliveryManLocation(userInfo.id, userInfo.type);
        }
        connectWebSocket("alarm", userInfo.id, userInfo.type);
    }).catch((error)=>{
        console.error('board list user info error : ',error);
    });

    await requestCookingOrder();

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
    window.changeStatus = async (newStatus) => {
        console.log("상태 변경 호출 !!",newStatus);
        if(newStatus === "ORDER_COOKING"){
            await requestCookingOrder();
        }else if(newStatus === "ORDER_DELIVERING"){
            await requestDeliveringOrder();
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

        endDelivery(deliveryInfo);
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
            Swal.fire({
                icon: 'error',
                title: '요청 실패',
                text: '요청 중 오류가 발생했습니다. 다시 시도해주세요.',
                confirmButtonColor: '#f97316'
            });
        }
    });
}

// 배달중 리스트 요청 함수
let requestDeliveringOrder = () => {
    checkToken();
    setupAjax();

    const deliverymanType = $('#hiddenType').val();
    const deliverymanUid = $('#hiddenId').val();

    if (!hasMore) return;
    isLoading = true;
    $('#loading').show();

    $.ajax({
        type: 'GET',
        url: `/api/delivery/delivering/${deliverymanType}/${deliverymanUid}`,
        success: (response) => {
            console.log(response);
            const $tbody = $('#deliveryContent').empty();

            if(response != null){
                $('#delivery-count').text(`( ${response.length} 건 )`);

                response.forEach((o, index) => {
                    $tbody.append(`
                        <tr>
                            <td>${index + 1}</td> <!-- 순번 -->
                            <td>${o.merchantUid}</td>
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
            Swal.fire({
                icon: 'error',
                title: '요청 실패',
                text: '요청 중 오류가 발생했습니다. 다시 시도해주세요.',
                confirmButtonColor: '#f97316'
            });
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
            Swal.fire({
                icon: 'success',
                title: '배달 시작됨',
                text: response.message || '배달이 시작되었습니다.',
                confirmButtonColor: '#f97316'
            });
        },
        error: (error) => {
            console.log('오류발생 : ', error);
            Swal.fire({
                icon: 'error',
                title: '배달 시작 실패',
                text: '요청 중 오류가 발생했습니다.',
                confirmButtonColor: '#f97316'
            });
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
        url: '/api/delivery/complete',
        data: JSON.stringify(deliveryInfo),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: (response) => {
            console.log(response);
            Swal.fire({
                icon: 'success',
                title: '배달 완료됨',
                text: response.message || '배달이 완료되었습니다.',
                confirmButtonColor: '#f97316'
            });
        },
        error: (error) => {
            console.log('오류발생 : ', error);
            Swal.fire({
                icon: 'error',
                title: '배달 완료 실패',
                text: '요청 중 오류가 발생했습니다.',
                confirmButtonColor: '#f97316'
            });
        }
    });
}

let sendDeliveryManLocation = async (uid, type) => {
    const socket = new SockJS(WEBSOCKET_URL);
    const stompClient = Stomp.over(socket);

    const deliveryList = await requestDeliveringList(type, uid);

    console.log(deliveryList);

    stompClient.connect({}, () => {
        console.log("STOMP 연결됨");

        // 5초마다 위치 전송
        setInterval(() => {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const payload = {
                        merchantUid: deliveryList[0].merchantUid,
                        riderUserUid: type === "user" ? uid : null,
                        riderSocialUid: type === "social" ? uid : null,
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        accuracy: pos.coords.accuracy // 정확도도 같이 보내고 싶다면
                    };

                    // 서버에 위치 정보 전송
                    stompClient.send("/app/delivery/update-location", {}, JSON.stringify(payload));
                },
                (error) => {
                    console.error("위치 정보 가져오기 실패:", error);
                },
                {
                    enableHighAccuracy: true, // 🔸GPS 우선 사용
                    timeout: 10000,           // 최대 10초 대기
                    maximumAge: 0             // 캐시된 위치 안 씀
                }
            );
        }, 5000);

    });

    stompClient.onWebSocketError = (error) => {
        console.error("WebSocket 에러:", error);
    };

    stompClient.onStompError = (frame) => {
        console.error("STOMP 에러:", frame);
    };
};

// 배달원이 수행중인 목록 요청 하는 함수
let requestDeliveringList = (type, uid) => {
    checkToken();
    setupAjax();

    return $.ajax({
        type: 'GET',
        url: `/api/delivery/delivering/${type}/${uid}`
    });
}

