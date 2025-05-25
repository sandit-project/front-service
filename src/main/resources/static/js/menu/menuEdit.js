$(document).ready(function () {
    checkToken();
    setupAjax();

    getUserInfo().then((userInfo) => {
        initUserUI(userInfo);
    });

    const menuName = decodeURIComponent(window.location.pathname.split('/').pop());

    $.ajax({
        url: `/menus/${menuName}`,
        method: "GET",
        success: function (menu) {
            $('input[name="menuName"]').val(menu.menuName);
            $('input[name="price"]').val(menu.price);
            $('input[name="calorie"]').val(menu.calorie);
            $('select[name="status"]').val(menu.status.toLowerCase());
            $('#imgUrl').val(menu.img);

            const setVal = (name, value) => $(`select[name="${name}"]`).val(value || '');

            setVal('breadId', menu.bread);
            setVal('cheeseId', menu.cheese);
            ['material1Id', 'material2Id', 'material3Id'].forEach((name, i) => setVal(name, menu[`material${i + 1}`]));
            for (let i = 1; i <= 8; i++) setVal(`vegetable${i}Id`, menu[`vegetable${i}`]);
            ['sauce1Id', 'sauce2Id', 'sauce3Id'].forEach((name, i) => setVal(name, menu[`sauce${i + 1}`]));

            const promises = [
                loadIngredientOptions('bread', 'breadId', [menu.bread]),
                loadIngredientOptions('cheese', 'cheeseId', [menu.cheese]),
                loadIngredientOptions('material', 'material', [menu.material1, menu.material2, menu.material3]),
                loadIngredientOptions('vegetable', 'vegetable', [
                    menu.vegetable1, menu.vegetable2, menu.vegetable3, menu.vegetable4,
                    menu.vegetable5, menu.vegetable6, menu.vegetable7, menu.vegetable8
                ]),
                loadIngredientOptions('sauce', 'sauce', [menu.sauce1, menu.sauce2, menu.sauce3])
            ];

            $.when.apply($, promises).done(() => console.log("재료 옵션 로딩 완료"));
        },
        error: (xhr) => {
            Swal.fire({
                icon: 'error',
                title: '메뉴 로딩 실패',
                text: xhr.responseText || '메뉴 정보를 불러오는 중 오류가 발생했습니다.',
                confirmButtonColor: '#f97316'
            });
        }
    });

    $('#updateBtn').on('click', function () {
        const formData = new FormData();
        const file = $('#img')[0].files[0];
        if (file) formData.append('file', file);

        const getVal = (name) => $(`[name="${name}"]`).val() || null;
        const toInt = v => isNaN(parseInt(v)) ? null : parseInt(v);
        const toFloat = v => isNaN(parseFloat(v)) ? null : parseFloat(v);

        const menuData = {
            menuName: getVal('menuName'),
            price: toInt(getVal('price')),
            calorie: toFloat(getVal('calorie')),
            bread: getVal('breadId'),
            cheese: getVal('cheeseId'),
            material1: getVal('material1Id'),
            material2: getVal('material2Id'),
            material3: getVal('material3Id'),
            vegetable1: getVal('vegetable1Id'),
            vegetable2: getVal('vegetable2Id'),
            vegetable3: getVal('vegetable3Id'),
            vegetable4: getVal('vegetable4Id'),
            vegetable5: getVal('vegetable5Id'),
            vegetable6: getVal('vegetable6Id'),
            vegetable7: getVal('vegetable7Id'),
            vegetable8: getVal('vegetable8Id'),
            sauce1: getVal('sauce1Id'),
            sauce2: getVal('sauce2Id'),
            sauce3: getVal('sauce3Id'),
            status: getVal('status') === 'active' ? 'ACTIVE' : 'DELETED',
            img: $('#imgUrl').val() || null
        };

        formData.append('menu', new Blob([JSON.stringify(menuData)], { type: 'application/json' }));

        $.ajax({
            url: `/menus/${encodeURIComponent(menuData.menuName)}`,
            method: 'PUT',
            data: formData,
            processData: false,
            contentType: false,
            success: () => {
                Swal.fire({
                    icon: 'success',
                    title: '수정 완료',
                    text: '메뉴가 성공적으로 수정되었습니다.',
                    confirmButtonColor: '#f97316'
                }).then(() => {
                    window.location.href = "/menus/list";
                });
            },
            error: (xhr) => {
                Swal.fire({
                    icon: 'error',
                    title: '수정 실패',
                    text: xhr.responseText || '수정 중 오류가 발생했습니다.',
                    confirmButtonColor: '#f97316'
                });
            }
        });
    });

    function loadIngredientOptions(type, selectorPrefix, selected = []) {
        const endpoints = {
            bread: ["/menus/ingredients/breads", "breadName"],
            cheese: ["/menus/ingredients/cheeses", "cheeseName"],
            material: ["/menus/ingredients/materials", "materialName"],
            vegetable: ["/menus/ingredients/vegetables", "vegetableName"],
            sauce: ["/menus/ingredients/sauces", "sauceName"]
        };

        const [url, nameField] = endpoints[type];

        return $.get(url).done(function (items) {
            const selects = $(`select[name^="${selectorPrefix}"]`);
            selects.each((i, el) => {
                const $sel = $(el).empty().append(`<option value="">-- 선택 --</option>`);
                items.forEach(item => {
                    const option = $('<option>')
                        .val(item.uid)
                        .text(item[nameField])
                        .prop('selected', selected[i] == item.uid);
                    $sel.append(option);
                });
            });
        });
    }
});
