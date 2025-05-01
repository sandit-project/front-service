let storeInfo;
$(document).ready(async ()=>{
    // 1) 토큰 유효성 확인 및 AJAX 헤더 설정
    checkToken();
    setupAjax();

    // 2) 로그인한 유저 정보 조회
    let userInfo;
    try {
        userInfo = await getUserInfo();      // common.js 에 정의된 함수 호출
    } catch (err) {
        console.error('유저 정보 조회 실패:', err);
        alert('유저 정보를 불러오지 못했습니다. 다시 로그인 해주세요.');
        return;
    }

    const managerUid = userInfo.id;       // 여기에서 매니저 UID 획득
    console.log('로그인한 매니저 UID:', managerUid);

    // 3) 매니저 UID로 storeUid 조회


    storeInfo = await fetchStoreUidByManager(managerUid);

    if (storeInfo==null) {
        alert('지점 정보를 불러오는 데 실패했습니다.');
        return;
    }
    // 4) 화면 헤더 업데이트
    $('#welcome-text').text(`${storeInfo.storeName} 주문 목록`);

    // ** 총 주문 수 조회 **
    //await updateOrderCount();

    // ** 새로고침 버튼 클릭 핸들러 **
    $('#refresh-btn').click(async ()=>{
        //await updateOrderCount();
        initStoreOrderList();
    });

    //최초 페이지(1)는 lastUid가 null 이어야 함
    cursorMap.set(1,null);
    initStoreOrderList();
});

let cursorMap=new Map();//페이지번호 => lastUid 매핑
let page= 1;
let limit=10

/**
 * 매니저 UID로 storeUid를 조회
 * GET /stores/storeUid?managerUid={managerUid}
 */
function fetchStoreUidByManager(managerUid) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: `/stores/storeUid?managerUid=${managerUid}`,
            dataType: 'json',
            success: response => {
                console.log("로그인 한 매니저의 지점명,지점번호 :",response);
                resolve(response);
            },
            error: xhr => {
                console.error('storeUid 조회 실패:', xhr.status);
                reject(null);
            }
        });
    });
}

/**
 * 초기 페이지 버튼&리스트 설정
 */
let initStoreOrderList=() =>{
    //최초 페이지 로드(page 1)
    loadStoreOrders({ limit, lastUid: cursorMap.get(page)});

    $('#nextPage').click(() => {
        if ($('#nextPage').prop('disabled')) return;
        //다음 페이지 커서가 있다면 페이지 번호 증가 후 해당 커서로 로드
        if (cursorMap.has(page + 1)) {
            page++;
            loadStoreOrders({limit, lastUid: cursorMap.get(page)});
        }
    });


    $('#prevPage').click(() => {
        if ($('#prevPage').prop('disabled')) return;
        if(page>1){
            page--;
            loadStoreOrders({ limit, lastUid: cursorMap.get(page) });
        }
    });


    $('#firstPage').click((event)=>{
        page=1;
        //1페이지는 항상 null
        loadStoreOrders({ limit, lastUid: cursorMap.get(1) });
    });
};

/**
 * storeUid로 주문 목록을 불러와 렌더링(jQuery AJAX 사용)
 */
function loadStoreOrders({ limit, lastUid }) {
    const last = lastUid != null ? lastUid : 0;

    // 기본 URL (limit만 붙임)
    let url = `/orders/store/${storeInfo.storeUid}?limit=${encodeURIComponent(limit)}`;

    // 두 번째 페이지부터 lastUid 파라미터 추가
    if (lastUid != null) {
        url += `&lastUid=${encodeURIComponent(lastUid)}`;
    }

    $.ajax({
        type: 'GET',
        url: url,
        success: function (response) {

            console.log("지점 주문 목록 :",response);
            const orders = response.storeOrderLists || [];
            const $tbody = $('#storeContent').empty();
            if (orders.length === 0) {
                $tbody.append(`
                    <tr>
                      <td colspan="8" style="text-align:center">주문 내역이 없습니다.</td>
                    </tr>
                `);

            } else {
                let displayOrderList = mergeOrderList(orders);

                $('#order-count').text(`( ${displayOrderList.length} 건 )`);

                displayOrderList.forEach(o => {
                    const created = new Date(o.createdDate).toLocaleString();
                    const reserve = o.reservationDate
                        ? new Date(o.reservationDate).toLocaleString()
                        : '-';
                    const itemsCnt = o.items ? o.items.length : 0;
                    // items 정보 HTML 문자열로 변환
                    const itemDetails = o.items.map(item => `${item.menuName} - ${item.amount} 개`).join("<br>");

                    $tbody.append(`
                        <tr>
                          <td>${o.merchantUid}</td>
                          <td>${o.userUid}</td>
                          <td>${o.status}</td>
                          <td>${created}</td>
                          <td>${reserve}</td>
                          <td>${itemDetails}</td>
                          <td>${itemDetails}</td>
                        </tr>
                    `);
                    //updateOrderCount();
                });
            }

            // 1페이지에서 초기화
            if (page === 1) {
                cursorMap.clear();
                cursorMap.set(1, null);
            }


            // 다음 페이지(lastUid)는 현재 응답의 nextCursor로 설정
            if (!response.lastPage && response.nextCursor != null && orders.length === limit) {
                if (!cursorMap.has(page + 1)) {
                    cursorMap.set(page + 1, response.nextCursor);
                }
            }

            updatePaginationButtons({
                lastPage: response.lastPage,
                hasNext: response.nextCursor != null
            });

        },
        error: (xhr, status, error) => {
            console.error('주문 목록 조회 오류 ::', error);
        }
    });
}

