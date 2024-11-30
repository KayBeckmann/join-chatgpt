<template>
    <div class="kanban-column">
      <h3>{{ title }}</h3>
      <div v-for="task in tasks" :key="task.id" class="task-card">
        <TaskCard :task="task" />
      </div>
    </div>
  </template>
  
  <script>
  import TaskCard from './TaskCard.vue';
  
  export default {
    props: ['title', 'tasks'],
    components: { TaskCard },
  };
  </script>
  
  <style>
  /* Styles für Spalten */
  </style>