# Harm Reduction Web App

In collaboration with the UBC CIC, the Hein Lab (UBC Chemistry) developed a solution using AWS services to build awareness of harm reduction by posting the certainty of tested drug safeness on a public table. The process builds off from the Hein lab. In this way, the Hein lab uses a dropbox, where the student drops off the drug sample while understanding that their privacy is maintained if they opt out of providing contact information. Next, once the sample is obtained and prepared, the Hein lab’s robot records drug samples, tracks the sample as it undergoes testing, and the solution prototype developed by the CIC activates– results of the sample are posted to the public for viewing. With the help of cloud technology, resource capacity is solved, and the data is easily accessible and retrievable for future review and revision. 

|Index| Description|
|:---------------------------------------------------|:---------------------------------------------------------|
| [Stack Overview](#stack-overview)                  | The technologies powering the project.                   |
| [High Level Architecure](#high-level-architecture) | High level overview illustrating component interactions  |
| [Screenshots](#screenshots)                        | View screenshots of the application.                     |
| [Deployment](#deployment-guide)                    | Learn how to deploy this project yourself.               |
| [User Guide](#user-guide)                          | Learn how to use this application.                       |
| [License](#license)                                | License details.                                         |

## Stack Overview

The solution is a web application, which allows users (students/lab admins) to make various interactions and queries to the database in the backend. Testing results from the robot in the lab is automatically uploaded to the storage in the cloud via an API endpoint. students are able to check the status of a specific sample by searching via sample ID, as well as view basic information about all the samples that the lab has tested.

## High Level Architecture

The following architecture diagram illustrates the various AWS components utilized to deliver the solution.  
![alt text](./docs/images/architecture.png)

## Screenshots

### Home Page

![alt text](./docs/images/homepage.png)

### Public Table of Samples

![alt text](./docs/images/publictable.png)

### Searching via Specific Sample ID

![alt text](./docs/images/sampleidentry.png)

### Admin Login Page

![alt text](./docs/images/adminlogin.png)

### Admin Table of Samples

![alt text](./docs/images/admintable.png)

## Deployment Guide

To deploy this solution, please follow our [Deployment Guide](./docs/deployment.md).

### Directories
```
├── amplify.yml
├── cdk
│   ├── bin
│   │   └── cdk.ts
│   ├── cdk.json
│   ├── jest.config.js
│   ├── lambdas
│   │   ├── dbapihandler
│   │   ├── otpapihandler
│   │   └── sendnotif
│   ├── lib
│   │   └── cdk-stack.ts
│   ├── package-lock.json
│   ├── package.json
│   └── tsconfig.json
├── docs
│   ├── architecture.md
│   ├── deployment.md
│   ├── images
│   └── userguide.md
├── package-lock.json
├── package.json
├── public
└── src
    ├── app.css
    ├── app.js
    ├── components
    │   ├── admintable.js
    │   └── navbar.js
    ├── css
    │   ├── admintable.css
    │   ├── navbar.css
    │   └── tracksample.css
    ├── index.css
    ├── index.js
    ├── pages
    │   ├── about.js
    │   ├── admin.js
    │   ├── publictable.js
    │   ├── resource.js
    │   └── tracksample.js
    └── utils
        └── loginworker.js
```
1. `amplify.yml`: The build settings file, amplify automatically applies the configuration described in this file to the frontend deployment
2. `/cdk`: Contains the cdk app, which is used to deploy all the backend resources used in this project
    - `/bin`: Contains the `cdk.ts` file, which is a part of the cdk app
    - `/lambdas`: Contains the 3 lambda functions that are a part of the backend, each subdirectory under `/lambdas` contains one file that contain the code that is a part of its corresponding lambda function
    - `/lib`: Contains the `cdk-stack.ts` file, which describes all the resource deployed as a part of the app
3. `/docs`: Contains the various documentation relevant to the project
4. `/public`: Contains some resources used for the frontend of the app
5. `/src`: Contains the main source code that make up the frontend
    - `/components`: Contains various components used as a part of the frontned
    - `/css`: Contains various css files which help define the appearance of the frontend
    - `/pages`: Contains one file corresponding to each page of the app, some pages are hidden and made inaccessible in the frontend
    - `/utils`: Contains files containing utility functions used by the frontend of the app

## User Guide

For instructions on how to use the web app, refer to the [User Guide](./docs/userguide.md).

## Credits

This application was architected and developed by Michael O'Keefe and Muhan Li, with guidance from the UBC CIC technical and project management teams.

## License

This project is distributed under the [MIT License](./LICENSE).

Licenses of libraries and tools used by the system are listed below

| Library | License |
| :---- | :---------- |
| [aws-amplify-js](https://github.com/aws-amplify/amplify-js/tree/main) | [Apache-2.0](https://github.com/aws-amplify/amplify-js/blob/main/LICENSE) |
| [aws-cdk](https://github.com/aws/aws-cdk) | [Apache-2.0](https://github.com/aws/aws-cdk/blob/main/LICENSE) |
| [aws-constructs](https://github.com/aws/constructs) | [Apache-2.0](https://github.com/aws/constructs/blob/10.x/LICENSE) |
| [aws-sdk-js](https://github.com/aws/aws-sdk-js/tree/master) | [Apache-2.0](https://github.com/aws/aws-sdk-js/blob/master/LICENSE.txt) |
| [axios](https://github.com/axios/axios/tree/v1.x) | [MIT](https://github.com/axios/axios/blob/v1.x/LICENSE) |
| [buffer](https://github.com/feross/buffer/tree/master) | [MIT](https://github.com/sanniassin/react-input-mask/blob/master/LICENSE.md) |
| [dayjs](https://github.com/iamkun/dayjs) | [MIT](https://github.com/iamkun/dayjs/blob/dev/LICENSE) |
| [emotion-js](https://github.com/emotion-js/emotion) | [MIT](https://github.com/emotion-js/emotion/blob/main/LICENSE) |
| [Material UI](https://github.com/mui/material-ui) | [MIT](https://github.com/mui/material-ui/blob/master/LICENSE) |
| [react](https://github.com/facebook/react) | [MIT](https://github.com/facebook/react/blob/main/LICENSE) |
| [react-device-detect](https://github.com/duskload/react-device-detect) | [MIT](https://github.com/duskload/react-device-detect/blob/master/LICENSE) |
| [react-input-mask](https://github.com/sanniassin/react-input-mask) | [MIT](https://github.com/sanniassin/react-input-mask/blob/master/LICENSE.md) |
| [react-router](https://github.com/remix-run/react-router/tree/main) | [MIT](https://github.com/remix-run/react-router/blob/main/LICENSE.md) |
| [source-map-support](https://github.com/evanw/node-source-map-support) | [MIT](https://github.com/evanw/node-source-map-support/blob/master/LICENSE.md)
