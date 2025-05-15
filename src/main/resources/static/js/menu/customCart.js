$(document).ready(function () {
    checkToken();
    setupAjax();
    // 사용자 정보 전역으로 불러오기
    getUserInfo().then((userInfo) => {
        globalUserInfo = userInfo;
        console.log('User Info:', userInfo);


    }).catch((error) => {
        console.error('user info error:', error);
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

    const addCustomCart = () => {
        const required = ["bread", "material1", "vegetable1", "sauce1", "cheese"];
        if (!required.every(name => getSelectValue(name))) {
            alert("모든 필수 항목을 선택해야 합니다.");
            return;
        }

        const fields = [
            "bread", "cheese", "material1", "material2", "material3",
            "sauce1", "sauce2", "sauce3",
            "vegetable1", "vegetable2", "vegetable3", "vegetable4",
            "vegetable5", "vegetable6", "vegetable7", "vegetable8"
        ];

        const customCartDTO = Object.fromEntries(fields.map(name => [name, getSelectValue(name)]));

        customCartDTO.price = parseInt($('input[name="price"]').val()) || 0;
        customCartDTO.calorie = parseFloat($('input[name="calorie"]').val()) || 0;

        if (globalUserInfo?.type === 'user') {
            customCartDTO.userUid = globalUserInfo.id;
        } else if (globalUserInfo?.type === 'social') {
            customCartDTO.socialUid = globalUserInfo.id;
        } else {
            alert("로그인 후 이용해주세요.");
            return;
        }

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

    $('#menuForm').on('submit', function (e) {
        e.preventDefault();
        const required = ["bread", "material1", "vegetable1", "sauce1", "cheese"];
        if (!required.every(name => getSelectValue(name))) {
            $('#warningMessage').fadeIn();
            return;
        }
        $('#warningMessage').fadeOut();
        addCustomCart();
    });

    $('select').on('change', calculatePriceAndCalories);
    loadIngredients();
    calculatePriceAndCalories();
});
