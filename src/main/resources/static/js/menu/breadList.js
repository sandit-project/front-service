$(document).ready(function () {
    checkToken();
    setupAjax();

    getUserInfo().then((userInfo) => {
        initUserUI(userInfo);
    });

    function loadBreads() {
        $.ajax({
            url: "/menus/breads",  // ✅ 새 API 경로
            type: "GET",
            dataType: "json",
            success: function (data) {
                const breadTableBody = $("#breadTableBody");
                breadTableBody.empty();

                data.forEach(bread => {
                    const row = `<tr>
                       
                        <td>${bread.breadName}</td>
                        <td>${bread.calorie}</td>
                        <td>${bread.price}</td>
                        <td><img src="${bread.img}" alt="빵 이미지" width="50"></td>
                        <td>${bread.status}</td>
                        <td>
                            <a href="/breads/edit/${encodeURIComponent(bread.breadName)}" class="edit-btn">수정</a>
                            <button class="delete-btn" data-breadname="${bread.breadName}">삭제</button>
                        </td>
                    </tr>`;
                    breadTableBody.append(row);
                });
            },
            error: function (xhr, status, error) {
                console.error("빵 목록을 불러오는 중 오류 발생:", error);
                Swal.fire({
                    icon: 'error',
                    title: '불러오기 실패',
                    text: '빵 목록을 불러오는 데 실패했습니다.',
                    confirmButtonColor: '#f97316'
                });
            }
        });
    }

    $(document).on("click", ".delete-btn", function () {
        const breadName = $(this).data("breadname");

        if (!breadName) {
            Swal.fire({
                icon: 'warning',
                title: '삭제 실패',
                text: '삭제할 빵 이름이 없습니다.',
                confirmButtonColor: '#f97316'
            });
            return;
        }

        Swal.fire({
            title: '정말 삭제하시겠습니까?',
            text: '삭제된 빵은 품절 상태로 전환됩니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "/menus/breads/" + encodeURIComponent(breadName),  // ✅ 수정된 DELETE 경로
                    type: "DELETE",
                    success: function () {
                        Swal.fire({
                            icon: 'success',
                            title: '삭제 완료',
                            text: '빵이 삭제되었습니다!',
                            confirmButtonColor: '#f97316'
                        }).then(() => {
                            loadBreads();
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
        // 페이지 로딩 시 호출
        loadBreads();
});
