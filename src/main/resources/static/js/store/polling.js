/**
 * polling 함수
 * @param {function} requestFn   // 상태를 체크할 ajax 호출 함수. (반드시 Promise 반환)
 * @param {function} successFn   // 성공(목표 상태 도달)시 실행할 함수
 * @param {object} options       // { interval, maxTry }
 */
function polling(requestFn, successFn, options = {} ) {
    const interval = options.interval || 2000; // 2초 기본
    const maxTry = options.maxTry || 10; // 최대 10회
    let tryCount = 0;

    function poll(){
        tryCount++;
        requestFn()
            .then((data)=>{
                if (data && data.success) {
                    successFn(data);
                } else if (tryCount < maxTry) {
                    setTimeout(poll, interval);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: '처리 지연',
                        text: '요청이 예상보다 오래 걸리고 있습니다.\n잠시 후 새로고침 해주세요.',
                        confirmButtonColor: '#f97316'
                    });
                }
            })
        .catch(()=>{
            if (tryCount < maxTry) {
                setTimeout(poll, interval);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '처리 지연',
                    text: '요청이 예상보다 오래 걸리고 있습니다.\n잠시 후 새로고침 해주세요.',
                    confirmButtonColor: '#f97316'
                });
            }
        });
    }
    poll();

}
