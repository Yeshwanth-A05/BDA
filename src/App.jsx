// App.js
import React, { useState } from "react";
import './App.css';

// Helper functions
const calculateGrade = (weightedAverage) => {
  if (weightedAverage >= 90) return "A+";
  if (weightedAverage >= 80) return "A";
  if (weightedAverage >= 70) return "B";
  if (weightedAverage >= 60) return "C";
  if (weightedAverage >= 50) return "D";
  return "F";
};

const predictPerformance = (weightedAverage, attendance) => {
  const attendanceFactor = attendance / 100;
  const adjustedScore = weightedAverage * attendanceFactor;

  if (adjustedScore >= 90) return { rank: "Top 5%", performance: "Excellent" };
  if (adjustedScore >= 80) return { rank: "Top 20%", performance: "Very Good" };
  if (adjustedScore >= 70) return { rank: "Top 50%", performance: "Good" };
  if (adjustedScore >= 60) return { rank: "Top 75%", performance: "Average" };
  return { rank: "Below 75%", performance: "Needs Improvement" };
};

const InputField = ({ label, name, value, onChange, type = "text", required = false }) => (
  <div>
    <label>{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} required={required} />
  </div>
);

const StudentPerformance = () => {
  const [formData, setFormData] = useState({
    grade: "",
    maths: "",
    biology: "",
    chemistry: "",
    physics: "",
    history: "",
    geography: "",
    economics: "",
    social: "",
    science: "",
    english: "",
    tamil: "",
    attendance: "",
  });

  const [report, setReport] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const grade = parseInt(formData.grade, 10);
    const attendance = parseFloat(formData.attendance);

    // Validate grade and attendance
    if (isNaN(grade) || grade < 1 || grade > 12) {
      setErrors((prev) => ({ ...prev, grade: "Please enter a valid grade between 1 and 12." }));
      setLoading(false);
      return;
    }

    if (isNaN(attendance) || attendance < 0 || attendance > 100) {
      setErrors((prev) => ({ ...prev, attendance: "Please enter a valid attendance percentage." }));
      setLoading(false);
      return;
    }

    const isHighGrade = grade > 8;

    const subjects = isHighGrade
      ? {
          Maths: parseFloat(formData.maths),
          Biology: parseFloat(formData.biology),
          Chemistry: parseFloat(formData.chemistry),
          Physics: parseFloat(formData.physics),
          History: parseFloat(formData.history),
          Geography: parseFloat(formData.geography),
          Economics: parseFloat(formData.economics),
          English: parseFloat(formData.english),
          Tamil: parseFloat(formData.tamil),
        }
      : {
          Maths: parseFloat(formData.maths),
          Social: parseFloat(formData.social),
          Science: parseFloat(formData.science),
          English: parseFloat(formData.english),
          Tamil: parseFloat(formData.tamil),
        };

    // Validate subject marks
    if (Object.values(subjects).some((mark) => isNaN(mark) || mark < 0 || mark > 100)) {
      setErrors((prev) => ({ ...prev, marks: "Please enter valid marks between 0 and 100 for all subjects." }));
      setLoading(false);
      return;
    }

    const weights = isHighGrade
      ? {
          Maths: 0.15,
          Biology: 0.10,
          Chemistry: 0.10,
          Physics: 0.10,
          History: 0.10,
          Geography: 0.10,
          Economics: 0.10,
          English: 0.15,
          Tamil: 0.10,
        }
      : {
          Maths: 0.25,
          Social: 0.25,
          Science: 0.25,
          English: 0.15,
          Tamil: 0.10,
        };

    const weightedSum = Object.keys(subjects).reduce((sum, key) => sum + subjects[key] * weights[key], 0);
    const weightedAverage = weightedSum / Object.values(weights).reduce((sum, w) => sum + w, 0);

    const calculatedGrade = calculateGrade(weightedAverage);
    const { rank, performance } = predictPerformance(weightedAverage, attendance);

    setReport({
      grade,
      weightedAverage: weightedAverage.toFixed(2),
      calculatedGrade,
      attendance: attendance.toFixed(2),
      rank,
      performance,
      breakdown: subjects,
    });
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Student Performance Prediction</h1>
      <form onSubmit={handleSubmit}>
        <InputField label="Grade (1-12):" name="grade" value={formData.grade} onChange={handleChange} type="number" />
        <InputField label="Maths:" name="maths" value={formData.maths} onChange={handleChange} type="number" />

        {/* Conditionally Render Based on Grade */}
        {formData.grade > 8 && (
          <>
            <InputField label="Biology:" name="biology" value={formData.biology} onChange={handleChange} type="number" />
            <InputField label="Chemistry:" name="chemistry" value={formData.chemistry} onChange={handleChange} type="number" />
            <InputField label="Physics:" name="physics" value={formData.physics} onChange={handleChange} type="number" />
            <InputField label="History:" name="history" value={formData.history} onChange={handleChange} type="number" />
            <InputField label="Geography:" name="geography" value={formData.geography} onChange={handleChange} type="number" />
            <InputField label="Economics:" name="economics" value={formData.economics} onChange={handleChange} type="number" />
          </>
        )}
        {formData.grade <= 8 && (
          <>
            <InputField label="Social:" name="social" value={formData.social} onChange={handleChange} type="number" />
            <InputField label="Science:" name="science" value={formData.science} onChange={handleChange} type="number" />
          </>
        )}
        
        <InputField label="English:" name="english" value={formData.english} onChange={handleChange} type="number" />
        <InputField label="Tamil:" name="tamil" value={formData.tamil} onChange={handleChange} type="number" />
        <InputField label="Attendance (%):" name="attendance" value={formData.attendance} onChange={handleChange} type="number" />

        <button type="submit" disabled={loading}>{loading ? "Generating..." : "Generate Report"}</button>
      </form>

      {errors.marks && <p style={{ color: "red" }}>{errors.marks}</p>}
      {errors.grade && <p style={{ color: "red" }}>{errors.grade}</p>}
      {errors.attendance && <p style={{ color: "red" }}>{errors.attendance}</p>}

      {report && (
        <div style={{ marginTop: "20px" }}>
          <h2>Student Performance Report</h2>
          <p>Grade Level: {report.grade}</p>
          <p>Weighted Average Marks: {report.weightedAverage}</p>
          <p>Grade: {report.calculatedGrade}</p>
          <p>Attendance: {report.attendance}%</p>
          <p>{report.rank}</p>
          <p>{report.performance}</p>
          <h3>Subject-wise Breakdown:</h3>
          <ul>
            {Object.keys(report.breakdown).map((subject) => (
              <li key={subject}>
                {subject}: {report.breakdown[subject]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StudentPerformance;

