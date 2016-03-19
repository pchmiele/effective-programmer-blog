var defaultData  = [
    {name: "Meteor Principles",
        items: ["Data on the Wire",
            "One Language",
            "Database Everywhere",
            "Latency Compensation",
            "Full Stack Reactivity",
            "Embrace the Ecosystem",
            "Simplicity Equals Productivity"
        ]
    },
    {name: "Languages",
        items: ["Lisp",
            "C",
            "C++",
            "Python",
            "Ruby",
            "JavaScript",
            "Scala",
            "Erlang",
            "6502 Assembly"
        ]
    },
    {name: "Favorite Scientists",
        items: ["Ada Lovelace",
            "Grace Hopper",
            "Marie Curie",
            "Carl Friedrich Gauss",
            "Nikola Tesla",
            "Claude Shannon"
        ]
    }
];

var timestamp = (new Date()).getTime();

Meteor.methods({
    'fixtures/loadFixtures': function(){
        if (process.env.IS_MIRROR) {
            console.log('Loading default fixtures');
            Accounts.createUser({
                email: 'email@example.com',
                password: '123456'
            });

            _.each(defaultData, function(list) {
                var list_id = Lists.insert({name: list.name,
                    incompleteCount: list.items.length});

                _.each(list.items, function(text) {
                    Todos.insert({listId: list_id,
                        text: text,
                        createdAt: new Date(timestamp)});
                    timestamp += 1; // ensure unique timestamp.
                });
            });

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
