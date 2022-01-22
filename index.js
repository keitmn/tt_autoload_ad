const puppeteer = require('puppeteer-core') //Нужен для автоматизации в браузере. Как Selenium, но Puppeteer
const axios = require('axios')
const xPaths = require('./xpaths') // Массив объектов для поиска элементов в DOM
const path = require('path')

/**
 * Текстовые константы. Укажите ваши значения *
 */
const antyProfileId = 3047269 //Профиль пользователя. Подробнее здесь: https://youtu.be/-2h9cVN9okw
const createCampaignURL = 'https://ads.tiktok.com/i18n/campaign/ad-campaign/create' //Ссылка на создание компании
const campaignBudget = '2000' //Устанавливаемый лимит по бюджету
const userLogin = 'login' //Логин, который нужно ввести на странице создания объявления
const adText = 'Текст "я тебя люблю" на 100 языках мира. Кликай "Подробнее", чтобы забрать себе.'
const videoFile = path.join(__dirname, 'video', 'ad_movie.mp4') //Путь к видео. Где 'video' папка, а 'ad_movie.mp4' название файла
const webSite = 'https://google.com' // Рекламируемый сайт
/**
 * Текстовые константы. Укажите ваши значения *
 */

/**
 * Функция "паузы" останавливает выполнение скрипта на указанное количество миллисекунд.
 * Использовать с await. Пример: await delay(1000) - пауза на 1 секунду
 * @param ms
 * @returns {Promise<unknown>}
 */
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Открываем инстанс браузера.
 * @param profileId
 * @returns {Promise<(*|(() => string))[]>}
 */
const browserStart = async (profileId) => {
    const response = await axios(`http://localhost:3001/v1.0/browser_profiles/${profileId}/start?automation=1`)
    if (response.data.success) {
        return [response.data.automation.port, response.data.automation.wsEndpoint]
    }
}

/**
 * Вспомогательная функция. Ищет элемент по его xpath. Если не находит, генерирует ошибку.
 * maxIterations отвечает за максимальное время поиска. Значение 60 означает искать не более 1 минуты
 * @param page
 * @param xPathObj
 * @param maxIterations
 * @returns {Promise<*>}
 */
const getElemByXPath = async (page, xPathObj, maxIterations = 60) => {
    let elems = []
    let count = 0

    while (!elems.length) {
        elems = await page.$x(xPathObj.xpath)
        if (elems.length) {
            return elems[xPathObj.index]
        }
        await delay(1000)
        count++
        if (count > maxIterations) {
            throw new Error(`Не могу найти HTML-элемент. XPath: ${xPathObj.xpath}`)
        }
    }
}

/**
 * Вспомогательная функция для клика на элементе и последующей задержки.
 * Для поиска элемента использует функцию getElemByXPath
 * Пауза в выполнении нужна, чтобы TT успел среагировать. Например, загрузить
 * список пикселей или событий.
 * @param page
 * @param index
 * @returns {Promise<*>}
 */
const findAndClick = async (page, index) => {
    let element = await getElemByXPath(page, xPaths[index])
    console.log(element)
    console.log(xPaths[index])
    await element.click()
    await delay(xPaths[index].delay)
    return element
}

/**
 * Основная функция автоматизации. Сначала прокликивает все элементы. После вводит
 * бюджет. Далее загружает видео.
 * @param profileId
 * @returns {Promise<void>}
 */
const automation = async (profileId) => {
    const [port, wsEndpoint] = await browserStart(profileId)

    if (!port) {
        throw new Error(`проверьте антидетект браузер`)
    }

    const browser = await puppeteer.connect({    browserWSEndpoint: `ws://127.0.0.1:${port}${wsEndpoint}`  })
    const page = await browser.newPage()
    await page.setViewport({width: 1366, height: 768})
    await page.goto(createCampaignURL)
    await page.waitForXPath('//ul[contains(@class, "biz-menu")]/li[2]/div/span')
    try {
        let i = 3
        /**
         * Ищем кнопку "Начать сначала", если есть, то идем по сокращенному пути
         * если нет, то начинаем с самого начала: Меню Campaign, Create...
         * Ждем 20 секунд
         */
        try {
            await findAndClick(page, 0, 20)
        } catch (e) {
            i = 1
        }

        // Цикл обходит массив xPaths и прокликивает все элементы. Когда натыкаемся на бюджет,
        // вводим бюджет в текстовое поле
        for(i; i<xPaths.length; i++) {
            let element
            element = await findAndClick(page, i)
            if (i == xPaths.length - 2) {
                await page.keyboard.type(campaignBudget)
            }
        }

        await page.waitForXPath('//div[contains(@class, "ad-creation-upload-operation-content")]/div/div/input')
        // Передаем путь к файлв в input[file] для загрузки
        const inputFile = await page.$x('//div[contains(@class, "ad-creation-upload-operation-content")]/div/div/input')
        const filename = videoFile
        await inputFile[0].uploadFile(filename)
        // Вызываем событие chang у input[file], чтобы TT понял, что файл выбран
        await inputFile[0].evaluate(upload => upload.dispatchEvent(new Event('change', { bubbles: true})))

        await delay(5000)
        const buttonUpload = await page.$x('//*[@class="upload-dialog-footer"]/button[2]')
        await buttonUpload[0].click()
        await delay(10000)

        let statusSuccess = []
        while(!statusSuccess.length) {
            statusSuccess = await  page.$x('//div[@class="verify-status"]/i[contains(@class, "success")]')
            if (!statusSuccess.length)
                await delay(2000)
            console.log('Iteration', statusSuccess.length)
        }

        const buttonSend = await page.$x('//span[@class = "upload-dialog-footer"]/button')
        await buttonSend[0].click()
        await delay(1500)

        const buttonCancel = await page.$x('//*[contains(@class, "delete-item")]')
        console.log(buttonCancel)
        if (buttonCancel.length) {
            await buttonCancel[1].click()
            console.log('Отменили лишние загрузки')
        }

        await delay(2000)
        try {
            await page.waitForXPath('//*[contains(@class,"upload-verify-dialog")]/div/div/button')
            const closeButton = await page.$x('//*[contains(@class,"upload-verify-dialog")]/div/div/button')
            await closeButton[0].click()
            await delay(1000)
        } catch (e) {
            console.log('Не нашли кнопку, идем дальше')
        }

        try {
            const inputLogin = await page.$x('//div[@class="ad-form-identity-name-op-wrapper"]/div/div/div/input')
            await inputLogin[0].click()
            await page.keyboard.type(userLogin)
            await delay(1000)
        } catch (e) {
            console.log('Не удалось ввести новый логин. Идем дальше')
        }
        // Устанавливаем фокус на поле ввода и эмулируем ввод с клавиатуры
        await page.focus('#websiteUrl')
        await page.keyboard.type(webSite)
        await delay(1000)

        await page.focus('textarea')
        await page.keyboard.type(adText)
        await delay(1000)

        const buttonSubmit = await page.$x('//*[contains(@class, "ad-copy-bottom-card")]/div/button[contains(@class, "primary")]')
        console.log(buttonSubmit)
        await buttonSubmit[0].click()
        await delay(1000)
    } catch(e) {
        console.log(e.message)
    } finally {
        console.log('End')
        // Закрываем инстанс браузера после выполнения всех операций или при ошибке
        // На время тестов, стоит закомментировать
        await page.close()
        await browser.close()
    }
}

/**
 * Функция запуска скрипта
 */
(async () => {
    try {
        automation(antyProfileId)
    } catch (e) {
        console.log(`Error: ${e.message}`)
    }
})()
