// Ждем полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded'); // Для отладки

    // Функция для инициализации аккордеона
    function initAccordion() {
        // Инициализация секций
        const sections = document.querySelectorAll('.help-section');
        sections.forEach(section => {
            const header = section.querySelector('.section-header');
            const content = section.querySelector('.section-content');
            const icon = header.querySelector('.section-icon');

            // Устанавливаем начальное состояние
            content.style.display = 'none';
            icon.textContent = '+';

            // Добавляем обработчик клика
            header.addEventListener('click', function() {
                console.log('Section header clicked'); // Для отладки
                
                // Закрываем все другие секции
                sections.forEach(otherSection => {
                    if (otherSection !== section) {
                        const otherContent = otherSection.querySelector('.section-content');
                        const otherIcon = otherSection.querySelector('.section-icon');
                        otherContent.style.display = 'none';
                        otherIcon.textContent = '+';
                        otherSection.querySelector('.section-header').classList.remove('active');
                    }
                });

                // Переключаем текущую секцию
                const isActive = header.classList.contains('active');
                header.classList.toggle('active');
                content.style.display = isActive ? 'none' : 'block';
                icon.textContent = isActive ? '+' : '-';
            });
        });

        // Инициализация вопросов
        const questions = document.querySelectorAll('.help-item');
        questions.forEach(question => {
            const header = question.querySelector('.help-item-header');
            const content = question.querySelector('.help-item-content');
            const icon = header.querySelector('.item-icon');

            // Устанавливаем начальное состояние
            content.style.display = 'none';
            icon.textContent = '+';

            // Добавляем обработчик клика
            header.addEventListener('click', function(e) {
                e.stopPropagation(); // Предотвращаем всплытие события
                console.log('Question header clicked'); // Для отладки

                // Переключаем текущий вопрос
                const isActive = header.classList.contains('active');
                header.classList.toggle('active');
                content.style.display = isActive ? 'none' : 'block';
                icon.textContent = isActive ? '+' : '-';
            });
        });
    }

    // Инициализируем аккордеон
    initAccordion();

    // Обработка поиска
    const searchInput = document.querySelector('.help-search input');
    const searchButton = document.querySelector('.search-button');

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const helpItems = document.querySelectorAll('.help-item');

        helpItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const content = item.querySelector('.help-item-content').textContent.toLowerCase();
            const isVisible = title.includes(searchTerm) || content.includes(searchTerm);

            // Показываем/скрываем секцию
            const section = item.closest('.help-section');
            const sectionItems = section.querySelectorAll('.help-item');
            const hasVisibleItems = Array.from(sectionItems).some(item => 
                item.querySelector('h3').textContent.toLowerCase().includes(searchTerm) ||
                item.querySelector('.help-item-content').textContent.toLowerCase().includes(searchTerm)
            );

            section.style.display = hasVisibleItems ? 'block' : 'none';
            item.style.display = isVisible ? 'block' : 'none';

            // Раскрываем секцию и вопрос, если найдено совпадение
            if (isVisible) {
                section.querySelector('.section-header').classList.add('active');
                section.querySelector('.section-content').style.display = 'block';
                section.querySelector('.section-icon').textContent = '-';
                
                item.querySelector('.help-item-header').classList.add('active');
                item.querySelector('.help-item-content').style.display = 'block';
                item.querySelector('.item-icon').textContent = '-';
            }
        });
    }

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Обработка загрузки файлов
    const mediaUpload = document.getElementById('media-upload');
    const uploadPreview = document.querySelector('.upload-preview');
    const mediaUploadContainer = document.querySelector('.media-upload-container');

    if (mediaUploadContainer) {
        mediaUploadContainer.addEventListener('click', () => {
            mediaUpload.click();
        });
    }

    if (mediaUpload) {
        mediaUpload.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            
            files.forEach(file => {
                if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                    const reader = new FileReader();
                    
                    reader.onload = (e) => {
                        const preview = document.createElement('div');
                        preview.className = 'media-preview';
                        
                        if (file.type.startsWith('image/')) {
                            preview.innerHTML = `
                                <img src="${e.target.result}" alt="Preview">
                                <button class="remove-media">×</button>
                            `;
                        } else {
                            preview.innerHTML = `
                                <video controls>
                                    <source src="${e.target.result}" type="${file.type}">
                                </video>
                                <button class="remove-media">×</button>
                            `;
                        }
                        
                        uploadPreview.appendChild(preview);
                    };
                    
                    reader.readAsDataURL(file);
                }
            });
        });
    }

    // Удаление превью файлов
    if (uploadPreview) {
        uploadPreview.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-media')) {
                e.target.parentElement.remove();
            }
        });
    }

    // Обработка отправки формы
    const supportForm = document.querySelector('.support-form');
    if (supportForm) {
        supportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const title = document.getElementById('problem-title').value;
            const email = document.getElementById('user-email').value;
            const description = document.getElementById('problem-description').value;
            const files = Array.from(mediaUpload.files);
            
            // Здесь будет отправка данных на сервер
            console.log('Form submitted:', {
                title,
                email,
                description,
                files
            });
            
            // Очистка формы
            supportForm.reset();
            uploadPreview.innerHTML = '';
            
            // Показ сообщения об успешной отправке
            alert('Ваше обращение успешно отправлено! Мы свяжемся с вами по указанному email.');
        });
    }
}); 