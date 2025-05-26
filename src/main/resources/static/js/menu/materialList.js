$(document).ready(function () {
    checkToken();
    setupAjax();

    getUserInfo().then((userInfo) => {
        initUserUI(userInfo);
    });

    // 재료 목록 불러오기
    function loadMaterials() {
        $.ajax({
            url: "/menus/materials",
            type: "GET",
            dataType: "json",
            success: function (data) {
                const materialTableBody = $("#materialTableBody");
                materialTableBody.empty();

                data.forEach(material => {
                    const row = `<tr>
                        
                        <td>${material.materialName}</td>
                        <td>${material.calorie}</td>
                        <td>${material.price}</td>
                        <td><img src="${material.img}" alt="재료 이미지" width="50"></td>
                        <td>${material.status}</td>
                        <td>
                            <a href="/materials/edit/${encodeURIComponent(material.materialName)}" class="edit-btn">수정</a>
                            <button class="delete-btn" data-materialname="${material.materialName}">삭제</button>
                        </td>
                    </tr>`;
                    materialTableBody.append(row);
                });
            },
            error: function (xhr, status, error) {
                console.error("재료 목록을 불러오는 중 오류 발생:", error);
                Swal.fire({
                    icon: 'error',
                    title: '불러오기 실패',
                    text: '재료 목록을 불러오는 중 오류가 발생했습니다.',
                    confirmButtonColor: '#f97316'
                });
            }
        });
    }

    // 삭제 버튼 클릭 이벤트
    $(document).on("click", ".delete-btn", function () {
        let materialName = $(this).data("materialname");

        if (!materialName) {
            Swal.fire({
                icon: 'warning',
                title: '삭제 실패',
                text: '삭제할 재료 이름이 없습니다.',
                confirmButtonColor: '#f97316'
            });
            return;
        }

        Swal.fire({
            title: '정말 삭제하시겠습니까?',
            text: '삭제된 재료는 복구할 수 없습니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "/menus/materials/" + encodeURIComponent(materialName),
                    type: "DELETE",
                    success: function () {
                        Swal.fire({
                            icon: 'success',
                            title: '삭제 완료',
                            text: '재료가 삭제되었습니다!',
                            confirmButtonColor: '#f97316'
                        }).then(() => {
                            loadMaterials(); // 목록 새로고침
                        });
                    },
                    error: function () {
                        Swal.fire({
                            icon: 'error',
                            title: '삭제 실패',
                            text: '삭제 중 오류가 발생했습니다.',
                            confirmButtonColor: '#f97316'
                        });
                    }
                });
            }
        });

    });
    // 페이지 로드 시 재료 목록 불러오기
    loadMaterials();
});
