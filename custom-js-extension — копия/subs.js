(function () {
    function countOpenedCategories() {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();

        chrome.storage.local.get(['openedCategories'], (data) => {
            let openedCategories = data.openedCategories || {};

            if (!openedCategories[currentYear]) {
                openedCategories[currentYear] = {};
            }

            openedCategories[currentYear][currentMonth] = (openedCategories[currentYear][currentMonth] || 0) + 1;

            chrome.storage.local.set({ openedCategories }, () => {
                console.log('Категории обновлены:', openedCategories);
            });
        });
    }

    function highlightSubscribersAndClick() {
        if (document.querySelector('#rc-anchor-container')) {
            console.log("🚨 Обнаружена капча! Остановка работы и запуск таймера на 3 минуты...");
            startCountdown(180, "⏳ Перезагрузка из-за капчи через");
            setTimeout(() => {
                location.reload();
            }, 180000);
            return;
        }

        const tasks = document.querySelectorAll('.task-type');
        console.log('🔎 Найдено заданий:', tasks.length);
        const categories = [
            "Активность по карточке (лайк, избранное, клики)",
            "Подписчики",
            "Лайки",
            "Поиск/просмотр объявления"
        ];

        let foundTasks = false;

        tasks.forEach(taskTypeElement => {
            const taskText = taskTypeElement.textContent.trim();
            console.log('🎯 Обрабатываем категорию:', taskText);

            if (!categories.includes(taskText)) return;

            foundTasks = true;
            const taskContainer = taskTypeElement.closest('.search-task__table-row');

            if (!taskContainer || taskContainer.classList.contains('clicked-task')) return;

            taskContainer.classList.add('clicked-task');
            taskContainer.style.backgroundColor = "#ff0";
            const taskNameElement = taskContainer.querySelector('.task-name');

            if (!taskNameElement) return;

            const taskNameText = taskNameElement.textContent.trim().toLowerCase();

            if (taskNameText.includes("ozon") || taskNameText.includes("озон")) {
                console.log(`❌ Пропускаем задание: ${taskNameText}`);
                return;
            }

            console.log(`✅ Нажимаем на элемент .task-name (${taskText})`);
            taskNameElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            taskNameElement.click();

            const purpleButton = taskContainer.querySelector('.purple-button');
            if (purpleButton) {
                if (!purpleButton.id) {
                    const uniqueId = 'purple-button-' + Date.now();
                    purpleButton.id = uniqueId;
                    console.log(`🆔 Добавлен уникальный ID к кнопке: ${uniqueId}`);
                }

                if (!purpleButton.classList.contains('clicked')) {
                    console.log(`🟣 Нажимаем на кнопку .purple-button (${taskText})`);
                    purpleButton.click();
                    purpleButton.classList.add('clicked');
                }
            }

            countOpenedCategories();
        });

        if (!foundTasks) {
            console.log("⚠️ Подходящих заданий не найдено.");
        }

        clickShowMoreIfNeeded();
    }

    function clickShowMoreIfNeeded() {
        if (document.querySelector('#rc-anchor-container')) return;

        const showMoreButton = document.getElementById('show_more_button');
        const noTasksMessage = document.querySelector('.search-task__table-cell');

        if (noTasksMessage && noTasksMessage.innerText.includes("Пока больше нет доступных заданий по заданным критериям")) {
            console.log("⚠️ Нет доступных заданий.");
        }

        if (showMoreButton) {
            if (!showMoreButton.classList.contains('clicked')) {
                console.log("📌 Нажимаем кнопку 'Показать ещё'");
                showMoreButton.click();
                showMoreButton.classList.add('clicked');

                setTimeout(() => {
                    showMoreButton.classList.remove('clicked');
                    highlightSubscribersAndClick();
                }, 2000);
            }
        }
    }

    function startCountdown(seconds, message) {
        let counter = seconds;
        const interval = setInterval(() => {
            console.log(`${message} ${counter} секунд...`);
            counter--;

            if (counter <= 0) {
                clearInterval(interval);
            }
        }, 1000);
    }

    function scheduleReload() {
        if (document.querySelector('#rc-anchor-container')) {
            console.log("🚨 Капча обнаружена. Запуск таймера на 3 минуты...");
            startCountdown(180, "⏳ Перезагрузка из-за капчи через");
            setTimeout(() => {
                location.reload();
            }, 180000);
            return;
        }

        console.log("⏳ Запуск таймера на 2.5 минуты...");
        startCountdown(150, "⏳ Перезагрузка через");
        setTimeout(() => {
            location.reload();
        }, 90000);
    }

    const observerSubs = new MutationObserver(() => {
        if (!document.querySelector('#rc-anchor-container')) {
            setTimeout(highlightSubscribersAndClick, 1000);
        }
    });

    observerSubs.observe(document.body, { childList: true, subtree: true });

    setTimeout(highlightSubscribersAndClick, 1500);
    setInterval(scheduleReload, 150000);

    console.log("🚀 Выделение и клик для категорий запущены!");
    scheduleReload();
})();
