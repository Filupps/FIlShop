function showDevelopmentNotification() {
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = 'dev-notification';
    notification.innerHTML = `
        <span>Раздел находится в разработке</span>
        <button class="close-btn">×</button>
    `;

    // Добавляем на страницу
    document.body.appendChild(notification);

    // Обработчик закрытия
    const closeBtn = notification.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        notification.classList.add('hide');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });

    // Автоматическое закрытие через 5 секунд
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.add('hide');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Добавляем обработчик для всех ссылок "Отзывы"
document.addEventListener('DOMContentLoaded', () => {
    const reviewsLinks = document.querySelectorAll('a[href="#"][class="menu-item"]');
    reviewsLinks.forEach(link => {
        if (link.textContent === 'Отзывы') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showDevelopmentNotification();
            });
        }
    });
}); 