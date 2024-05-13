import { useRouter } from 'next/router';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface Task {
  id: string;
  name: string;
}

interface Column {
  id: string;
  name: string;
  tasks: Task[];
}

interface Project {
  id: string;
  name: string;
  columns: string[];
}

const ProjectDetails: NextPage = () => {
  const router = useRouter();
  const { _id } = router.query;
  const [project, setProject] = useState<Project | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!_id || typeof _id !== 'string') return;
      try {
        const projectResponse = await axios.get<Project>(`http://localhost:5000/project/${_id}`);
        setProject(projectResponse.data);
        const columnsPromises = projectResponse.data.model.columns.map(columnId =>
          axios.get<Column>(`http://localhost:5000/column/${columnId}`)
        );
        const columnsResponses = await Promise.all(columnsPromises);
        const columnsWithTasks = await Promise.all(columnsResponses.map(async (columnResponse) => {
          const column = columnResponse.data;
          const tasksPromises = column.model.taches.map(taskId =>
            axios.get<Task>(`http://localhost:5000/tache/${taskId}`)
          );
          const tasksResponses = await Promise.all(tasksPromises);
          return {
            ...column,
            tasks: tasksResponses.map(response => response.data.model)
          };
        }));
        setColumns(columnsWithTasks);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project details:", error);
        setError("Failed to load project details. Please try again later.");
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [_id]);

  const onDragEnd = (result) => {
    // Implement reordering logic here
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="My Project" />
      <h2>Project: {project?.model.nom}</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="columns-container" style={{ display: 'flex', justifyContent: 'space-around', padding: '10px' }}>
          {columns.map((column, index) => (
            <Droppable key={column.model._id} droppableId={column.model._id}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} style={{ margin: '8px', background: '#e2e2e2', padding: '10px', width: '250px' }}>
                  <h2>{column.model.nom}</h2>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {column.tasks.map((task, taskIndex) => (
                      <Draggable key={task._id} draggableId={task.id} index={taskIndex}>
                        {(provided) => (
                          <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{ padding: '6px', margin: '4px', background: '#fff', borderRadius: '4px' }}>
                            {task.nom}
                          </li>
                        )}
                      </Draggable>
                    ))}
                  </ul>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </DefaultLayout>
  );
};

export default ProjectDetails;
