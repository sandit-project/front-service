$(document).ready(() => {

    // 최초 로딩 시 권한 값에 따라 알러지 체크박스 show/hide
    toggleAllergyGroup();

    $('#toggle-allergy').on('click', function () {
        const $other = $('#other-allergy-options');

        if ($other.hasClass('open')) {
            // 닫기: class 제거 -> 트랜지션(0.4s) 후 display:none
            $other.removeClass('open');
            $(this).text('기타 알레르기');
            setTimeout(() => {
                $other.css('display', 'hidden');
            }, 400); // CSS transition duration과 동일하게 맞춤
        } else {
            // 열기: display:flex 후 짧은 지연 뒤 class 추가
            $other.css('display', 'flex');
            $(this).text('접기');
            setTimeout(() => {
                $other.addClass('open');
            }, 10);
        }
    });

    // 권한 선택 변경 시마다 show/hide
    $('#role').on('change', function() {
        toggleAllergyGroup();
    });

    function toggleAllergyGroup() {
        const role = $('#role').val();
        if (role === 'ROLE_USER') {
            $('#allergy-group').css({
                'opacity': '1',
                'pointer-events': 'auto',
                'height': '',
                'padding': '',
            });
        } else {
            $('#allergy-group').css({
                'opacity': '0',
                'pointer-events': 'none',  // 클릭 막기
                'height': '',
                'padding': '',
            });
            $('input[name="allergy"]').prop('checked', false);
        }
    }



    $('#id_validation').on('click', async () => {
        const userId = $('#user_id').val().trim();
        if (!userId) {
            Swal.fire({
                icon: 'warning',
                title: '아이디 입력',
                text: '아이디를 입력해주세요.',
                confirmButtonColor: '#f97316'
            });
            return;
        }

        try {
            const res = await $.ajax({
                type: 'GET',
                url: `/check-id?userId=${encodeURIComponent(userId)}`,
                dataType: 'json'
            });

            if (res.exists) {
                Swal.fire({
                    icon: 'error',
                    title: '중복된 아이디',
                    text: '이미 사용중인 아이디입니다.',
                    confirmButtonColor: '#f97316'
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    title: '사용 가능',
                    text: '사용 가능한 아이디입니다.',
                    confirmButtonColor: '#f97316'
                });
            }
        } catch (err) {
            const msg = err.responseJSON?.message || '아이디 검증 중 오류가 발생했습니다.';
            Swal.fire({
                icon: 'error',
                title: '아이디 확인 실패',
                text: msg,
                confirmButtonColor: '#f97316'
            });
            console.error('아이디 중복 체크 오류:', err);
        }
    });

    // 전화번호 자동 하이픈 적용
    $('#phone').on('input', function() {
        this.value = autoHyphenPhone(this.value);
    });

    function autoHyphenPhone(str) {
        str = str.replace(/[^0-9]/g, '');

        if (str.startsWith('02')) {
            if (str.length < 3) return str;
            if (str.length < 6) return str.substr(0, 2) + '-' + str.substr(2);
            if (str.length < 10) return str.substr(0, 2) + '-' + str.substr(2, 3) + '-' + str.substr(5);
            return str.substr(0, 2) + '-' + str.substr(2, 4) + '-' + str.substr(6, 4);
        } else {
            if (str.length < 4) return str;
            if (str.length < 8) return str.substr(0, 3) + '-' + str.substr(3);
            if (str.length < 12) return str.substr(0, 3) + '-' + str.substr(3, 4) + '-' + str.substr(7);
            return str.substr(0, 3) + '-' + str.substr(3, 4) + '-' + str.substr(7, 4);
        }
    }

    $('#signup').on('click', async function(e) {
        e.preventDefault();
        const btn = $(this).prop('disabled', true);

        const userId     = $('#user_id').val().trim();
        const password   = $('#password').val().trim();
        const userName   = $('#user_name').val().trim();
        const email      = $('#email').val().trim();
        const emailAgree = $('#emailyn').is(':checked') ? 'Y' : 'N';
        const phoneAgree = $('#phoneyn').is(':checked') ? 'Y' : 'N';
        const phone      = $('#phone').val().trim();
        if (phone.length < 11) {
            Swal.fire({
                icon: 'warning',
                title: '전화번호 오류',
                text: '전화번호는 11자리 이상 입력해야 합니다.',
                confirmButtonColor: '#f97316'
            }).then(() => {
                btn.prop('disabled', false);
            });
            return;
        }
        const baseAddress   = $('#main_address_base').val().trim();
        const detailAddress = $('#main_address_detail').val().trim();
        const mainAddress   = detailAddress ? `${baseAddress} ${detailAddress}` : baseAddress;
        const role       = $('#role').val();
        const allergies = [];
        $('input[name="allergy"]:checked').each(function() {
            allergies.push($(this).val());
        });

        if (!userId || !password || !userName || !mainAddress) {
            Swal.fire({
                icon: 'warning',
                title: '필수 항목 미입력',
                text: '아이디, 비밀번호, 이름, 주소를 모두 입력해주세요.',
                confirmButtonColor: '#f97316'
            }).then(() => {
                btn.prop('disabled', false);
            });
            return;
        }

        const mainLat = parseFloat($('#main_latitude').val());
        const mainLan = parseFloat($('#main_longitude').val());
        if (isNaN(mainLat) || isNaN(mainLan)) {
            Swal.fire({
                icon: 'warning',
                title: '주소 미지정',
                text: '주소 찾기 후 회원가입해주세요.',
                confirmButtonColor: '#f97316'
            }).then(() => {
                btn.prop('disabled', false);
            });
            return;
        }

        const payload = {
            userId,
            password,
            userName,
            email,
            phone,
            mainAddress: mainAddress.trim(),
            role: role,
            mainLat: mainLat,
            mainLan: mainLan,
            phoneyn: phoneAgree,
            emailyn: emailAgree,
            allergies: allergies,
        };

        console.log('회원가입 payload:', payload);

        try {
            const res = await $.ajax({
                type: 'POST',
                url: '/join',
                data: JSON.stringify(payload),
                contentType: 'application/json; charset=UTF-8',
                dataType: 'json'
            });

            if (res.success) {
                Swal.fire({
                    icon: 'success',
                    title: '회원가입 완료',
                    text: '가입을 축하드립니다!',
                    confirmButtonColor: '#f97316'
                }).then(() => {
                    location.href = '/member/login';
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '가입 실패',
                    text: '회원가입에 실패했습니다.',
                    confirmButtonColor: '#f97316'
                });
            }
        } catch (err) {
            const msg = err.responseJSON?.message || '오류가 발생했습니다.';
            Swal.fire({
                icon: 'error',
                title: '오류 발생',
                text: msg,
                confirmButtonColor: '#f97316'
            });
            console.error('회원가입 오류:', err);
        } finally {
            btn.prop('disabled', false);
        }
    });
});
