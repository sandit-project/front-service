$(document).ready(function () {
    checkToken();
    setupAjax();

    getUserInfo().then((userInfo) => {
        initUserUI(userInfo);
    });

    const params = new URLSearchParams(window.location.search);
    const storeUid = params.get("storeUid");

    // 지점 상세 조회
    $.ajax({
        url: `/stores/${storeUid}`,
        method: 'GET',
        success: function (data) {
            console.log('지점 상세 조회 :',data);
            $('#store_uid').val(data.storeUid);
            $('#store_name').val(data.storeName);
            $('#store_manager').val(data.userUid)
            $('#address').val(data.storeAddress);
            $('#postcode').val(data.storePostcode);
            $('#store_latitude').val(data.storeLatitude);
            $('#store_longitude').val(data.storeLongitude);
            $('#status').val(data.storeStatus)
        },
        error: function () {
            Swal.fire({
                icon: 'error',
                title: '지점 정보 오류',
                text: '지점 정보를 불러오는데 실패했습니다.',
                confirmButtonColor: '#f97316'
            });
        }
    });



    // 수정 요청
    $('#storeDetailForm').submit(function (e) {
        e.preventDefault();

        const formData = {
            storeName: $('#store_name').val(),
            userUid: $('#store_manager').val(),
            storeAddress: $('#address').val(),
            storePostcode: $('#postcode').val(),
            storeLatitude : $('#store_latitude').val(),
            storeLongitude : $('#store_longitude').val(),
            storeStatus: $('#status').val()
        };

        $.ajax({
            url: `/stores/${storeUid}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function () {
                Swal.fire({
                    icon: 'success',
                    title: '수정 완료',
                    text: '지점 정보가 수정되었습니다.',
                    confirmButtonColor: '#f97316'
                }).then(() => {
                    window.location.href = '/store/list';
                });
            },
            error: function () {
                Swal.fire({
                    icon: 'error',
                    title: '수정 실패',
                    text: '지점 정보 수정 중 오류가 발생했습니다.',
                    confirmButtonColor: '#f97316'
                });
            }
        });
    });

    // 삭제 요청
    $('#deleteBtn').click(function () {
        Swal.fire({
            icon: 'warning',
            title: '정말 삭제하시겠습니까?',
            text: '삭제된 지점은 복구할 수 없습니다.',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6'
        }).then((result) => {
            if (result.isConfirmed) {

                $.ajax({
                    url: `/stores/${storeUid}`,
                    method: 'DELETE',
                    success: function () {
                        Swal.fire({
                            icon: 'success',
                            title: '삭제 완료',
                            text: '지점이 삭제되었습니다.',
                            confirmButtonColor: '#f97316'
                        }).then(() => {
                            window.location.href = '/store/list';
                        });
                    },
                    error: function () {
                        Swal.fire({
                            icon: 'error',
                            title: '삭제 실패',
                            text: '지점 삭제 중 오류가 발생했습니다.',
                            confirmButtonColor: '#f97316'
                        });
                    }
                });
            }
        });
    });

    // 이전 화면
    $('#prevBtn').click(()=> {

        window.location.href = '/store/list';

    });
});
