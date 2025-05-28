let receiveAlarm = (uid, type) => {
    const socket = new SockJS(WEBSOCKET_URL);
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
        console.log("웹소켓 알림 연결 성공");

        const subscribePath = `/topic/alarm/${type}/${uid}`;

        stompClient.subscribe(subscribePath, (message) => {
            console.log("구독 콜백 진입, message:", message);

            try {
                const alarm = JSON.parse(message.body);
                console.log("알림 도착:", alarm);

                Swal.fire({
                    icon: 'info',
                    title: '알림',
                    text: alarm.message,
                    confirmButtonColor: '#f97316'
                });
            } catch (e) {
                console.error("메시지 파싱 에러:", e);
                console.log("message.body:", message.body);
            }
        });
    }, (error) => {
        console.error("웹소켓 알림 연결 실패:", error);
    });
};
