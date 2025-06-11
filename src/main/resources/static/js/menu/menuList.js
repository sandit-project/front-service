$(document).ready(function () {
    checkToken();
    setupAjax();

    getUserInfo().then((userInfo) => {
        initUserUI(userInfo);
    });

    // 메뉴 목록을 Ajax로 로드
    function loadMenus() {
        $.ajax({
            url: "/menus", // 메뉴 데이터를 반환하는 API URL
            type: "GET",
            dataType: "json", // 서버에서 JSON 형식으로 응답 받음

            success: function (data) {
                renderMenuList(data);
            },
            error: function (xhr, status, error) {
                console.error(`메뉴 목록 불러오기 실패 [${status}]:`, error);
                Swal.fire({
                    icon: 'error',
                    title: '메뉴 불러오기 실패',
                    text: '메뉴 목록을 불러오는 중 오류가 발생했습니다.',
                    confirmButtonColor: '#f97316'
                });
            }
        });
    }

    // 메뉴 목록을 HTML 테이블에 렌더링
    function renderMenuList(menus) {
        const menuTableBody = $("#menuTableBody");
        menuTableBody.empty(); // 기존 내용을 비웁니다.

        menus.forEach(menu => {
            // ★ 메뉴 UID별 fallback 이미지 설정
            let fallbackImg = "https://himedia-sandis-20205.s3.ap-northeast-2.amazonaws.com/uploads/sandit.png";
            if (menu.uid === 4) {
                fallbackImg = "/images/product-image/shrimp.png";
            } else if (menu.uid === 5) {
                fallbackImg = "/images/product-image/chicken_bacon.png";
            }

            const imgTag = menu.img
                ? `<img src="${menu.img}" alt="메뉴 이미지" width="50" onerror="this.onerror=null; this.src='${fallbackImg}'">`
                : `<img src="${fallbackImg}" alt="대체 이미지" width="50">`;

                // ? `<img src="${menu.img}" alt="메뉴 이미지" width="50">`
                // : `<span>이미지 없음</span>`;

            const rowHtml = `
                <tr>
                    <td>${menu.menuName}</td>
                    <td>${menu.price}</td>
                    <td>${menu.calorie}</td>
                    <td>${imgTag}</td>
                    <td>${menu.breadName || '없음'}</td>
                    <td>${menu.material1Name || '없음'}</td>
                    <td>
                        <ul>
                            <li>${menu.material2Name || ''}</li>
                            <li>${menu.material3Name || ''}</li>
                        </ul>
                    </td>
                    <td>${menu.cheeseName || '없음'}</td>
                    <td>
                        <ul>
                            <li>${menu.vegetable1Name || ''}</li>
                            <li>${menu.vegetable2Name || ''}</li>
                            <li>${menu.vegetable3Name || ''}</li>
                            <li>${menu.vegetable4Name || ''}</li>
                            <li>${menu.vegetable5Name || ''}</li>
                            <li>${menu.vegetable6Name || ''}</li>
                            <li>${menu.vegetable7Name || ''}</li>
                            <li>${menu.vegetable8Name || ''}</li>
                        </ul>
                    </td>
                    <td>
                        <ul>
                            <li>${menu.sauce1Name || ''}</li>
                            <li>${menu.sauce2Name || ''}</li>
                            <li>${menu.sauce3Name || ''}</li>
                        </ul>
                    </td>
                    <td>${menu.status}</td>
                    <td>
                        <a href="/menus/edit/${encodeURIComponent(menu.menuName)}" class="edit-btn">수정</a>
                    </td>
                    <td>
                        <button class="delete-btn" data-menuName="${menu.menuName}">삭제</button>
                    </td>
                </tr>
            `;
            menuTableBody.append(rowHtml);
        });
    }

    // 메뉴 목록 로드
    loadMenus();

    // 삭제 버튼 클릭 처리
    $(document).on("click", ".delete-btn", function () {
        const menuName = $(this).data("menuname");
        deleteMenu(menuName);
    });

    // 메뉴 삭제
    function deleteMenu(menuName) {
        if (!menuName) {
            Swal.fire({
                icon: 'warning',
                title: '삭제 실패',
                text: '삭제할 메뉴 이름이 없습니다.',
                confirmButtonColor: '#f97316'
            });
            return;
        }

        Swal.fire({
            title: `'${menuName}' 메뉴를 삭제하시겠습니까?`,
            text: "삭제된 메뉴는 품절 상태로 전환됩니다.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "삭제",
            cancelButtonText: "취소"
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "/menus/" + encodeURIComponent(menuName),
                    type: "DELETE",
                    success: function () {
                        Swal.fire({
                            icon: 'success',
                            title: '삭제 완료',
                            text: '메뉴가 삭제되었습니다!',
                            confirmButtonColor: '#f97316'
                        }).then(() => {
                            loadMenus(); // 원래 있던 새로고침
                        });
                    },
                    error: function (xhr, status, error) {
                        console.error(`삭제 실패 [${status}]:`, error);
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
    }
});
