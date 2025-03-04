import { useState, useEffect, useMemo, useReducer, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const studentReducer = (state, action) => {
  switch (action.type) {
    case "LOAD_STUDENTS":
      return action.students || [];
    case "ADD_STUDENT":
      return [
        ...state,
        {
          id: Date.now(),
          name: action.name,
          grade1: action.grade1,
          grade2: action.grade2,
          grade3: action.grade3,
          average: (parseFloat(action.grade1) + parseFloat(action.grade2) + parseFloat(action.grade3)) / 3,
        },
      ];
    case "EDIT_STUDENT":
      return state.map((student) =>
        student.id === action.id
          ? {
              ...student,
              name: action.name,
              grade1: action.grade1,
              grade2: action.grade2,
              grade3: action.grade3,
              average: (parseFloat(action.grade1) + parseFloat(action.grade2) + parseFloat(action.grade3)) / 3,
            }
          : student
      );
    case "DELETE_STUDENT":
      return state.filter((student) => student.id !== action.id);
    default:
      return state;
  }
};

const StudentApp = () => {
  const [students, dispatch] = useReducer(studentReducer, []);
  const [name, setName] = useState("");
  const [grade1, setGrade1] = useState("");
  const [grade2, setGrade2] = useState("");
  const [grade3, setGrade3] = useState("");
  const [editStudent, setEditStudent] = useState(null);
  const nameRef = useRef(null);
  const grade1Ref = useRef(null);
  const grade2Ref = useRef(null);
  const grade3Ref = useRef(null);

  useEffect(() => {
    const storedStudents = JSON.parse(localStorage.getItem("students"));
    if (storedStudents) {
      dispatch({ type: "LOAD_STUDENTS", students: storedStudents });
    }
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem("students", JSON.stringify(students));
    } else {
      localStorage.removeItem("students");
    }
  }, [students]);
  

  const averageGrade = useMemo(() => {
    if (students.length === 0) return 0;
    const totalGrade = students.reduce(
      (sum, student) =>
        sum + student.average,
      0
    );
    return totalGrade / students.length;
  }, [students]);
  

  const handleAddStudent = () => {
    if (name.trim() !== "" && grade1.trim() !== "" && grade2.trim() !== "" && grade3.trim() !== "") {
      const g1 = parseFloat(grade1);
      const g2 = parseFloat(grade2);
      const g3 = parseFloat(grade3);
  
      if (g1 < 1 || g1 > 10 || g2 < 1 || g2 > 10 || g3 < 1 || g3 > 10) {
        alert("Điểm phải nằm trong khoảng từ 1 đến 10!");
        return;
      }
  
      dispatch({ type: "ADD_STUDENT", name, grade1: g1, grade2: g2, grade3: g3 });
      setName("");
      setGrade1("");
      setGrade2("");
      setGrade3("");
      nameRef.current.focus();
    }
  };
  
  const handleEditStudent = () => {
    if (editStudent && name.trim() !== "" && grade1.trim() !== "" && grade2.trim() !== "" && grade3.trim() !== "") {
      const g1 = parseFloat(grade1);
      const g2 = parseFloat(grade2);
      const g3 = parseFloat(grade3);
  
      if (g1 < 1 || g1 > 10 || g2 < 1 || g2 > 10 || g3 < 1 || g3 > 10) {
        alert("Điểm phải nằm trong khoảng từ 1 đến 10!");
        return;
      }
  
      dispatch({ type: "EDIT_STUDENT", id: editStudent.id, name, grade1: g1, grade2: g2, grade3: g3 });
      setEditStudent(null);
      setName("");
      setGrade1("");
      setGrade2("");
      setGrade3("");
      nameRef.current.focus();
    }
  };
  

  const handleDeleteStudent = (id) => {
    dispatch({ type: "DELETE_STUDENT", id });
  };

  const handleEditClick = (student) => {
    setEditStudent(student);
    setName(student.name);
    setGrade1(student.grade1);
    setGrade2(student.grade2);
    setGrade3(student.grade3);
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
          ref={grade1Ref}
          type="number"
          value={grade1}
          onChange={(e) => setGrade1(e.target.value)}
          placeholder="Điểm 1"
        />
        <input
          className="row container-fluid m-auto mt-2 mb-2 rounded-3 p-2 w-25"
          ref={grade2Ref}
          type="number"
          value={grade2}
          onChange={(e) => setGrade2(e.target.value)}
          placeholder="Điểm 2"
        />
        <input
          className="row container-fluid m-auto mt-2 mb-2 rounded-3 p-2 w-25"
          ref={grade3Ref}
          type="number"
          value={grade3}
          onChange={(e) => setGrade3(e.target.value)}
          placeholder="Điểm 3"
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
            <span className="m-2 border p-3 rounded-3 bg-success-subtle fw-bold">{student.name} - {student.grade1} Điểm - {student.grade2} Điểm - {student.grade3} Điểm</span>
            <span className="m-2 border p-3 rounded-3 bg-success-subtle fw-bold">Điểm trung bình: {student.average} Điểm</span>
            <button className="p-2 ps-3 pe-3 bg-primary rounded-3 text-light ms-1 me-1" onClick={() => handleEditClick(student)}>Sửa</button>
            <button className="p-2 ps-3 pe-3 bg-danger rounded-3 text-light ms-1 me-1" onClick={() => handleDeleteStudent(student.id)}>Xoá</button>
          </li>
        ))}
      </ul>
      <h3>Điểm trung bình các sinh viên: {averageGrade.toFixed(2)}</h3>
    </div>
  );
};

export default StudentApp;
