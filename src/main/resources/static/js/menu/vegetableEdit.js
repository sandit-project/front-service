$(document).ready(function () {
    checkToken();
    setupAjax();

    getUserInfo().then((userInfo) => {
        initUserUI(userInfo);
    });

    const vegetableName = window.location.pathname.split('/').pop();

    $.ajax({
        url: "/menus/vegetables/" + vegetableName,
        type: "GET",
        success: function (vegetable) {
            $('#uid').val(vegetable.uid);
            $('#vegetableName').val(vegetable.vegetableName);
            $('#calorie').val(vegetable.calorie);
            $('#price').val(vegetable.price);
            $('#status').val(vegetable.status.toLowerCase());
            $('#currentImg').attr('src', vegetable.img);
            $('#imgUrl').val(vegetable.img);
        },
        error: function (xhr) {
            console.error("Error:", xhr.responseText);
            Swal.fire({
                icon: 'error',
                title: '불러오기 실패',
                text: '야채 정보 불러오기 중 오류가 발생했습니다.',
                confirmButtonColor: '#f97316'
            });
        }
    });

    $("#updateBtn").on("click", function () {
        let fileInput = $("#img")[0].files[0];

        let vegetableData = {
            vegetableName: $("#vegetableName").val(),
            calorie: parseFloat($("#calorie").val()),
            price: parseInt($("#price").val(), 10),
            status: $("#status").val() === "active" ? "ACTIVE" : "DELETED",
            img: $("#imgUrl").val()
        };

        let formData = new FormData();
        let jsonBlob = new Blob([JSON.stringify(vegetableData)], { type: "application/json" });
        formData.append("vegetable", jsonBlob);

        if (fileInput) {
            formData.append("file", fileInput);
        }

        $.ajax({
            url: "/menus/vegetables/" + encodeURIComponent(vegetableData.vegetableName),
            type: "PUT",
            data: formData,
            enctype: "multipart/form-data",
            processData: false,
            contentType: false,
            success: function () {
                Swal.fire({
                    icon: 'success',
                    title: '수정 완료',
                    text: '야채 정보가 수정되었습니다!',
                    confirmButtonColor: '#f97316'
                }).then(() => {
                    window.location.href = "/vegetables/list";
                });
            },
            error: function (xhr) {
                console.error("Error:", xhr.responseText);
                Swal.fire({
                    icon: 'error',
                    title: '수정 실패',
                    text: '야채 정보 수정 중 오류가 발생했습니다.',
                    confirmButtonColor: '#f97316'
                });
            }
        });
    });
});
