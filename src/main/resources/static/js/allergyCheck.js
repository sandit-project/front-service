//유저 알러지 조회
async function fetchUserAllergies(userUid) {
    try {
        const data = await $.ajax({
            url: `/api/ai/users/${userUid}/allergies`,
            type: 'GET',
            dataType: 'json'
        });
        window.globalUserAllergies = data.allergy || [];
        console.log("유저 알러지:", window.globalUserAllergies);
        return data.allergy || []; // ✅ 이 한 줄을 꼭 추가!!
    } catch (err) {
        console.error("알러지 조회 오류:", err);
        window.globalUserAllergies = [];
        return [];  // 실패시에도 무조건 배열 반환
    }
}

//  알러지 체크 API 호출
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
// 완제품 메뉴에서 재료 추출
window.extractIngredients = function(menuObj) {
    const ingredients = [];
    if (menuObj.breadName) ingredients.push(menuObj.breadName);
    if (menuObj.material1Name) ingredients.push(menuObj.material1Name);
    if (menuObj.material2Name) ingredients.push(menuObj.material2Name);
    if (menuObj.material3Name) ingredients.push(menuObj.material3Name);
    if (menuObj.cheeseName) ingredients.push(menuObj.cheeseName);
    for (let i = 1; i <= 8; i++) {
        const vegName = menuObj[`vegetable${i}Name`];
        if (vegName) ingredients.push(vegName);
    }
    for (let i = 1; i <= 3; i++) {
        const sauceName = menuObj[`sauce${i}Name`];
        if (sauceName) ingredients.push(sauceName);
    }
    return ingredients;
};

