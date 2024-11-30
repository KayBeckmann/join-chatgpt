<template>
    <div class="task-card">
      <h4>{{ task.title }}</h4>
      <p>{{ task.description }}</p>
      <p>Priorität: {{ task.priority }}</p>
    </div>
  </template>
  
  <script>
  export default {
    props: ['task'],
  };
  </script>
  
  <style>
  /* Styles für die Task-Karten */
  </style>