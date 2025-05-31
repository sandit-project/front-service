// --- 전역 변수 ---
let stompClient = null;
let sock = null;
let isConnected = false;
let alarmSubscription = null;

let receiveAlarm = (uid, type) => {
    if (!stompClient || !isConnected) {
        console.warn('[WebSocket] 연결 안 됨 → 구독 실패');
        return;
    }

    if (alarmSubscription) {
        alarmSubscription.unsubscribe();
        console.log('[WebSocket] 기존 알림 구독 해제');
    }

    const topic = `/topic/alarm/${type}/${uid}`;
    alarmSubscription = stompClient.subscribe(topic, function (msg) {
        try {
            const alarm = JSON.parse(msg.body);
            console.log('[WebSocket] 알림 수신:', alarm);

            Swal.fire({
                icon: 'info',
                title: '알림',
                text: alarm.message,
                confirmButtonColor: '#f97316'
            });
        } catch (e) {
            console.error('[WebSocket] 메시지 파싱 실패:', e);
        }
    });

    console.log('[WebSocket] 알림 구독 시작:', topic);
};

// --- 페이지 이탈 시 연결 종료 ---
$(window).on('beforeunload', function () {
    if (stompClient && stompClient.disconnect) {
        stompClient.disconnect();
        console.log('[WebSocket] 연결 종료');
    }
});

