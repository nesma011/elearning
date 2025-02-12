import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function PDFViewer() {
  const location = useLocation();
  const pdfUrl = new URLSearchParams(location.search).get("file");

  useEffect(() => {
    // Prevent PrintScreen and specific key combinations
    const handleKeyDown = (event) => {
      if (event.key === "PrintScreen") {
        event.preventDefault();
        alert("Screenshots are disabled!");
      }
      if (
        event.ctrlKey &&
        ["p", "s", "i", "c", "a", "x", "u"].includes(event.key)
      ) {
        event.preventDefault();
        alert("This action is disabled!");
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    // Prevent text selection and copying
    const handleContextMenu = (event) => event.preventDefault();
    const handleCopy = (event) => event.preventDefault();
    const handleSelectStart = (event) => event.preventDefault();

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("selectstart", handleSelectStart);

    // Disable text selection via CSS
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";
    document.body.style.mozUserSelect = "none";
    document.body.style.msUserSelect = "none";

    // Add watermark
    const watermark = document.createElement("div");
    watermark.textContent = "Alex Med-Learn";
    watermark.style.position = "fixed";
    watermark.style.top = "50%";
    watermark.style.left = "50%";
    watermark.style.transform = "translate(-50%, -50%)";
    watermark.style.opacity = "0.2";
    watermark.style.fontSize = "50px";
    watermark.style.fontWeight = "bold";
    watermark.style.color = "gray";
    watermark.style.pointerEvents = "none";
    watermark.style.zIndex = "9999";
    document.body.appendChild(watermark);

    // Detect Developer Tools
    const checkDevTools = setInterval(() => {
      let devtools = /./;
      console.log(devtools);
      devtools.toString = function () {
        alert("Screen capture is disabled!");
        document.body.innerHTML = "";
        return "";
      };
    }, 1000);

    // Blur content when focus is lost
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.body.style.filter = "blur(10px)";
      } else {
        document.body.style.filter = "none";
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("selectstart", handleSelectStart);
      document.body.style.userSelect = "auto";
      document.body.removeChild(watermark);
      clearInterval(checkDevTools);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="pdf-container" style={{ width: "100vw", height: "100vh" }}>
      <iframe
  src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(pdfUrl)}`}
  width="100%"
  height="100%"
  style={{ border: "none", userSelect: "none" }}
></iframe>
    </div>
  );
}
