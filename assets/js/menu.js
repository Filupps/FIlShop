// Функциональность выпадающего меню
document.addEventListener('DOMContentLoaded', function() {
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');
    let timeoutId;

    if (dropdown) {
        dropdown.addEventListener('mouseenter', function() {
            clearTimeout(timeoutId);
            dropdown.classList.add('show');
        });

        dropdown.addEventListener('mouseleave', function() {
            timeoutId = setTimeout(function() {
                dropdown.classList.remove('show');
            }, 100); // Небольшая задержка для предотвращения мерцания
        });
    }

    // Функциональность бокового меню
    const hamburger = document.querySelector('.hamburger-menu');
    const menu = document.querySelector('.menu');

    if (hamburger && menu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            menu.classList.toggle('active');
        });

        // Закрытие меню при клике вне его
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.menu') && !e.target.closest('.hamburger-menu')) {
                hamburger.classList.remove('active');
                menu.classList.remove('active');
            }
        });
    }
}); 