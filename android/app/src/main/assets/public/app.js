document.addEventListener("DOMContentLoaded", () => {
    if (!Capacitor.isNativePlatform()) {
        alert("Ứng dụng này hoạt động tốt nhất trên thiết bị di động!");
    }
});

async function showTime() {
    let now = new Date();
    let timeString = now.toLocaleTimeString();
    document.getElementById("timeDisplay").textContent = `Bây giờ là: ${timeString}`;
    
    showNotification(timeString);
}

async function showNotification(time) {
    const { LocalNotifications } = await import("@capacitor/local-notifications");

    await LocalNotifications.requestPermissions();
    await LocalNotifications.schedule({
        notifications: [
            {
                title: "Thời gian hiện tại",
                body: `Bây giờ là: ${time}`,
                id: 1,
                schedule: { at: new Date(Date.now() + 1000) }, // Thông báo sau 1 giây
            }
        ]
    });
}

async function shareTime() {
    let timeText = document.getElementById("timeDisplay").textContent;
    
    if (!timeText) {
        alert("Chưa có thời gian để chia sẻ!");
        return;
    }

    try {
        const { Share } = await import("@capacitor/share");

        // Kiểm tra xem thiết bị có hỗ trợ chia sẻ không
        const canShare = await Share.canShare();
        if (!canShare.value) {
            alert("Thiết bị này không hỗ trợ chia sẻ!");
            return;
        }

        // Chia sẻ thời gian hiện tại
        await Share.share({
            title: "Thời gian hiện tại",
            text: timeText,
            dialogTitle: "Chia sẻ thời gian",
        });

    } catch (error) {
        console.error("Lỗi khi chia sẻ:", error);
        alert("Không thể chia sẻ thời gian.");
    }
}


async function captureScreen() {
    try {
        const { Camera } = await import("@capacitor/camera");

        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: "uri",
        });

        alert("Ảnh đã được chụp!");
        console.log("📷 Ảnh chụp:", image.webPath);

        // Hiển thị ảnh lên giao diện
        let imgElement = document.getElementById("capturedImage");
        imgElement.src = image.webPath;
        imgElement.style.display = "block";

    } catch (error) {
        console.error("❌ Lỗi khi chụp ảnh:", error);
        alert("Chụp ảnh không khả dụng trên thiết bị này.");
    }
}