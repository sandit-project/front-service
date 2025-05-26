$(document).ready(function () {
    checkToken();
    setupAjax();

    getUserInfo().then((userInfo) => {
        if (userInfo) {
            initUserUI(userInfo); // 로그인한 사용자용 헤더
        } else {
            renderGuestUI(); // 비회원용 헤더
        }
    });

    const sideName = window.location.pathname.split('/').pop(); // URL에서 메뉴 이름 추출

    // 메뉴 상세 정보 Ajax 호출
    $.ajax({
        type: "GET",
        url: `/menus/sides/${sideName}`,
        success: function (data) {
            // 타이틀 및 상세 정보 업데이트
            $("#pageTitle").text("메뉴 상세 - " + data.sideName);
            $("#menuTitle").text(data.sideName);
            $("#menuImage").attr("src", data.img);
            $("#menuPrice").text(data.price);
            $("#menuCalorie").text(data.calorie);
        },
        error: function (xhr) {
            Swal.fire({
                icon: 'error',
                title: '로딩 실패',
                text: '메뉴 정보를 불러오는 데 오류가 발생했습니다.',
                confirmButtonColor: '#f97316'
            });
        }
    });
});
