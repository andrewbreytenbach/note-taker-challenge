# Note Taker App

The Note Taker App is a web-based application that allows users to create, save, and delete notes. The application uses a server-side API built with Node.js and Express to handle HTTP requests and interact with a JSON database file. Users can access the Note Taker App through a web browser on any device.

## About The Project

The Note Taker App is designed to streamline the note-taking process for users. Users can create new notes with a title and content, save them to the database, and view them on the left-hand side of the page. The user can select a note from the list to view its content, or delete the note entirely. 

### The Note Taker App utilizes the following technologies:

Node.js
Express.js
JavaScript
HTML
CSS
Bootstrap

## Getting Started

To get started with the Note Taker App, follow these steps:

1. Clone this repository: git clone https://github.com/andrewbreytenbach/notetaker-app.git
2. Change to the project directory: cd notetaker-app
3. Install dependencies: npm install
4. Start the server: npm start
5. Open your web browser and navigate to http://localhost:3001/

![Launch Page](/images/Screenshot%202023-04-11%20at%2015.14.20.png "Launch Page")

## Usage

To create a new note, click on the "New Note" button in the upper right-hand corner of the page. Enter a title and content for the note and click the save icon in the top right corner.

![New Note](/images/11-express-homework-demo-01.png "New Note")

To view a note, click on the note's title in the list on the left-hand side of the page. To delete a note, click on the trash can icon to the right of the note's title.

![View Notes](/images/11-express-homework-demo-02.png "View Notes")

## API Routes

The Note Taker App has the following API routes:

* GET /api/notes: Returns all notes from the database as JSON
* POST /api/notes: Adds a new note to the database
* DELETE /api/notes/:id: Deletes a note from the database by its ID

## Running Tests

The Note Taker App uses Jest for running unit tests. To run tests, run the following command: npm test

## Contact
* [https://github.com/andrewbreytenbach](Andrew Breytenbach)
* Project Link: [https://note-taker-challenge-expressjs.herokuapp.com/](Note Taker Challenge)

## Acknowledgements
* [https://nodejs.org/] (Node.js)
* [https://jestjs.io/] (Jest)
* [https://expressjs.com/] (Express.js)
* [https://heroku.com/] (Heroku)
* [https://getbootstrap.com/] (Bootstrap)
* [https://github.com/coding-boot-camp/miniature-eureka] (Starter Code)




