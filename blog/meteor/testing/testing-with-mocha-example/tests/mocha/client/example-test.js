/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Przemysław Chmielewski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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
            browser.url('http://localhost:3000/lists/0');
            browser.waitForVisible('.title-page');
        });

        it('page title should be set by the Meteor method @watch', function () {
            expect(browser.getTitle()).to.equal('Todos - All your todos synced wherever you happen to be');
        });

        it('user should be able to create todo list @watch', function () {
            var todoListsLengthBefore = getTodoLists().length;
            browser.click('.js-new-list');

            var todoListsLengthAfter = getTodoLists().length;
            var expectedTodoListLength = todoListsLengthBefore + 1;
            expect(todoListsLengthAfter).to.equal(expectedTodoListLength);
        });

        it('user should be able to rename the todo list @watch', function () {
            browser.click('.title-page');

            var todoListName = 'todoListName';
            browser.setValue('[name="name"]', todoListName);
            browser.waitForVisible('.list-edit-form');
            browser.submitForm('.list-edit-form');

            expect(browser.getText('.list-todo')).to.equal(todoListName)
        });

        it('user should be able to add task @watch', function () {
            var todoItemsLengthBefore= getTodoItems().length;

            browser.setValue('.page.lists-show nav form.todo-new input[type="text"]', 'new task');
            browser.submitForm('.page.lists-show nav form.todo-new');

            var todoItemsLengthAfter = getTodoItems().length;
            var expectedTodoItemsLength = todoItemsLengthBefore + 1;
            expect(todoItemsLengthAfter).to.equal(expectedTodoItemsLength);
        });

        it('user should be able to remove task @watch', function () {
            var todoItemsLengthBefore = getTodoItems().length;
            expect(todoItemsLengthBefore).to.be.at.least(1);

            browser.click('.list-item');
            browser.click('.list-items .list-item .delete-item');

            var todoItemsLengthAfter = getTodoItems().length;
            expect(todoItemsLengthAfter).to.be.empty;
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

