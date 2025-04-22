$(document).ready(function () {
    const params = new URLSearchParams(window.location.search);
    const uid = params.get("uid");

    // 지점 상세 조회
    $.ajax({
        url: `/stores/${uid}`,
        method: 'GET',
        success: function (data) {
            $('#uid').val(data.uid);
            $('#store_name').val(data.storeName);
            $('#address').val(data.storeAddress);
            $('#postcode').val(data.storePostcode);
            $('#status').val(data.storeStatus);
        },
        error: function () {
            alert('지점 정보를 불러오는데 실패했습니다.');
        }
    });

    // 주소 클릭 시 다음 주소 API 호출
    $('#address').click(function () {
        new daum.Postcode({
            oncomplete: function(data) {
                $('#postcode').val(data.zonecode);
                $('#address').val(data.roadAddress);
            }
        }).open();
    });

    // 수정 요청
    $('#storeDetailForm').submit(function (e) {
        e.preventDefault();

        const formData = {
            storeName: $('#store_name').val(),
            storeAddress: $('#address').val(),
            storePostcode: $('#postcode').val(),
            storeStatus: $('#status').val()
        };

        $.ajax({
            url: `/stores/${uid}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function () {
                alert('수정 성공!');
                window.location.href = '/store/storelist';
            },
            error: function () {
                alert('수정 실패!');
            }
        });
    });

    // 삭제 요청
    $('#deleteBtn').click(function () {
        if (!confirm('정말 삭제하시겠습니까?')) return;

        $.ajax({
            url: `/stores/${uid}`,
            method: 'DELETE',
            success: function () {
                alert('삭제 성공!');
                window.location.href = '/store/storelist';
            },
            error: function () {
                alert('삭제 실패!');
            }
        });
    });
});
