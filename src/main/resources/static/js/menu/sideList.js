$(document).ready(function () {
    checkToken();
    setupAjax();

    getUserInfo().then((userInfo) => {
        initUserUI(userInfo);
    });

    // 사이드 목록 불러오기
    function loadSides() {
        $.ajax({
            url: "/menus/sides",
            type: "GET",
            dataType: "json",
            success: function (data) {
                const sideTableBody = $("#sideTableBody");
                sideTableBody.empty();

                data.forEach(side => {
                    const row = `<tr>
                      
                        <td>${side.sideName}</td>
                        <td>${side.calorie}</td>
                        <td>${side.price}</td>
                        <td><img src="${side.img}" alt="사이드 이미지" width="50"></td>
                        <td>${side.status}</td>
                        <td>
                            <a href="/sides/edit/${encodeURIComponent(side.sideName)}" class="edit-btn">수정</a>
                            <button class="delete-btn" data-sidename="${side.sideName}">삭제</button>
                        </td>
                    </tr>`;
                    sideTableBody.append(row);
                });
            },
            error: function (xhr, status, error) {
                console.error("사이드 목록을 불러오는 중 오류 발생:", error);
                Swal.fire({
                    icon: 'error',
                    title: '불러오기 실패',
                    text: '사이드 목록을 불러오는 중 오류가 발생했습니다.',
                    confirmButtonColor: '#f97316'
                });
            }
        });
    }

    // 삭제 버튼 클릭 이벤트
    $(document).on("click", ".delete-btn", function () {
        let sideName = $(this).data("sidename");

        if (!sideName) {
            Swal.fire({
                icon: 'warning',
                title: '삭제 실패',
                text: '삭제할 사이드 이름이 없습니다.',
                confirmButtonColor: '#f97316'
            });
            return;
        }

        Swal.fire({
            title: '정말 삭제하시겠습니까?',
            text: '삭제된 사이드는 품절 상태로 전환됩니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "/menus/sides/" + encodeURIComponent(sideName),
                    type: "DELETE",
                    success: function () {
                        Swal.fire({
                            icon: 'success',
                            title: '삭제 완료',
                            text: '사이드가 삭제되었습니다!',
                            confirmButtonColor: '#f97316'
                        }).then(() => {
                            loadSides();
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
    // 페이지 로드 시 사이드 목록 불러오기
    loadSides();
});
