(function() {
    console.log("withdrawal.js загружен!");

    function autoFillFields() {
        console.log("⏳ Скрипт запущен, ждём 3 секунды для подгрузки элементов...");
        
        setTimeout(() => {
            console.log("🔍 Начинаем искать элементы на странице...");

            // 📌 Проверяем наличие всех элементов
            const hintElement = document.querySelector('.edit-task__hint');
            console.log("👀 .edit-task__hint найден?", hintElement ? "✅ Да" : "❌ Нет");

            const sumInput = document.querySelector('.edit-task__item input[name="sum"]');
            console.log("👀 input[name='sum'] найден?", sumInput ? "✅ Да" : "❌ Нет");

            const purseInput = document.querySelector('.edit-task__item input[name="purse"]');
            console.log("👀 input[name='purse'] найден?", purseInput ? "✅ Да" : "❌ Нет");

            const purseSelect = document.querySelector('#purse_holder_block select[name="purse_holder"]');
            console.log("👀 select[name='purse_holder'] найден?", purseSelect ? "✅ Да" : "❌ Нет");

            // 📌 Вставка суммы вывода
            if (hintElement) {
                console.log("📄 Текст .edit-task__hint:", hintElement.textContent);
                const match = hintElement.textContent.match(/(\d+(\.\d+)?) руб/);
                if (match) {
                    const availableAmount = match[1];
                    console.log("💰 Распознанная сумма:", availableAmount);
                    if (sumInput) {
                        sumInput.value = availableAmount;
                        sumInput.dispatchEvent(new Event('input', { bubbles: true }));
                        console.log("✅ Вставлена сумма в input[name='sum']");
                    }
                }
            }

            // 📌 Вставка номера кошелька
            if (purseInput) {
                purseInput.value = '79922087015';
                purseInput.dispatchEvent(new Event('input', { bubbles: true }));
                console.log("✅ Вставлен номер кошелька в input[name='purse']");
            }

            // 📌 Выбор "Тинькофф Банк" (4-й option)
            if (purseSelect) {
                console.log("📌 Найден select[name='purse_holder'] с", purseSelect.options.length, "опциями");
                if (purseSelect.options.length >= 4) {
                    purseSelect.value = purseSelect.options[3].value;
                    purseSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log("✅ Выбран 4-й option:", purseSelect.options[3].textContent);
                }
            }

        }, 3000); // Ждём 3 секунды, если страница загружается медленно
    }

    document.addEventListener('DOMContentLoaded', () => {
        console.log("📢 DOMContentLoaded сработал!");
        autoFillFields();
    });

    window.addEventListener('load', () => {
        console.log("📢 window.load сработал! Повторяем авто-заполнение...");
        autoFillFields();
    });

})();
