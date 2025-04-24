$(document).ready(()=>{
    checkToken();
    setupAjax();

    //최초 페이지(1)는 lastUid가 null 이어야 함
    cursorMap.set(1,null);
    initStoreOrderList();

});

let cursorMap=new Map();//페이지번호 => lastUid 매핑
let page= 1;
let limit=10

let initStoreOrderList=() =>{
    //최초 페이지 로드(page 1)
    loadStoreOders({ limit, lastUid: cursorMap.get(page)});

    $('#nextPage').click(() => {
        if ($('#nextPage').prop('disabled')) return;
        //다음 페이지 커서가 있다면 페이지 번호 증가 후 해당 커서로 로드
        if (cursorMap.has(page + 1)) {
            page++;
            loadStoreOders({limit, lastUid: cursorMap.get(page)});
        }
    });


    $('#prevPage').click(() => {
        if ($('prevPage').prop('disabled')) return;
        if(page>1){
            page--;
            loadStoreOders({ limit, lastUid: cursorMap.get(page) });
        }
    });


    $('#firstPage').click((event)=>{
        page=1;
        //1페이지는 항상 null
        loadStoreOders({ limit, lastUid: cursorMap.get(1) });
    });
};

let loadStoreOders = ({ limit, lastUid }) => {
    let url = `/stores/orders/list?limit=${limit}`;
    if (lastUid !== null && lastUid !== undefined) {
        url += `&lastUid=${lastUid}`;
    }

    // 주문 목록 로드
    $.ajax({
        type: 'GET',
        url: `/stores/${storeUid}/orders/list`,
        success: (orders) => {
            const $tbody = $('#storeContent');
            $tbody.empty();

            if (!orders || orders.length === 0) {
                $tbody.append(`
                  <tr>
                    <td colspan="8" style="text-align: center;">주문 내역이 없습니다.</td>
                  </tr>
                `);
            } else {
                orders.forEach(o => {
                    const created = new Date(o.createdDate).toLocaleString();
                    const reservation = o.reservationDate
                        ? new Date(o.reservationDate).toLocaleString()
                        : '-';
                    const itemsCount = o.items ? o.items.length : 0;

                    $tbody.append(`
                      <tr>
                        <td>${o.uid}</td>
                        <td>${o.userUid}</td>
                        <td>${o.payment}</td>
                        <td>${o.status}</td>
                        <td>${created}</td>
                        <td>${reservation}</td>
                        <td>${itemsCount}</td>
                        <td>
                          <a href="/store/orders/detail?uid=${o.storeUid}">상세</a>
                        </td>
                      </tr>
                    `);
                });
            }
        },
        error: (err) => {
            console.error('주문 목록 조회 오류 ::', err);
        }
    });

    // 1페이지에서 초기화
    if (page === 1) {
        cursorMap.clear();
        cursorStack = [];
        cursorMap.set(1, null);
    }

    // 만약 현재 페이지의 데이터가 꽉 차 있고 다음 페이지 커서가 있다면,
    // 다음 페이지(lastUid)는 현재 응답의 nextCursor로 설정
    if (response.nextCursor && response.storeList.length === limit) {
        if (!cursorMap.has(page + 1)) {
            cursorMap.set(page + 1, response.nextCursor);
        }
    }

    updatePaginationButtons(response);

};

//페이지 번호 생성
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
        loadStoreOders({ limit, lastUid: cursorMap.get(page) });
    });
};

let logout = () => {
    $.ajax({
        type: 'POST',
        url: '/logout',
        success: () => {
            alert('로그아웃이 성공했습니다.');
            localStorage.removeItem('accessToken');
            window.location.href = '/member/login'
        },
        error: (error) => {
            console.log('오류발생 : ', error);
            alert('로그아웃 중 오류가 발생했습니다.');
        }
    });
}