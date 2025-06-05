$(document).ready(async () => {

    const profile = await requestProfileApi();
    const convertType = profile.type === "USER" ? "user":"social";

    const allergyList = await fetchUserAllergies(convertType, profile.uid);
    if(allergyList){
        allergyList.forEach((allergy) => {
            const selector = `input[type="checkbox"][name="allergy"][value="${allergy}"]`;
            const checkbox = document.querySelector(selector);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    }

    const existCoordinate = {
        mainLat : profile.mainLat,
        mainLan : profile.mainLan,
        subLat1 : profile.sub1Lat,
        subLan1 : profile.sub1Lan,
        subLat2 : profile.sub2Lat,
        subLan2 : profile.sub2Lan
    }

    $('#updateProfileBtn').on("click",()=>{
        requestProfileUpdate(existCoordinate);
    });

    $('#toggle-allergy').on('click', function () {
        const $other = $('#other-allergy-options');

        if ($other.hasClass('open')) {
            $other.removeClass('open');
            $(this).text('기타 알레르기'); // ← 닫힐 예정이므로 텍스트 미리 설정
            setTimeout(() => $other.css('display', 'none'), 10);
        } else {
            $other.css('display', 'flex'); // 보여주는 동시에 flex로 설정
            $(this).text('접기'); // ← 열릴 예정이므로 텍스트 미리 설정
            setTimeout(() => $other.addClass('open'), 10);
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
});

let requestProfileApi = () => {
    checkToken();
    setupAjax();

    return $.ajax({
        type: 'GET',
        url: '/profile',
        success: (response) => {
            $('#welcome-message').text(response.userName + '님 환영합니다!');
            $('#hiddenUserUId').val(response.uid);
            $('#user_name').val(response.userName);
            $('#email').val(response.email);
            document.getElementById("emailyn").checked = response.emailyn === "Y" ? true : false;
            $('#phone').val(response.phone);
            document.getElementById("phoneyn").checked = response.phoneyn === "Y" ? true : false;
            const mainAddressArr = response.mainAddress == null ? "" : response.mainAddress.split("/");
            const sub1AddressArr = response.subAddress1 == null ? "" : response.subAddress1.split("/");
            const sub2AddressArr = response.subAddress2 == null ? "" : response.subAddress2.split("/");
            $('#main_address_base').val(mainAddressArr[0]);
            $('#main_address_detail').val(mainAddressArr[1]);
            $('#sub1_address_base').val(sub1AddressArr[0]);
            $('#sub1_address_detail').val(sub1AddressArr[1]);
            $('#sub2_address_base').val(sub2AddressArr[0]);
            $('#sub2_address_detail').val(sub2AddressArr[1]);

            console.log(response);
            initUserUI(response);
        },
        error : (error) => {
            console.error('profile in error :: ',error);
            Swal.fire({
                icon: 'error',
                title: '프로필 요청 실패',
                text: '프로필 요청 중 오류가 발생했습니다.',
                confirmButtonColor: '#f97316'
            });
            if(error.status === 401){
                // 토큰 만료 에러 메세지에 따라 refreshToken 보냄
                handleTokenExpiration();
            }
        }
    });
}

let requestProfileUpdate = (existCoordinate) => {
    //const btn = $(document).prop('disabled', true);

    checkToken();
    setupAjax();

    const uid = $('#hiddenUserUId').val();
    const userName = $('#user_name').val().trim();
    const email = $('#email').val().trim();
    const emailyn = $('#emailyn').val() === "on";
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
    const phoneyn = $('#phoneyn').val() === "on";
    const baseMainAddress   = $('#main_address_base').val().trim();
    const detailMainAddress = $('#main_address_detail').val().trim();
    const mainAddress   = detailMainAddress ? `${baseMainAddress}/${detailMainAddress}` : baseMainAddress;
    const baseSub1Address   = $('#sub1_address_base').val().trim();
    const detailSub1Address = $('#sub1_address_detail').val().trim();
    const subAddress1   = detailSub1Address ? `${baseSub1Address}/${detailSub1Address}` : baseSub1Address;
    const baseSub2Address   = $('#sub2_address_base').val().trim();
    const detailSub2Address = $('#sub2_address_detail').val().trim();
    const subAddress2   = detailSub2Address ? `${baseSub2Address}/${detailSub2Address}` : baseSub2Address;

    if (!userName || !mainAddress) {
        Swal.fire({
            icon: 'warning',
            title: '필수 항목 미입력',
            text: '이름, 현재 주소를 입력해주세요.',
            confirmButtonColor: '#f97316'
        }).then(() => {
            btn.prop('disabled', false);
        });
        return;
    }

    const coordinates = checkModifyCoordinate(existCoordinate);
    const allergies = [];
    $('input[name="allergy"]:checked').each(function() {
        allergies.push($(this).val());
    });

    let updateProfileData = {
        uid : uid,
        userName : userName,
        email : email,
        emailyn : emailyn? "Y" : "N" ,
        phone : phone,
        phoneyn : phoneyn? "Y" : "N" ,
        mainAddress : mainAddress,
        subAddress1 : subAddress1,
        subAddress2 : subAddress2,
        mainLat : coordinates.mainLat,
        mainLan : coordinates.mainLan,
        subLat1 : coordinates.subLat1,
        subLan1 : coordinates.subLan1,
        subLat2 : coordinates.subLat2,
        subLan2 : coordinates.subLan2,
        allergies : allergies
    }
    console.log(updateProfileData);
    $.ajax({
        type : 'PUT',
        url : '/profile',
        data : JSON.stringify(updateProfileData),
        contentType : 'application/json; charset=utf-8',
        dataType : 'json',
        success : () => {
            Swal.fire({
                icon: 'success',
                title: '수정 완료',
                text: '회원 정보가 성공적으로 수정되었습니다.',
                confirmButtonColor: '#f97316'
            }).then(() => {
                window.location.href = '/member/profile';
            });
        },
        error : (error) => {
            console.error('update error :: ',error);
            Swal.fire({
                icon: 'error',
                title: '수정 실패',
                text: '회원 정보 수정 중 오류가 발생했습니다.',
                confirmButtonColor: '#f97316'
            });
        }
    });
}

let checkModifyCoordinate = (existCoordinate) => {
    const safeParse = (val) => {
        const parsed = parseFloat(val);
        return isNaN(parsed) ? 0 : parsed;
    };

    const mainLat = safeParse($('#main_latitude').val());
    const mainLan = safeParse($('#main_longitude').val());
    const sub1Lat = safeParse($('#sub1_latitude').val());
    const sub1Lan = safeParse($('#sub1_longitude').val());
    const sub2Lat = safeParse($('#sub2_latitude').val());
    const sub2Lan = safeParse($('#sub2_longitude').val());

    const coordinate = {
        mainLat: (mainLat && mainLat !== existCoordinate.mainLat) ? mainLat : existCoordinate.mainLat,
        mainLan: (mainLan && mainLan !== existCoordinate.mainLan) ? mainLan : existCoordinate.mainLan,
        subLat1: (sub1Lat && sub1Lat !== existCoordinate.subLat1) ? sub1Lat : existCoordinate.subLat1,
        subLan1: (sub1Lan && sub1Lan !== existCoordinate.subLan1) ? sub1Lan : existCoordinate.subLan1,
        subLat2: (sub2Lat && sub2Lat !== existCoordinate.subLat2) ? sub2Lat : existCoordinate.subLat2,
        subLan2: (sub2Lan && sub2Lan !== existCoordinate.subLan2) ? sub2Lan : existCoordinate.subLan2,
    };

    console.log("기존 좌표:", existCoordinate);
    console.log("최종 좌표:", coordinate);

    return coordinate;
}


