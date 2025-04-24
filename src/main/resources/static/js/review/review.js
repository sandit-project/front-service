// 1) 모든 리뷰 조회
async function fetchAllReviews() {
    try {
        const res = await fetch('/reviews');
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        const list = document.getElementById('reviewList');
        list.innerHTML = '';
        data.forEach(r => {
            const li = document.createElement('li');
            li.textContent = `UID:${r.uid} | User:${r.userUid} | Order:${r.orderUid} | Rate:${r.rate} | Title:${r.title}`;
            list.appendChild(li);
        });
    } catch (e) {
        alert('전체 조회 실패: ' + e.message);
    }
}

// 2) UID로 리뷰 조회
async function fetchReviewById() {
    const uid = document.getElementById('uidInput').value;
    try {
        const res = await fetch(`/reviews/${uid}`);
        if (!res.ok) throw new Error(res.statusText);
        const r = await res.json();
        document.getElementById('reviewDetail').textContent = JSON.stringify(r, null, 2);
    } catch (e) {
        alert('UID 조회 실패: ' + e.message);
    }
}

// 3) 사용자 UID로 리뷰 조회
async function fetchReviewsByUser() {
    const userUid = document.getElementById('userUidInput').value;
    try {
        const res = await fetch(`/reviews/user/${userUid}`);
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        const list = document.getElementById('userReviews');
        list.innerHTML = '';
        data.forEach(r => {
            const li = document.createElement('li');
            li.textContent = `UID:${r.uid} | Order:${r.orderUid} | Rate:${r.rate} | Title:${r.title}`;
            list.appendChild(li);
        });
    } catch (e) {
        alert('사용자별 조회 실패: ' + e.message);
    }
}

// 4) 리뷰 작성
async function createReview(event) {
    event.preventDefault();
    const body = {
        userUid:    Number(document.getElementById('createUserUid').value),
        socialUid:  document.getElementById('createSocialUid').value,
        orderUid:   Number(document.getElementById('createOrderUid').value),
        rate:       Number(document.getElementById('createRate').value),
        title:      document.getElementById('createTitle').value,
        content:    document.getElementById('createContent').value
    };
    try {
        const res = await fetch('/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error(res.statusText);
        const json = await res.json();
        document.getElementById('createResponse').textContent = JSON.stringify(json, null, 2);
        fetchAllReviews();
    } catch (e) {
        alert('작성 실패: ' + e.message);
    }
}

// 5) 리뷰 삭제
async function deleteReview() {
    const uid   = document.getElementById('deleteUid').value;
    const token = document.getElementById('deleteToken').value;
    try {
        const res = await fetch(`/reviews/${uid}`, {
            method: 'DELETE',
            headers: { 'Authorization': token }
        });
        if (!res.ok) throw new Error(res.statusText);
        const json = await res.json();
        document.getElementById('deleteResponse').textContent = JSON.stringify(json, null, 2);
        fetchAllReviews();
    } catch (e) {
        alert('삭제 실패: ' + e.message);
    }
}

// 이벤트 리스너 바인딩
document.getElementById('btnAll').addEventListener('click', fetchAllReviews);
document.getElementById('btnById').addEventListener('click', fetchReviewById);
document.getElementById('btnByUser').addEventListener('click', fetchReviewsByUser);
document.getElementById('createForm').addEventListener('submit', createReview);
document.getElementById('btnDelete').addEventListener('click', deleteReview);
