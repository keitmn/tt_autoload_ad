const xPaths = [
    {
        // Кнопка "Начать сначала"
        xpath: '//*[@id="app"]/section/div[2]/section/div/div/div[1]/div[2]/div[1]/div/div[3]/span/button[1]/span',
        delay: 1500,
        index: 0
    },
    {
        // Меню Campaign
        xpath: '//ul[contains(@class, "biz-menu")]/li[2]/div/span',
        delay: 1500,
        index: 0
    },
    {
        // Кнопка Create
        xpath: '//*[contains(@class, "perf-action-section")]/div/div/button',
        delay: 1500,
        index: 0
    },
    {
        // Селектор "Конверсии"
        xpath: '//*[contains(@id, "campaign_objective_conversion")]/div[1]',
        delay: 1500,
        index: 0
    },
    {
        // Кнопка далее, когда выбрали "Конверсии"
        xpath: '//div[contains(@class, "ad-campagin-edit-bottom")]/button',
        delay: 5500,
        index: 0
    },
    {
        // Открываем список пикселей
        xpath: '//*[contains(@class, "convert-refresh")]',
        delay: 3500,
        index: 0,
        needWait: true
    },
    {
        // Кликаем на пиксель
        xpath: '//li[contains(@class,"vi-tooltip")]/div',
        delay: 2500,
        index: 0
    },
    {
        // Открываем список событий
        xpath: '//section/div[3]/div/div/div[2]/div/div/span/div[2]/*[contains(@class, "convert-refresh")]',
        delay: 2500,
        index: 0
    },
    {
        // Кликаем на событие
        xpath: '//*[contains(@id, "ag-promotion-use-opt-event-148")]',
        delay: 1500,
        index: 0
    },
    {
        // Кликаем на плейсменты
        xpath: '//*[@id="ag-placement-select"]/span[1]/span',
        delay: 2500,
        index: 0
    },
    {
        // Убираем комменты
        xpath: '//*[@id="ag-placement-comment-switch"]/div/div[1]/span',
        delay: 1500,
        index: 0
    },
    {
        // Убираем возможность скачивать
        xpath: '//*[@id="ag-placement-download-switch"]/div/div[1]/span',
        delay: 1500,
        index: 0
    },
    {
        // Убираем новостной плейсмент
        xpath: '//*[@id="ag-placement-select-1000"]/span/span',
        delay: 2000,
        index: 0
    },
    {
        // Убираем плейсмент Pangle
        xpath: '//*[@id="ag-placement-select-9000"]/span/span',
        delay: 1000,
        index: 0
    },
    {
        // Выбор локации
        xpath: '//div[@id="country"]/div/div/div/div/div/input',
        delay: 2500,
        index: 0
    },
    {
        // Россия
        xpath: '//div[contains(@class, "vi-select-tree-options")]/div[9]/div/label/span',
        delay: 2500,
        index: 0
    },
    {
        // Кликаем на локацию, чтобы закрыть
        xpath: '//div[@id="country"]/div/div/div/div/div/input',
        delay: 1000,
        index: 0
    },
    // {
    //     // Любого пола
    //     xpath: '//div[@class="adgroup-target-main"]/div[7]/div/div/div/div/label[1]',
    //     delay: 1000,
    //     index: 0
    // },
    // {
    //     // Мужского пола
    //     xpath: '//div[@class="adgroup-target-main"]/div[7]/div/div/div/div/label[2]',
    //     delay: 1000,
    //     index: 0
    // },
    {
        // Женского пола
        xpath: '//div[@class="adgroup-target-main"]/div[7]/div/div/div/div/label[3]',
        delay: 1000,
        index: 0
    },
    {
        // Возраст 25-34
        xpath: '//div[@class="vi-checkbox-group"]/label[4]/span',
        delay: 500,
        index: 0
    },
    {
        // Возраст 35-44
        xpath: '//div[@class="vi-checkbox-group"]/label[5]/span',
        delay: 500,
        index: 0
    },
    {
        // Возраст 45-54
        xpath: '//div[@class="vi-checkbox-group"]/label[6]/span',
        delay: 500,
        index: 0
    },
    {
        // Возраст 55+
        xpath: '//div[@class="vi-checkbox-group"]/label[7]/span',
        delay: 500,
        index: 0
    },
    {
        // Кликаем на бюджет
        xpath: '//*[@id="ag-budget-input"]',
        delay: 500,
        index: 0
    },
    {
        // Кликаем Next
        xpath: '//section[contains(@class, "vi-operation-bottom")]/div/div[2]/button[contains(@class, "vi-button--primary")]',
        delay: 500,
        index: 0
    },
]

module.exports = xPaths
