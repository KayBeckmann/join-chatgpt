import Dexie from 'dexie';

const db = new Dexie('KanbanDB');
db.version(1).stores({
  tasks: 'id, title, description, status, priority, dueDate, userId',
});

export default db;