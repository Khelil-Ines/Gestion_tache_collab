import { useRouter } from 'next/router';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSession } from 'next-auth/react';
import CustomAlerts from '@/components/CustomAlerts';
import '@/css/delete.scss';
import Select from 'react-select';





interface Task {
  id: string;
  name: string;
}

interface Column {
  id: string;
  name: string;
  tasks: Task[];
  isAddingTask: boolean;
  newTaskName: string;
  selectedUserId: string;
}

interface Project {
  id: string;
  name: string;
  columns: Column[];
}

interface User {
  id: string;
  name: string;
}

const ProjectDetails: NextPage = () => {
  
  const { data: session } = useSession();
console.log(session);
  const router = useRouter();
  const { _id } = router.query;
  const [project, setProject] = useState<Project | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [newColumnName, setNewColumnName] = useState('');
const [isAddingColumn, setIsAddingColumn] = useState(false); // To handle form visibility
const [currentColumnId, setCurrentColumnId] = useState(null);
const [selectedUser, setSelectedUser] = useState('');
const [newTaskName, setNewTaskName] = useState('');
const [users, setUsers] = useState<User[]>([]); // Users state


const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:5000/getU'); // Make sure the URL is correct
    console.log('Users fetched:', response.data.model);
    setUsers(response.data.model); // Assuming the response data is the array of users
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
};
useEffect(() => {
fetchUsers();
}, [_id]);

const options =  users.map(user => ({
  value: user._id,
  label: user.email
}));

const customStyles = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? 'blue' : base.borderColor,
    '&:hover': {
      borderColor: state.isFocused ? 'darkblue' : base.borderColor,
    },
    boxShadow: state.isFocused ? null : null,
  }),
};

const handleSelectChange = selectedOption => {
  setSelectedUser(selectedOption.value);
};

const handleAddTask = async () => {
  console.log('Adding task for user ID:', selectedUser); // Ensure this is not undefined

  if (!currentColumnId || !selectedUser) {
    console.log('Selected user:', selectedUser);
    console.error('No column or user selected');
    return;
}
  try {
      const response = await axios.post(`http://localhost:5000/tache/add/${currentColumnId}`, {
          nom: newTaskName, // Example task data
          responsable: selectedUser    
        });
      console.log('Task added successfully:', response.data);
      // Update your UI or fetch new data as needed
      await fetchColumns();  // Make sure to implement this function to refresh your local state

  } catch (error) {
      console.log('Selected user:', selectedUser);
      console.error('Failed to add task:', error);
  }
};





  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert.show]);

