$(document).ready(function () {
    checkToken();
    setupAjax();

    getUserInfo().then((userInfo) => {
        initUserUI(userInfo);
    });

    const params = new URLSearchParams(window.location.search);
    const storeUid = params.get("storeUid");

    // 매니저 목록과 매니저-지점 매핑 정보를 동시에 받아와야 함
    Promise.all([
        $.ajax({
            type: "GET",
            url: "/user/managers",
            dataType: "json"
        }),
        $.ajax({
            type: "GET",
            url: "/stores/manager-mapping",
            dataType: "json"
        })
    ]).then(([managers, managerMappings]) => {
        // userUid -> storeName 맵 생성
        const mappingMap = {};
        managerMappings.forEach(mapping => {
            mappingMap[mapping.userUid] = mapping.storeName;
        });

        const $select = $('#store_manager');
        $select.empty();
        $select.append('<option value="">지점 관리자를 선택하세요</option>');

        managers.forEach(manager => {
            let text = `${manager.userId}(${manager.userName}`;
            if (mappingMap[manager.userUid]) {
                text += `::${mappingMap[manager.userUid]}`;
            }
            text += ')';
            $select.append(
                $('<option>')
                    .val(manager.userUid)
                    .text(text)
            );
        });
        // 👉 그 후 지점 상세 조회 (옵션 추가 후!)
        loadStoreDetail(storeUid);
    }).catch(() => {
        Swal.fire({
            icon: 'error',
            title: '관리자 목록 불러오기 실패',
            text: '지점 관리자 목록을 불러오지 못했습니다.',
            confirmButtonColor: '#f97316'
        });
    });


    // 지점 상세 정보를 채우는 함수
    function loadStoreDetail(storeUid) {
        $.ajax({
            url: `/stores/${storeUid}`,
            method: 'GET',
            success: function (data) {
                console.log('지점 상세 조회 :', data);
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
    }

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
                    title: '지점 정보 수정 요청 성공',
                    text: '지점 정보 수정 요청이 정상적으로 접수되었습니다.\n(실제 반영까지 시간이 걸릴 수 있습니다)',
                    confirmButtonColor: '#f97316'
                }).then(() => {
                    window.location.href = '/store/list';
                });
            },
            error: function () {
                Swal.fire({
                    icon: 'error',
                    title: '지점 정보 수정 요청 실패',
                    text: '지점 정보 수정 요청 처리 중 문제가 발생했습니다. 다시 시도해주세요.',
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
                            title: '지점 삭제 요청 성공',
                            text: '지점 삭제 요청이 정상적으로 접수되었습니다.\n(실제 삭제까지 시간이 걸릴 수 있습니다)',
                            confirmButtonColor: '#f97316'
                        }).then(() => {
                            window.location.href = '/store/list';
                        });
                    },
                    error: function () {
                        Swal.fire({
                            icon: 'error',
                            title: '지점 삭제 요청 실패',
                            text: '지점 삭제 요청 처리 중 문제가 발생했습니다. 다시 시도해주세요.',
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
