let receiveAlarm = (uid, type) => {
    if (!isConnected || !stompClient) {
        console.warn('[WebSocket] 연결 안 됨, 재연결 시도');
        connectWebSocket(() => {
            // 연결 완료된 후 알람 구독 실행
            subscribeAlarm(uid, type);
        });
        return;
    }

    // 이미 연결된 상태라면 바로 구독
    subscribeAlarm(uid, type);
};

let subscribeAlarm = (uid, type) => {
    const subscribePath = `/topic/alarm/${type}/${uid}`;
    stompClient.subscribe(subscribePath, (message) => {
        try {
            const alarm = JSON.parse(message.body);
            Swal.fire({
                icon: 'info',
                title: '알림',
                text: alarm.message,
                confirmButtonColor: '#f97316'
            });
        } catch (e) {
            console.error("메시지 파싱 에러:", e);
        }
    });
    console.log("[WebSocket] 알림 구독 완료:", subscribePath);
}
