// app.js
async function initializeLiff() {
    // 1. 初始化 LIFF
    await liff.init({ liffId: "你的_LIFF_ID" });

    // 2. 檢查登入
    if (!liff.isLoggedIn()) {
        liff.login();
        return;
    }

    // 3. 取得 LINE 個人資料 (名字就在這裡)
    const profile = await liff.getProfile();
    
    const form = document.getElementById('leaveForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 4. 打包資料
        const formData = {
            lineName: profile.displayName, // 填表人的 LINE 名字
            lineUserId: profile.userId,    // 填表人的 LINE ID (供回覆使用)
            caseName: document.getElementById('caseName').value,
            leaveDate: document.getElementById('leaveDate').value,
            startTime: document.getElementById('startTime').value,
            endTime: document.getElementById('endTime').value,
            reason: document.getElementById('reason').value
        };

        // 5. 傳送至 n8n Webhook
        try {
            const response = await fetch('你的_N8N_WEBHOOK_URL', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // 6. 讓使用者自動在聊天室發話 (觸發機器人 Reply)
                await liff.sendMessages([{
                    type: 'text',
                    text: `已提交請假申請：${formData.caseName}`
                }]);
                liff.closeWindow(); // 關閉視窗
            }
        } catch (err) {
            alert("發送失敗，請稍後再試");
        }
    });
}

initializeLiff();
