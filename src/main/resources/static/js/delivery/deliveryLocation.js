let sendDeliveryManLocation = async (uid, type) => {
    const socket = new SockJS(WEBSOCKET_URL);
    const stompClient = Stomp.over(socket);

    const deliveryList = await requestDeliveringList(type, uid);

    console.log(deliveryList);

    stompClient.connect({}, () => {
        console.log("STOMP 연결됨");

        // 2초마다 위치 전송
        setInterval(() => {
            navigator.geolocation.getCurrentPosition((pos) => {
                const payload = {
                    riderUserUid: type === "user" ? uid : null,
                    riderSocialUid: type === "social" ? uid : null,
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                };

                // 서버에서 설정한 수신 경로에 맞춰 메시지 전송
                stompClient.send("/app/delivery/update-location", {}, JSON.stringify(payload));
            });
        }, 5000);
    });

    stompClient.onWebSocketError = (error) => {
        console.error("WebSocket 에러:", error);
    };

    stompClient.onStompError = (frame) => {
        console.error("STOMP 에러:", frame);
    };
};

let receiveDeliveryManLocation = () => {
    const socket = new SockJS(WEBSOCKET_URL);
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, (frame) => {
        console.log("STOMP 연결됨 (수신)");

        // 예: 특정 배달원 UID 기반으로 구독
        // 서버에서 배달원 위치를 `/topic/delivery-location/{uid}`로 발행하는 경우
        const topic = `/topic/delivery-location`;

        stompClient.subscribe(topic, (message) => {
            const location = JSON.parse(message.body);
            console.log("배달원 위치 수신:", location);

            // 위치 데이터 처리 예시
            // updateMapMarker(location.lat, location.lng);
        });
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