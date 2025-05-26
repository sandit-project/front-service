$(document).ready(()=>{

    renderGuestUI();

    $('.dropdown-admin, .dropdown-manager, .dropdown-delivery').hide();

    $('#signin').on('click',()=>{

        let userId = $('#user_id').val();
        let password = $('#password').val();

        let signInData = {
            userId : userId,
            password : password
        }

        $.ajax({
           type: 'POST',
           url: '/login',
           data: JSON.stringify(signInData),
           contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: (response) => {
                Swal.fire({
                    icon: 'success',
                    title: '로그인 성공',
                    text: '환영합니다!',
                    confirmButtonColor: '#f97316'
                }).then(() => {
                    localStorage.setItem('accessToken', response.accessToken);
                    initUserUI(response);
                    window.location.href = '/';
                });
            },
            error : (error) => {
                console.error('log in error :: ',error);
                Swal.fire({
                    icon: 'error',
                    title: '로그인 실패',
                    text: '아이디 또는 비밀번호를 확인해주세요.',
                    confirmButtonColor: '#f97316'
                });
            }
        });
    });

});