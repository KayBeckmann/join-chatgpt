<template>
    <div class="dashboard">
      <div class="header">
        <h1>Willkommen, {{ userName }}</h1>
        <p>Hier sind deine heutigen Aufgaben und Statistiken:</p>
      </div>
  
      <!-- Statistiken -->
      <div class="stats">
        <div class="stat-item">
          <h2>{{ tasksDueToday }}</h2>
          <p>Fällige Aufgaben heute</p>
        </div>
        <div class="stat-item">
          <h2>{{ highPriorityTasks }}</h2>
          <p>Aufgaben mit hoher Priorität</p>
        </div>
        <div class="stat-item">
          <h2>{{ totalTasks }}</h2>
          <p>Gesamte Aufgaben</p>
        </div>
      </div>
  
      <!-- Filter und Kanban-Board -->
      <div class="kanban-board">
        <div class="filter">
          <label>
            <input type="radio" value="all" v-model="filter" /> Alle Aufgaben
          </label>
          <label>
            <input type="radio" value="own" v-model="filter" /> Eigene Aufgaben
          </label>
        </div>
  
        <div class="columns">
          <KanbanColumn 
            title="Wartend" 
            :tasks="filteredTasks('wartend')" 
          />
          <KanbanColumn 
            title="In Bearbeitung" 
            :tasks="filteredTasks('inBearbeitung')" 
          />
          <KanbanColumn 
            title="Prüfen" 
            :tasks="filteredTasks('prüfen')" 
          />
          <KanbanColumn 
            title="Erledigt" 
            :tasks="filteredTasks('erledigt')" 
          />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { computed, ref, onMounted } from 'vue';
  import { useAuthStore } from '../stores/auth';
  import KanbanColumn from '../components/KanbanColumn.vue';
  import db from '../utils/dexieDB';
  import axios from 'axios';
  
  export default {
    components: { KanbanColumn },
    setup() {
      const authStore = useAuthStore();
      const userName = computed(() => authStore.user?.name || 'Benutzer');
      const tasks = ref([]);
      const filter = ref('all');
  
      // Statistiken
      const tasksDueToday = computed(() =>
        tasks.value.filter(task => isDueToday(task.dueDate)).length
      );
      const highPriorityTasks = computed(() =>
        tasks.value.filter(task => task.priority === 'hoch').length
      );
      const totalTasks = computed(() => tasks.value.length);
  
      // Aufgaben laden
      const fetchTasks = async () => {
        try {
          const { data } = await axios.get('/api/tasks', {
            headers: { Authorization: `Bearer ${authStore.token}` },
          });
          tasks.value = data;
  
          // Daten in Dexie speichern
          await db.tasks.clear();
          await db.tasks.bulkAdd(data);
        } catch (error) {
          console.error('Fehler beim Laden der Aufgaben:', error);
  
          // Fallback auf Dexie
          tasks.value = await db.tasks.toArray();
        }
      };
  
      // Filterung der Aufgaben
      const filteredTasks = (status) => {
        const userId = authStore.user?.id;
        return tasks.value.filter(task => 
          task.status === status &&
          (filter.value === 'all' || task.userId === userId)
        );
      };
  
      // Hilfsfunktion: Ist heute fällig
      const isDueToday = (dueDate) => {
        const today = new Date().toISOString().split('T')[0];
        return dueDate === today;
      };
  
      onMounted(() => {
        fetchTasks();
      });
  
      return {
        userName,
        tasks,
        tasksDueToday,
        highPriorityTasks,
        totalTasks,
        filteredTasks,
        filter,
      };
    },
  };
  </script>
  
  <style scoped>
  .dashboard {
    padding: 1rem;
    background-color: darkblue;
  }
  
  .header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .stats {
    display: flex;
    justify-content: space-around;
    margin-bottom: 2rem;
  }
  
  .stat-item {
    text-align: center;
    padding: 1rem;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .kanban-board {
    margin-top: 2rem;
  }
  
  .filter {
    text-align: center;
    margin-bottom: 1rem;
  }
  
  .columns {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
  </style>