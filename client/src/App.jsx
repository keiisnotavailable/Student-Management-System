import {useEffect, useState} from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/students";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [age, setAge] = useState("");

  const [editingId, setEditingId] = useState(null);
  const fetchStudents = () => {
    axios.get(API_URL).then((response) => {
      setStudents(response.data);
    });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const resetForm = () => {
    setName("");
    setCourse("");
    setAge("");
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !course || !age)
      return;

    if (editingId) {
      axios.put(`${API_URL}/${editingId}`, {name, course, age: Number(age)})
      .then(() => {
        resetForm();
        fetchStudents();
      })
      .catch((error) =>
      console.error("Error updating student:", error));
    }else {
      axios.post(API_URL, {name, course, age: Number(age)})
      .then(() => {
        resetForm();
        fetchStudents();
      })
      .catch((error) => console.error ("Error adding student: ", error));
    }
  };

  const handleEditClick = (student) => {
    setEditingId(student._id);
    setName(student.name);
    setCourse(student.course);
    setAge(student.age);
  };

  const handleDelete = (id) => {
    axios.delete(`${API_URL}/${id}`)
    .then(() => {
      fetchStudents();
    })
    .catch((error) => 
    console.error("Error deleting student:", error));
  };

  return (
    <div>
      <h1>Student Management System</h1>
      <h2>Students</h2>

      <form onSubmit = {handleSubmit}>
        <h3>{editingId ? "Edit Student" : "Add Student"}</h3>
        <div>
          <label>Name: </label>
          <input type="text" value={name} onChange={(e) => 
            setName(e.target.value)} required/>
        </div>
        <div>
          <label>Course: </label>
          <input type="text" value={course} onChange={(e) => 
            setCourse(e.target.value)} required/>
        </div>
        <div>
          <label>Age: </label>
          <input type="number" value={age} onChange={(e) => 
            setAge(e.target.value)} required/>
        </div>
        <button type="submit">{editingId ? "Update Student" : "Add Student"}</button>
        {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      <h2>Students</h2>
      {students.map((student)=> (
        <div key={student._id}>
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Course:</strong> {student.course}</p>
          <p><strong>Age:</strong> {student.age}</p>
          <button onClick={() => handleEditClick(student)}>Edit</button>
          <button onClick={() => handleDelete(student._id)}>Delete</button>
        </div>
      ))}
        </div>
  );
}

export default App;