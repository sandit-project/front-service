document.addEventListener('DOMContentLoaded', async () => {
    checkToken();
    setupAjax();

    try {
        const response = await $.ajax({
            url: '/user/info',
            method: 'GET'
        });

        // 로그인한 사용자
        initUserUI(response);
    } catch (err) {
        // 비로그인 사용자
        renderGuestUI();
    }
});
