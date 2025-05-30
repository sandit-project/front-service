$(document).ready(function () {
    checkToken();
    setupAjax();

    getUserInfo().then((userInfo) => {
        initUserUI(userInfo);
    });

    // 소스 목록 불러오기
    function loadSauces() {
        $.ajax({
            url: "/menus/sauces",
            type: "GET",
            dataType: "json",
            success: function (data) {
                const sauceTableBody = $("#sauceTableBody");
                sauceTableBody.empty();

                data.forEach(sauce => {
                    const row = `<tr>
                       
                        <td>${sauce.sauceName}</td>
                        <td>${sauce.calorie}</td>
                        <td>${sauce.price}</td>
                        <td><img src="${sauce.img}" alt="소스 이미지" width="50"></td>
                        <td>${sauce.status}</td>
                        <td>
                            <a href="/sauces/edit/${encodeURIComponent(sauce.sauceName)}" class="edit-btn">수정</a>
                            <button class="delete-btn" data-saucename="${sauce.sauceName}">삭제</button>
                        </td>
                    </tr>`;
                    sauceTableBody.append(row);
                });
            },
            error: function (xhr, status, error) {
                console.error("소스 목록을 불러오는 중 오류 발생:", error);
                Swal.fire({
                    icon: 'error',
                    title: '목록 불러오기 실패',
                    text: '소스 목록을 불러오는 중 오류가 발생했습니다.',
                    confirmButtonColor: '#f97316'
                });
            }
        });
    }

    // 삭제 버튼 클릭 이벤트
    $(document).on("click", ".delete-btn", function () {
        let sauceName = $(this).data("saucename");

        if (!sauceName) {
            Swal.fire({
                icon: 'warning',
                title: '삭제 실패',
                text: '삭제할 소스 이름이 없습니다.',
                confirmButtonColor: '#f97316'
            });
            return;
        }

        Swal.fire({
            title: `'${sauceName}' 소스를 삭제하시겠습니까?`,
            text: '삭제된 소스는 품절 상태로 전환됩니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "/menus/sauces/" + encodeURIComponent(sauceName),
                    type: "DELETE",
                    success: function () {
                        Swal.fire({
                            icon: 'success',
                            title: '삭제 완료',
                            text: '소스가 삭제되었습니다!',
                            confirmButtonColor: '#f97316'
                        }).then(() => {
                            loadSauces(); // 목록 새로고침
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

    // 페이지 로드 시 소스 목록 불러오기
    loadSauces();
});
