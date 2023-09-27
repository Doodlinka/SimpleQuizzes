# Simple Quizzes

#### Video Demo:  https://youtu.be/qYlQRVvCOCs

#### Description:
This is a web app that allows users to create and play quizzes.
It supports quizzes with or without correct answers and multiple choice questions.
Simple Quizzes doesn't have an account system because i didn't feel like adding one.

#### How it works:
You can create a quiz, specifying questions, answers and winners (results), and play quizzes.
If the quiz doesn't have correct answers, each answer gives one point to a specified winner;
the quiz's result when playing is whichever winner gains most points from player's answers,
picked randomly out of highest-scoring ones in case of a tie.
If the quiz has correct answers, winners are treated as equal sections on a 0-1 scale. User's
inputs are converted to a correct/total fraction, and a result is displayed based on that scale.
A multiple choice question is only answered correctly if all and only the correct options are ticked.

#### HTML forms and security:
Most effort went into making Simple Quizzes crashproof. Vanilla HTML forms are never used
because they heavily depend on "view" HTML elements and their unique names. First, they're hard to
make flexible - each element needs a unique name that contains all info about what it is
and how it's related to other elements, so a complex id system has to be created. Second, forms
are submitted in a inconvenient format that gives very little info about the fields, so their
names have to contain all of it, and it's difficult to check and parse. Third, most important,
they're very easy to alter with browser dev tools, and checking for all ways of how can a form
be altered with little data in a stupid format is just way too difficult. Because of all this
Simple Quizzes uses a lot of js and no vanilla forms to secure and parse data.

#### Project's files:

##### create.js:
Contains js for create.html, is responsible for altering the "form" on button presses,
recording inputted conveniently formatted data in a safe place and sending a POST request.

##### jquery.js:
A library, unused so far.

##### play.js:
Contains js for play.html, is responsible for validating and parsing player's answers
and displaying results.

##### templates.js:
A file used in create.js, contains strings with html for form fields.

##### create, index, play.html:
Nondescript webpages for creating, browsing and playing quizzes.

##### favicon.ico:
An empty placeholder to avoid a 404.

##### styles.css:
A nondescript stylesheet.

##### todo.txt:
A to-do list for this project, sorted by priority.

##### README.md:
A long and fancy project description.

##### quizzes.db:
An sqlite3 database containing quiz data.

##### test.db:
Contains junk test quizzes.

##### app.py:
Contains the flask application, functions are listed below:

###### create:
Just renders the page.

###### index:
Parses data and adds the quiz to the database on POST,
renders index in any case.

###### play:
Gets quiz data and passes it with render_template.

##### Stolen pset distribution code:
- some index.html with all tags and headers and stuff
- flask app setup lines and decorator syntax
- a stylesheet

#### Thanks:
- Dad for help with testing and project name.