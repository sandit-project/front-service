$(document).ready(()=>{
    checkToken();
    setupAjax();
    getUserInfo().then((userInfo)=>{
        $('#welcome-message').text(userInfo.userName + '님 환영합니다!');
        $('#hiddenUserName').val(userInfo.userName);
        $('#hiddenUserId').val(userInfo.userId);
    }).catch((error)=>{
        console.error('board list user info error : ',error);
    });

    $('#logoutBtn').on("click",()=>{
        logout();
    });
});

let logout = () => {
    $.ajax({
        type: 'POST',
        url: '/login',
        data: JSON.stringify(signInData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: (response) => {
            alert('로그인이 성공했습니다.');
            localStorage.setItem('accessToken',response.accessToken);
            window.location.href = '/';
        },
        error : (error) => {
            console.error('log in error :: ',error);
            alert('로그인 중 오류가 발생했습니다.');
        }
    });
}