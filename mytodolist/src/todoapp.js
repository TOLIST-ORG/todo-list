import { useState, useEffect } from "react";
import "./TodoApp.css";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  const API_URL = "http://localhost:5000/todos";

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(setTodos)
      .catch(console.error);
  }, []);

  const addTodo = async () => {
    if (!input.trim()) return;
    const newTodo = {
      id: Date.now(),
      text: input,
      done: false,
    };

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    });

    const saved = await res.json();
    setTodos([...todos, saved]);
    setInput("");
  };

  const toggleTodo = async (id, done) => {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !done }),
    });

    setTodos(
      todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTodo = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <div className="app-container">
      <div className="todo-box">
        <h1 className="title">Todo List</h1>

        <div className="input-row">
          <input
            className="text-input"
            placeholder="Add a task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={addTodo} className="add-btn">Add</button>
        </div>

        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <span
                onClick={() => toggleTodo(todo.id, todo.done)}
                className={`todo-text ${todo.done ? "done" : ""}`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="delete-btn"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}