// 주문 결제 취소 요청을 서버에 전달. 실제 포트원 API 연동은 서버에서 처리되며, 프론트에서는 이 API만 호출하면 됨.
let cancelOrder = (merchantUid, reason) => {
    console.log("[cancelOrder] 들어온 merchantUid:", merchantUid);
    return $.ajax({
        url: '/orders/payments/cancel',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ merchantUid:merchantUid, reason:reason })
    }).then(resp => {
        console.log(resp);
        console.log(resp.isSuccess)
        if (!resp.isSuccess) {
            const msg = resp.message || '알 수 없는 오류';
            if (msg.includes('imp_uid') || msg.includes('merchant_uid')) {
                alert(SYSTEM_MESSAGES.CANCEL_DELAY_NOTICE);
            } else {
                alert(`결제 취소 실패: ${msg}`);
            }
            return Promise.reject(new Error(msg));
        } else {
            alert(resp.message || '결제 취소 성공!');
        }
        return resp;
    }).catch(err => {
        console.error('결제 취소 오류:', err);
        return Promise.reject(err);
    });
}
const SYSTEM_MESSAGES = {
    CANCEL_DELAY_NOTICE: '취소 요청 실패. 잠시 후 다시 시도해주세요.'
};