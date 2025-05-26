// src/components/TodoList.tsx

import React, { useEffect, useState } from 'react';

import { Todo } from '../types/todo-type';

interface TodoListProps {
  onSelectTodo: (id: number) => void;
}
interface FetchTodosParams {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setFilteredTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}
/**
 * fetchTodos function fetches todos from the API and updates the state.
 * @param setTodos - React setState Function to set the todos state.
 * @param setFilteredTodos - React setState Function to set the filtered todos state.
 * @param setLoading - react setState Function to set the loading state.
 * @param setError - react setState Function to set the error state.
 *
 * @returns {Promise<void>} - A promise that resolves when the todos are fetched and state is updated.  You should call this in useEffect.
 * setup useEffect to call this function when the component mounts
 * wraps the fetch API call in a try-catch block to handle errors gracefully and update the loading and error states accordingly.
 * The function uses async/await syntax to handle asynchronous operations, making the code cleaner and easier to read.
 * fetch from the URL https://jsonplaceholder.typicode.com/todos
 */
// remove eslint-disable-next-line @typescript-eslint/no-unused-vars when you use the parameters in the function
export const fetchTodos = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setTodos,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setFilteredTodos,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setLoading,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setError,
}: FetchTodosParams): Promise<void> => {
  try {
    setLoading(true);

    const res = await fetch('https://jsonplaceholder.typicode.com/todos');
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const data: Todo[] = await res.json();
    setTodos(data);
    setFilteredTodos(data);
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message || 'Error');
    } else {
      setError('Unknown error');
    }
  } finally {
    setLoading(false);
  }
};
/**
 * TodoList component fetches todos from the API and displays them in a list.
 * It also provides filter buttons to filter the todos based on their completion status.
 * @param onSelectTodo - A function that is called when a todo is selected. It receives the todo id as an argument.
 * @returns
 */

// remove the following line when you use onSelectTodo in the component
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const TodoList: React.FC<TodoListProps> = ({ onSelectTodo }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'completed'>('all');

  useEffect(() => {
    fetchTodos({ setTodos, setFilteredTodos, setLoading, setError });
  }, []);

  useEffect(() => {
    switch (filter) {
      // case 'all':
      //   break
      case 'completed':
        setFilteredTodos(todos.filter((todo) => todo.completed));
        break;
      case 'open':
        setFilteredTodos(todos.filter((todo) => !todo.completed)); // if not complete then open
        break;
      default:
        setFilteredTodos(todos);
    }
  }, [filter, todos]);

  return (
    <div className="todo-list">
      <h2>Todo List</h2>
      {loading && <p>Loading todos...</p>}
      {error && <p style={{ color: 'red' }}>Error loading todos: {error}</p>}

      {/* <p>
        These are the filter buttons. the tests depend on the data-testids; and use
        provided styles. Implement click event handlers to change the filter state and
        update the UI accordingly to show just those todo&apos;s. other hints: you can
        change the styling of the button with <code>className</code> property. if the
        className of a button is &quot;active&quot; it will use the{' '}
        <code> .todo-button.completed</code> CSS style in App.css
      </p> */}
      <div className="filter-buttons">
        <button
          data-testid="filter-all"
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          data-testid="filter-open"
          className={filter === 'open' ? 'active' : ''}
          onClick={() => setFilter('open')}
        >
          Open
        </button>
        <button
          data-testid="filter-completed"
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {/* <p>
        Show a list of todo&apos;s here. Make it so if you click a todo it calls the event
        handler onSelectTodo with the todo id to show the individual todo
      </p> */}
      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            <button
              className={`todo-button ${todo.completed ? 'completed' : ''}`}
              onClick={() => onSelectTodo(todo.id)}
            >
              <span>{todo.title}</span>
              <span>{todo.completed ? 'Completed' : 'Open'}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
