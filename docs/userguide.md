# User Guide

**Before Continuing with this User Guide, please make sure you have deployed the frontend and backend stacks.**

- [Deployment Guides](./deployment.md)

| Index | Description |
| :---- | :---------- |
| [Public Table Page](#public-table-page) | Viewing all sample available to the public |
| [Individual Sample Page](#individual-sample-page) | Viewing a sample specified by sample ID |
| [Admin Login Page](#admin-login-page) | Login page for lab admin |
| [Admin Table Page](#admin-table-page) | Table with info privy only to the admin |
|||

## Public Table Page

The Public Table Page is a table that displays all the samples that have been through the drug-testing cycle. It does not display any sensitive information as this table can be accessed by anyone on the website.

![alt text](./images/publictable.png)

### 1. Public Table

The table displays samples in three columns of information: date sample was received by the lab, expected contents of the sample, and test results if they're available. The table can be searched/filtered via these columns.

### 2. Search Field

The three search field that are available match the three columns in the table. Each of them will filter the table by the input. For example: entering 'Heroin' in the expected contents will cause the table to show only samples with 'Heroin' in the expected contents column.

## Individual Sample Page

The individual samples page is for a user who has a specific sample ID. In the context of drug testing offered by the Hein Lab, a user will typically receive this sample ID from the sample submission package offered by the Lab. For other projects, how the user obtains their sample ID may vary.

### 1. Search Field

A user will enter their sample ID, then the search button is available to kickstart the query of the database. An invalid sample ID will cause an error message to display. The sample ID is not case sensitive, entries will be automatically converted to upper case.

![alt text](./images/sampleidentry.png)

### 2. Opt in for Email/SMS Notification

A button is available, which opens a box upon click to collect a user's contact information. The button toggles whether the entered contact info is an email address or phone number. If contact info already exists for the sample, a censored version of the info will be displayed. The existing contact info can be edited by pressing the edit button, entering different info, and then clicking save. After clicking the save button, invalid contact info will cause an error message to display, valid contact details will cause an OTP (One Time Password) to be sent to the contact. This OTP then must be entered in the text field to verify the user has entered the correct and desired contact info.

![alt text](./images/contactentry.png)

### 3. Entering Additional Metadata

A button that opens a box to prompt for additional information from a user. This box will open automatically if the user has yet to provide details on the expected contents about the sample or whether the sample has already been used. A checkbox is available to show whether a user has already used the sample, and the text field is for the user to enter what the expected contents of the sample is.

![alt text](./images/sampledataentry.png)

### 4. Sample Contents Table

If the status of the sample is 'Complete', a table will show, displaying the test results of the sample. In the left column are the chemical components of the sample, and in the right column are the percentage of these chemical components sorted by mass. The last row of the table displays any additional notes which may have been left by the lab admin for the user.

![alt text](./images/samplepage.png)


## Admin Login Page

The admin login page is an unlisted link which is available only to the lab admins, this page leads to the admin table. To access the Admin Login Page edit the URL to be ```<Base URL>/admin```

### 1. Login Field

This is a simple login field that allows for the lab admin to enter the next page. This user must be allocated through the AWS Console by the system administrator. It is intentionally designed to ensure only someone with the correct credentials can access the next page.

![alt text](./images/adminlogin.png)


## Admin Table Page

The admin table page is similar to the public samples page, but this table will display all the available information regarding each sample. This page does not contain sensitive information such as user contact information.

![alt text](./images/admintable.png)

### 1. Admin Table

The table contains 10 columns. Sample ID, expected contents, test results, status, date received, notes, if the sample has been used, location, colour of sample, and testing method. The edit button at the right of every row allows the admin to edit any of the fields. Any edit made to this table will update the backend database accordingly.

### 2. Filters

There are 5 filters available: status, location, color, testing method, and is-used. Each filter includes a dropdown list of checkboxes, these checkboxes are generated based on the actual entrie in the table. 

### 3. Search Fields

There are 4 search fields available: sample ID, expected content, test results, and date received. These search fields work the same way as the search fields in the public samples table.
