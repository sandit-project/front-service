$(document).ready(function() {
    const menuName = window.location.pathname.split('/').pop(); // URL에서 메뉴 이름 추출

    // 메뉴 상세 정보 Ajax 호출
    $.ajax({
        type: "GET",
        url: `/menus/${menuName}`,
        success: function(data) {
            // 타이틀 업데이트
            $("#pageTitle").text("메뉴 상세 - " + data.menuName);

            // 메뉴 정보 업데이트
            $("#menuTitle").text(data.menuName);
            $("#menuImage").attr("src", data.img);
            $("#menuPrice").text(data.price);
            $("#menuCalorie").text(data.calorie);
            $("#breadName").text(data.breadName);
            $("#cheeseName").text(data.cheeseName);

            // 재료 태그 생성
            createTags(data.material1Name, "#materialTags");
            createTags(data.material2Name, "#materialTags");
            createTags(data.material3Name, "#materialTags");

            createTags(data.sauce1Name, "#sauceTags");
            createTags(data.sauce2Name, "#sauceTags");
            createTags(data.sauce3Name, "#sauceTags");

            createTags(data.vegetable1Name, "#vegetableTags");
            createTags(data.vegetable2Name, "#vegetableTags");
            createTags(data.vegetable3Name, "#vegetableTags");
            createTags(data.vegetable4Name, "#vegetableTags");
            createTags(data.vegetable5Name, "#vegetableTags");
            createTags(data.vegetable6Name, "#vegetableTags");
            createTags(data.vegetable7Name, "#vegetableTags");
            createTags(data.vegetable8Name, "#vegetableTags");
        },
        error: function(xhr) {
            alert("정보를 불러오는 데 오류가 발생했습니다.");
        }
    });

    // 태그 생성 함수
    function createTags(item, targetElement) {
        if (item) {
            $(targetElement).append(`<span class="tag">${item}</span>`);
        }
    }
});
