$(document).ready(function () {
    checkToken();
    setupAjax();
    getUserInfo().then((userInfo) => {
        initUserUI(userInfo);
    });
    // 치즈 목록 불러오기
    function loadCheeses() {
        $.ajax({
            url: "/menus/cheeses",
            type: "GET",
            dataType: "json",
            success: function (data) {
                const cheeseTableBody = $("#cheeseTableBody");
                cheeseTableBody.empty();

                data.forEach(cheese => {
                    const row = `<tr>
                      
                        <td>${cheese.cheeseName}</td>
                        <td>${cheese.calorie}</td>
                        <td>${cheese.price}</td>
                        <td><img src="${cheese.img}" alt="치즈 이미지" width="50"></td>
                        <td>${cheese.status}</td>
                        <td>
                            <a href="/cheeses/edit/${encodeURIComponent(cheese.cheeseName)}" class="edit-btn">수정</a>
                            <button class="delete-btn" data-cheesename="${cheese.cheeseName}">삭제</button>
                        </td>
                    </tr>`;
                    cheeseTableBody.append(row);
                });
            },
            error: function (xhr, status, error) {
                console.error("치즈 목록을 불러오는 중 오류 발생:", error);
                Swal.fire({
                    icon: 'error',
                    title: '불러오기 실패',
                    text: '치즈 목록을 불러오는 중 오류가 발생했습니다.',
                    confirmButtonColor: '#f97316'
                });
            }
        });
    }

    // 삭제 버튼 클릭 이벤트
    $(document).on("click", ".delete-btn", function () {
        let cheeseName = $(this).data("cheesename");

        if (!cheeseName) {
            Swal.fire({
                icon: 'warning',
                title: '삭제 실패',
                text: '삭제할 치즈 이름이 없습니다.',
                confirmButtonColor: '#f97316'
            });
            return;
        }

        Swal.fire({
            title: '정말 삭제하시겠습니까?',
            text: '삭제된 치즈는 복구할 수 없습니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "/menus/cheeses/" + encodeURIComponent(cheeseName),
                    type: "DELETE",
                    success: function () {
                        Swal.fire({
                            icon: 'success',
                            title: '삭제 완료',
                            text: '치즈가 삭제되었습니다!',
                            confirmButtonColor: '#f97316'
                        }).then(() => {
                            loadCheeses();
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

    // 페이지 로드 시 치즈 목록 불러오기
    loadCheeses();
});
