import { getFirestore, collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';

export const updateProjectsWithPendingTasks = async () => {
  const db = getFirestore();
  const projectsRef = collection(db, 'projects');
  const projectsSnapshot = await getDocs(projectsRef);

  for (const projectDoc of projectsSnapshot.docs) {
    const tasksRef = collection(db, `projects/${projectDoc.id}/tasks`);
    const pendingTasksQuery = query(tasksRef, where('progress', '<', 100));
    const pendingTasksSnapshot = await getDocs(pendingTasksQuery);
    
    await updateDoc(doc(db, 'projects', projectDoc.id), {
      pendingTasksCount: pendingTasksSnapshot.size
    });
  }
};
