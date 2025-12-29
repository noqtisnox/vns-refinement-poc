const StudentsTablePage = () => {
    const params = new URLSearchParams(window.location.search);
    const assignmentId = params.get('id');

    const student = {
        id: 12345,
        name: 'John Doe'
    }

    return (
        <div>
            Students Table Page for Assignment #{assignmentId}
            <a href={`view.php?id=${assignmentId}&action=grader&userid=${student.id}`}>
            Grade Student
            </a>
        </div>
    );
}
export default StudentsTablePage;