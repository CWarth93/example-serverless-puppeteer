// README

//// Description
Web Application

//// Techstack
NodeJS, Next, React

//// Structure
- backend
-- basics
-- business
-- resources
- connection
- frontend
-- components
-- elements
-- hocs
-- pages
-- resources

//// How to get started
1) run script "setup"
2) run script "run"
3) open browser and use localhost as url

//// How to use
- the names of the files in the pages directory define the routes (f.e. http::localhost:3000/hello is a legit route here)
- pages are created like: hocs > pages > components > elements
- attributes can be inherited
- backend directory for deeper functionality (keep ui clean)

//// Testing

- testing the ui: set MODE = 'test' in next.config.js and you can use connection/mock.js for providing test data
- testing the functionality: you can write tests for specific functions in connection/connector.test.js