/**
 * 페이지 버튼 업데이트
 */
let updatePaginationButtons = (response) => {
    //첫 페이지에서는 이전 버튼 비활성화
    $('#prevPage').prop('disabled', page === 1);
    // 다음 페이지 커서가 없다면 다음 버튼 비활성화
    $('#nextPage').prop('disabled', !cursorMap.has(page+1));

    const $pageNumbers = $('#pageNumbers');
    $pageNumbers.empty();

    // 지금까지 저장된 페이지 수만큼 번호 버튼 생성
    const totalPages = cursorMap.size;
    for (let i = 1; i <= totalPages; i++) {
        const $btn = $(`<button class="btn page-btn" data-page="${i}">${i}</button>`);
        if (i === page) {
            $btn.css('background-color', '#999');
        }
        $pageNumbers.append($btn);
    }

    // 페이지 번호 버튼 클릭 시 해당 페이지의 lastUid를 이용해 로드
    $('.page-btn').off('click').on('click', function () {
        const targetPage = parseInt($(this).data("page"));
        if (targetPage === page) return;
        if (!cursorMap.has(targetPage)) return; //안전 검사

        page = targetPage;
        loadStoreOrders({ limit, lastUid: cursorMap.get(page) });
    });
};

/**
 * 총 주문 수 조회
 * GET /orders/store/{storeUid}/count
 */
async function updateOrderCount(){
    try {
        const response = await $.ajax({
            type: 'GET',
            url: `/orders/store/${storeInfo.storeUid}/count`,
            dataType: 'json',
        });
        $('#order-count').text(`(${response.count})`);
    } catch (err) {
        console.error('주문 수 조회 실패 :',err)
        $('#order-count').text('(?)');
    }
}

// response 주문 정보 통합하는 함수
let mergeOrderList = (input) => {
    const merged = Object.values(
        input.reduce((acc, order) => {
            const { merchantUid, items, ...rest } = order;

            if (!acc[merchantUid]) {
                acc[merchantUid] = {
                    merchantUid,
                    ...rest,
                    items: []
                };
            }

            items.forEach(item => {
                const existing = acc[merchantUid].items.find(i => i.menuName === item.menuName);
                if (existing) {
                    existing.amount += item.amount;
                } else {
                    acc[merchantUid].items.push({ ...item });
                }
            });

            return acc;
        }, {})
    );

    console.log("merged list",merged);
    return merged;
}

// 주문 조작 함수
let remoteOrder = (action) => {
    checkToken();
    setupAjax();

    $.ajax({
        type: 'GET',
        url: '/stores/orders/' + action,
        success: (response) => {
            console.log(response);
            alert(response.message);
        },
        error: (error) => {
            console.log('오류발생 : ', error);
            alert('요청 중 오류가 발생했습니다.');
        }
    });
}

// 배달 시작 함수
let startDelivery = () => {
    // 배달원 정보 입력하는 창 추가로 필요함
    
    // 인풋 창에서 받아오는 정보 셋팅 필요함
    let deliverymanType = "USER";
    let deliverymanUid = "";

    checkToken();
    setupAjax();

    // 임시 템플릿
    $.ajax({
        type: 'GET',
        url: '/',
        success: (response) => {
            console.log(response);
            alert(response.message);
        },
        error: (error) => {
            console.log('오류발생 : ', error);
            alert('요청 중 오류가 발생했습니다.');
        }
    });
}
