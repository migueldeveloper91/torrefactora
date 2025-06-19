export function getSJFTasks(tasks) {
  return [...tasks].sort((a, b) => {
    const isATerminated = a.state === "Terminada";
    const isBTerminated = b.state === "Terminada";

    if (isATerminated && !isBTerminated) return 1;
    if (!isATerminated && isBTerminated) return -1;
    if (isATerminated && isBTerminated) return 0;

    return a.duration - b.duration; // Ordenar por duración
  });
}
