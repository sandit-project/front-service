function connectWebSocket() {
    if (isConnected) {
        console.log('[WebSocket] 이미 연결된 상태');
        return;
    }

    sock = new SockJS(window.WEBSOCKET_URL);
    stompClient = Stomp.over(sock);

    stompClient.connect({}, function (frame) {
        console.log('[WebSocket] 연결 성공:', frame);
        isConnected = true;
        subscribeToGlobalMessages();
    }, function (error) {
        console.error('[WebSocket] 연결 실패:', error);
        isConnected = false;
        stompClient = null;
        sock = null;
        setTimeout(connectWebSocket, 5000);
    });
}