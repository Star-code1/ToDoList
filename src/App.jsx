import "react";
import Student from "./components/Student";
import Todo from "./components/ToDo"; 
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App container mt-5 p-5 text-center bg-success-subtle">
      <Todo />
      <Student />
    </div>
  );
}

export default App;
