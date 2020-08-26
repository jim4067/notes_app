# NOTES APP

Hi there and welcome!

This is the Back End of the note taking app.
This is where all the magic happens. Requests for creating, updating and removing a note are handled here.

User authentication and creation also happens here.

The notes app is from the [fullstackopen] course that is offered by the Univesity of Helsinki.

<br />

## Technologies used in building the app

- The back end is built using the Node.js together with the Express.js framework. :metal:
- The Database used is MongoDB with the really awesome mongoose as the connector. DB as a service is from Atlas.
- The entire project is hosted on Heroku where you can host dynamic sites for free. Shout out to them too.
- User authentication is performed using jsonwebtokens and hashing of user passwords is done by bcrypt.
- The linter used for code consistency is eslint.(God this was a pain in the ass when your not consistent with your coding style).
- The unit tests are performed using JEST (yay! Facebook) while end to end testing using Cypress.
- The folowing dependancies also deserve a shoutout for making the dev process easier.
  - [supertest] for wrapping around the entire express app and thus making testing using jest more <del>easier</del> :joy: manageble.
  - [express-async-erros] for eliminating the need to write the try-catch block each time when using async functions.
  - [cors] to allow \*
  - [morgan] although I had my own request logger function I prefer morgan.
  - [nodemon] so that the server restarted every time I made changes to the code.

<br />

## Running the app locally

This app is not oftenly deployed to production so here are the instruction for running it locally.

- Make sure you have git and node and is familiar with the basics of how both of them work.
- clone this repository.
- change directory into the notes app.
- install all the required dependancies.
- run the npm script that starts the server locally.

                    git clone https://github.com/jim4067/notes_app_frontend.git
                    cd notes_app_front_end
                    npm i
                    npm run dev

<br />
<br />

[fullstackopen]: https://fullstackopen.com
[express-async-erros]: https://
[supertest]: https://
[cors]: https://
[morgan]: https://
[nodemon]: https://
