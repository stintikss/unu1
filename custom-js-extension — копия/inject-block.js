(async function () {
    console.log("🚀 Inject script loaded!"); // Проверяем, что скрипт загрузился

    function clickShowLink() {
        setTimeout(() => {
            const showLink = document.getElementById("show_link");
            if (showLink && showLink.style.display !== "none") {
                showLink.click();
                console.log('✅ Клик по "show_link" выполнен!');
            } else {
                console.warn('⚠️ Элемент с id="show_link" не найден или уже скрыт!');
            }
        }, 1000);
    }

    function highlightScreenshotRequest() {
        const hintElement = document.querySelector('.edit-task__hint');

        if (hintElement && hintElement.textContent.includes("Заказчик просит прикрепить к отчёту скриншот. Загрузите его здесь")) {
            console.log("📸 Требуется загрузить скриншот! Добавляем выделение...");

            hintElement.style.cssText = `
                border: 3px solid red;
                padding: 10px;
                border-radius: 5px;
                animation: blink-border 1s infinite alternate;
            `;

            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes blink-border {
                    from { border-color: red; }
                    to { border-color: yellow; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        clickShowLink();
        highlightScreenshotRequest();
    });

    if (window.location.href.startsWith("https://unu.im/tasks/report/")) {
        console.log("📝 Находимся на нужной странице:", window.location.href);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Ждём загрузки контента
            clickShowLink(); // Повторный клик после загрузки страницы

            const editTask = document.querySelector(".edit-task");

            console.log("🌐 Запрашиваем https://unu.im/dashboard...");
            const responseDashboard = await fetch("https://unu.im/dashboard");

            if (!responseDashboard.ok) {
                throw new Error(`❌ Ошибка загрузки dashboard: ${responseDashboard.status}`);
            }

            const textDashboard = await responseDashboard.text();
            console.log("✅ Страница dashboard загружена!");

            const parserDashboard = new DOMParser();
            const docDashboard = parserDashboard.parseFromString(textDashboard, "text/html");

            const balanceBlock = docDashboard.querySelector(".personal-area__block.block-balance");
            if (balanceBlock) {
                console.log("💰 Блок баланса найден! Добавляем на страницу...");
                const clonedBlock = balanceBlock.cloneNode(true);

                clonedBlock.style.cssText = `
                    max-width: 100%;
                    margin-right: 0px;
                    margin-top: -50px;
                    padding: 15px;
                    border: 2px solid #ddd;
                    border-radius: 10px;
                    background: #61647a;
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
                `;

                if (editTask) {
                    editTask.parentNode.insertBefore(clonedBlock, editTask.nextSibling);
                    console.log("✅ Блок баланса добавлен после .edit-task!");
                } else {
                    console.warn("⚠️ Элемент .edit-task не найден! Добавляем в конец body.");
                    document.body.appendChild(clonedBlock);
                }

                document.querySelector('.side-note')?.remove();
                document.querySelector('.personal-area__btn')?.remove();

                if (editTask) {
                    editTask.style.width = '100%';
                    console.log("📏 Ширина .edit-task изменена на 100%");
                }

                console.log("👤 Запрашиваем https://unu.im/users/2089641...");
                const responseUser = await fetch("https://unu.im/users/2089641");

                if (!responseUser.ok) {
                    throw new Error(`❌ Ошибка загрузки страницы пользователя: ${responseUser.status}`);
                }

                const textUser = await responseUser.text();
                console.log("✅ Страница пользователя загружена!");

                const parserUser = new DOMParser();
                const docUser = parserUser.parseFromString(textUser, "text/html");

                const tableRows = docUser.querySelectorAll(".page-table tbody tr");
                if (tableRows.length >= 8) {
                    const clonedRow = tableRows[7].cloneNode(true);

                    const infoBox = document.createElement("div");
                    infoBox.style.cssText = `
                        margin-top: 15px;
                        padding: 10px;
                        border: 1px solid #ccc;
                        border-radius: 8px;
                        background: #b8b9c0;
                        box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
                        font-family: Arial, sans-serif;
                        font-size: 14px;
                        color: #333;
                        text-align: left;
                    `;

                    infoBox.innerHTML = "<strong>Доп. информация:</strong>";
                    infoBox.appendChild(clonedRow);

                    clonedBlock.appendChild(infoBox);
                    console.log("📌 8-й <tr> добавлен внутрь блока баланса!");
                }

            } else {
                console.warn("⚠️ Блок .personal-area__block.block-balance не найден!");
            }

            highlightScreenshotRequest(); // Проверяем необходимость загрузки скриншота

            const pageTitle = document.querySelector('.page-title');
            const fullDescr = document.getElementById('full_descr');

            if (pageTitle || fullDescr) {
                const textContent = `${pageTitle?.textContent} ${fullDescr?.textContent}`.toLowerCase();

                // Ozon-specific block removed here
                // If there's no need to handle Ozon, we can skip the logic that checks for Ozon references.
                
                // Проверка на Telegram, Instagram, Facebook, Tiktok
                const socialPlatforms = ["telegram", "телеграм", "телеграмм", "instagram", "инстаграм", "facebook", "фейсбук", "tiktok", "тикток", "вконтакте"];
                if (socialPlatforms.some(platform => textContent.includes(platform))) {
                    console.log("📲 Обнаружено упоминание в заголовке страницы!");

                    const editTaskItem = document.querySelector('.edit-task__item textarea');
                    if (editTaskItem) {
                        if (/вконтакте/i.test(textContent)) {
                            editTaskItem.value = "https://vk.com/n_nikitka_k";
                            console.log("✅ Вставлена ссылка на ВКонтакте!");
                        } else {
                            editTaskItem.value = "@mefistofefel";
                            console.log("✅ Вставлен текст: @mefistofefel в textarea!");
                        }
                    } else {
                        console.warn("⚠️ Textarea внутри .edit-task__item не найдена!");
                    }
                }
            }

            document.addEventListener("click", (event) => {
                if (event.target.classList.contains("bt-purle")) {
                    console.log("🟣 Кнопка .bt-purle нажата! Следим за переходом...");

                    const observer = new MutationObserver(() => {
                        if (window.location.href.startsWith("https://unu.im/tasks/works")) {
                            console.log("✅ Перешли на /tasks/works, закрываем страницу...");
                            window.close();
                        }
                    });

                    observer.observe(document.body, { childList: true, subtree: true });
                }
            });

        } catch (error) {
            console.error("❌ Ошибка:", error);
        }
    } else {
        console.log("⛔ Не на целевой странице, скрипт завершает работу.");
    }
})();
