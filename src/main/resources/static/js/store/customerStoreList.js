console.log('kakao:', typeof kakao);
kakao.maps.load(() => {
    $(document).ready(() => {

        checkToken();
        setupAjax();

        getUserInfo().then((userInfo) => {
            if (userInfo) {
                initUserUI(userInfo);
                receiveAlarm(userInfo.id, userInfo.type);
            } else {
                renderGuestUI();
            }
        });

        $.ajax({
            type: "GET",
            url: "/stores",   // 실제 스토어 목록을 반환하는 백엔드 API
            success: function (stores) {
                console.log('받아온 stores:', stores);
                const container = $(".store-container");
                stores.forEach((store, index) => {
                    const mapId = `map-${index}`;  // 고유 ID 지정

                    const html = `
                    <div class="store-item" data-store-id="${index}">
                        <div id="${mapId}" class="store-map"></div>
                        <div class="store-info">
                            <h2>${store.storeName}</h2>
                            <p>${store.storeAddress}</p>
                            <input type="hidden" name="latitude" value="${store.storeLatitude}">
                            <input type="hidden" name="longitude" value="${store.storeLongitude}">
                        </div>
                    </div>
                `;
                    container.append(html);

                    setTimeout(() => {
                        renderStoreKakaomap(store, mapId);
                    }, 100);
                });
            },
            error: function () {
                Swal.fire({
                    icon: 'error',
                    title: '가맹점 목록 오류',
                    text: '가맹점 목록을 불러오는 데 실패했습니다.',
                    confirmButtonColor: '#f97316'
                });
            }
        });
    });

    let renderStoreKakaomap = (store, mapId) => {
        // 지도 초기화
        const mapContainer = document.getElementById(mapId);
        const mapOption = {
            center: new kakao.maps.LatLng(store.storeLatitude, store.storeLongitude),
            level: 5
        };
        const map = new kakao.maps.Map(mapContainer, mapOption);

        const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(store.storeLatitude, store.storeLongitude),
            map: map,
            title: store.storeName
        });

        const infowindow = new kakao.maps.InfoWindow({
            content: `<div style="padding:5px;font-size:13px;">${store.storeName}</div>`
        });
        infowindow.open(map, marker);
    }
});
