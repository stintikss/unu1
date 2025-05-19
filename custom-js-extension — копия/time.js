// (function () {
//     let openedLinks = new Set();
//     let instantStart = false;
//     let socialStart = false;
//     let openingStopped = false;

//     function createButtons() {
//         if (window.location.href.startsWith("https://unu.im/tasks/works")) {
//             let container = document.createElement("div");
//             container.style.position = "fixed";
//             container.style.top = "150px";
//             container.style.left = "50%";
//             container.style.transform = "translateX(-50%)";
//             container.style.display = "flex";
//             container.style.gap = "10px";
//             container.style.zIndex = "1000";

//             let instantButton = createButton("Открыть все задания", "#ff4b4b", () => {
//                 console.log("Начинаем бесконечное открытие всех заданий!");
//                 instantStart = true;
//                 socialStart = false;
//                 openingStopped = false;
//                 openJobLinks(false);
//             });

//             let socialButton = createButton("Открыть только соцсети", "#4b83ff", () => {
//                 console.log("Начинаем открытие только соцсетей!");
//                 socialStart = true;
//                 instantStart = false;
//                 openingStopped = false;
//                 openJobLinks(true);
//             });

//             // Добавление информации о количестве заданий
//             let jobsCountText = document.createElement("span");
//             jobsCountText.style.fontSize = "16px";
//             jobsCountText.style.color = "#e9e9e9";

//             // Функция для обновления текста о количестве заданий
//             function updateJobsCount() {
//                 let jobRows = document.querySelectorAll('.job-table__row');
//                 jobsCountText.textContent = `Текущих заданий: ${jobRows.length}`;
//             }

//             // Обновляем количество заданий при загрузке страницы
//             updateJobsCount();

//             // Обновляем количество заданий каждые 2 секунды
//             setInterval(updateJobsCount, 2000);

//             container.appendChild(instantButton);
//             container.appendChild(socialButton);
//             container.appendChild(jobsCountText);
//             document.body.appendChild(container);
//         }
//     }

//     function createButton(text, color, onClick) {
//         let button = document.createElement("button");
//         button.textContent = text;
//         button.style.padding = "10px 15px";
//         button.style.background = color;
//         button.style.color = "#fff";
//         button.style.border = "none";
//         button.style.borderRadius = "5px";
//         button.style.cursor = "pointer";
//         button.style.fontSize = "16px";
//         button.onclick = onClick;
//         return button;
//     }

//     function highlightJobs() {
//         setInterval(() => {
//             document.querySelectorAll('.job-table__row').forEach(row => {
//                 let statusElement = row.querySelector('.job__status-work');
//                 let jobNameElement = row.querySelector('a.job-name');

//                 if (statusElement) {
//                     let text = statusElement.textContent;
//                     if (text.match(/(\d+)\s*мин/)) {
//                         row.style.border = "3px solid #ffcd00"; // Обводка желтая для минутных
//                     }
//                 }

//                 if (jobNameElement) {
//                     let jobText = jobNameElement.textContent.toLowerCase();
//                     if (["telegram", "instagram", "facebook", "tiktok"].some(social => jobText.includes(social))) {
//                         row.style.backgroundColor = "#ff999947"; // Красный для соцсетей
//                     }
//                 }
//             });
//         }, 2000);
//     }

//     highlightJobs();

//     function openJobLinks(onlySocial) {
//         if (openingStopped) {
//             console.log("Открытие остановлено.");
//             return;
//         }

//         let minuteLinks = [];
//         let hourLinks = [];

//         document.querySelectorAll('.job-name').forEach(jobName => {
//             let row = jobName.closest('.job-table__row');
//             let link = jobName.closest('a');
//             let statusElement = row?.querySelector('.job__status-work');

//             if (link && link.href && !openedLinks.has(link.href)) {
//                 let jobText = jobName.textContent.toLowerCase();
//                 let isSocial = ["telegram", "instagram", "facebook", "tiktok"].some(social => jobText.includes(social));

//                 if (onlySocial && !isSocial) return;

//                 if (statusElement) {
//                     const text = statusElement.textContent;
//                     let minutesMatch = text.match(/(\d+)\s*мин/);
//                     let hoursMatch = text.match(/(\d+)\s*ч/);

//                     if (minutesMatch) {
//                         minuteLinks.push({
//                             link: link,
//                             minutes: parseInt(minutesMatch[1]) // Добавляем количество минут
//                         });
//                     } else if (hoursMatch) {
//                         hourLinks.push({ link, hours: parseInt(hoursMatch[1]) });
//                     }
//                 }
//             }
//         });

//         // Сортируем минутные задания по времени (по возрастанию минут)
//         minuteLinks.sort((a, b) => a.minutes - b.minutes);

//         hourLinks.sort((a, b) => a.hours - b.hours);
//         let sortedHourLinks = hourLinks.map(item => item.link);

//         console.log(`Найдено ${minuteLinks.length} минутных заданий, ${sortedHourLinks.length} часовых.`);

//         function openLinks(links, onComplete) {
//             if (links.length === 0) {
//                 console.log("Нет новых заданий для открытия. Ждем 5 секунд...");
//                 setTimeout(() => onComplete(), 5000);
//                 return;
//             }

//             let index = 0;

//             function openNext() {
//                 if (index < links.length) {
//                     let link = links[index];
//                     console.log(`Открываю: ${link.href}`);
//                     window.open(link.href, '_blank');
//                     openedLinks.add(link.href);
//                     index++;
//                     setTimeout(openNext, 1200);
//                 } else {
//                     console.log("Все задания открыты.");
//                     onComplete();
//                 }
//             }

//             openNext();
//         }

//         // Сначала открываем минутные задания в порядке возрастания минут
//         openLinks(minuteLinks.map(item => item.link), () => {
//             // После завершения минутных заданий, открываем часовые задания
//             openLinks(sortedHourLinks, () => {
//                 console.log("Все задания открыты.");
//             });
//         });

//         clickShowMore();
//     }

//     function clickShowMore() {
//         let showMoreButton = document.getElementById("show_more_button");
//         if (!showMoreButton) {
//             console.log("⛔ Кнопка 'Показать ещё' не найдена.");
//             return;
//         }

//         console.log("✅ Кнопка 'Показать ещё' найдена. Начинаем кликать...");

//         let observer = new MutationObserver(() => {
//             if (!document.getElementById("show_more_button")) {
//                 console.log("🔥 Кнопка 'Показать ещё' исчезла, остановка кликов.");
//                 observer.disconnect();
//             }
//         });

//         observer.observe(document.body, { childList: true, subtree: true });

//         function clickButton() {
//             let button = document.getElementById("show_more_button");
//             if (button) {
//                 console.log("📌 Нажимаем кнопку 'Показать ещё'");
//                 button.click();
//                 setTimeout(clickButton, 2000);
//             } else {
//                 console.log("⏹️ Кнопка 'Показать ещё' больше не доступна.");
//             }
//         }
//         clickButton();
//     }

//     createButtons();
// })();
