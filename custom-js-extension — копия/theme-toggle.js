(function () {
    if (document.querySelector("#theme-toggle")) return;

    const button = document.createElement("button");
    button.id = "theme-toggle";
    button.innerText = "🌙";
    button.style.position = "absolute";
    button.style.bottom = "10px";
    button.style.right = "10px";
    button.style.width = "30px";
    button.style.height = "30px";
    button.style.border = "none";
    button.style.borderRadius = "50%";
    button.style.cursor = "pointer";
    button.style.zIndex = "9999";
    button.style.fontSize = "16px";
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";

    const header = document.querySelector(".header");
    if (!header) return;
    header.appendChild(button);

    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);

    button.addEventListener("click", () => {
        const newTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
        applyTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    });

    function applyTheme(theme) {
        document.body.dataset.theme = theme;

        const elements = [
            { selector: ".site-body", light: "#e0e0e0", dark: "#292929" },
            { selector: ".personal-area__block.block-balance", light: "#e0e0e0", dark: "#1e1e1e" },
            { selector: ".personal-area__block.block-pechenki", light: "#e0e0e0", dark: "#1e1e1e" },
            { selector: ".personal-area-news", light: "#e0e0e0", dark: "#1e1e1e" },
            { selector: ".search-task__table-row", light: "#e0e0e0", dark: "#1e1e1e" },
            { selector: ".page", light: "#fdfdfd", dark: "#202020" }, // Теперь фон .page светлее
            { selector: ".edit-task__content.main-tab.active", light: "#e0e0e0", dark: "#202020" }
        ];

        elements.forEach(({ selector, light, dark }) => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.backgroundColor = theme === "dark" ? dark : light;
                el.style.color = theme === "dark" ? "#fff" : "#000";
            });
        });

        header.style.backgroundColor = theme === "dark" ? "#333" : "#d0d0d0";
        button.style.backgroundColor = theme === "dark" ? "#555" : "#bbb";
        button.style.color = theme === "dark" ? "#fff" : "#000";
        button.innerText = theme === "dark" ? "☀️" : "🌙";
    }
})();
