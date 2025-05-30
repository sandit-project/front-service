$(document).ready(function () {
    checkToken();
    setupAjax();

    getUserInfo().then((userInfo) => {
        initUserUI(userInfo);
    });

    // 야채 목록 불러오기
    function loadVegetables() {
        $.ajax({
            url: "/menus/vegetables",
            type: "GET",
            dataType: "json",
            success: function (data) {
                const vegetableTableBody = $("#vegetableTableBody");
                vegetableTableBody.empty();

                data.forEach(vegetable => {
                    const row = `<tr>
                        
                        <td>${vegetable.vegetableName}</td>
                        <td>${vegetable.calorie}</td>
                        <td>${vegetable.price}</td>
                        <td><img src="${vegetable.img}" alt="야채 이미지" width="50"></td>
                        <td>${vegetable.status}</td>
                        <td>
                            <a href="/vegetables/edit/${encodeURIComponent(vegetable.vegetableName)}" class="edit-btn">수정</a>
                            <button class="delete-btn" data-vegetablename="${vegetable.vegetableName}">삭제</button>
                        </td>
                    </tr>`;
                    vegetableTableBody.append(row);
                });
            },
            error: function (xhr, status, error) {
                console.error("야채 목록을 불러오는 중 오류 발생:", error);
                Swal.fire({
                    icon: 'error',
                    title: '야채 목록 불러오기 실패',
                    text: '야채 목록을 불러오는 중 오류가 발생했습니다.',
                    confirmButtonColor: '#f97316'
                });
            }
        });
    }

    // 삭제 버튼 클릭 이벤트
    $(document).on("click", ".delete-btn", function () {
        let vegetableName = $(this).data("vegetablename");

        if (!vegetableName) {
            Swal.fire({
                icon: 'warning',
                title: '삭제 실패',
                text: '삭제할 야채 이름이 없습니다.',
                confirmButtonColor: '#f97316'
            });
            return;
        }

        Swal.fire({
            title: `'${vegetableName}' 야채를 삭제하시겠습니까?`,
            text: "삭제된 야채는 품절 상태로 전환됩니다.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "삭제",
            cancelButtonText: "취소"
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "/menus/vegetables/" + encodeURIComponent(vegetableName),
                    type: "DELETE",
                    success: function () {
                        Swal.fire({
                            icon: 'success',
                            title: '삭제 완료',
                            text: '야채가 삭제되었습니다!',
                            confirmButtonColor: '#f97316'
                        }).then(() => {
                            loadVegetables(); // 목록 새로고침
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
    // 페이지 로드 시 야채 목록 불러오기
    loadVegetables();
});
