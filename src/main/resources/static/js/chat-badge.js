// // 알림 뱃지 보이기 / 숨기기
// function showChatNotification(count) {
//     const badge = document.getElementById('chatBadge');
//     if (!badge) return;
//     badge.textContent = count > 1 ? count : '!';  // 1개면 '!', 2개 이상이면 숫자
//     badge.style.display = 'flex';
// }
//
// function hideChatNotification() {
//     const badge = document.getElementById('chatBadge');
//     if (!badge) return;
//     badge.style.display = 'none';
// }
//
// // WebSocket + STOMP 초기화 및 알림 구독
// function connectNotificationSocket(userId) {
//     const token = localStorage.getItem("accessToken");
//     const socket = new SockJS("http://localhost:9006/chat");
//     const stompClient = Stomp.over(socket);
//
//     stompClient.connect(
//         { Authorization: `Bearer ${token}` },
//         () => {
//             console.log("알림 WebSocket 연결 성공");
//
//             // 알림 구독 (유저 ID 기반)
//             stompClient.subscribe(`/topic/notify/${userId}`, (msg) => {
//                 const data = JSON.parse(msg.body);
//                 if (data.type === 'NEW_MESSAGE') {
//                     showChatNotification(data.unreadCount || 1);
//                 }
//             });
//         },
//         (error) => {
//             console.error("알림 WebSocket 연결 실패:", error);
//         }
//     );
//
//     // 전역 stompClient가 필요하면 return 해줘도 됩니다
//     return stompClient;
// }
//
// // 채팅 버튼 클릭 시 알림 뱃지 숨김
// document.getElementById('oneOnOneChatBtn').addEventListener('click', () => {
//     window.location.href = '/chat/rooms';
//     hideChatNotification();
// });
