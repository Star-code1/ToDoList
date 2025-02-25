import { useState, useEffect, useMemo, useReducer, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const studentReducer = (state, action) => {
  switch (action.type) {
    case "ADD_STUDENT":
      return [...state, { id: Date.now(), name: action.name, grade: action.grade }];
    case "EDIT_STUDENT":
      return state.map(student =>
        student.id === action.id ? { ...student, name: action.name, grade: action.grade } : student
      );
    case "DELETE_STUDENT":
      return state.filter(student => student.id !== action.id);
    default:
      return state;
  }
};

const StudentApp = () => {
  const [students, dispatch] = useReducer(studentReducer, []);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [editStudent, setEditStudent] = useState(null);
  const nameRef = useRef(null);
  const gradeRef = useRef(null);

  useEffect(() => {
    const storedStudents = JSON.parse(localStorage.getItem("students"));
    if (storedStudents) {
      dispatch({ type: "LOAD_STUDENTS", students: storedStudents });
    }
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem("students", JSON.stringify(students));
    }
  }, [students]);

  const averageGrade = useMemo(() => {
    if (students.length === 0) return 0;
    const totalGrade = students.reduce((sum, student) => sum + parseFloat(student.grade), 0);
    return totalGrade / students.length;
  }, [students]);

  const handleAddStudent = () => {
    if (name.trim() !== "" && grade.trim() !== "") {
      dispatch({ type: "ADD_STUDENT", name, grade });
      setName("");
      setGrade("");
      nameRef.current.focus();
    }
  };

  const handleEditStudent = () => {
    if (editStudent && name.trim() !== "" && grade.trim() !== "") {
      dispatch({ type: "EDIT_STUDENT", id: editStudent.id, name, grade });
      setEditStudent(null);
      setName("");
      setGrade("");
      nameRef.current.focus();
    }
  };

  const handleDeleteStudent = (id) => {
    dispatch({ type: "DELETE_STUDENT", id });
  };

  const handleEditClick = (student) => {
    setEditStudent(student);
    setName(student.name);
    setGrade(student.grade);
  };

  return (
    <div className="container mt-5 d-grid p-3 border border-1 border-secondary bg-light rounded-3 ">
      <h1>Quản lý sinh viên</h1>
      <div className="container m-auto">
        <input
          className="row container-fluid m-auto mt-2 mb-2 rounded-3 p-2 w-25"
          ref={nameRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên sinh viên"
        />
        <input
          className="row container-fluid m-auto mt-2 mb-2 rounded-3 p-2 w-25"
          ref={gradeRef}
          type="number"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          placeholder="Điểm"
        />
        {editStudent ? (
          <button className="p-2 ps-3 pe-3 bg-success rounded-3 text-light" onClick={handleEditStudent}>Sửa điểm</button>
        ) : (
          <button className="p-2 ps-3 pe-3 bg-success rounded-3 text-light" onClick={handleAddStudent}>Thêm sinh viên</button>
        )}
      </div>

      <h3>Danh sách sinh viên</h3>
      <ul>
        {students.map((student) => (
          <li className="m-2 mt-3 mb-3 list-group-item" key={student.id}>
            <span className="m-2 border p-3 rounded-3 bg-success-subtle fw-bold">{student.name} - {student.grade} Điểm</span>
            <button className="p-2 ps-3 pe-3 bg-primary rounded-3 text-light ms-1 me-1" onClick={() => handleEditClick(student)}>Sửa</button>
            <button className="p-2 ps-3 pe-3 bg-danger rounded-3 text-light ms-1 me-1" onClick={() => handleDeleteStudent(student.id)}>Xoá</button>
          </li>
        ))}
      </ul>

      <h3 className="text-danger">Điểm trung bình: {averageGrade.toFixed(2)}</h3>
    </div>
  );
};

export default StudentApp;
