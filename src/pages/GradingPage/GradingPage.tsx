const GradingPage = () => {
  const params = new URLSearchParams(window.location.search);
  const assignmentId = params.get('id');
  const userId = params.get('userid');

  return <div>Grading Page Content for Assignment #{assignmentId} and User #{userId}</div>;
}

export default GradingPage;