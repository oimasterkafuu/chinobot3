const edge = require('selenium-webdriver/edge');
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

async function shotScreen(url, path) {
    const service = await new edge.ServiceBuilder()
        .setPort(2333)
        .build();

    const options = await new edge.Options();
    options.addArguments('--headless');

    const driver = await edge.Driver.createSession(options, service);

    await driver.get(url);
    await driver.sleep(3000);

    const windowHeight = await driver.executeScript('return window.innerHeight');
    const windowWidth = await driver.executeScript('return window.innerWidth');
    const bodyHeight = await driver.executeScript('return document.body.scrollHeight');
    const bodyWidth = await driver.executeScript('return document.body.scrollWidth');


    const row = Math.ceil(bodyHeight / windowHeight);
    const col = Math.ceil(bodyWidth / windowWidth);

    const testScreen = await driver.takeScreenshot();
    const testImg = await loadImage(Buffer.from(testScreen, 'base64'));
    const imgHeight = testImg.height;
    const imgWidth = testImg.width;

    var canvas;
    
    if (!(col * imgWidth > 32767 || row * imgHeight > 32767)) {
        canvas = createCanvas(col * imgWidth, row * imgHeight);
        const ctx = canvas.getContext('2d');

        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                await driver.executeScript(`window.scrollTo(${j * windowWidth}, ${i * windowHeight})`);
                await driver.sleep(1000);
                const screen = await driver.takeScreenshot();
                const img = await loadImage(Buffer.from(screen, 'base64'));
                ctx.drawImage(img, j * imgWidth, i * imgHeight);
            }
        }
    } else {
        canvas = createCanvas(imgWidth, imgHeight);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(testImg, 0, 0);
    }

    const base64 = canvas.toDataURL();
    const data = base64.replace(/^data:image\/\w+;base64,/, '');
    const buf = Buffer.from(data, 'base64');
    fs.writeFileSync(path, buf);

    await driver.quit();
}

module.exports = shotScreen;