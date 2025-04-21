function execDaumPostcode() {
    new daum.Postcode({
        oncomplete: async function(data) {
            // 1) 화면에 표시
            $('#postcode').val(data.zonecode);
            $('#main_address_base').val(data.address);

            // 2) 백엔드에 좌표 요청
            try {
                const coords = await $.ajax({
                    type: 'GET',
                    url: '/api/geocode',
                    data: { address: data.address },
                    dataType: 'json'
                });

                // 3) 받아온 lat/lng를 hidden 필드에 세팅
                if (coords.lat != null && coords.lng != null) {
                    $('#latitude').val(coords.lat);
                    $('#longitude').val(coords.lng);
                } else {
                    console.warn('좌표 변환 결과가 비어있습니다.', coords);
                }
            } catch (err) {
                console.error('좌표 조회 에러:', err);
                alert('주소 변환에 실패했습니다.');
            }
        }
    }).open();
}

$(document).ready(() => {
    // "우편번호" 입력란이나 "주소 찾기" 버튼 클릭 시 팝업 띄우기
    $('#postcode, #mainAddress-kakao').on('click', execDaumPostcode);
});
