$(document).ready(async () => {
    // 로그아웃 처리
    $(document).on("click", "#logoutBtn", () => {
        Swal.fire({
            title: '로그아웃 하시겠습니까?',
            text: '로그아웃 후 다시 로그인해야 합니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '네, 로그아웃할게요',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
            }
        });
    });
});

// 로그인 UI 구성
function initUserUI(userInfo) {
    const rightMenu = $('.header-right').empty();
    rightMenu.append(`
        <a href="#" class="header-link" id="logoutBtn">로그아웃</a>
        <a href="/member/profile" class="header-link">프로필</a>
        <a href="/cart" class="header-link">장바구니</a>
    `);

    hideUnauthorizedNav(userInfo);
}

// 비로그인 UI 구성
function renderGuestUI() {
    const rightMenu = $('.header-right').empty();
    rightMenu.append(`
        <a href="/member/login" class="header-link">로그인</a>
        <a href="/member/join" class="header-link">회원가입</a>
        <a href="/cart" class="header-link">장바구니</a>
    `);
}

// 로그아웃 처리
function logout() {
    setupAjax();
    $.ajax({
        type: 'POST',
        url: '/logout',
        success: () => {
            Swal.fire({
                icon: 'success',
                title: '로그아웃 성공',
                text: '로그아웃이 완료되었습니다.',
                confirmButtonText: '확인'
            }).then(() => {
                localStorage.removeItem('accessToken');
                window.location.href = '/member/login';
            });
        },
        error: (error) => {
            console.log('오류 발생 : ', error);
            Swal.fire({
                icon: 'error',
                title: '오류 발생',
                text: '로그아웃 중 오류가 발생했습니다.'
            });
        }
    });
}

//권한에 따른 nav바 노출
function hideUnauthorizedNav(user) {
    const role = user.role;

    // 기본적으로 관리 섹션 전체 숨김
    $('.dropdown-admin, .dropdown-manager, .dropdown-delivery').hide();

    if (role === 'ROLE_ADMIN') {
        $('.dropdown-admin').show();
    } else if (role === 'ROLE_MANAGER') {
        $('.dropdown-manager').show();
    } else if (role === 'ROLE_DELIVERY') {
        $('.dropdown-delivery').show();
    }
}

