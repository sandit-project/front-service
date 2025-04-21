$(document).ready(() => {
    requestProfileApi();

    $('#updateProfileBtn').on("click",()=>{
        requestProfileUpdate();
    });
});

let requestProfileApi = () => {
    checkToken();
    setupAjax();

    $.ajax({
        type: 'GET',
        url: '/profile',
        success: (response) => {
            $('#welcome-message').text(response.userName + '님 환영합니다!');
            $('#user_name').val(response.userName);
            $('#user_email').val(response.email);
            $('#user_phone').val(response.phone);
            $('#main_address').val(response.mainAddress);
            $('#sub_address1').val(response.subAddress1);
            $('#sub_address2').val(response.subAddress2);

            alert('프로필 요청이 성공했습니다.');
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

let requestProfileUpdate = () => {
    setupAjax();

    let userName = $('#user_name').val();
    let userEmail = $('#user_email').val();
    let userEmailyn = $('#user_emailyn').val() === "on";
    let userPhone = $('#user_phone').val();
    let userPhoneyn = $('#user_phoneyn').val() === "on";
    let mainAddress = $('#main_address').val();
    let subAddress1 = $('#sub_address1').val();
    let subAddress2 = $('#sub_address2').val();

    let updateProfileData = {
        userName : userName,
        email : userEmail,
        emailyn : userEmailyn? "y" : "n" ,
        phone : userPhone,
        phoneyn : userPhoneyn? "y" : "n" ,
        mainAddress : mainAddress,
        subAddress1 : subAddress1,
        subAddress2 : subAddress2
    }
    console.log(updateProfileData);
    $.ajax({
        type : 'PUT',
        url : '/profile',
        data : JSON.stringify(updateProfileData),
        contentType : 'application/json; charset=utf-8',
        dataType : 'json',
        success : () => {
            alert('회원 정보가 수정 되었습니다.');
            window.location.href = '/member/profile';
        },
        error : (error) => {
            console.error('update error :: ',error);
            alert('회원 정보가 수정 중 오류가 발생했습니다.');
        }
    });
}