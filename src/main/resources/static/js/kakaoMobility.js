let pathCoords = [];  // 경로 좌표 배열
let deliveryMarker;   // 배달원 마커
let moveIndex = 0;    // 현재 위치 인덱스

let renderKakaomap = (info) => {
    // 지도 초기화
    const mapContainer = document.getElementById('map');
    const mapOption = {
        center: new kakao.maps.LatLng(info.addressDestinationLat, info.addressDestinationLan),
        level: 5
    };
    const map = new kakao.maps.Map(mapContainer, mapOption);

    // 점포(출발지) & 배달지(도착지) 좌표
    const store = { lat: info.addressStartLat, lng: info.addressStartLan };
    const customer = { lat: info.addressDestinationLat, lng: info.addressDestinationLan };

    // 마커 표시 함수
    function placeMarker(position, title) {
        const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(position.lat, position.lng),
            map: map,
            title: title
        });

        const infowindow = new kakao.maps.InfoWindow({
            content: `<div style="padding:5px;font-size:13px;">${title}</div>`
        });
        infowindow.open(map, marker);
    }

    // 점포와 배달지 마커 표시
    placeMarker(store, info.addressStart);
    placeMarker(customer, '배달지');

    $.ajax({
        type: 'GET',
        url: '/api/delivery/path?origin='+store.lng+','+store.lat+'&destination='+customer.lng+','+customer.lat,
        dataType : 'json',
        success:(data)=>{
            const roads = data.routes[0].sections[0].roads;
            pathCoords = roads.flatMap(road =>
                road.vertexes.reduce((arr, val, idx, array) => {
                    if (idx % 2 === 0) {
                        arr.push(new kakao.maps.LatLng(array[idx + 1], val));
                    }
                    return arr;
                }, [])
            );

            // 경로선 그림
            const polyline = new kakao.maps.Polyline({
                path: pathCoords,
                strokeWeight: 5,
                strokeColor: '#FF0000',
                strokeOpacity: 0.9,
                strokeStyle: 'solid'
            });
            polyline.setMap(map);

            // 배달원 이동 시작
            // moveIndex = 0;
            // moveDeliveryMan();
            receiveDeliveryManLocation(info.merchantUid);
        },
        error: (error)=>{
            console.log("error :: ",error);
        }
    })

    // 배달원 위치 갱신
    // function moveDeliveryMan() {
    //     setInterval(function() {
    //         if (moveIndex < pathCoords.length) {
    //             deliveryMarker.setPosition(pathCoords[moveIndex]);
    //             moveIndex++;
    //         }
    //     }, 1000); // 1초마다 이동
    // }

    let receiveDeliveryManLocation = (merchantUid) => {
        const socket = new SockJS(window.WEBSOCKET_URL);
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, (frame) => {
            console.log("STOMP 연결됨 (수신)");

            // 예: 특정 배달원 UID 기반으로 구독
            // 서버에서 배달원 위치를 `/topic/delivery-location/{uid}`로 발행하는 경우
            const topic = `/topic/delivery-location/${merchantUid}`;

            stompClient.subscribe(topic, (message) => {
                const location = JSON.parse(message.body);
                console.log("배달원 위치 수신:", location);

                // 위치 데이터 처리 예시
                let rider = { lat: location.lat, lng: location.lng };
                placeMarker(rider, '실시간 배달원');
            });
        });

        stompClient.onWebSocketError = (error) => {
            console.error("WebSocket 에러:", error);
        };

        stompClient.onStompError = (frame) => {
            console.error("STOMP 에러:", frame);
        };
    };
};