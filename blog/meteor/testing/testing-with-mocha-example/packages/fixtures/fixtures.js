// Write your package code here!

Meteor.methods({
    'fixtures/loadFixtures': function(){
        if (process.env.IS_MIRROR) {
            console.log('Loading default fixtures');
            Accounts.createUser({
                email: 'email@example.com',
                password: '123456'
            });
            var id = '0';
            Todos.insert({
                listId: id,
                text: 'todoTestedValue',
                checked: false,
                createdAt: new Date()
            });

            var list = {
                _id: id,
                name: 'listName',
                incompleteCount: 0
            };
            Lists.insert(list);

            console.log('Finished loading default fixtures');
        } else {
            console.log('loadFixtures failed');
        }
    },

    'fixtures/clearDB': function(){
        if (process.env.IS_MIRROR) {
            console.log('Clear DB');

            var collectionsRemoved = 0;
            var db = Meteor.users.find()._mongo.db;
            db.collections(function (err, collections) {

                var appCollections = _.reject(collections, function (col) {
                    return col.collectionName.indexOf('velocity') === 0 ||
                        col.collectionName === 'system.indexes';
                });

                _.each(appCollections, function (appCollection) {
                    appCollection.remove(function (e) {
                        if (e) {
                            console.error('Failed removing collection', e);
                            fut.return('fail: ' + e);
                        }
                        collectionsRemoved++;
                        console.log('Removed collection');
                        if (appCollections.length === collectionsRemoved) {
                            console.log('Finished resetting database');
                        }
                    });
                });
            });

            console.log('Finished clearing');
        } else {
            console.log('clearDB failed');
        }
    }
});
