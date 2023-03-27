const express = require("express");
const app = express();
const cors = require("cors");
const router = express.Router();
const subjectController = require("../controller/subjectController");


app.use(express.urlencoded({ extended: true }));

router.get("/subjects/:user_Id", subjectController.list_all_subject);
router.get("/subjects/show/:subject_id", subjectController.single_subject_name)
router.get("/subjects/details/:userId/:subjectId", subjectController.single_subject);
router.delete("/subjects/:subject_id", subjectController.deleteSubject);
router.post("/subjects/teacherAssign/:subject_id", subjectController.assign_teacher);//optional
router.post("/subjects/addEditSubject/:operation_type", subjectController.addEditSubject); // add & edit documentation separately
router.post("/subjects/archive/:subject_id", subjectController.archiveSubject);
router.get("/subjects/show/:Id/:subject_id", subjectController.showSubjectInfo);
router.get("/subjects/tests/:Id/:subject_id", subjectController.list_test_subject);
module.exports = router;