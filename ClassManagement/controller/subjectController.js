const dbconfig = require("../config");
const fetch = require("node-fetch");
exports.single_subject_name = async (req, res) => {
    dbconfig.query(
        'SELECT * from subject where subject_id = ?', req.params.subject_id,
        function (err, results, fields) {
            if (err) throw err;
            res.send(results);
        }
    );
}
exports.single_subject = (req, res) => {
    const subjectId = req.params.subjectId;
    const userId = req.params.userId;//req.body.user_id;
    dbconfig.query(
        'SELECT t.test_name,m.marks from subject s INNER JOIN test t on t.subject_id = s.subject_id INNER JOIN mark m on m.test_id = t.test_id where m.user_id=? and s.subject_id = ?', [userId, subjectId],
        function (err, results, fields) {
            if (err) throw err;
            res.send(results);
        }
    );
}

exports.deleteSubject = async (req, res) => {
    // const userId = req.params.Id;
    const subjectId = req.params.subject_id;
    // let response = await fetch('http://localhost:5000/users/' + userId);
    // let result = await response.json();
    // console.log(userId)
    console.log(subjectId)

    // if (result[0].user_type == 'admin') {
    dbconfig.query(
        'SELECT count(*) AS testCount FROM test WHERE subject_id = ?', subjectId,
        function (err, results, fields) {
            if (err) throw err;
            console.log(results[0].testCount)
            if (Number(results[0].testCount) > 0) {
                console.log("This subject has records");
            } else {
                const qry = 'DELETE FROM subject where subject_id = ?';
                dbconfig.query(qry, [subjectId], (err, result) => {
                    if (err) throw err;
                    console.log("1 record deleted");
                    res.status(200).send("Subject deleted successfully");
                });
            }
        }
    );
    // }
}
// optional if needed
exports.assign_teacher = async (req, res) => {
    const user_id = req.body.id;
    const subjectId = req.params.subject_id;
    const created_at = new Date();

    const sql = 'INSERT INTO assign_teacher set ?';
    dbconfig.query(sql, [user_id, subjectId, created_at], (err, results) => {
        if (err) throw err;
        res.status(200).send('Inserted successfully'); // results contains rows returned by server
    });
}
exports.list_all_subject = async (req, res) => {
    const userId = req.params.user_Id;
    let response = await fetch('http://localhost:5000/users/show/' + userId);
    let result = await response.json();

    if (result[0].user_type == 'admin') {
        dbconfig.query(
            'SELECT s.subject_id, s.subject_name, s.class_id, s.is_archived, c.class_name, c.is_archived, ast.user_id, u.user_name FROM subject s INNER JOIN class c ON s.class_id = c.class_id INNER JOIN assign_teacher ast ON s.subject_id = ast.subject_id INNER JOIN users u ON ast.user_id = u.user_id',
            function (err, results, fields) {
                res.send(results); // results contains rows returned by server
            }
        );
    } else {
        //code for deny permission
    }

}
exports.addEditSubject = async (req, res) => {
    const operation_type = req.params.operation_type;
    const user_id = req.body.user_id;
    let lastInsertedID = 0;
    switch (operation_type) {
        case 'addSubject':
            const sql = "INSERT INTO `subject` set ?";
            const insertData = {
                subject_name: req.body.subject_name,
                class_id: req.body.class_id,
                is_archived: 0
            }
            dbconfig.query(sql, insertData, async (err, result) => {
                if (err) throw err;
                console.log(result.insertId)
                lastInsertedID = await result.insertId;
                console.log("1 record inserted");
                if (lastInsertedID != 0) {
                    let qry = `INSERT INTO assign_teacher (user_id, subject_id, created_at) VALUES ( ?, ?, ?)`
                    dbconfig.query(qry, [req.body.teacher_id, lastInsertedID, new Date()], function (err, data) {
                        if (err) throw err;
                        console.log("1 record inserted for assign_teacher");
                        res.redirect('http://localhost/api/subject.php?class_id=' + req.body.class_id + '&user_id=' + user_id)
                    });
                }
                else {
                    console.log("not working");
                }
            });

            break;
        case 'editSubject':
            const sqlQry = 'UPDATE subject SET subject_name = ?, class_id = ?  where subject_id = ?';
            let subject_id = req.body.subject_id;
            let subject_name = req.body.subject_name;
            let class_id = req.body.class_id;

            dbconfig.query(sqlQry, [subject_name, class_id, subject_id], (err, result) => {
                if (err) throw err;
                console.log("1 record updated");
                let qry = `UPDATE assign_teacher SET user_id = ?  where subject_id = ?` // not nessessary
                dbconfig.query(qry, [req.body.teacher_id, req.body.subject_id], function (err, data) {
                    if (err) throw err;
                    console.log("1 record inserted for assign_teacher");
                    res.redirect('http://localhost/api/subject.php?class_id=' + class_id + '&user_id=' + req.body.user_id)
                });
            });


            break;
        default:
            break;
    }
}
exports.showSubjectInfo = async (req, res) => {
    const userId = req.params.Id;
    const subjectId = req.params.subject_id;
    console.log(userId)
    console.log(subjectId)
    let response = await fetch('http://localhost:5000/users/show/' + userId);
    let result = await response.json();

    if (result[0].user_type == 'admin') {
        dbconfig.query(
            'SELECT s.subject_id, s.subject_name, s.is_archived,s.class_id, c.class_name, ast.user_id, u.user_name FROM subject s INNER JOIN class c ON s.class_id = c.class_id INNER JOIN assign_teacher ast ON s.subject_id = ast.subject_id INNER JOIN users u ON ast.user_id = u.user_id WHERE s.subject_id = ?', subjectId,
            function (err, results, fields) {
                res.send(results); // results contains rows returned by server
            }
        );
    }
}
exports.archiveSubject = async (req, res) => {
    // const userId = req.params.Id;
    const subjectId = req.params.subject_id;
    // let response = await fetch('http://localhost:5000/users/' + userId);
    // let result = await response.json();
    // console.log(userId)
    console.log(subjectId)
    // if (result[0].user_type == 'admin') {
    dbconfig.query(
        'SELECT count(*) AS testCount FROM test WHERE subject_id = ?', subjectId,
        function (err, results, fields) {
            if (err) throw err;
            if (results[0].testCount > 0) {
                const sqlQry = 'UPDATE subject SET is_archived = ?  where subject_id = ?';
                dbconfig.query(sqlQry, [1, Number(subjectId)], (err, result) => {
                    if (err) throw err;
                    console.log("1 record updated");
                    res.status(200).send('Archived Successfully')
                });
            } else {
                console.log("This subject has no test");
                res.status(200).send('This subject has no test')
            }
        }
    );
    // }
}

exports.list_test_subject = async (req, res) => {
    const userId = req.params.Id;
    const subjectId = req.params.subject_id;
    let response = await fetch('http://localhost:5000/users/show/' + userId);
    let result = await response.json();


    if (result[0].user_type == 'teacher') {
        dbconfig.query(
            'SELECT * from test where subject_id = ?', subjectId,
            function (err, results, fields) {
                res.send(results); // results contains rows returned by server
            }
        );
    } else {
        //code for deny permission
    }
}