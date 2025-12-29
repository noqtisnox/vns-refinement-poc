<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Assignment Management</title>
    <script type="module" src="/mod/assign/dist/assets/main.js"></script>
</head>
<body>
    <?php
        $id     = $_GET['id'] ?? null;
        $action = $_GET['action'] ?? 'grading'; // Default to table
        $userId = $_GET['userid'] ?? null;
    ?>
    <div id="root" 
         data-id="<?= htmlspecialchars($id) ?>" 
         data-action="<?= htmlspecialchars($action) ?>"
         data-userid="<?= htmlspecialchars($userId) ?>">
         </div>

</body>
</html>