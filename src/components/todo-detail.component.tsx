// src/components/TodoDetail.tsx

import React, { useEffect, useState } from 'react';

import { Todo } from '../types/todo-type';

interface TodoDetailProps {
  todoId: number;
}
/**
 * TodoDetail component fetches and displays the details of a specific todo item based on the provided todoId.
 * It uses the useEffect hook to fetch the todo details from the API when the component mounts or when the todoId changes.
 * @param todoId - The ID of the todo item to fetch and display.
 */
export const TodoDetail: React.FC<TodoDetailProps> = ({ todoId }) => {
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getTodo = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`);
        if (!res.ok) throw new Error('Failed to fetch todo details');

        const data: Todo = await res.json();
        setTodo(data);
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

    getTodo();
  }, [todoId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!todo) return null;

  return (
    <div className="todo-detail">
      <h2>Todo Details</h2>
      <p>
        <strong>ID:</strong> {todo.id}{' '}
      </p>
      <p>
        <strong>Title:</strong> {todo.title}{' '}
      </p>
      <p>
        <strong>Completed:</strong> {todo.completed ? 'Yes' : 'No'}{' '}
      </p>
      <p>
        <strong>User ID:</strong> {todo.userId}{' '}
      </p>
    </div>
  );
};
