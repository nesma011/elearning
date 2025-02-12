import { useEffect } from "react";

const SecureScreen = () => {
    useEffect(() => {
        const preventPrintScreen = (e) => {
            if (e.key === "PrintScreen") {
                e.preventDefault();
                alert("Screenshoot Unavailable");
            }
        };

        //
        const preventWinScreenshot = (e) => {
            if (e.key === "s" && e.shiftKey && e.metaKey) {
                e.preventDefault();
                alert("تم تعطيل السكرينشوت داخل الموقع!");
            }
        };

        const disableRightClick = (e) => {
            e.preventDefault();
        };

        const preventViewSource = (e) => {
            if (e.ctrlKey && (e.key === "u" || e.key === "U")) {
                e.preventDefault();
            }
        };

        // ✅ إضافة طبقة شفافة فوق الموقع لتشويش التسجيل
        const antiScreenshotLayer = document.createElement("div");
        antiScreenshotLayer.style.position = "fixed";
        antiScreenshotLayer.style.top = "0";
        antiScreenshotLayer.style.left = "0";
        antiScreenshotLayer.style.width = "100vw";
        antiScreenshotLayer.style.height = "100vh";
        antiScreenshotLayer.style.background = "rgba(255, 255, 255, 0.01)";
        antiScreenshotLayer.style.zIndex = "9999";
        antiScreenshotLayer.style.pointerEvents = "none";
        document.body.appendChild(antiScreenshotLayer);

        // ✅ تشغيل الأحداث
        document.addEventListener("keydown", preventPrintScreen);
        document.addEventListener("keydown", preventWinScreenshot);
        document.addEventListener("contextmenu", disableRightClick);
        document.addEventListener("keydown", preventViewSource);

        // ✅ تنظيف الأحداث عند الخروج
        return () => {
            document.removeEventListener("keydown", preventPrintScreen);
            document.removeEventListener("keydown", preventWinScreenshot);
            document.removeEventListener("contextmenu", disableRightClick);
            document.removeEventListener("keydown", preventViewSource);
            document.body.removeChild(antiScreenshotLayer);
        };
    }, []);

    return null;
};

export default SecureScreen;
