import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [age, setAge] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/students")
      .then((response) => {
        setStudents(response.data);
      });
  }, []);

  const handleAddStudent = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/students", { name, course, age: Number(age) })
      .then(() => {
        // Clear form inputs and refresh displayed list
        setName("");
        setCourse("");
        setAge("");
        fetchStudents();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h1>Student Management System</h1>
      <h2>Students</h2>

      <form onSubmit={handleAddStudent}>
        <input type="text" value={name} onChange={(e) =>
          setName(e.target.value)} placeholder="Name" required />
        <input type="text" value={course} onChange={(e) =>
          setCourse(e.target.value)} placeholder="Course" required />
        <input type="number" value={age} onChange={(e) =>
          setAge(e.target.value)} placeholder="Age" required />
        <button type="submit">Add Student</button>
      </form>

      <h2>Students</h2>
      {students.map((student)=> (
        <div key={student._id}>
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Course:</strong> {student.course}</p>
          <p><strong>Age:</strong> {student.age}</p>
        </div>
      ))}
    </div>
  );
}

export default App;