import { useState, useEffect, useMemo, useReducer, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const todoReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, { id: Date.now(), text: action.text, completed: false }];
    case "TOGGLE_TODO":
      return state.map(todo =>
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
      );
    case "DELETE_TODO":
      return state.filter(todo => todo.id !== action.id);
    default:
      return state;
  }
};

const TodoApp = () => {
  const [todos, dispatch] = useReducer(todoReducer, []);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem("todos"));
    if (storedTodos) {
      dispatch({ type: "LOAD_TODOS", todos: storedTodos });
    }
  }, []);

  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos]);

  const filteredTodos = useMemo(() => {
    return {
      completed: todos.filter(todo => todo.completed),
      incomplete: todos.filter(todo => !todo.completed),
    };
  }, [todos]);

  const handleAddTodo = () => {
    if (input.trim() !== "") {
      dispatch({ type: "ADD_TODO", text: input });
      setInput(""); 
      inputRef.current.focus(); 
    }
  };

  const handleDeleteTodo = (id) => {
    dispatch({ type: "DELETE_TODO", id });
  };

  const handleToggleTodo = (id) => {
    dispatch({ type: "TOGGLE_TODO", id });
  };

  return (
    <div className="container d-grid p-3 border border-1 border-secondary bg-light rounded-3">
      <h1>To-Do List</h1>
      <div className="container m-auto">
        <input
          className="row container-fluid m-auto mt-2 mb-2 rounded-3 p-2 w-25"
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Thêm công việc mới"
        />
        <button className="p-2 ps-3 pe-3 bg-success rounded-3 text-light" onClick={handleAddTodo}>Thêm công việc</button>
      </div>

      <h3>Danh sách công việc</h3>
      <h4 className="text-primary">Công việc chưa hoàn thành</h4>
      <ul className="list-group w-50 m-auto">
        {filteredTodos.incomplete.map(todo => (
          <li className="list-group-item d-flex justify-content-between align-items-center" key={todo.id}>
            <span className="fw-bold" onClick={() => handleToggleTodo(todo.id)}>{todo.text}</span>
            <button className="btn btn-danger" onClick={() => handleDeleteTodo(todo.id)}>Xoá</button>
          </li>
        ))}
      </ul>

      <h4 className="text-success mt-4">Công việc đã hoàn thành</h4>
      <ul className="list-group w-50 m-auto">
        {filteredTodos.completed.map(todo => (
          <li className="list-group-item d-flex justify-content-between align-items-center" key={todo.id}>
            <span className="text-decoration-line-through" onClick={() => handleToggleTodo(todo.id)}>{todo.text}</span>
            <button className="btn btn-danger" onClick={() => handleDeleteTodo(todo.id)}>Xoá</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
