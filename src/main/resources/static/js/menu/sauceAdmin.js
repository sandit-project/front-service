$(document).ready(function () {
    checkToken();
    setupAjax();

    getUserInfo().then((userInfo) => {
        initUserUI(userInfo);
    });

    $("#submitBtn").on("click", function () {
        let fileInput = $("#img")[0].files[0];

        if (!fileInput) {
            Swal.fire({
                icon: 'warning',
                title: '이미지 누락',
                text: '이미지를 업로드해야 합니다.',
                confirmButtonColor: '#f97316'
            });
            return;
        }

        let formData = new FormData();
        formData.append("file", fileInput); // 이미지 파일 추가

        let sauceData = {
            sauceName: $("#sauceName").val(),
            calorie: parseFloat($("#calorie").val()),
            price: parseInt($("#price").val(), 10),
            status: $("#status").val() === "active" ? "ACTIVE" : "DELETED"
        };

        // ✅ JSON 데이터를 Blob으로 변환하여 FormData에 추가
        let jsonBlob = new Blob([JSON.stringify(sauceData)], { type: "application/json" });
        formData.append("sauce", jsonBlob); // 백엔드에서 @RequestPart("sauce")와 일치

        // ✅ Ajax 요청
        $.ajax({
            url: "/menus/sauces",
            type: "POST",
            data: formData,
            enctype: "multipart/form-data",
            processData: false,
            contentType: false,
            success: function () {
                Swal.fire({
                    icon: 'success',
                    title: '등록 완료',
                    text: '소스 정보가 등록되었습니다!',
                    confirmButtonColor: '#f97316'
                }).then(() => {
                    window.location.href = "/sauces/list";
                });
            },
            error: function (xhr) {
                console.error("Error:", xhr.responseText);
                Swal.fire({
                    icon: 'error',
                    title: '등록 실패',
                    text: '소스 정보 등록 중 오류가 발생했습니다.',
                    confirmButtonColor: '#f97316'
                });
            }
        });
    });
});
