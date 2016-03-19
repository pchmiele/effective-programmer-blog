function getTodoLists() {
    return browser.elements('.list-todo').value;
}

function getTodoItems() {
    return browser.elements('.list-item').value;
}

describe('Views', function() {
    beforeEach(function() {
        server.call('fixtures/clearDB');
        server.call('fixtures/loadFixtures');
    });

    describe('/', function() {
        beforeEach(function() {
            browser.url('http://localhost:3000');
            browser.waitForExist('.title-page');
        });

        it('page title should be set by the Meteor method @watch', function () {
            expect(browser.getTitle()).to.equal('Todos - All your todos synced wherever you happen to be');
        });

        it('user should be able to create todo list @watch', function () {
            var initialTodoListLength = getTodoLists().length;
            browser.click('.js-new-list');

            var actualTodoListLength = getTodoLists().length;
            var expectedTodoListLength = initialTodoListLength + 1;
            expect(actualTodoListLength).to.equal(expectedTodoListLength);
        });

        it('user should be able to remove task @watch', function () {
            var initialTodoItemsLength = getTodoItems().length;
            expect(initialTodoItemsLength).to.be.at.least(1);

            browser.click('.list-item');
            browser.click('.list-items .list-item .delete-item');

            var actualTodoItemsLength = getTodoItems().length;
            var expectedTodoItemsLength = initialTodoItemsLength - 1;
            expect(actualTodoItemsLength).to.equal(expectedTodoItemsLength);
        });
    });

    describe('/join', function() {
        it('new user should be able to create new account @watch', function () {
            browser.url('http://localhost:3000/join');
            browser.waitForText('.title-auth');

            browser.setValue('[name="email"]', 'asd2@mail.com');
            browser.setValue('[name="password"]', 'password');
            browser.setValue('[name="confirm"]', 'password');

            browser.click('.page.auth .wrapper-auth form .btn-primary');
        });
    });

    describe('/signin', function() {
        it('existing user should be able to sign in @watch', function () {
            browser.url('http://localhost:3000/signin');
            browser.waitForText('.title-auth');

            browser.setValue('[name="email"]', 'email@example.com');
            browser.setValue('[name="password"]', '123456');

            browser.click('.page.auth .wrapper-auth form .btn-primary');
        });
    });
});

