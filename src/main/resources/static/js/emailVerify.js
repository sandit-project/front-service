let timerInterval;
let emailSent     = false;
let emailVerified = false;

$(document).ready(() => {

    function formatTime(sec) {
        const m = String(Math.floor(sec / 60)).padStart(2, '0');
        const s = String(sec % 60).padStart(2, '0');
        return `${m}:${s}`;
    }

    function startTimer() {
        let timeLeft = 180;
        $('#timer').text(formatTime(timeLeft));
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                $('#timer').text('만료');
                $('#email-verify').prop('disabled', true);
            } else {
                $('#timer').text(formatTime(timeLeft));
            }
        }, 1000);
    }

    //이메일 입력값이 바뀌면 인증 버튼 다시 활성화/비활성화
    function updateEmailButtonState() {
        const email = $('#email').val();
        const isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
        if (!isValid || emailVerified) {
            $('#email-submit').prop('disabled', true);
        } else {
            $('#email-submit').prop('disabled', false);
        }
    }

    $('#email').on('input', function() {
        emailSent = false;
        emailVerified = false;
        $('#email-submit').prop('disabled', false);
        $('#email_code').val('');
        $('#email-code-group').hide();
    });

    // 1) 코드 전송
    $('#email-submit').on('click', async () => {
        if (emailSent) return;
        const rawEmail = $('#email').val().trim();
        if (!rawEmail) {
            return Swal.fire({
                icon: 'warning',
                title: '입력 필요',
                text: '이메일을 입력해주세요.',
                confirmButtonColor: '#f97316'
            });
        }
        const email = encodeURIComponent(rawEmail);

        try {
            await $.ajax({
                type: 'GET',
                url: `/auths/email/${email}/authcode`,
                dataType: 'text'
            });
            Swal.fire({
                icon: 'success',
                title: '코드 발송 완료',
                text: '인증 코드가 발송되었습니다!',
                confirmButtonColor: '#f97316'
            });
            $('#email-code-group').show();
            emailSent = true;
            startTimer();
        } catch (err) {
            if (err.status === 400) {
                Swal.fire({
                    icon: 'error',
                    title: '이메일 중복',
                    text: '이미 사용중인 이메일입니다.',
                    confirmButtonColor: '#f97316'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '인증 코드 발송 실패',
                    text: '인증 코드 발송이 실패했습니다.',
                    confirmButtonColor: '#f97316'
                });
            }
        }
    });

    // 2) 코드 검증
    $('#email-verify').on('click', async () => {
        if (emailVerified) return;
        const rawEmail = $('#email').val().trim();
        if (!rawEmail) {
            return Swal.fire({
                icon: 'warning',
                title: '입력 필요',
                text: '이메일을 입력해주세요.',
                confirmButtonColor: '#f97316'
            });
        }
        const email = encodeURIComponent(rawEmail);

        const code = $('#email_code').val().trim();
        if (!code) {return Swal.fire({
            icon: 'warning',
            title: '인증 코드 입력 필요',
            text: '인증 코드를 입력해주세요.',
            confirmButtonColor: '#f97316'
        })};

        try {
            const token = await $.ajax({
                type: 'POST',
                url: `/auths/email/${email}/authcode`,
                data: JSON.stringify({ email: rawEmail, code }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'text'
            });

            console.log('검증 토큰:', token);
            // 토큰 문자열이 비어있지 않으면 성공
            if (token && token.length > 0) {
                clearInterval(timerInterval);
                Swal.fire({
                    icon: 'success',
                    title: '인증 완료',
                    text: '이메일 인증이 완료되었습니다.',
                    confirmButtonColor: '#f97316'
                });
                emailVerified = true;

                $('#email, #email-submit, #email_code, #email-verify').prop('disabled', true);
                //updateEmailButtonState();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '인증 실패',
                    text: '인증 코드가 올바르지 않습니다.',
                    confirmButtonColor: '#f97316'
                });
            }
        } catch (err) {
            if (err.status === 404) {
                Swal.fire({
                    icon: 'error',
                    title: '인증 실패',
                    text: '인증 코드가 올바르지 않습니다.',
                    confirmButtonColor: '#f97316'
                });
            } else {
                console.error('검증 오류:', err.status, err.responseText);
                Swal.fire({
                    icon: 'error',
                    title: '검증 중 오류 발생',
                    text: '검증 중 오류가 발생했습니다.',
                    confirmButtonColor: '#f97316'
                });
            }
        }
    });

    // 페이지 로딩 시 초기 상태 적용
    updateEmailButtonState();
});

