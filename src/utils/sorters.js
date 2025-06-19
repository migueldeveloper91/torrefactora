const priorityOrder = {
  Urgente: 1,
  Normal: 2,
  Bajo: 3,
};

export function getSJFTasks(tasks = []) {
  return [...tasks].sort((a, b) => {
    if (a.duration !== b.duration) {
      return a.duration - b.duration; // orden principal por duración
    }
    return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4); // orden secundario por prioridad
  });
}
