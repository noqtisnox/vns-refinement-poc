<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Assignment Management</title>
    <link rel="stylesheet" href="/mod/assign/dist/assets/main.css">
    <script type="module" src="/mod/assign/dist/assets/main.js"></script>
</head>
<body>
    <?php
        $id     = $_GET['id'] ?? null;
        $action = $_GET['action'] ?? 'grading';
        $userId = $_GET['userid'] ?? null;
    ?>
    <div id="root" 
         data-id="<?= htmlspecialchars($id) ?>" 
         data-action="<?= htmlspecialchars($action) ?>"
         data-userid="<?= htmlspecialchars($userId) ?>">
         </div>

</body>
</html>