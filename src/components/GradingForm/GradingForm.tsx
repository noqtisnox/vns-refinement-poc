import React, { useState } from "react";
import "./GradingForm.css";

const GradingForm: React.FC = () => {
  const [grade, setGrade] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Grade Submitted:", grade);
    console.log("Comment Submitted:", comment);
  };

  return (
    <form onSubmit={handleSubmit} className="grading-form">
      {" "}
      <h2 className="form-title">Оцінка роботи</h2>
      <div className="form-group">
        <label htmlFor="grade" className="form-label">
          Оцінка:
        </label>
        <input
          id="grade"
          type="text"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          placeholder="5.0"
          className="text-input grade-input"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="comment" className="form-label">
          Відгук коментарем:
        </label>

        {/* <div className="markdown-toolbar">
          <button type="button" className="toolbar-button is-bold">
            B
          </button>
          <button type="button" className="toolbar-button is-italic">
            I
          </button>
          <button type="button" className="toolbar-button is-link">
            🔗
          </button>
        </div> */}

        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="..."
          rows={6}
          className="textarea-input"
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button type="submit" className="submit-button">
            Зберегти
          </button>
          <button type="submit" className="submit-button">
            Зберегти та наступний
          </button>
      </div>

      <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <input type="checkbox" id="notify" name="notify" value="notify" />
        <label htmlFor="notify">Повідомити студента</label>
      </div>
    </form>
  );
};

export default GradingForm;
