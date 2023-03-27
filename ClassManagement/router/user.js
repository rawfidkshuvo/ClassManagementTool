const express = require("express");
const app = express();
const cors = require("cors");
const router = express.Router();
const userController = require("../controller/usersController");

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//router.get("/users/login", userController.getLogin);
router.post("/users/login", userController.login);
router.post("/users/register", userController.addUser);
router.get("/users/show/:Id", userController.edit_user)
router.put("/users/:Id", userController.update_user)
router.delete("/users/:Id", userController.delete_user)
router.get("/users", userController.all_users);
router.get("/users/student/:Id", userController.student_view)
router.get("/users/teacher", userController.onlyTeacher);
router.get("/users/student", userController.studentList);
//router.put("/users/edit_grade_pupil/:Id", userController.edit_grade_pupil);
router.get("/users/subjects/:Id", userController.user_subjects);
router.get("/users/student/meanResult/:Id", userController.user_subjects_test_mean);
router.get("/users/teacher/subjects/:Id", userController.list_assign_subject);
router.get("/users/subject/students/:Id/:subject_id", userController.list_student_subject);
router.get("/users/student/grades/:Id", userController.get_all_subject_grades);
module.exports = router;