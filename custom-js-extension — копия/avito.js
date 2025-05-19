let clickedSVG = false;
let clickedDesktopImage = false;
let clickedReadMore = false;
let userClickedImage = false; // Флаг, если пользователь сам выбрал изображение

// Функция для клика на последнее изображение, если пользователь сам ничего не выбрал
function clickLastImage() {
    if (userClickedImage) {
        console.log("⚠️ Пользователь уже выбрал изображение вручную, пропускаем автоклик.");
        return false;
    }

    let imageElements = document.querySelectorAll('li[data-marker="image-preview/item"] img');

    if (imageElements.length > 0) {
        let lastImageElement = imageElements[imageElements.length - 1];

        if (lastImageElement) {
            console.log("✅ Нажимаю на последнее изображение:", lastImageElement);
            lastImageElement.click();

            setTimeout(clickDesktopImage, 1000);
            return true;
        }
    }

    console.log("❌ Не найдено изображений для нажатия.");
    return false;
}

// Позволяет пользователю кликнуть вручную, игнорируя автоклик
document.addEventListener("click", (event) => {
    if (event.target.closest('li[data-marker="image-preview/item"] img')) {
        console.log("🛑 Пользователь выбрал изображение вручную:", event.target);
        userClickedImage = true; // Устанавливаем флаг, чтобы автоклик не срабатывал
    }
});

// Функция для клика на img в image-frame
function clickDesktopImage() {
    if (clickedDesktopImage) return false;

    let imageFrame = document.querySelector('div.image-frame-wrapper-_NvbY img.desktop-1ky5g7j');

    if (imageFrame) {
        console.log("✅ Нажимаю на img.desktop-1ky5g7j:", imageFrame);
        imageFrame.click();
        clickedDesktopImage = true;

        return true;
    }

    console.log("❌ img.desktop-1ky5g7j не найден.");
    return false;
}

// Функция для клика на SVG Path
// function clickSVGPath() {
//     if (clickedSVG) return false;

//     let svgPath = document.querySelector("svg.style-iconRedesign-Z7LuN path");

//     if (svgPath) {
//         console.log("✅ Нажимаю на SVG Path:", svgPath);
//         svgPath.dispatchEvent(new MouseEvent('click', { bubbles: true }));

//         clickedSVG = true;
//         return true;
//     }

//     console.log("❌ SVG Path не найден.");
//     return false;
// }

// Функция для клика на "Читать полностью"
function clickReadMore() {
    if (clickedReadMore) return false;

    let readMoreLink = document.querySelector('div.style-item-description-pL_gy a[role="button"][tabindex="0"].styles-module-root-iSkj3');

    if (readMoreLink && readMoreLink.textContent.trim() === "Читать полностью") {
        console.log("✅ Нажимаю на 'Читать полностью':", readMoreLink);
        readMoreLink.click();
        clickedReadMore = true;
        return true;
    }

    console.log("❌ Кнопка 'Читать полностью' не найдена.");
    return false;
}

// Попытки кликнуть 10 раз с интервалом 500 мс
let attempts = 0;
let interval = setInterval(() => {
    let clickedImage = clickLastImage();
    let clickedReadMore = clickReadMore();

    if (clickedImage || clickedReadMore || attempts >= 10) {
        clearInterval(interval);
    }

    attempts++;
}, 500);

// Отслеживание изменений в DOM (если элементы появляются позже)
const observer = new MutationObserver(() => {
    let clickedImage = clickLastImage();
    let clickedDesktop = clickDesktopImage();
    let clickedReadMore = clickReadMore();

    if (clickedImage && clickedDesktop && clickedPath && clickedReadMore) {
        observer.disconnect();
    }
});

observer.observe(document.body, { childList: true, subtree: true });
