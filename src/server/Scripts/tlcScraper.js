/**
 * Requires the latest chrome driver be installed and available in your PATH
 * download here: http://chromedriver.storage.googleapis.com/index.html
 * location: C:/Users/Landon
 */

const fs = require('fs/promises');
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

    return { firstName, lastName, id, patrol, adv: [], active: true };
  }

  const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .setChromeOptions(opts)
    .build();

  const lessons = [];
  const members = {};

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

    // assemble the trailmen in into member records so they are accessable by id
    [...foxes, ...hawks, ...mountainLions].forEach((trailman) => {
      members[trailman.id] = trailman;
    });

    /**
     * Build Advancement and Lesson Data
     * advacement grid item id=<lessonID>_<memberID>_<patrolID>
     */
    const trailmenSelectInput = await driver.findElement(By.className('select2-search__field'));
    trailmenSelectInput.click(); // reveal the 'Select All' box
    const selectAll = await driver.findElement(By.id('s2-togall-trailmen-select'));
    selectAll.click(); // select all trailmen

    // Loop over each branch
    for (let branch = 0; branch <= 6; branch++) {
      console.log({ branch });
      const lessonTypes = ['core', 'elective', 'htt', 'makeup'];
      let typeIndex = -1;

      // open the badge list
      const badgeSelectElement = await driver.findElement(By.css('span[data-select2-id="2"]'));
      badgeSelectElement.click();

      // explicit wait for the results to appear
      await driver.wait(until.elementLocated(By.className('select2-results')));

      // select the first elements in the branches list
      const badgeBranchGroup = await driver.findElement(By.css('.select2-results ul li'));
      const badgeBranches = await badgeBranchGroup.findElements(By.css('li'));
      const branchName = (await badgeBranches[branch].getText()).replace(' Branch', '');
      badgeBranches[branch].click();

      // find the level select buttons and Loop over each patrol
      const trackLevelButtons = await driver.wait(until.elementsLocated(By.css('#div-track-level-select label')));
      for (let level = 1; level <= 3; level++) {
        console.log({ level });
        await driver.wait(until.elementIsVisible(trackLevelButtons[level]));
        trackLevelButtons[level].click();

        // wait for the loader then the table to appear again
        await driver.wait(until.elementLocated(By.css('#award_html h4')));
        await driver.wait(until.elementLocated(By.id('table_items')));

        const advRows = await driver.findElements(By.css('#table_items tr'));
        advRows.splice(advRows.length - 7);

        for (let j = 0; j < advRows.length; j++) {
          const cells = await advRows[j].findElements(By.css('td'));
          const lessonNameText = await cells[0].getText();
          const lessonName = lessonNameText.split('\n')[0];
          let saveLesson = true;

          // TODO: Low nesting output to say it's working

          // if length === 1, then it's a type header so advance the type index
          if (cells.length === 1) {
            typeIndex += 1;
          } else {
            for (let i = 1; i < cells.length; i++) {
              console.log({ i });
              const cellDiv = await cells[i].findElement(By.css('div'));
              const [lessonID, memberID, patrolID] = (await cellDiv.getAttribute('id')).split('_');

              if (![lessonID, memberID].includes('ave')) {
                // check for date completed. Record the advancement if it exists
                const earnedOn = await cellDiv.findElement(By.css('i')).getAttribute('data-original-title');
                if (earnedOn) {
                  const dateCompleted = earnedOn.split(': ')[1].split('<br>')[0];
                  members[memberID].adv.push({ patrolID, lessonID, date: dateCompleted });
                }

                if (saveLesson) {
                  const lesson = {
                    lessonID,
                    branch: branchName,
                    name: lessonName,
                    type: lessonTypes[typeIndex],
                  };

                  lessons.push(lesson);
                  saveLesson = false;
                }
              }
            }
          }
        }
      }
    }

    // write out to files
    await fs.writeFile('./output/members.json', JSON.stringify(Object.values(members)));
    await fs.writeFile('./output/lessons.json', JSON.stringify(lessons));
  } catch (error) {
    console.error(error);
  }
  // finally {
  //   await driver.quit();
  // }
}());
