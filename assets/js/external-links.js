class ExternalLinksManager {
    constructor() {
        this.externalLinks = [];
        this.trustedDomains = new Set([
            'steam.com',
            'epicgames.com',
            'gog.com',
            'ubisoft.com',
            'ea.com',
            'bethesda.net'
        ]);
    }

    // Проверка и обработка всех внешних ссылок
    init() {
        const links = document.getElementsByTagName('a');
        
        for (let link of links) {
            if (this.isExternalLink(link.href)) {
                this.processExternalLink(link);
            }
        }
    }

    // Проверка, является ли ссылка внешней
    isExternalLink(url) {
        if (!url) return false;
        
        try {
            const linkHost = new URL(url).hostname;
            const currentHost = window.location.hostname;
            return linkHost !== currentHost;
        } catch (e) {
            return false;
        }
    }

    // Обработка внешней ссылки
    processExternalLink(link) {
        const url = new URL(link.href);
        const domain = url.hostname;

        // Добавляем атрибуты безопасности
        link.setAttribute('rel', 'noopener noreferrer');
        link.setAttribute('target', '_blank');

        // Проверяем домен
        if (!this.trustedDomains.has(domain)) {
            // Добавляем предупреждение для непроверенных доменов
            link.setAttribute('data-external', 'true');
            link.addEventListener('click', (e) => {
                if (!confirm('Вы переходите на внешний сайт. Продолжить?')) {
                    e.preventDefault();
                }
            });
        }

        // Добавляем иконку внешней ссылки
        const icon = document.createElement('span');
        icon.className = 'external-link-icon';
        icon.innerHTML = '↗';
        link.appendChild(icon);

        // Сохраняем информацию о ссылке
        this.externalLinks.push({
            url: link.href,
            domain: domain,
            isTrusted: this.trustedDomains.has(domain),
            page: window.location.href
        });
    }

    // Получение отчета о внешних ссылках
    getReport() {
        let report = 'External Links Report:\n\n';
        
        this.externalLinks.forEach(link => {
            report += `URL: ${link.url}\n`;
            report += `Domain: ${link.domain}\n`;
            report += `Trusted: ${link.isTrusted ? 'Yes' : 'No'}\n`;
            report += `Found on page: ${link.page}\n`;
            report += '-------------------\n';
        });

        return report;
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const externalLinksManager = new ExternalLinksManager();
    externalLinksManager.init();
});

// Экспорт для использования в других модулях
window.ExternalLinksManager = ExternalLinksManager; 