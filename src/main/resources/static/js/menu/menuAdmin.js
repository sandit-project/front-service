$(document).ready(function () {
    checkToken();
    setupAjax();

    getUserInfo().then((userInfo) => {
        initUserUI(userInfo);
    });

    const endpoints = {
        bread: { url: "/menus/ingredients/breads", nameField: "breadName" },
        cheese: { url: "/menus/ingredients/cheeses", nameField: "cheeseName" },
        material: { url: "/menus/ingredients/materials", nameField: "materialName" },
        vegetable: { url: "/menus/ingredients/vegetables", nameField: "vegetableName" },
        sauce: { url: "/menus/ingredients/sauces", nameField: "sauceName" }
    };

    Object.entries(endpoints).forEach(([type, { url, nameField }]) => {
        $.get(url, function (data) {
            $(`.option-grid[data-name^="${type}"]`).each(function () {
                const $grid = $(this);
                const group = $grid.data("name");
                $grid.empty();
                data.forEach(item => {
                    const $btn = $('<div class="option-button"></div>');
                    $btn.text(item[nameField]);
                    $btn.attr({
                        'data-name': group,
                        'data-value': item.uid,
                        'data-price': item.price,
                        'data-calorie': item.calorie
                    });
                    $grid.append($btn);
                });
            });
        });
    });

    $(document).on('click', '.option-button', function () {
        const $btn = $(this);
        const group = $btn.data('name');
        const $groupButtons = $(`.option-button[data-name='${group}']`);
        $groupButtons.removeClass('selected');
        $btn.addClass('selected');
    });

    $(document).on('click', '.toggle-btn', function () {
        const targetId = $(this).data('target');
        const $target = $('#' + targetId);
        $target.slideToggle(300);
    });

    $('#menuForm').on('submit', function (e) {
        e.preventDefault();

        const fileInput = $('#img')[0].files[0];
        if (!fileInput) {
            Swal.fire("이미지 필요", "이미지를 업로드해야 합니다.", "warning");
            return;
        }

        const price = parseInt($('input[name="price"]').val(), 10);
        const calorie = parseFloat($('input[name="calorie"]').val());

        if (isNaN(price) || price <= 0) {
            Swal.fire("가격 오류", "가격은 0보다 큰 숫자여야 합니다.", "warning");
            return;
        }

        if (isNaN(calorie) || calorie < 0) {
            Swal.fire("칼로리 오류", "칼로리는 0 이상 숫자여야 합니다.", "warning");
            return;
        }

        const getVal = name => $(`.option-button[data-name='${name}'].selected`).data('value') || null;

        // 필수 항목 검사
        const requiredFields = ['menuName', 'price', 'calorie', 'bread', 'material1', 'cheese', 'sauce1'];
        for (let field of requiredFields) {
            if ((field === 'menuName' && !$('input[name="menuName"]').val().trim()) ||
                (['price', 'calorie'].includes(field) && isNaN($(`input[name="${field}"]`).val())) ||
                (['bread', 'material1', 'cheese', 'sauce1'].includes(field) && !getVal(field))) {
                Swal.fire("입력 누락", `'${field}' 항목은 필수입니다.`, "warning");
                return;
            }
        }

        const menuData = {
            menuName: $('input[name="menuName"]').val().trim(),
            price: parseInt($('input[name="price"]').val(), 10),
            calorie: parseFloat($('input[name="calorie"]').val()),
            bread: getVal('bread'),
            material1: getVal('material1'),
            material2: getVal('material2'),
            material3: getVal('material3'),
            cheese: getVal('cheese'),
            sauce1: getVal('sauce1'),
            sauce2: getVal('sauce2'),
            sauce3: getVal('sauce3'),
            status: $('select[name="status"]').val() === 'active' ? 'ACTIVE' : 'DELETED'
        };

        for (let i = 1; i <= 8; i++) {
            menuData[`vegetable${i}`] = getVal(`vegetable${i}`);
        }

        const formData = new FormData();
        formData.append("file", fileInput);
        formData.append("menu", new Blob([JSON.stringify(menuData)], { type: "application/json" }));

        $.ajax({
            url: "/menus",
            type: "POST",
            data: formData,
            enctype: "multipart/form-data",
            processData: false,
            contentType: false,
            success: () => {
                Swal.fire('등록 완료', '메뉴가 등록되었습니다!', 'success').then(() => {
                    location.href = "/menus/list";
                });
            },
            error: (xhr) => {
                console.error("등록 실패", xhr);
                if (xhr.responseJSON) {
                    const errors = xhr.responseJSON;
                    let msg = "서버 오류:\n";
                    for (const [field, error] of Object.entries(errors)) {
                        msg += `- ${field}: ${error}\n`;
                    }
                    Swal.fire("등록 실패", msg, "error");
                } else {
                    Swal.fire("에러 발생", xhr.responseText || `HTTP ${xhr.status}`, "error");
                }
            }
        });
    });
});
