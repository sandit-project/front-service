$(document).ready(()=>{
    checkToken();
    setupAjax();
    requestProfileApi();
});

let requestProfileApi = () => {
    setupAjax();

    $.ajax({
        type: 'GET',
        url: '/profile',
        success: (response) => {
            $('#welcome-message').text(response.userName + '님 환영합니다!');
            $('#hiddenUserName').val(response.userName);
            $('#hiddenUserId').val(response.userId);
            $('#hiddenUserRole').val(response.role);
            $('#name').text(response.userName);
            $('#email').text(response.email);
            $('#phone').text(response.phone);
            $('#createdDate').text(response.createdDate);
            $('#point').text(response.point);
            $('#type').text(response.type);
            $('#mainAddress').text(response.mainAddress);
            $('#subAddress1').text(response.subAddress1);
            $('#subAddress2').text(response.subAddress2);

            alert('프로필 요청이 성공했습니다.');
            console.log(response);
        },
        error : (error) => {
            console.error('profile in error :: ',error);
            alert('프로필 요청 중 오류가 발생했습니다.');
        }
    });
}