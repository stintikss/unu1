(async function () {
    let lastBalance = null;
    let lastTaskStatus = null;
    let lastInfoContent = null; // Для отслеживания изменений в дополнительной информации
    let refreshCount = localStorage.getItem("refreshCount") || 0;
    let startBalance = parseFloat(localStorage.getItem("startBalance")) || null;

    const noop = () => {};
    const log = noop;
    const error = noop;

    async function injectBalance() {
        try {
            const response = await fetch("https://unu.im/dashboard");
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");

            const balanceBlock = doc.querySelector(".block-balance");
            if (!balanceBlock) return error("Балансный блок не найден.");

            const perso = doc.querySelector(".personal-area__btn");
            if (perso) perso.remove();

            const title = document.querySelector(".page-title");
            if (title && title.textContent.includes("Активные конкурсы")) {
                title.textContent = "Баланс";
            }

            const targetContainer = document.querySelector(".container.container-mobile.competitions");
            if (!targetContainer) return error("Целевой контейнер не найден.");

            document.querySelector("#custom-balance-block")?.remove();

            const clonedBlock = balanceBlock.cloneNode(true);
            clonedBlock.id = "custom-balance-block";

            Object.assign(clonedBlock.style, {
                border: "2px solid #4CAF50",
                padding: "15px",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                marginBottom: "15px",
                fontSize: "16px",
                fontWeight: "bold",
                textAlign: "center",
                position: "relative",
                maxWidth: "100%",
            });

            const balanceSpan = clonedBlock.querySelector("span");
            const balanceValue = parseFloat(balanceSpan.textContent.replace(/[^\d.]/g, ""));

            if (!isNaN(balanceValue)) {
                if (startBalance === null) {
                    startBalance = balanceValue;
                    localStorage.setItem("startBalance", startBalance);
                }

                const dailyChange = balanceValue - startBalance;
                localStorage.setItem("dailyChange", dailyChange);

                if (lastBalance !== null && lastBalance !== balanceValue) {
                    refreshCount++;
                    localStorage.setItem("refreshCount", refreshCount);
                    log(`Баланс изменился! Обновляем страницу... (${refreshCount} раз)`);
                    location.reload();
                }
                lastBalance = balanceValue;
            }

            const dailyChangeElement = document.createElement("div");
            dailyChangeElement.id = "daily-change";
            Object.assign(dailyChangeElement.style, {
                marginTop: "10px",
                fontSize: "22px",
                fontWeight: "bold",
                color: (balanceValue - startBalance) >= 0 ? "green" : "red",
            });
            dailyChangeElement.textContent = `Изменение за день: ${(balanceValue - startBalance).toFixed(2)} руб`;
            clonedBlock.appendChild(dailyChangeElement);

            const clearButton = document.createElement("button");
            clearButton.textContent = "Очистить консоль";
            Object.assign(clearButton.style, {
                display: "block",
                margin: "10px auto 0",
                padding: "8px 12px",
                fontSize: "14px",
                backgroundColor: "#ff4d4d",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                width: "90%",
            });

            clearButton.addEventListener("click", () => {
                console.clear();
                refreshCount = 0;
                localStorage.setItem("refreshCount", 0);
                log("Консоль очищена. Счетчик обновлений сброшен.");
            });

            clonedBlock.appendChild(clearButton);
            targetContainer.prepend(clonedBlock);


            const ConclusionBalance = document.createElement("button");
            ConclusionBalance.textContent = "Вывести деньги";
            Object.assign(ConclusionBalance.style, {
                display: "block",
                margin: "10px auto 0",
                padding: "8px 12px",
                fontSize: "14px",
                backgroundColor: "#40836e",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                width: "90%",
            });

            ConclusionBalance.addEventListener("click", () => {
                window.open('https://unu.im/money/withdrawal/12', '_blank');
            });

            clonedBlock.appendChild(ConclusionBalance);

            log("Балансный блок обновлён.");
            await injectTableInfo(clonedBlock);
        } catch (error) {
            error("Ошибка при переносе блока баланса:", error);
        }
    }

    async function injectTableInfo(balanceBlock) {
        log("Запрашиваем https://unu.im/users/2089641...");

        try {
            const responseUser = await fetch("https://unu.im/users/2089641");

            if (!responseUser.ok) {
                throw new Error(`Ошибка загрузки страницы пользователя: ${responseUser.status}`);
            }

            const textUser = await responseUser.text();
            log("Страница пользователя загружена!");

            const parserUser = new DOMParser();
            const docUser = parserUser.parseFromString(textUser, "text/html");

            const tableRows = docUser.querySelectorAll(".page-table tbody tr");
            if (tableRows.length >= 8) {
                const clonedRow = tableRows[7].cloneNode(true);

                let existingInfoBox = document.querySelector("#info-box");
                if (existingInfoBox) {
                    existingInfoBox.remove();
                }

                const infoBox = document.createElement("div");
                infoBox.id = "info-box";
                infoBox.style.cssText = `
                    margin-top: 15px;
                    padding: 15px;
                    border: 2px solid #4CAF50;
                    border-radius: 8px;
                    background-color: #f1f1f1;
                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                    color: #333;
                    text-align: left;
                    max-width: 100%;
                    margin-bottom: 15px;
                `;

                clonedRow.style.fontSize = '30px'

                infoBox.innerHTML = "<strong>Доп. информация:</strong><br>";
                infoBox.appendChild(clonedRow);
                balanceBlock.appendChild(infoBox);
                log("Дополнительная информация (8-й <tr>) добавлена под блоком баланса.");

                // Проверка на изменения в дополнительной информации каждые 10 секунд
                const newInfoContent = clonedRow.textContent.trim();
                if (lastInfoContent !== null && lastInfoContent !== newInfoContent) {
                    log("Доп. информация изменилась! Обновляем страницу...");
                    location.reload();
                }
                lastInfoContent = newInfoContent;
            } else {
                error("Не удалось найти 8-й <tr> в таблице.");
            }
        } catch (error) {
            error("Ошибка при загрузке таблицы с дополнительной информацией:", error);
        }
    }

    async function checkTaskStatus() {
        try {
            const response = await fetch("https://unu.im/dashboard");
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");

            const taskBlock = doc.querySelector(".task-block");
            if (!taskBlock) return error("Блок заданий не найден.");

            const taskStatus = taskBlock.textContent.trim();

            // Увеличиваем размер текста
            taskBlock.style.fontSize = "20px"; // Увеличение текста заданий

            if (lastTaskStatus !== taskStatus) {
                lastTaskStatus = taskStatus;
                log("Статус заданий изменился! Обновляем страницу...");
                location.reload();
            }
        } catch (error) {
            error("Ошибка при проверке статуса заданий:", error);
        }
    }

    await injectBalance();
    setInterval(injectBalance, 10000); // Проверка баланса каждые 10 секунд
    setInterval(checkTaskStatus, 60000);  // Проверка изменений в заданиях каждые 60 секунд
    setInterval(() => {
        const now = new Date();
        const permTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Yekaterinburg" }));
        if (permTime.getHours() === 0 && permTime.getMinutes() === 0) {
            log("⏰ 00:00 по Пермскому времени! Сбрасываем счётчик...");
            
            // Повторно получаем баланс перед сбросом
            const balanceSpan = document.querySelector("#custom-balance-block span");
            if (balanceSpan) {
                const newStartBalance = parseFloat(balanceSpan.textContent.replace(/[^\d.]/g, ""));
                if (!isNaN(newStartBalance)) {
                    localStorage.setItem("startBalance", newStartBalance);
                }
            }
        
            location.reload();
        }        
    }, 60000);
})();
