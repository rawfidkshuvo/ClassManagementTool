const express = require("express");
const app = express();
const cors = require("cors");
const router = express.Router();
const classController = require("../controller/classController");

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.get("/classes", classController.all_class)
router.post("/classes", classController.create_class)
router.get("/classes/:Id", classController.edit_class)
router.put("/classes/:class_Id/:user_Id", classController.update_class)
router.delete("/classes/:Id", classController.delete_class)
router.post("/classes/studentAssign/:Id/:class_id", classController.assign_student_a_class)
router.post("/classes/studentDeassign/:Id/:class_id", classController.deassign_student_a_class)
router.get("/classes/subjects/:class_id", classController.all_available_subject);
router.get("/classes/assign/:class_id", classController.list_of_assign_available_student)
router.get("/classes/deassign/:class_id", classController.list_of_assigned_student)


module.exports = router;