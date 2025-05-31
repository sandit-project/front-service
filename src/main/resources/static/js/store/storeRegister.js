$(document).ready(() => {
    checkToken();
    setupAjax();

    // 두 API를 비동기로 받아옴(Promise.all활용)

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
    ]).then(([managers,managerMappings])=>{
        // userUid -> storeName 맵 생성
        const mappingMap = {};
        managerMappings.forEach(mapping => {
            mappingMap[mapping.userUid] = mapping.storeName;
        });

        const $select = $('#manager');
        $select.empty();
        $select.append('<option value="">지점 관리자를 선택하세요</option>');

        managers.forEach(manager => {
            let text = `${manager.userId}(${manager.userName}`;
            if (mappingMap[manager.userUid]) {
                text +=`::${mappingMap[manager.userUid]}`;
            }
            text += ')';
            $select.append(
                $('<option>')
                    .val(manager.userUid)
                    .text(text)
            );
        });
    }).catch(()=>{
        Swal.fire({
            icon: 'error',
            title: '관리자 목록 불러오기 실패',
            text: '지점 관리자 목록을 불러오지 못했습니다.',
            confirmButtonColor: '#f97316'
        });
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

    function checkStoreCreated(storeUid){
        polling(
            // 1. 요청 함수(Promise 반환)
            ()=>{
                return $.ajax({
                    url: `/stores/${storeUid}`,
                    method: "GET"
                })
                    .then(data=>({success:true, data}))
                    .catch(()=>({success:false}));
            },
            // 2. 성공 시 실행 함수
            (result)=>{
                console.log(result);
                Swal.fire({
                    icon: 'success',
                    title: '저장 완료!',
                    text: '지점이 실제로 저장되었습니다.',
                    confirmButtonColor: '#f97316'
                }).then(() => {
                    window.location.href = '/store/list';
                });
            },
            // 3. 옵션
            {interval: 2000, maxTry: 10}
        );
    }

    // 지점 등록 버튼 클릭 이벤트
    $('#storeRegister').click(async (event) => {
        event.preventDefault(); // 기본 동작 막기

        const button = $(event.target);
        button.prop('disabled', true); // 버튼 비활성화


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

        button.prop('disabled', false); // 버튼 활성화
    });


    // 서버 데이터 전송 함수
    const sendDataToServer = (formData) => {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: '/stores',
                data: JSON.stringify(formData),
                contentType: 'application/json; charset=utf-8',//요청바디는 JSON
                dataType: 'json',                              // 응답도 JSON으로 기대
                success: function (res) {
                    console.log('등록 성공:', res);
                    Swal.fire({
                        icon: 'success',
                        title: '지점 가입 요청 성공',
                        text: '지점 가입 요청이 정상적으로 접수되었습니다.\n(실제 저장은 잠시 후 반영됩니다)',
                        confirmButtonColor: '#f97316'
                    }).then(() => {
                        window.location.href = '/store/list';
                    });
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error('AJAX 에러:', textStatus, errorThrown);
                    Swal.fire({
                        icon: 'error',
                        title: '지점 가입 요청 실패',
                        text: '지점 가입 요청 처리 중 문제가 발생했습니다. 다시 시도해주세요.',
                        confirmButtonColor: '#f97316'
                    });
                }
            });
        });
    };

    // 이전 화면
    $('#prevBtn').click(()=> {

        window.location.href = '/store/list';

    });
});