let globalUserAllergies = [];

async function fetchUserAllergies(userUid) {
    try {
        const res = await fetch(`/api/ai/users/${userUid}/allergies`);
        if (!res.ok) throw new Error("알러지 조회 실패");
        const data = await res.json();
        globalUserAllergies = data.allergies || [];
        console.log("유저 알러지:", globalUserAllergies);
    } catch (err) {
        console.error("알러지 조회 오류:", err);
    }
}

// 1) 알러지 체크 API 호출
async function checkAllergyAPI(userAllergies, ingredients) {
    try {
        const response = await $.ajax({
            url: '/api/ai/check-allergy',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ allergy: userAllergies, ingredients }),
            dataType: 'json'
        });
        return response;  // { risk, cause, detail }
    } catch (error) {
        console.error('알러지 체크 오류:', error);
        return { risk: false, cause: [], detail: '체크 중 오류 발생' };
    }
}

// 2) 경고 UI 표시
function showAllergyWarning(result) {
    const warningHtml = `
    <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
      <p class="font-bold">알러지 위험 경고</p>
      <p>원인: ${result.cause.join(', ')}</p>
      <p>${result.detail}</p>
    </div>`;
    // 기존 cartList.js에서 쓰이는 컨테이너 맨 위에 삽입
    $('.cart-container').prepend(warningHtml);
}
