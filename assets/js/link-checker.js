class LinkChecker {
    constructor() {
        this.brokenLinks = [];
        this.checkedLinks = new Set();
    }

    // Проверка одной ссылки
    async checkLink(url) {
        if (this.checkedLinks.has(url)) return;
        this.checkedLinks.add(url);

        try {
            const response = await fetch(url, { method: 'HEAD' });
            if (!response.ok) {
                this.brokenLinks.push({
                    url: url,
                    status: response.status,
                    page: window.location.href
                });
                console.warn(`Broken link found: ${url} (Status: ${response.status})`);
            }
        } catch (error) {
            this.brokenLinks.push({
                url: url,
                error: error.message,
                page: window.location.href
            });
            console.error(`Error checking link ${url}:`, error);
        }
    }

    // Проверка всех ссылок на странице
    async checkAllLinks() {
        const links = document.getElementsByTagName('a');
        const promises = [];

        for (let link of links) {
            const href = link.href;
            if (href && !href.startsWith('javascript:') && !href.startsWith('#')) {
                promises.push(this.checkLink(href));
            }
        }

        await Promise.all(promises);
        return this.brokenLinks;
    }

    // Получение отчета о битых ссылках
    getReport() {
        if (this.brokenLinks.length === 0) {
            return 'No broken links found.';
        }

        let report = 'Broken Links Report:\n\n';
        this.brokenLinks.forEach(link => {
            report += `URL: ${link.url}\n`;
            report += `Found on page: ${link.page}\n`;
            report += `Status: ${link.status || 'Error'}\n`;
            report += '-------------------\n';
        });

        return report;
    }
}

// Экспорт для использования в других модулях
window.LinkChecker = LinkChecker; 