import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [age, setAge] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/students`).then((response) => {
      setStudents(response.data);
    });
  }, []);

  const handleAddStudent = (e) => {
    e.preventDefault();
    axios
      .post(`${API_URL}/students`, {
        name,
        course,
        age: Number(age),
      })
      .then(() => {
        setName("");
        setCourse("");
        setAge("");
        fetchStudents();
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (id) => {
    axios
      .delete(`${API_URL}/students/${id}`)
      .then(() => fetchStudents()) // Re-fetch updated list
      .catch((err) => console.error(err));
  };

  const handleEditClick = (student) => {
  setEditingId(student._id);
  setName(student.name);
  setCourse(student.course);
  setAge(student.age);
};
  const handleSubmit = (e) => {
  e.preventDefault();
 
  if (editingId) {
    // UPDATE
    axios
      .put(`${API_URL}/students/${editingId}`, { name, course, age: Number(age) })
      .then(() => {
        setEditingId(null);
        setName("");
        setCourse("");
        setAge("");
        fetchStudents();
      });
  } else {
    // CREATE
    handleAddStudent(e);
  }
};

  return (
    <div>
      <h1>Student Management System</h1>
      <h2>Students</h2>

      <form onSubmit={handleAddStudent}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <br />
        <br />
        <input
          type="text"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          placeholder="Course"
          required
        />
        <br />
        <br />
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
          required
        />
        <br />
        <br />
        <button type="submit">Add Student</button>
      </form>

      <br />

      <h2>Students</h2>
      {students.map((student) => (
        <div key={student._id}>
          <p>
            <strong>Name:</strong> {student.name}
          </p>
          <p>
            <strong>Course:</strong> {student.course}
          </p>
          <p>
            <strong>Age:</strong> {student.age}
          </p>
          <button onClick={() => handleDelete(student._id)}>Delete</button>
          <br />
          <button onClick={() => handleEditClick(student)}>Edit</button>
        </div>
      ))}
    </div>
  );
}

export default App;
