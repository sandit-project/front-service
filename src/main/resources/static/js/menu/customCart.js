$(document).ready(async function () {
    checkToken();
    setupAjax();

    // 1.유저 정보 가져오기
    getUserInfo().then(async (userInfo) => {
        globalUserInfo = userInfo;
        console.log('User Info:', userInfo);

        initUserUI(userInfo);

        // 2.user/social 분기 : userUid or socialUid 구분해서 알러지 요청
        let allergyUrl = '';
        if (globalUserInfo.type === 'user') {
            allergyUrl = `/api/ai/users/${globalUserInfo.id}/allergies`;
        }else if (globalUserInfo.type === 'social') {
            allergyUrl = `/api/ai/socials/${globalUserInfo.id}/allergies`;
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
            if (!required.every(name => getSelectedValue(name))) {
                showWarning();
                return;
            }

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
                // 선택된 버튼 찾기 (한 개 or 여러 개)
                $(`.option-button[data-name="${name}"].selected`).each(function () {
                    const txt = $(this).text().trim();
                    if (txt && !defaultExcludeTexts.includes(txt)) {
                        selectedTexts.push(txt);
                    }
                });
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
            // 알러지 경고
            if (res.risk) {
                Swal.fire({
                    icon: 'error',
                    title: '⚠️ 알러지 위험 경고',
                    html: `
                        <b>위험 원인:</b> ${res.cause && res.cause.length ? res.cause.join(', ') : '원인 불명'}<br>
                        <b>설명:</b> ${res.detail || ''}
        `
                });
                return;
            }
            // 장바구니 저장 함수
            await addCustomCart();
        });
        // 초기 로드
        $('select').on('change', calculatePriceAndCalories);
        loadIngredients();
        calculatePriceAndCalories();

    }).catch((error) => {
        Swal.fire({
            icon: 'error',
            title: '로그인 실패',
            text: '로그인 정보 확인에 실패했습니다.',
            confirmButtonColor: '#f97316'
        }).then(() => {
            location.href = '/member/login';
        });
    });


    const getSelectedValue = name => {
        return $(`.option-button[data-name="${name}"].selected`).data('value') || null;
    };

    const calculatePriceAndCalories = () => {
        let totalPrice = 0;
        let totalCalorie = 0;
        let selectedItems = [];

        $('.option-button.selected').each(function () {
            const $el = $(this);
            const price = parseInt($el.data('price')) || 0;
            const calorie = parseFloat($el.data('calorie')) || 0;
            const text = $el.text().trim();

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

    $(document).on('click', '.option-button', function () {
        const $btn = $(this);
        const groupName = $btn.data('name');

        // 단일 선택 그룹
        const singleSelectGroups = [
            'bread', 'cheese',
            'material1', 'material2', 'material3',
            'vegetable1', 'vegetable2', 'vegetable3', 'vegetable4', 'vegetable5', 'vegetable6', 'vegetable7', 'vegetable8',
            'sauce1', 'sauce2', 'sauce3'
        ];

        if (singleSelectGroups.includes(groupName)) {
            // 같은 그룹의 기존 선택 해제 후 현재 항목 선택
            const $groupButtons = $(`.option-button[data-name="${groupName}"]`);
            if ($btn.hasClass('selected')) {
                $btn.removeClass('selected');
            } else {
                $groupButtons.removeClass('selected');
                $btn.addClass('selected');
            }
        } else {
            // 기타 그룹은 기본 toggle (예외가 있다면 조건 추가)
            $btn.toggleClass('selected');
        }

        calculatePriceAndCalories();
    });

    $(document).on('click', '.toggle-btn', function () {
        const targetId = $(this).data('target');
        const $target = $('#' + targetId);
        $target.slideToggle(300); // 부드러운 전환
    });

    const loadIngredients = () => {
        const endpoints = {
            bread:    { url: "/menus/ingredients/breads",     nameField: "breadName" },
            cheese:   { url: "/menus/ingredients/cheeses",    nameField: "cheeseName" },
            material: { url: "/menus/ingredients/materials",  nameField: "materialName" },
            vegetable:{ url: "/menus/ingredients/vegetables", nameField: "vegetableName" },
            sauce:    { url: "/menus/ingredients/sauces",     nameField: "sauceName" }
        };

        Object.entries(endpoints).forEach(([type, { url, nameField }]) => {
            $.get(url, function (data) {
                $(`.option-grid[data-name^="${type}"]`).each(function () {
                    const $grid = $(this);
                    const groupName = $grid.data('name');

                    $grid.empty();

                    data.forEach(item => {
                        const $btn = $('<div class="option-button"></div>');
                        $btn.html(`<strong>${item[nameField]}</strong><br>(+${item.price}원)`);

                        $btn.attr({
                            'data-value': item.uid,
                            'data-name': groupName,
                            'data-price': item.price,
                            'data-calorie': item.calorie
                        });
                        $grid.append($btn);
                    });
                });
            });
        });
    };

    const defaultExcludeTexts = [
        "선택 안 함", "빵을 선택하세요", "소스를 선택하세요", "재료를 선택하세요", "채소를 선택하세요"
    ];

    const addCustomCart = async () => {
        // 필수 항목 체트
        const required = ["bread", "material1", "vegetable1", "sauce1", "cheese"];
        if (!required.every(name => getSelectedValue(name))) {
            Swal.fire({
                icon: 'warning',
                title: '선택 오류',
                text: '모든 필수 항목을 선택해야 합니다.',
                confirmButtonColor: '#f97316'
            });
            return;
        }
        //DTO 생성
        const fields = [
            "bread", "cheese", "material1", "material2", "material3",
            "sauce1", "sauce2", "sauce3",
            "vegetable1", "vegetable2", "vegetable3", "vegetable4",
            "vegetable5", "vegetable6", "vegetable7", "vegetable8"
        ];

        const customCartDTO = Object.fromEntries(fields.map(name => [name, getSelectedValue(name)]));

        customCartDTO.price = parseInt($('input[name="price"]').val()) || 0;
        customCartDTO.calorie = parseFloat($('input[name="calorie"]').val()) || 0;

        // 사용자 ID 세팅
        if (globalUserInfo?.type === 'user') {
            customCartDTO.userUid = globalUserInfo.id;
        } else if (globalUserInfo?.type === 'social') {
            customCartDTO.socialUid = globalUserInfo.id;
        } else {
            Swal.fire({
                icon: 'warning',
                title: '로그인이 필요합니다',
                text: '로그인 후 이용해주세요.',
                confirmButtonColor: '#f97316'
            });
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
                Swal.fire({
                    icon: 'success',
                    title: '장바구니에 담겼습니다!',
                    text: '커스텀 샌드위치가 저장되었어요. 장바구니로 이동합니다.',
                    confirmButtonColor: '#f97316',
                    confirmButtonText: '확인'
                }).then(() => {
                    location.href = '/cart';
                });
            },
            error: xhr => {
                if (xhr.status === 400 && xhr.responseJSON) {
                    const errors = xhr.responseJSON;
                    let msg = "입력 오류:\n";
                    for (const [field, message] of Object.entries(errors)) {
                        msg += `- ${field}: ${message}\n`;
                    }
                    Swal.fire({
                        icon: 'error',
                        title: '입력 오류',
                        text: msg,
                        confirmButtonColor: '#f97316'
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: '저장 실패',
                        text: '저장에 실패했습니다. 다시 시도해 주세요.',
                        confirmButtonColor: '#f97316'
                    });
                }
            }
        });
    };

});

//경고 메시지
function showWarning() {
    Swal.fire({
        icon: 'warning',
        title: '선택 오류',
        text: '필수 재료를 모두 확인해주세요.',
        confirmButtonColor: '#f97316',
        confirmButtonText: '확인'
    });
}
