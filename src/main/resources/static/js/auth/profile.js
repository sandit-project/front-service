let userInfo;

$(document).ready(()=>{
    checkToken();
    setupAjax();
    requestProfileApi();

    $('#updateProfileBtn').on("click",() => {
        requestUpdateProfile();
    });
});

let requestProfileApi = () => {
    checkToken();
    setupAjax();

    $.ajax({
        type: 'GET',
        url: '/profile',
        success: (response) => {
            userInfo = response;
            $('#welcome-message').text(response.userName + '님 환영합니다!');
            $('#hiddenUserName').val(response.userName);
            $('#hiddenUserId').val(response.userId);
            $('#hiddenUserRole').val(response.role);
            $('#user_name').text(response.userName);
            $('#user_email').text(response.email);
            $('#user_phone').text(response.phone);
            $('#created_date').text(response.createdDate);
            $('#user_point').text(response.point);
            $('#user_type').text(response.type);
            $('#main_address').text(response.mainAddress);
            $('#sub_address1').text(response.subAddress1);
            $('#sub_address2').text(response.subAddress2);

            console.log(response);
        },
        error : (error) => {
            console.error('profile in error :: ',error);
            alert('프로필 요청 중 오류가 발생했습니다.');
            if(error.status === 401){
                // 토큰 만료 에러 메세지에 따라 refreshToken 보냄
                handleTokenExpiration();
            }
        }
    });
}

let requestUpdateProfile = () => {
    setupAjax();
    $.ajax({
        type: 'GET',
        url: '/member/profile/update',
        success: ()=>{
            window.location.href = "/member/profile/update"
        },
        error: (error)=>{
            console.log('오류 발생 : ',error);
        }
    });
}



// 회원 탈퇴 버튼 (동적 요소 대응)
$(document).on("click", "#deleteBtn", () => {
    Swal.fire({
        title: '정말 탈퇴하시겠습니까?',
        text: '탈퇴하면 계정 정보가 모두 삭제됩니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: '네, 탈퇴할게요',
        cancelButtonText: '취소'
    }).then((result) => {
        if (result.isConfirmed) {
            deleteAccount();
        }
    });
});

function deleteAccount() {
    setupAjax();
    $.ajax({
        type: 'DELETE',
        url: '/user',
        success: () => {
            Swal.fire({
                icon: 'success',
                title: '탈퇴 완료',
                text: '회원 탈퇴가 성공적으로 처리되었습니다.',
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
                text: '회원 탈퇴 중 오류가 발생했습니다.'
            });
        }
    });
}
