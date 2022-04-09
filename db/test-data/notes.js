const {DateTime} = require('luxon')
module.exports = [
    {
      listId: "test",
      noteTitle: 'This is the title',
      noteText: 'This is the text of the first example note',
      timestamp: DateTime.fromMillis(1649001286757).toSQL(),
      priority: 1,
      deadline: DateTime.fromMillis(1650150000000).toSQL(),
    },
    {
      listId: "test",
      noteTitle: 'Second Test Title',
      noteText: 'This is the text of the second example note',
      timestamp: DateTime.fromMillis(1629001286757).toSQL(),
      priority: 2,
      deadline: DateTime.fromMillis(1690150000000).toSQL(),
    },
    {
      listId: "another",
      noteTitle: 'First Other Test Title',
      noteText: 'This is the text for the first note for the other list',
      timestamp: DateTime.fromMillis(1629001286757).toSQL(),
      priority: 2,
      deadline: DateTime.fromMillis(1690150000000).toSQL(),
    },
    {
      listId: "another",
      noteTitle: 'Second Other Test Title',
      noteText: 'This is the text for the second note for the other list',
      timestamp: DateTime.fromMillis(1619001286757).toSQL(),
      priority: 2,
      deadline: DateTime.fromMillis(1790150000000).toSQL(),
    },
  ];
  