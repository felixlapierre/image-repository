# image-repository
Image repository server that allows storing, deleting and searching of images

## Installation

This application requires
* Node v10.15.0 or equivalent
* MongoDB v4.0.3 or equivalent

1. Clone the git repository onto your computer
2. Run the command `npm install` in the project folder
3. Enter your MongoDB connection string in Index.ts
4. In the MongoDB shell, select your database and enter the following command to enable text searching for images:
db.createIndex({name: "text", description: "text"})

## Running Instructions
* `npm run backend`: Builds and runs the backend server
* `npm run frontend`: Builds and runs the frontend server
* `npm run test`: Runs the project acceptance tests
