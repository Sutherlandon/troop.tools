const { By, Key, until } = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const opts = new chrome.Options();

(async function tlcScraper() {
  /**
   * Parses an active member from the 'trailman-select' on the advancement page in TLC
   * into a member record
   * @param {WebElement} kid The <option> from the trailman-select dropdown
   * @param {String} patrol The patrol to put the kid in
   * @returns An object with firstName, lastName, TLC_ID, and patrol
   */
  async function parseKid(kid, patrol) {
    const name = (await kid.getAttribute('textContent')).split(', ');
    const firstName = name[1];
    const lastName = name[0];
    const id = await kid.getAttribute('value');

    return { firstName, lastName, id, patrol };
  }

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

    /**
     * Build Trailmen List
     */
    // navigate to advancement
    await driver.get('https://www.traillifeconnect.com/advancement/index?level=wt&style=grid');

    // generate woodland trails member records
    const foxOptions = await driver.findElements(By.css('#trailmen-select optgroup[label="Foxes"] option'));
    const foxes = await Promise.all(foxOptions.map((kid) => parseKid(kid, 'foxes')));

    const hawkOptions = await driver.findElements(By.css('#trailmen-select optgroup[label="Hawks"] option'));
    const hawks = await Promise.all(hawkOptions.map((kid) => parseKid(kid, 'hawks')));

    const mlOptions = await driver.findElements(By.css('#trailmen-select optgroup[label="Mountain Lions"] option'));
    const mountainLions = await Promise.all(mlOptions.map((kid) => parseKid(kid, 'mountainLions')));

    const trailmenArray = [...foxes, ...hawks, ...mountainLions];

    // console.log(trailmenArray);

    /**
     * Build Advancement Data
     * advacement grid item id=<lessonID>_<memberID>_<patrolID>
     */
    const trailmenSelectInput = await driver.findElement(By.className('select2-search__field'));
    trailmenSelectInput.click(); // reveal the 'Select All' box
    const selectAll = await driver.findElement(By.id('s2-togall-trailmen-select'));
    selectAll.click(); // select all trailmen

    // open the badge list
    const badgeSelectElement = await driver.findElement(By.css('span[data-select2-id="2"]'));
    badgeSelectElement.click();

    // explicit wait for the results to appear
    await driver.wait(until.elementLocated(By.className('select2-results')));

    // select the first elements in the branches list
    const badgeBranchGroup = await driver.findElement(By.css('.select2-results ul li'));
    const badgeBranches = await badgeBranchGroup.findElements(By.css('li'));
    badgeBranches[0].click();

    // wait for the table to appear
    await driver.wait(until.elementLocated(By.id('table_items')));

    const lessons = [];
    const advacement = {};

    const advRows = await driver.findElements(By.css('#table_items tr'));
    advRows.splice(advRows.length - 7);
    await Promise.all(
      advRows.map(async (row) => {
        const cells = await row.findElements(By.css('td'));
        const lessonNameText = await cells[0].getText();
        const lessonName = lessonNameText.split('\n')[0];
        let saveLesson = true;

        if (cells.length > 1) {
          for (let i = 1; i < cells.length; i++) {
            const cellDiv = await cells[i].findElement(By.css('div'));
            const [lessonID, memberID, patrolID] = (await cellDiv.getAttribute('id')).split('_');

            if (![lessonID, memberID].includes('ave')) {
              // check for date completed. Record the advancement if it exists
              const earnedOn = await cellDiv.findElement(By.css('i')).getAttribute('data-original-title');
              if (earnedOn) {
                const dateCompleted = earnedOn.split(': ')[1].split('<br>')[0];
                // add to the list or start it.
                if (advacement[memberID]) {
                  advacement[memberID].push({ patrolID, lessonID, date: dateCompleted });
                } else {
                  advacement[memberID] = [{ patrolID, lessonID, date: dateCompleted }];
                }
              }

              if (saveLesson) {
                console.log(`${lessonID} - ${lessonName}`);
                lessons.push({ lessonName, lessonID });
                saveLesson = false;
              }
            }
          }
        }

        // TODO: process cells
        // <td><div id=<lessonID>_<memberID>_<patrolID> data-original-title="Earned on: 02/10/2022"><i /></div></td>
        // advacement grid item
      })
    );

    console.log(advacement);
  } catch (error) {
    console.error(error);
  }
  // finally {
  //   await driver.quit();
  // }
}());
