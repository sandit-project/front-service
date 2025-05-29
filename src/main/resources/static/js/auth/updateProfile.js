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
            $('#phone').val(response.phone);
            $('#main_address_base').val(response.mainAddress);
            $('#sub1_address_base').val(response.subAddress1);
            $('#sub2_address_base').val(response.subAddress2);

            console.log(response);
            initUserUI(response);
            let type;
            if(response.type === "USER"){
                type = "user";
            }else{
                type = "social";
            }
            receiveAlarm(response.uid, type);
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
    checkToken();
    setupAjax();

    const uid = $('#hiddenUserUId').val();
    const userName = $('#user_name').val();
    const email = $('#email').val();
    const emailyn = $('#emailyn').val() === "on";
    const phone = $('#phone').val();
    const phoneyn = $('#phoneyn').val() === "on";
    const baseMainAddress   = $('#main_address_base').val().trim();
    const detailMainAddress = $('#main_address_detail').val().trim();
    const mainAddress   = detailMainAddress ? `${baseMainAddress} ${detailMainAddress}` : baseMainAddress;
    const baseSub1Address   = $('#sub1_address_base').val().trim();
    const detailSub1Address = $('#sub1_address_detail').val().trim();
    const subAddress1   = detailSub1Address ? `${baseSub1Address} ${detailSub1Address}` : baseSub1Address;
    const baseSub2Address   = $('#sub2_address_base').val().trim();
    const detailSub2Address = $('#sub2_address_detail').val().trim();
    const subAddress2   = detailSub2Address ? `${baseSub2Address} ${detailSub2Address}` : baseSub2Address;

    if (!userName || !mainAddress) {
        Swal.fire({
            icon: 'warning',
            title: '입력 누락',
            text: '필수 입력 항목을 모두 채워주세요.',
            confirmButtonColor: '#f97316'
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
        emailyn : emailyn? "y" : "n" ,
        phone : phone,
        phoneyn : phoneyn? "y" : "n" ,
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


