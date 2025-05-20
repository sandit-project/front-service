let globalUserInfo;

$(document).ready(async function () {
    checkToken();
    setupAjax();
    // 1.유저 정보 가져오기
    getUserInfo().then(async (userInfo) => {
        window.globalUserInfo = userInfo;
        console.log('User Info:', userInfo);

        // 2.user/social 분기 : userUid or socialUid 구분해서 알러지 요청
        let allergyUrl = '';
        if (window.globalUserInfo.type === 'user') {
            allergyUrl = `/api/ai/users/${window.globalUserInfo.id}/allergies`;
        }else if (window.globalUserInfo.type === 'social') {
            allergyUrl = `/api/ai/socials/${window.globalUserInfo.id}/allergies`;
        } // 실제로 socials 엔드포인트는 백엔드에 추가

        // (fetch → $.ajax로 교체)
        const data = await $.ajax({
            url: allergyUrl,
            type: 'GET',
            dataType: 'json'
        });
        window.globalUserAllergies = data.allergy || [];

        // 폼 제출 시 addCustomCart 호출
        $('#menuForm').on('submit', async function (e) {
            e.preventDefault();

            // 필수값 유효성
            const required = ["bread", "material1", "vegetable1", "sauce1", "cheese"];
            if (!required.every(name => getSelectValue(name))) {
                $('#warningMessage').fadeIn();
                return;
            }
            $('#warningMessage').fadeOut();

            // 장바구니 폼 필드 리스트
            const fields = [
                "bread", "cheese",
                "material1", "material2", "material3",
                "vegetable1","vegetable2","vegetable3","vegetable4",
                "vegetable5","vegetable6","vegetable7","vegetable8",
                "sauce1","sauce2","sauce3"
            ];

            // 선택된 재료 텍스트만 추출
            const selectedTexts = [];
            //  fields: ["bread", ...] select name 리스트
            fields.forEach(name=>{
                const val = $(`select[name="${name}"]`).val();
                if (val) {
                    const txt = $(`select[name="${name}"] option[value="${val}"]`).text();
                    if (txt && !defaultExcludeTexts.includes(txt)) selectedTexts.push(txt);
                }
            });

            //  user/social UID 구분해서 body 구성
            let allergyReqBody ={
                ingredients: selectedTexts,
                allergy: globalUserAllergies
            };
            if (globalUserInfo.type === 'user') {
                allergyReqBody.user_uid = globalUserInfo.id;
            } else if (globalUserInfo.type === 'social') {
                allergyReqBody.social_uid = globalUserInfo.id;
            }

            // ① AI-서비스로 알러지 체크
            const res = await checkAllergyAPI(allergyReqBody);
            if (res.risk) {
                // ② 위험 시 경고 UI 표시 후 중단
                showAllergyWarning(res);
                return;
            }

            // ③ 이상 없으면 DTO 생성 후 저장
            const dto = Object.fromEntries(fields.map(n=>[n, getSelectValue(n)]));
            dto.price   = +$('input[name="price"]').val()   || 0;
            dto.calorie = +$('input[name="calorie"]').val() || 0;
            if (globalUserInfo.type === 'user')   dto.userUid   = globalUserInfo.id;
            else if (globalUserInfo.type === 'social') dto.socialUid = globalUserInfo.id;
            else { alert('로그인 후 이용해주세요.'); return; }

            // 장바구니 저장 함수
            await addCustomCart();
        });
        // 초기 로드
        $('select').on('change', calculatePriceAndCalories);
        loadIngredients();
        calculatePriceAndCalories();

    }).catch((error) => {
        alert('로그인 정보 확인에 실패했습니다.');
        location.href = '/login';
    });


    const defaultExcludeTexts = [
        "선택 안 함", "빵을 선택하세요", "소스를 선택하세요", "재료를 선택하세요", "채소를 선택하세요"
    ];

    const getSelectValue = name => $(`select[name="${name}"]`).val() || null;

    const calculatePriceAndCalories = () => {
        let totalPrice = 0;
        let totalCalorie = 0;
        let selectedItems = [];

        $('select').each(function () {
            const selected = $(this).find(':selected');
            const price = parseInt(selected.data('price')) || 0;
            const calorie = parseFloat(selected.data('calorie')) || 0;
            const text = selected.text();

            totalPrice += price;
            totalCalorie += calorie;

            if (text && !defaultExcludeTexts.includes(text)) {
                selectedItems.push(text);
            }
        });

        $('#totalPriceText').text(totalPrice);
        $('#totalCalorieText').text(totalCalorie.toFixed(1));
        $('#selectionText').text(selectedItems.length ? selectedItems.join(" / ") : "선택 항목이 없습니다.");

        $('input[name="price"]').val(totalPrice);
        $('input[name="calorie"]').val(totalCalorie.toFixed(1));
    };

    const loadIngredients = () => {
        const endpoints = {
            bread: { url: "/menus/ingredients/breads", nameField: "breadName" },
            cheese: { url: "/menus/ingredients/cheeses", nameField: "cheeseName" },
            material: { url: "/menus/ingredients/materials", nameField: "materialName" },
            vegetable: { url: "/menus/ingredients/vegetables", nameField: "vegetableName" },
            sauce: { url: "/menus/ingredients/sauces", nameField: "sauceName" }
        };

        Object.entries(endpoints).forEach(([type, { url, nameField }]) => {
            $.get(url, function (data) {
                $(`select[name^="${type}"]`).each(function () {
                    const select = $(this);
                    select.empty().append(`<option value="">선택 안 함</option>`);

                    data.forEach(item => {
                        select.append(
                            `<option value="${item.uid}" data-price="${item.price}" data-calorie="${item.calorie}">
                                ${item[nameField]}
                             </option>`
                        );
                    });
                });
            });
        });
    };



    const addCustomCart = async () => {
        // 필수 항목 체트
        const required = ["bread", "material1", "vegetable1", "sauce1", "cheese"];
        if (!required.every(name => getSelectValue(name))) {
            alert("모든 필수 항목을 선택해야 합니다.");
            return;
        }
        //DTO 생성
        const fields = [
            "bread", "cheese", "material1", "material2", "material3",
            "sauce1", "sauce2", "sauce3",
            "vegetable1", "vegetable2", "vegetable3", "vegetable4",
            "vegetable5", "vegetable6", "vegetable7", "vegetable8"
        ];

        const customCartDTO = Object.fromEntries(fields.map(name => [name, getSelectValue(name)]));

        customCartDTO.price = parseInt($('input[name="price"]').val()) || 0;
        customCartDTO.calorie = parseFloat($('input[name="calorie"]').val()) || 0;

        // 사용자 ID 세팅
        if (globalUserInfo?.type === 'user') {
            customCartDTO.userUid = globalUserInfo.id;
        } else if (globalUserInfo?.type === 'social') {
            customCartDTO.socialUid = globalUserInfo.id;
        } else {
            alert("로그인 후 이용해주세요.");
            return;
        }



        // 장바구니 저장
        $.ajax({
            url: '/menus/custom-carts',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(customCartDTO),
            success: (response) => {
                console.log("서버 응답:", response);

                customCartDTO.uid = response.uid;
                const localList = JSON.parse(localStorage.getItem('customSandwiches')) || [];
                localList.push(customCartDTO);
                localStorage.setItem('customSandwiches', JSON.stringify(localList));
                alert('저장 완료! 장바구니로 이동합니다.');
                location.href = '/cart';
            },
            error: xhr => {
                if (xhr.status === 400 && xhr.responseJSON) {
                    const errors = xhr.responseJSON;
                    let msg = "입력 오류:\n";
                    for (const [field, message] of Object.entries(errors)) {
                        msg += `- ${field}: ${message}\n`;
                    }
                    alert(msg);
                } else {
                    alert('저장에 실패했습니다. 다시 시도해 주세요.');
                }
            }
        });
    };

    // // ① 로그인 후 globalUserInfo.id 가 있으면 호출
    // if (globalUserInfo?.id) {
    //     const res = await fetch('http://localhost:9000/api/ai/users/' + globalUserInfo.id + '/allergies');
    //     if (res.ok) {
    //         const data = await res.json();
    //         globalUserAllergies = data.allergies || [];
    //     }
    // }

    // 폼 제출 시 addCustomCart 호출
    $('#menuForm').on('submit', function (e) {
        e.preventDefault();

        // 필수 유효성
        const required = ["bread", "material1", "vegetable1", "sauce1", "cheese"];
        if (!required.every(name => getSelectValue(name))) {
            $('#warningMessage').fadeIn();
            return;
        }
        $('#warningMessage').fadeOut();

        // 선택된 재료 텍스트 수집
        const selectedTexts = [];
        fields.forEach(name=>{
            const val = getSelectValue(name);
            if (val) {
                const txt = $(`select[name="${name}"] option[value="${val}"]`).text();
                if (txt && !defaultExcludeTexts.includes(txt)) selectedTexts.push(txt);
            }
        });

        // // ① AI-서비스로 알러지 체크
        // const res = await checkAllergyAPI(globalUserAllergies, selectedTexts);
        // if (res.risk) {
        //     // ② 위험 시 경고 UI 표시 후 중단
        //     showAllergyWarning(res);
        //     return;
        // }

        // // ③ 이상 없으면 DTO 생성 후 저장
        // const dto = Object.fromEntries(fields.map(n=>[n, getSelectValue(n)]));
        // dto.price   = +$('input[name="price"]').val()   || 0;
        // dto.calorie = +$('input[name="calorie"]').val() || 0;
        // if (globalUserInfo.type === 'user')   dto.userUid   = globalUserInfo.id;
        // else if (globalUserInfo.type === 'social') dto.socialUid = globalUserInfo.id;
        // else { alert('로그인 후 이용해주세요.'); return; }

        // 장바구니 저장 함수
        addCustomCart();
    });
    // 초기 로드
    $('select').on('change', calculatePriceAndCalories);
    loadIngredients();
    calculatePriceAndCalories();
});
