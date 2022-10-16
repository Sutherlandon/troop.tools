const { By, Key, until } = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const opts = new chrome.Options();

(async function tlcScraper() {
  const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .setChromeOptions(opts)
    .build();

  try {
    await driver.get('https://www.traillifeconnect.com/dashboard');

    // login
    await driver.findElement(By.id('loginform-email'))
      .sendKeys('sutherlandon@gmail.com', Key.TAB, 'n_eA3HMfzfbp', Key.ENTER);

    // explicit wait for this dashboard link to appear
    await driver.wait(until.elementLocated(By.css('a[href="/advancement/index')));

    // navigate to advancement
    await driver.get('https://www.traillifeconnect.com/advancement/index?level=wt&style=grid');

    // generate woodland trails member records
    const foxOptions = await driver.findElements(By.css('#trailmen-select optgroup[label="Foxes"] option'));
    const foxes = await Promise.all(foxOptions.map(async (kid) => {
      const name = (await kid.getAttribute('textContent')).split(', ');
      const firstName = name[1];
      const lastName = name[0];
      const id = await kid.getAttribute('value');

      return { firstName, lastName, id, patrol: 'foxes' };
    }));

    const hawkOptions = await driver.findElements(By.css('#trailmen-select optgroup[label="Hawks"] option'));
    const hawks = await Promise.all(hawkOptions.map(async (kid) => {
      const name = (await kid.getAttribute('textContent')).split(', ');
      const firstName = name[1];
      const lastName = name[0];
      const id = await kid.getAttribute('value');

      return { firstName, lastName, id, patrol: 'hawks' };
    }));

    const mlOptions = await driver.findElements(By.css('#trailmen-select optgroup[label="Mountain Lions"] option'));
    const mountainLions = await Promise.all(mlOptions.map(async (kid) => {
      const name = (await kid.getAttribute('textContent')).split(', ');
      const firstName = name[1];
      const lastName = name[0];
      const id = await kid.getAttribute('value');

      return { firstName, lastName, id, patrol: 'mountainLions' };
    }));

    const trailmen = [...foxes, ...hawks, ...mountainLions];

    console.log(trailmen);
  } catch (error) {
    console.error(error);
  } finally {
    await driver.quit();
  }
}());
