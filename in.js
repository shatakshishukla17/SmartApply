//type node in.js in terminal

const puppeteer = require("puppeteer");
const { id, pass } = require("./secret");
const dataFile = require("./data");

let tab;

async function main() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized", "--ignore-certificate-errors", "--disable-features=IsolateOrigins,site-per-process"],
        ignoreHTTPSErrors: true
    });

    const pages = await browser.pages();

    // Set a random user agent to mimic different browsers
    const userAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.1.2 Safari/603.3.8",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
      ];
      const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
      
    tab = pages[0];
    
    await tab.setUserAgent(randomUserAgent);

    await tab.goto("https://internshala.com/");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await tab.evaluate(() => window.scrollBy(0, 800));
    await new Promise(resolve => setTimeout(resolve, 2000));
    await tab.click("button.login-cta");
    console.log('Login button clicked!');
     // Wait for the login modal to appear
    await new Promise(resolve => setTimeout(resolve, 600));
    await tab.waitForSelector('#login-modal', { visible: true });
    await tab.type("#modal_email", id, {delay:100});
    await tab.type("#modal_password", pass, {delay:101});


    await tab.click("#modal_login_submit");
    console.log('Login button inside modal clicked.');

    await tab.waitForNavigation({ waitUntil: "networkidle2" });
    console.log('Navigation completed.');


    //When you want to fill the resume section also in internshala website use this code:
    // await tab.click(".nav-link.dropdown-toggle.profile_container .is_icon_header.ic-24-filled-down-arrow");
    // const profileOptions = await tab.$$(".profile_options a");
    // const appUrls = [];

    // for (let i = 0; i < 11; i++) {
    //     const url = await tab.evaluate(ele => ele.getAttribute("href"), profileOptions[i]);
    //     appUrls.push(url);
    // }

    // await tab.goto("https://internshala.com" + appUrls[3]);
    // await tab.waitForSelector("#graduation-tab .ic-16-plus", { visible: true });
    // await tab.click("#graduation-tab .ic-16-plus");
    // await fillGraduation(dataFile[0]);

    // await tab.waitForSelector(".next-button", { visible: true });
    // await tab.click(".next-button");

    // await fillTraining(dataFile[0]);

    // await tab.waitForSelector(".next-button", { visible: true });
    // await tab.click(".next-button");

    // await tab.waitForSelector(".btn.btn-secondary.skip.skip-button", { visible: true });
    // await tab.click(".btn.btn-secondary.skip.skip-button");

    // await fillWorkSample(dataFile[0]);

    // await tab.waitForSelector("#save_work_samples", { visible: true });
    // await tab.click("#save_work_samples");

    // // await tab.goto("https://internshala.com/the-grand-summer-internship-fair");
    // // await tab.waitForSelector(".btn.btn-primary.campaign-btn.view_internship", { visible: true });
   // // await tab.click(".btn.btn-primary.campaign-btn.view_internship");


   // Navigate to Internships page
    await tab.waitForSelector('a.nav-link.dropdown-toggle.internship_link', { visible: true });
    await tab.click('a.nav-link.dropdown-toggle.internship_link');
    console.log('Internships link clicked.');
    await tab.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log('Navigation to Internships page completed.');


    // Profile and location settings
    const profileName = ' Web Development'; // Desired profile name
    const locationName = ''; // Location if needed
    const chooseToWorkFromHome = true;
    const choosePartTimeWork = false;


    // Check Work from Home checkbox
    if (chooseToWorkFromHome) {
        await tab.waitForSelector('#work_from_home', { visible: true });
        const isDisabled = await tab.$eval('#work_from_home', el => el.disabled);
        if (!isDisabled) {
            await tab.click('#work_from_home');
            console.log('Work from Home checkbox clicked.');
        } else {
            console.log('Work from Home checkbox is disabled.');
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
        const isChecked = await tab.$eval('#work_from_home', el => el.checked);
        console.log(isChecked ? 'Work from Home checkbox is now checked.' : 'Failed to check Work from Home checkbox.');
    }


    // Check Part-time checkbox
    if (choosePartTimeWork) {
        await tab.waitForSelector('#part_time', { visible: true });
        const isDisabled = await tab.$eval('#part_time', el => el.disabled);
        if (!isDisabled) {
            await tab.click('#part_time');
            console.log('Part-time checkbox clicked.');
        } else {
            console.log('Part-time checkbox is disabled.');
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
        const isChecked = await tab.$eval('#part_time', el => el.checked);
        console.log(isChecked ? 'Part-time checkbox is now checked.' : 'Failed to check Part-time checkbox.');
    }


    // Search for internships
    await new Promise(resolve => setTimeout(resolve, 5000));

    await tab.waitForSelector('input[value="e.g. Marketing"]', { visible: true });
    await tab.type('input[value="e.g. Marketing"]', profileName, { delay: 100 });
    await tab.keyboard.press('Enter');
    console.log(`Typed "${profileName}" into profile search input and pressed Enter.`);
    await new Promise(resolve => setTimeout(resolve, 5000));

    if (locationName) {
        await tab.waitForSelector('input[value="e.g. Delhi"]', { visible: true });
        await tab.type('input[value="e.g. Delhi"]', locationName, { delay: 100 });
        console.log(`Typed "${locationName}" into location search input and pressed Enter.`);
        await tab.keyboard.press('Enter');
    }
    await new Promise(resolve => setTimeout(resolve, 5000));


    // Wait for the internship container and get all internship cards
    // Wait for the outer internship container
    await tab.waitForSelector('#internship_list_container', { visible: true });
    const internshipContainers = await tab.$$('div.individual_internship_details.individual_internship_internship');

    // Apply to the first 3 internships
    for (let i = 0; i < Math.min(4, internshipContainers.length); i++) {
        try {
            await apply(tab, dataFile[0], internshipContainers[i]);
            console.log(`Successfully applied to internship ${i}`);
        } catch (error) {
            console.error(`Failed to apply to internship ${i}:`, error);
        }
        // Wait between applications
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
 
    console.log('Completed all applications');
    await tab.close();
    console.log("Closed Internshala's tab!");
}

//Use this code to fill details in resume section of website:
// async function fillGraduation(data) {
//     await tab.waitForSelector("#degree_completion_status_pursuing", { visible: true });
//     await tab.click("#degree_completion_status_pursuing");

//     await tab.waitForSelector("#college", { visible: true });
//     await tab.type("#college", data["College"]);

//     await tab.waitForSelector("#start_year_chosen", { visible: true });
//     await tab.click("#start_year_chosen");
//     await tab.waitForSelector(".active-result[data-option-array-index='5']", { visible: true });
//     await tab.click(".active-result[data-option-array-index='5']");

//     await tab.waitForSelector("#end_year_chosen", { visible: true });
//     await tab.click('#end_year_chosen');
//     await tab.waitForSelector("#end_year_chosen .active-result[data-option-array-index='6']", { visible: true });
//     await tab.click("#end_year_chosen .active-result[data-option-array-index='6']");

//     await tab.waitForSelector("#degree", { visible: true });
//     await tab.type("#degree", data["Degree"]);

//     await tab.waitForSelector("#stream", { visible: true });
//     await tab.type("#stream", data["Stream"]);

//     await tab.waitForSelector("#performance-college", { visible: true });
//     await tab.type("#performance-college", data["Percentage"]);

//     await tab.click("#college-submit");
// }

// async function fillTraining(data) {
//     await tab.waitForSelector(".experiences-tabs[data-target='#training-modal'] .ic-16-plus", { visible: true });
//     await tab.click(".experiences-tabs[data-target='#training-modal'] .ic-16-plus");

//     await tab.waitForSelector("#other_experiences_course", { visible: true });
//     await tab.type("#other_experiences_course", data["Training"]);

//     await tab.waitForSelector("#other_experiences_organization", { visible: true });
//     await tab.type("#other_experiences_organization", data["Organization"]);

//     await tab.click("#other_experiences_location_type_label");
//     await tab.click("#other_experiences_start_date");

//     await tab.waitForSelector(".ui-state-default[href='#']", { visible: true });
//     const date = await tab.$$(".ui-state-default[href='#']");
//     await date[0].click();
//     await tab.click("#other_experiences_is_on_going");

//     await tab.waitForSelector("#other_experiences_training_description", { visible: true });
//     await tab.type("#other_experiences_training_description", data["description"]);

//     await tab.click("#training-submit");
// }

// async function fillWorkSample(data) {
//     await tab.waitForSelector("#other_portfolio_link", { visible: true });
//     await tab.type("#other_portfolio_link", data["link"]);
// }

async function apply(tab, data, internshipCard) {
    try {
        // Click on the internship card
        await internshipCard.click();
        console.log("Clicked on internship card");

        // Wait for the new tab to open and get all pages
        await new Promise(r => setTimeout(r, 2000));

        //When internship apply page is opening in new tab
        // const pages = await tab.browser().pages();
        // const newTab = pages[pages.length - 1];
        
        // console.log("Switched to new tab");


        //When internship apply page is opening in same tab
        //Wait for page load and scroll to make sure button is in viewport
        await new Promise(r => setTimeout(r, 3000));
        
        // Try multiple methods to find and click the apply button
        try {
            // First attempt: Wait for button and click directly
            await tab.waitForSelector('#continue_button', {
                visible: true,
                timeout: 5000
            });
            
            // Scroll the button into view
            await tab.evaluate(() => {
                const button = document.querySelector('#continue_button');
                if (button) {
                    button.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });

            // Wait for any smooth scrolling to complete
            await new Promise(r => setTimeout(r, 1000));

            // Try multiple click methods
            try {
                // Method 1: Direct click
                await tab.click('#continue_button');
            } catch (clickError) {
                console.log("Direct click failed, trying JavaScript click");
                // Method 2: JavaScript click
                await tab.evaluate(() => {
                    const button = document.querySelector('#continue_button');
                    if (button) {
                        button.click();
                    }
                });
            }
            
            console.log("Successfully clicked apply button");

        } catch (buttonError) {
            console.log("Initial button click failed, trying alternate method");
            
            // Alternate method: Force click using JavaScript
            await tab.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const applyButton = buttons.find(button => 
                    button.textContent.toLowerCase().includes('apply') ||
                    button.id === 'continue_button'
                );
                if (applyButton) {
                    applyButton.click();
                } else {
                    throw new Error("Apply button not found");
                }
            });
        }

        // Wait for the application form modal
        await tab.waitForSelector('#application-form', {
            visible: true,
            timeout: 10000
        });
        console.log("Application form modal appeared");

        //Handle the cover letter first
        try {
            // Wait for either the container or the cover letter element
            await Promise.race([
                tab.waitForSelector('.cover_letter_container.application_modal', { visible: true, timeout: 5000 }),
                tab.waitForSelector('#cover_letter', { visible: true, timeout: 5000 })
            ]);

            // Try multiple methods to fill the cover letter
            await tab.evaluate((coverLetterText) => {
                // Method 1: Try the main cover letter textarea
                const coverLetterTextarea = document.querySelector('textarea[name="cover_letter"]');
                if (coverLetterTextarea) {
                    coverLetterTextarea.value = coverLetterText;
                    // Trigger input event to ensure changes are registered
                    coverLetterTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                }

                // Method 2: Try the visible editor div
                const coverLetterDiv = document.querySelector('#cover_letter_holder');
                if (coverLetterDiv) {
                    coverLetterDiv.innerHTML = coverLetterText;
                    coverLetterDiv.dispatchEvent(new Event('input', { bubbles: true }));
                }

                // Method 3: Try any other cover letter related elements
                const otherElements = document.querySelectorAll('[id*="cover_letter"], [class*="cover_letter"]');
                otherElements.forEach(element => {
                    if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
                        element.value = coverLetterText;
                        element.dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (element.contentEditable === 'true') {
                        element.innerHTML = coverLetterText;
                        element.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                });
            }, data.hiringReason);

            // Additional fallback: Try direct typing
            const coverLetterSelectors = [
                'textarea[name="cover_letter"]',
                '#cover_letter',
                '.cover_letter_textarea',
                '#cover_letter_holder'
            ];

            for (const selector of coverLetterSelectors) {
                try {
                    await tab.waitForSelector(selector, { visible: true, timeout: 2000 });
                    await tab.evaluate((sel) => {
                        const element = document.querySelector(sel);
                        if (element) element.value = '';
                    }, selector);
                    await tab.type(selector, data.hiringReason, { delay: 101 });
                    console.log(`Successfully filled cover letter using selector: ${selector}`);
                    break;
                } catch (err) {
                    console.log(`Failed with selector ${selector}, trying next...`);
                }
            }

            // Final verification
            await tab.evaluate((text) => {
                const verifyAndUpdate = (element, text) => {
                    if (!element) return;
                    if (element.value === '' || !element.value) {
                        element.value = text;
                        element.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                };

                verifyAndUpdate(document.querySelector('textarea[name="cover_letter"]'), text);
                verifyAndUpdate(document.querySelector('#cover_letter'), text);
                verifyAndUpdate(document.querySelector('#cover_letter_holder'), text);
            }, data.hiringReason);

            console.log("Cover letter handling completed");
            
            // Add a small delay to ensure changes are registered
            await new Promise(r => setTimeout(r, 1000));

        } catch (coverLetterError) {
            console.error("Error handling cover letter:", coverLetterError);
            throw coverLetterError;
        }

        // Handle availability radio button if it exists
        try {
            await tab.waitForSelector('input[name="confirm_availability"][value="yes"]', { timeout: 5000 });
            await tab.click('input[name="confirm_availability"][value="yes"]');
            console.log("Clicked availability radio button");
        } catch (error) {
            console.log("Availability radio button not found or not needed");
        }

        // Get all additional questions
        const questionAnswerPairs = await tab.evaluate(() => {
            const pairs = [];
            const formGroups = document.querySelectorAll('.form-group');
            
            formGroups.forEach(group => {
                // Skip cover letter container
                if (group.querySelector('.cover_letter_container_application_modal')) {
                    return;
                }
                
                const questionElements = group.querySelectorAll('label, .question-heading, .question-text');
                const textarea = group.querySelector('textarea:not([name="cover_letter"])');
                
                if (textarea) {
                    let questionText = '';
                    questionElements.forEach(el => {
                        questionText += el.textContent.toLowerCase().trim() + ' ';
                    });
                    
                    pairs.push({
                        question: questionText,
                        textareaId: textarea.id || '',
                        textareaName: textarea.name || ''
                    });
                }
            });
            return pairs;
        });

        console.log("Found questions:", questionAnswerPairs);

        // Function to determine the appropriate answer based on question text
        const getAnswer = (questionText) => {
            questionText = questionText.toLowerCase();
            
            if (questionText.includes('why should we hire') || 
                questionText.includes('why do you want') || 
                questionText.includes('why are you suitable') ||
                questionText.includes('reason') ||
                questionText.includes('motivation')) {
                return data.hiringReason;
            }
            
            if (questionText.includes('when can you join') || 
                questionText.includes('available') || 
                questionText.includes('start date') ||
                questionText.includes('joining')) {
                return data.availability;
            }
            
            if (questionText.includes('rate') || 
                questionText.includes('skill') || 
                questionText.includes('proficiency') ||
                questionText.includes('experience level') ||
                questionText.includes('github') ||
                questionText.includes('experience')) {
                return data.link;
            }
            
            return data.hiringReason; // Default answer
        };

        // Fill in each additional question
        for (const pair of questionAnswerPairs) {
            try {
                const answer = getAnswer(pair.question);
                
                const selector = pair.textareaId ? 
                    `#${pair.textareaId}` : 
                    pair.textareaName ? 
                    `textarea[name="${pair.textareaName}"]` : 
                    'textarea';
                
                await tab.waitForSelector(selector, { visible: true, timeout: 5000 });
                
                // Clear existing text
                await tab.evaluate((sel) => {
                    const textarea = document.querySelector(sel);
                    if (textarea) textarea.value = '';
                }, selector);
                
                // Type the answer
                await tab.type(selector, answer, { delay: 50 });
                console.log(`Filled answer for question: ${pair.question.substring(0, 50)}...`);
                
                await new Promise(r => setTimeout(r, 500));
            } catch (error) {
                console.error(`Error filling question: ${pair.question}`, error);
            }
        }

        // Submit the application
        try {
            await tab.waitForSelector('input[type="submit"]#submit', {
                visible: true,
                timeout: 5000
            });
            
            await tab.click('input[type="submit"]#submit');
            console.log('Submitted application form');

            // Wait for submission to complete
            await new Promise(r => setTimeout(r, 4000));

            // Handle post-submission modal
            await tab.waitForSelector('a.back-cta[id="dismiss_similar_job_modal"]', {
                visible: true,
                timeout: 5000
            });

            await tab.click('a.back-cta[id="dismiss_similar_job_modal"]');
            console.log('Clicked on Go back to internship search');

            // Wait for navigation to complete
            await tab.waitForNavigation({ waitUntil: 'networkidle2' });
            console.log('Navigation back to search page completed');

        } catch (submitError) {
            console.error("Error during submission:", submitError);
            throw submitError;
        }
        
        //When internship apply page is opening in different tab we close that tab and return to same internship list page again to further apply:
        // await newTab.close();
        // console.log("Closed application tab");
        
    } catch (error) {
        console.error("Error in apply function:", error);
        // Take a screenshot for debugging
        try {
            const fs = require('fs');
            const path = require('path');
            // Create the error folder if it doesn't exist
            const errorFolderPath = path.join(__dirname, 'error');
            if (!fs.existsSync(errorFolderPath)) {
                fs.mkdirSync(errorFolderPath);
            }

            const pages = await tab.browser().pages();
            const errorTab = pages[pages.length - 1];
            
            // Save screenshot in the error folder
            const screenshotPath = path.join(errorFolderPath, `error-screenshot-${Date.now()}.png`);
            await errorTab.screenshot({ path: screenshotPath });
            console.log(`Error screenshot saved to: ${screenshotPath}`);
            // await errorTab.close();
        } catch (screenshotError) {
            console.error("Failed to save error screenshot:", screenshotError);
        }
    }
}


main().catch(error => console.error(error));




