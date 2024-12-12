# SmartApply-V1 (Internshala Automation Script)
This project automates the process of applying to internships on Internshala using Puppeteer, allowing users to save time by automatically filling in their details and applying to multiple internships. The script is configurable for different profiles, locations, and other preferences.

## Features
- Logs into your Internshala account using credentials from `secret.js`.
- Searches for internships based on user-defined criteria (e.g., profile, location).
- Automatically applies to internships, filling out application forms and cover letters.
- Optionally fills out the resume section on Internshala.
- Supports customizable application limits, location, and job profile settings.

### Demo Video Link: <a>https://drive.google.com/file/d/1pl82vU6VkV6bjrVaPIxR0qH43g8RGk7-/view?usp=sharing</a>

## How It Works

### Steps to Run the Script
1. **Clone or Download the Repository**
   ```bash
   git clone https://github.com/shatakshishukla17/SmartApply.git

   ```

2. **Install Dependencies**
   Ensure Node.js is installed on your system. Then, install the required dependencies:
   ```bash
   npm install
   ```

3. **Update Configuration Files**
   - Open the `secret.js` file and add your Internshala credentials:
     ```javascript
     module.exports = {
         id: "your_email@example.com",
         pass: "your_password"
     };
     ```
   - Open the `data.js` file and update it with your personal information for the application:
     ```javascript
     module.exports = [
         {
             hiringReason: "Your hiring reason",
             availability: "Your availability",
             link: "Your portfolio or LinkedIn URL or github URL",
             // Add additional fields as needed
         }
     ];
     ```

4. **Run the Script**
   ```bash
   node in.js
   ```

### Customization
1. **Limit the Number of Applications**
   By default, the script applies to 4 internships at a time. To modify this, change the following code in `in.js`:
   ```javascript
   for (let i = 0; i < Math.min(4, internshipContainers.length); i++) {
   ```
   Replace `4` with the desired number of internships.

2. **Set Profile and Location Preferences**
   Update the following lines in `in.js` to customize your preferences:
   ```javascript
   const profileName = 'Web Development'; // Desired profile name
   const locationName = ''; // Location if needed
   const chooseToWorkFromHome = true; // Set to true or false
   const choosePartTimeWork = false; // Set to true or false
   ```

3. **Enable Resume Section Automation**
   To fill out the resume section on Internshala, uncomment the relevant code in `in.js`. Look for comments like:
   ```javascript
   // When you want to fill the resume section also in Internshala website use this code:
   ```

4. **Handle Cover Letter and Additional Questions**
   The script dynamically fills cover letters and additional questions based on the provided data. Update your `data.js` file with the necessary information.

## Notes
- Protect your credentials by keeping `secret.js` private.
- Use this script responsibly, adhering to Internshala's terms of service.

## Disclaimer
This script is for educational purposes only. The developer is not responsible for any misuse or violations of Internshala’s policies.

---
For questions or suggestions, feel free to create an issue or submit a pull request!
Thankyou!!
