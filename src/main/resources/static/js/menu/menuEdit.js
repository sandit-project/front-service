// menu-edit.js
$(document).ready(function () {
    checkToken();
    setupAjax();

    getUserInfo().then(initUserUI);

    const menuName = decodeURIComponent(window.location.pathname.split('/').pop());

    const endpoints = {
        bread: ["/menus/ingredients/breads", "breadName"],
        cheese: ["/menus/ingredients/cheeses", "cheeseName"],
        material: ["/menus/ingredients/materials", "materialName"],
        vegetable: ["/menus/ingredients/vegetables", "vegetableName"],
        sauce: ["/menus/ingredients/sauces", "sauceName"]
    };

    function loadIngredientOptions(type, namePrefix, selected = []) {
        const [url, nameField] = endpoints[type];
        return $.get(url).done(items => {
            $(`select[name^="${namePrefix}"]`).each((i, el) => {
                const $sel = $(el).empty().append(`<option value="">-- 선택하세요 --</option>`);
                items.forEach(item => {
                    $('<option>')
                        .val(item.uid)
                        .text(item[nameField])
                        .prop('selected', selected[i] == item.uid)
                        .appendTo($sel);
                });
            });
        });
    }

    function loadAllIngredientOptions(menu) {
        return $.when(
            loadIngredientOptions('bread', 'breadId', [menu.breadId]),
            loadIngredientOptions('cheese', 'cheeseId', [menu.cheeseId]),
            loadIngredientOptions('material', 'material', [menu.material1Id, menu.material2Id, menu.material3Id]),
            loadIngredientOptions('vegetable', 'vegetable', [
                menu.vegetable1Id, menu.vegetable2Id, menu.vegetable3Id, menu.vegetable4Id,
                menu.vegetable5Id, menu.vegetable6Id, menu.vegetable7Id, menu.vegetable8Id
            ]),
            loadIngredientOptions('sauce', 'sauce', [menu.sauce1Id, menu.sauce2Id, menu.sauce3Id])
        );
    }

    function fillMenuForm(menu) {
        const form = $('#menuEditForm')[0];
        form.uid.value = menu.uid || '';
        form.menuName.value = menu.menuName || '';
        form.price.value = menu.price || '';
        form.calorie.value = menu.calorie || '';
        form.status.value = menu.status || 'ACTIVE';
        $('#currentImg').attr('src', menu.img || '');
        form.imgUrl.value = menu.img || '';
    }

    // 초기 메뉴 상세 정보 로드
    $.get(`/menus/${menuName}`).done(menu => {
        fillMenuForm(menu);
        loadAllIngredientOptions(menu);
    });

    // 이미지 변경 시 미리보기
    $('#img').on('change', function () {
        const file = this.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = e => {
            $('#currentImg').attr('src', e.target.result);
            $('#imgUrl').val('');
        };
        reader.readAsDataURL(file);
    });

    // 수정 버튼 클릭 이벤트
    $('#updateBtn').on('click', function () {
        const menu = {
            menuName: $('#menuName').val(),
            price: Number($('#price').val()),
            calorie: parseFloat($('#calorie').val()),
            status: $('#status').val(),

            bread: $('select[name="breadId"]').val(),
            cheese: $('select[name="cheeseId"]').val(),

            material1: $('select[name="material1Id"]').val(),
            material2: $('select[name="material2Id"]').val(),
            material3: $('select[name="material3Id"]').val(),

            vegetable1: $('select[name="vegetable1Id"]').val(),
            vegetable2: $('select[name="vegetable2Id"]').val(),
            vegetable3: $('select[name="vegetable3Id"]').val(),
            vegetable4: $('select[name="vegetable4Id"]').val(),
            vegetable5: $('select[name="vegetable5Id"]').val(),
            vegetable6: $('select[name="vegetable6Id"]').val(),
            vegetable7: $('select[name="vegetable7Id"]').val(),
            vegetable8: $('select[name="vegetable8Id"]').val(),

            sauce1: $('select[name="sauce1Id"]').val(),
            sauce2: $('select[name="sauce2Id"]').val(),
            sauce3: $('select[name="sauce3Id"]').val(),

            imgUrl: $('#imgUrl').val()
        };

        const formData = new FormData();
        formData.append('menu', new Blob([JSON.stringify(menu)], { type: 'application/json' }));

        const fileInput = $('#img')[0].files[0];
        if (fileInput) {
            formData.append('file', fileInput);
        }

        $.ajax({
            url: `/menus/${menuName}`,
            method: 'PUT',
            data: formData,
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success: function () {
                Swal.fire('수정 완료!', '메뉴 정보가 성공적으로 수정되었습니다.', 'success').then(() => {
                    location.href = '/menus/list';
                });
            },
            error: function (xhr) {
                Swal.fire('오류', xhr.responseJSON?.message || '메뉴 수정 중 오류가 발생했습니다.', 'error');
            }
        });
    });
});
