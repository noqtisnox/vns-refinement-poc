import React, { useState } from "react";
import { Box, TextField, Button, Checkbox, FormControlLabel, Typography, Stack } from "@mui/material";
import type { StudentDetails } from "../../types/types";

import axios from "axios";

type GradingFormProps = {
  assignmentId: string;
  student: StudentDetails;
};

const GradingForm: React.FC<GradingFormProps> = ({ assignmentId, student }) => {
  const sesskey = "JustAPlaceholderSesskey";
  
  // Real URL would be `https://vns.lpnu.ua/lib/ajax/service.php?sesskey=${sesskey}&info=mod_assign_submit_grading_form`;
  const postURL = `http://localhost:8000/mod/assign/service.php?sesskey=${sesskey}&info=mod_assign_submit_grading_form`;

  const [grade, setGrade] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [notify, setNotify] = useState<boolean>(false);

  const createJSONFormData = () => {
    const encodedGrade = encodeURIComponent(grade);
    const encodedComment = encodeURIComponent(comment);
    
    return `\"id=${assignmentId}&rownum=0&useridlistid=&attemptnumber=-1&ajax=0&userid=0&sendstudentnotifications=${notify}&action=submitgrade&sesskey=${sesskey}&_qf__mod_assign_grade_form_${student.id}=1&grade=${encodedGrade}&assignfeedbackcomments_editor%5Btext%5D=${encodedComment}&assignfeedbackcomments_editor%5Bformat%5D=1&assignfeedbackcomments_editor%5Bitemid%5D=619729955\"`
  }

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    console.log("Grade Submitted:", grade);
    console.log("Comment Submitted:", comment);
    console.log("Notify:", notify);

    axios.post(postURL, [
      {
        "index": 0,
        "methodname": "mod_assign_submit_grading_form",
        "args": {
          "assignmentid": assignmentId,
          "userid": Number(student.id),
          "jsonformdata": createJSONFormData()
        }
      }
    ])
  };

  const handleSaveNext = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
  };

  return (
    <Box component="form" onSubmit={handleSave} sx={{ p: 2, bgcolor: "background.paper", borderRadius: 1, boxShadow: 2, width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Оцінка роботи
      </Typography>

      <Stack spacing={2}>
        <TextField
          id="grade"
          label="Оцінка"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          placeholder="5.0"
          required
          size="small"
          sx={{ width: { xs: '100%', sm: 200 } }}
        />

        <TextField
          id="comment"
          label="Відгук коментарем"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="..."
          multiline
          minRows={6}
          fullWidth
        />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button type="submit" variant="contained" color="primary" onClick={handleSave}>
            Зберегти
          </Button>
          <Button type="button" variant="contained" color="primary" onClick={handleSaveNext}>
            Зберегти та наступний
          </Button>
        </Box>

        <FormControlLabel
          control={<Checkbox checked={notify} onChange={(e) => setNotify(e.target.checked)} />}
          label="Повідомити студента"
        />
      </Stack>
    </Box>
  );
};

export default GradingForm;
