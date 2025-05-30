import React, { useState, useEffect, useContext } from 'react';
import {useNavigate} from 'react-router-dom';
import AddItem from './AddItem';
import Delete from './Delete';
import { UserContext } from './context';
import '../css/todos.css'
import EditItem from './EditItem';

const Todos = () => {
  const { user } = useContext(UserContext);
  const [myTodos, setMyTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('body');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isEditing, setIsEditing] = useState(null);
  const fields = [{ name: "body", inputType: "text" }];
  const initialObject = { completed: false };
const navigate = useNavigate();
  useEffect(() => {
    fetch(`http://localhost:3012/todos`, {
      method: 'GET',
      headers: {
      'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('userToken')), // Add your JWT token here
      'Content-Type': 'application/json'
      },
      
    })
      .then(response => {
      if (response.status === 401) {
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }
      return response.json();
      })
      .then(json => {
      if (json) {
        setMyTodos(json);
        setLoading(false);
      }
      })
      .catch(error => {
      console.error('Error fetching tasks:', error);
      setLoading(false);
      });
  }, [user.id]);

  const handleCheckboxChange = (taskId) => {
    setMyTodos(prev => {
      const updatedTodos = prev.map(todo =>
        todo.id === taskId ? { ...todo, completed: !todo.completed } : todo
      );
      return updatedTodos;
    });
    fetch(`http://localhost:3012/todos/${taskId}`, {
      method: 'PUT',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('userToken')),
      },
      body: JSON.stringify({
      ...myTodos.find(todo => todo.id === taskId),
      completed: !myTodos.find(todo => todo.id === taskId).completed,
      }),
    })
    .then(response => {
      if (response.status === 401) {
      localStorage.removeItem("user");
      navigate("/login");
      return;
      }
      return response.json();
    })
    .catch(err => console.error('Error updating task:', err));
  };

  const sortTodos = (todos) => {
    return todos.sort((a, b) => {
      if (sortOrder === 'asc') {
        if (a[sortField] < b[sortField]) return -1;
        if (a[sortField] > b[sortField]) return 1;
        return 0;
      } else {
        if (a[sortField] < b[sortField]) return 1;
        if (a[sortField] > b[sortField]) return -1;
        return 0;
      }
    });
  };

  if (loading) {
    return <div className='loading'>Loading...</div>;
  }

  return (
    <div>
      <AddItem fields={fields} initialObject={initialObject} setData={setMyTodos} type="todos" />
      <input
        type="text"
        placeholder="search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: '5px', marginBottom: '10px' }}
      />
      <button onClick={() => setSearch("")}>
        Clear search
      </button>
      <div className='todosList'>
        <select onChange={(e) => setSortField(e.target.value)} value={sortField}>
          <option value="body">Body</option>
          <option value="completed">Completed</option>
          <option value="id">ID</option>
        </select>

        <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="asc">Ascending sort</option>
          <option value="desc">Descending sort</option>
        </select>

        <ul>
          {sortTodos(myTodos)
            .filter(task =>
              task.body.toLowerCase().includes(search.toLowerCase()) ||
              task.id.toString().includes(search) ||
              ("true".includes(search.toLowerCase()) && task.completed) ||
              ("false".includes(search.toLowerCase()) && !task.completed)
            )
            .map((task, index) => (
              <li key={task.id}>
                <div className="task-actions">
                  {isEditing === task.id ? (
                    <EditItem
                      item={task}
                      fields={[{ name: "body", inputType: "text" }]} // Define fields dynamically
                      type="todos"
                      setData={setMyTodos}
                      setIsEditing={setIsEditing}
                    />
                  ) : (
                    <>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleCheckboxChange(task.id)}
                      />
                      <div className="task-text">{task.body}</div>
                      <button onClick={() => {
                        setIsEditing(task.id);
                      }}>Edit</button>
                      <Delete setMyItem={setMyTodos} id={task.id} type="todos" />
                    </>
                  )}
                </div>

              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Todos;