document.addEventListener('DOMContentLoaded', function() {
    // Обработка раскрытия/скрытия секций
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            header.classList.toggle('active');
        });
    });

    // Обработка раскрытия/скрытия вопросов
    const itemHeaders = document.querySelectorAll('.help-item-header');
    itemHeaders.forEach(header => {
        header.addEventListener('click', () => {
            header.classList.toggle('active');
        });
    });

    // Поиск по вопросам
    const searchInput = document.querySelector('.help-search input');
    const searchButton = document.querySelector('.search-button');

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const helpItems = document.querySelectorAll('.help-item');

        helpItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const content = item.querySelector('.help-item-content').textContent.toLowerCase();
            const isVisible = title.includes(searchTerm) || content.includes(searchTerm);

            // Показываем/скрываем секцию, если в ней есть результаты поиска
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
                item.querySelector('.help-item-header').classList.add('active');
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

    mediaUploadContainer.addEventListener('click', () => {
        mediaUpload.click();
    });

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

    // Удаление превью файлов
    uploadPreview.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-media')) {
            e.target.parentElement.remove();
        }
    });

    // Обработка отправки формы
    const supportForm = document.querySelector('.support-form');
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
}); 