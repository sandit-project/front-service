$(document).ready(() => {

    checkToken();
    setupAjax();

    getUserInfo().then((userInfo) => {
        if (userInfo) {
            initUserUI(userInfo);
        } else {
            renderGuestUI();
        }
    });

    $.ajax({
        type: "GET",
        url: "/stores",   // 실제 스토어 목록을 반환하는 백엔드 API
        success: function (stores) {
            const container = $(".store-container");
            stores.forEach(store => {
                const html = `
                    <div class="store-item" data-store-id="${store.uid}">
                         <img src="/img/no-store.png" alt="지점 이미지" class="store-img">
                        <div class="store-info">
                            <h2>${store.storeName}</h2>
                            <p>${store.storeAddress}</p>
                            <input type="hidden" name="latitude" value="${store.storeLatitude}">
                            <input type="hidden" name="longitude" value="${store.storeLongitude}">
                            <button onclick="location.href='/stores/${store.uid}'">상세 보기</button>
                        </div>
                    </div>
                `;
                container.append(html);
            });
        },
        error: function () {
            alert("가맹점 목록을 불러오는 데 실패했습니다.");
        }
    });
});
