import React, { useState } from "react";
import { Box, TextField, Button, Checkbox, FormControlLabel, Typography, Stack } from "@mui/material";

const GradingForm: React.FC = () => {
  const [grade, setGrade] = useState("");
  const [comment, setComment] = useState("");
  const [notify, setNotify] = useState(false);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    console.log("Grade Submitted:", grade);
    console.log("Comment Submitted:", comment);
    console.log("Notify:", notify);
  };

  const handleSaveNext = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
    // TODO: advance to next student
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
