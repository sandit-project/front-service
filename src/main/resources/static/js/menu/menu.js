$(document).ready(()=>{
    checkToken();
    setupAjax();
    getUserInfo().then((userInfo)=>{
        initUserUI(userInfo);

        $('#welcome-message').text(userInfo.userName + '님 환영합니다!');
        $('#hiddenUserName').val(userInfo.userName);
        $('#hiddenUserId').val(userInfo.userId);
    }).catch((error)=>{
        console.error('board list user info error : ',error);
    });

    $('#logoutBtn').on("click",()=>{
        logout();
    });

    $('#deleteBtn').on("click",()=>{
        deleteAccount();
    });

    $('#profileBtn').on("click",()=>{
        requestProfile();
    });
});

let logout = () => {
    setupAjax();
    $.ajax({
        type: 'POST',
        url: '/logout',
        success: ()=>{
            Swal.fire({
                icon: 'success',
                title: '로그아웃 완료',
                text: '로그아웃이 성공했습니다.',
                confirmButtonColor: '#f97316'
            }).then(() => {
                localStorage.removeItem('accessToken');
                window.location.href = '/member/login';
            });
        },
        error: (error)=>{
            console.log('오류 발생 : ',error);
            Swal.fire({
                icon: 'error',
                title: '로그아웃 실패',
                text: '로그아웃 중 오류가 발생했습니다.',
                confirmButtonColor: '#f97316'
            });
        }
    });
}

let deleteAccount = () => {
    setupAjax();
    $.ajax({
        type: 'DELETE',
        url: '/user',
        success: ()=>{
            Swal.fire({
                icon: 'success',
                title: '탈퇴 완료',
                text: '회원 탈퇴가 성공했습니다.',
                confirmButtonColor: '#f97316'
            }).then(() => {
                localStorage.removeItem('accessToken');
                window.location.href = '/member/login';
            });
        },
        error: (error)=>{
            console.log('오류 발생 : ',error);
            Swal.fire({
                icon: 'error',
                title: '탈퇴 실패',
                text: '회원 탈퇴 중 오류가 발생했습니다.',
                confirmButtonColor: '#f97316'
            });
        }
    });
}

let requestProfile = () => {
    setupAjax();
    $.ajax({
        type: 'GET',
        url: '/member/profile',
        success: ()=>{
            Swal.fire({
                icon: 'success',
                title: '정보 로드 성공',
                text: '회원 정보 로드에 성공했습니다.',
                confirmButtonColor: '#f97316'
            });
        },
        error: (error)=>{
            console.log('오류 발생 : ',error);
            Swal.fire({
                icon: 'error',
                title: '정보 로드 실패',
                text: '회원 정보 로드 중 오류가 발생했습니다.',
                confirmButtonColor: '#f97316'
            });
        }
    });
}