// Function to fetch columns
const fetchColumns = async () => {
  if (!_id) {
    console.log('Project ID is undefined');
    return; // Avoid making a request if the project ID is not defined
  }

  try {
    const response = await axios.get<Project>(`http://localhost:5000/project/${_id}`);
    console.log('Fetched project:', response.data.model);
    if (response.status === 200) {
      const project = response.data.model;
      const columnsPromises = project.columns.map(columnId =>
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
          tasks: tasksResponses.map(response => response.data.model),
          isAddingTask: false,
          newTaskName: '',
          selectedUserId: ''
        };
      }));
      setColumns(columnsWithTasks);
    } else {
      console.error(`Failed to fetch project: ${response.status}`);
      // Handle non-success status codes appropriately
    }
  } catch (error) {
    console.error(`Error fetching project: ${error.message}`);
    // Handle network or server errors here
  }
};
useEffect(() => {
  fetchColumns();
}, [_id]); // Fetch columns whenever _id changes



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

  const onDragEnd =  async (result) => {
    const { source, destination, draggableId } = result;

    // Do nothing if the task is dropped outside any column
    if (!destination) {
      return;
    }

    // API call to move the task
    try {
      const response = await axios.post(`http://localhost:5000/tache/${draggableId}/move/${destination.droppableId}`, {}, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}` // Assuming the token is stored in the session state
        }
      });
     
    
      console.log(typeof session?.user?._id, typeof response.data.tache.responsable);  // Check data types

      console.log('Session User ID:', session?.user?._id);  // Log user ID from session
      console.log('Task Responsable ID:', response.data.tache.responsable); 
      if (session?.user?._id !== response.data.tache.responsable){
        console.error('Failed to move the task, not authorized :', response.data.error);
        return
      }
      if (response.status === 200) {
        console.log('Task moved successfully:', response.data);
        // Fetch new columns data or adjust the local state optimistically
        await fetchColumns();  // Make sure to implement this function to refresh your local state
      } else {
        // Handle any errors returned by the server, e.g., task or column not found
        console.error('Failed to move the task:', response.data.error);
      }
    } catch(error: unknown) {
      console.error('Error moving task:', error);
  
      if (axios.isAxiosError(error)) {
        // Error is an AxiosError
        if (error.response?.status === 404) {
          setAlert({ show: true, message: 'You are not authorized to move this task.', type: 'error' });
        } else {
          setAlert({ show: true, message: error.message, type: 'error' }); // error.message is always a string
        }
      } else if (error instanceof Error) {
        // Error is a generic JavaScript Error
        setAlert({ show: true, message: error.message, type: 'error' });
      } else {
        // Error is of unknown type
        setAlert({ show: true, message: 'An unexpected error occurred.', type: 'error' });
      }
    }
  };

  const handleAddColumn = async () => {
    const columnData = {
      name: "New Column", // Example name, consider using a prompt or form
      tasks: [], // Assuming new columns start empty
    };
  
    try {
      const response = await axios.post(`http://localhost:5000/column/add/${_id}`,  { nom: newColumnName }, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}` // Assuming token based auth
        }
      });
      if (response.status === 200) {
        await fetchColumns(); // Reload columns to reflect the new column
        console.log('Column added successfully:', response.data);
      } else {
        throw new Error('Failed to add column');
      }
    } catch (error) {
      console.error('Error adding column:', error);
      setAlert({ show: true, message: 'Failed to add new column.', type: 'error' });
    }
  };

  const handleDeleteColumn = async (columnId) => {
    if (window.confirm("Are you sure you want to delete this column? This action cannot be undone.")) {
      try {
        const response = await axios.delete(`http://localhost:5000/column/${columnId}`, {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`
          }
        });
        if (response.status === 200) {
          setAlert({ show: true, message: 'Column deleted successfully!', type: 'success' });
          await fetchColumns(); // Refresh columns to reflect the deletion
        } else {
          throw new Error('Failed to delete column');
        }
      } catch (error) {
        console.error('Error deleting column:', error);
        setAlert({ show: true, message: 'Failed to delete column.', type: 'error' });
      }
    }
  };
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="My Project" />
      <h2>Project: {project?.model.nom}</h2>
      {alert.show && (
        <CustomAlerts 
          message={alert.message}
          type={alert.type as 'error' | 'success' | 'warning'}
          onClose={() => setAlert({ show: false, message: '', type: '' })}
        />
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="columns-container" style={{  display: 'flex',  justifyContent: 'space-around', padding: '10px' }}>
          {columns.map((column, index) => (
            <Droppable key={column.model._id} droppableId={column.model._id}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} style={{borderRadius: '25px', margin: '8px', background: '#e2e2e2', padding: '10px', width: '250px' }}>
                  <div className="column-header" style={{  display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>{column.model.nom}</h2>
            <button type="button" className="btn-close" onClick={() => handleDeleteColumn(column.model._id)} >
            <span class="icon-cross"></span>
 
            </button>



           

            </div>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {column.tasks.map((task, taskIndex) => (
                      <Draggable key={task._id} draggableId={task._id} index={taskIndex}>
                        {(provided , snapshot) => (
                          <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{...provided.draggableProps.style,  padding: '6px', margin: '4px',  background: snapshot.isDragging ? 'lightblue' : '#fff', borderRadius: '4px' }}>
                            {task.nom}
                          </li>
                        )}
                      </Draggable>
                    ))}
                    <div>
                
                  <button onClick={() => {
          const newColumns = columns.map((col, colIndex) => {
            if (index === colIndex) {
              return { ...col, isAddingTask: !col.isAddingTask };
            }
            return col;
          });
          setColumns(newColumns); setCurrentColumnId(column.model._id); console.log('Adding task to column ID:', column.model._id)
        }} className="add-task-button">

          + Add Task
        </button>
        {column.isAddingTask && (
          <div className="add-task-form">
            <input
              type="text"
              placeholder="Task name"
              value={column.newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              className="task-input"
            />
            
            <Select
              options={options}
              onChange={handleSelectChange}
              styles={customStyles}
              placeholder="Select a user"
              className="user-select"
            />
            <button onClick={() => handleAddTask()} className="submit-task-button">
              Add
            </button>
          </div>
        )}
                </div>

                  </ul>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}

         <button
  onClick={() => setIsAddingColumn(true)}
  className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
>
  + New Column
</button>

{isAddingColumn && (
  <div className="my-4">
    <input
      type="text"
      value={newColumnName}
      onChange={(e) => setNewColumnName(e.target.value)}
      placeholder="Enter column name"
      className="px-2 py-1 border rounded"
    />
    <button
      onClick={handleAddColumn}
      className="ml-2 py-1 px-4 bg-green-500 text-white rounded hover:bg-green-600"
    >
      Add Column
    </button>
    <button
      onClick={() => setIsAddingColumn(false)}
      className="ml-2 py-1 px-4 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Cancel
    </button>
  </div>
  )}
        </div>
      </DragDropContext>
    </DefaultLayout>
  );
};

export default ProjectDetails;
