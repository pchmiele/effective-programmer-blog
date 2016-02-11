Package.describe({
  name: 'awesome:fixtures',
  version: '0.0.1',
  summary: 'Example fixtures which helps in e2e tesing with chimp and mocha',
  debugOnly: true
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.addFiles('fixtures.js');
});