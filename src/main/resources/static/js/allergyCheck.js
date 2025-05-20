
async function fetchUserAllergies(userUid) {
    try {
        const data = await $.ajax({
            url: `/api/ai/users/${userUid}/allergies`,
            type: 'GET',
            dataType: 'json'
        });
        window.globalUserAllergies = data.allergy || [];
        console.log("유저 알러지:", window.globalUserAllergies);
    } catch (err) {
        console.error("알러지 조회 오류:", err);
        window.globalUserAllergies = [];
    }
}

// 1) 알러지 체크 API 호출
async function checkAllergyAPI(body) {
    try {
        const response = await $.ajax({
            url: '/api/ai/check-allergy',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(body),
            dataType: 'json'
        });
        return response;  // { risk, cause, detail }
    } catch (error) {
        alert("알러지 체크 오류: " + (error.responseText || error.statusText));
        return { risk: false, cause: [], detail: '체크 중 오류 발생' };
    }
}

// 2) 경고 UI 표시
function showAllergyWarning(result) {
    $('#allergyWarning').html(
        `<div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
            <p class="font-bold">알러지 위험 경고</p>
            <p>원인: ${result.cause && result.cause.length > 0 ? result.cause.join(', ') : '원인 불명'}</p>
            <p>${result.detail || ''}</p>
        </div>`
    ).show();
}
