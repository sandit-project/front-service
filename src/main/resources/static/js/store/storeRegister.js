$(document).ready(() => {
    checkToken();
    setupAjax();

    // 관리자(ROLEE_MANAGER) 목록을 불러와서 드롭다운에 채우기
    $.ajax({
        type: "GET",
        url: "/user/managers",
        dataType: "json",
        success: function (managers) {
            console.log("managers : ",managers);
            const $select = $('#manager');
            $select.empty();
            $select.append('<option value="">지점 관리자를 선택하세요</option>');
            // 배열이 [{userUid: 1, userId: "...", userName: "..."}] 구조여야 함
            managers.forEach(manager => {
                $select.append(
                    $('<option>')
                        .val(manager.userUid) // 실제 등록은 uid로!
                        .text(manager.userId+'('+manager.userName+')')
                );
            });

        },
        error: function () {
            Swal.fire({
                icon: 'error',
                title: '관리자 목록 불러오기 실패',
                text: '지점 관리자 목록을 불러오지 못했습니다.',
                confirmButtonColor: '#f97316'
            });
        }
    });

    getUserInfo().then((userInfo) => {
        initUserUI(userInfo);
    });

    // 매니저 선택 시 이미 등록된 관리자 여부 확인
    $('#manager').change(function () {
        const selectedManagerUid = $(this).val();

        if (!selectedManagerUid) return; // 기본 선택일 경우 무시

        $.ajax({
            type: 'GET',
            url: `/stores/check-manager?userUid=${selectedManagerUid}`,
            dataType: 'json',
            success: function(response) {
                if (response.assigned) {
                    Swal.fire({
                        icon: 'warning',
                        title: '이미 등록된 관리자',
                        text: '해당 관리자는 이미 다른 지점에 등록되어 있습니다.',
                        confirmButtonColor: '#f97316'
                    });

                    // 선택을 초기화
                    $('#manager').val('');
                }
            },
            error: function(xhr) {
                console.error('매니저 등록 확인 오류:', xhr);
            }
        });
    });



    // 지점 등록 버튼 클릭 이벤트
    $('#storeRegister').click(async (event) => {
        event.preventDefault(); // 기본 동작 막기

        const button = $(event.target);
        button.prop('disabled', true); // 버튼 비활성화

        try {
            // 입력 데이터 수집
            const storeName = $('#store_name').val();
            const storeManagerUid = $('#manager').val();
            const address = $('#store_address_base').val();
            const addressDetail = $('#store_address_detail').val();
            const fullAddress = addressDetail? `${address} ${addressDetail}` : address ;
            const postcode = $('#store_postcode').val();
            const storeLatitude = $('#store_latitude').val();
            const storeLongitude = $('#store_longitude').val();
            const status = 'ACTIVE';

            if (!storeName || !address || !postcode) {
                Swal.fire({
                    icon: 'warning',
                    title: '입력 누락',
                    text: '모든 항목을 입력해주세요.',
                    confirmButtonColor: '#f97316'
                });
                return;
            }

            // 서버로 전송할 데이터 생성
            const formData = {
                storeName,
                userUid: storeManagerUid,
                storeAddress: fullAddress,
                storePostcode: postcode,
                storeLatitude: storeLatitude,
                storeLongitude: storeLongitude,
                storeStatus: status,
            };

            console.log('전송 데이터: ', formData);

            // 서버로 데이터 전송
            await sendDataToServer(formData);

            Swal.fire({
                icon: 'success',
                title: '등록 완료',
                text: '지점 등록이 성공적으로 완료되었습니다.',
                confirmButtonColor: '#f97316'
            }).then(() => {
                window.location.href = '/store/list';
            });
        } catch (error) {
            console.error('오류 발생: ', error);
            Swal.fire({
                icon: 'error',
                title: '오류 발생',
                text: '처리 중 문제가 발생했습니다. 다시 시도해주세요.',
                confirmButtonColor: '#f97316'
            });
        } finally {
            button.prop('disabled', false); // 버튼 활성화
        }
    });


    // 서버 데이터 전송 함수
    const sendDataToServer = async (formData) => {
        return $.ajax({
            type: 'POST',
            url: '/stores',
            data: JSON.stringify(formData),
            contentType: 'application/json; charset=utf-8',//요청바디는 JSON
            dataType: 'json',                              // 응답도 JSON으로 기대
            success: function(res) {
                console.log('등록 성공:', res);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('AJAX 에러:', textStatus, errorThrown);
            }
        });
    };

    // 이전 화면
    $('#prevBtn').click(()=> {

        window.location.href = '/store/list';

    });
});