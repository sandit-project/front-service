$(document).ready(()=>{

    $('#signup').on('click',()=>{

        let userId = $('#user_id').val();
        let password = $('#password').val();
        let userName = $('#user_name').val();
        let role = $('#role').val();

        let signUpData = {
            userId : userId,
            password : password,
            userName : userName,
            role : role
        }

        $.ajax({
           type : 'POST',
           url : '/join',
           data : JSON.stringify(signUpData),
           contentType : 'application/json; charset=utf-8',
           dataType : 'json',
           success : (response) => {
                alert('회원가입이 성공했습니다.\n로그인 해주세요.');
                if(response.successed){
                    window.location.href = '/member/login';
                }
           },
            error : (error) => {
                console.error('signup error :: ',error);
                alert('회원가입 중 오류가 발생했습니다.');
            }
        });
    });

});