const dbconfig = require("../config");
const fetch = require("node-fetch");
const fs = require('fs');
const fastcsv = require("fast-csv");

exports.all_test = (req, res) => {
    dbconfig.query(
        'SELECT * FROM `test`',
        function (err, results, fields) {
            res.send(results); // results contains rows returned by server
        }
    );
};


exports.add_test = async (req, res) => {
    //const userId = req.params.Id;
    const user_id = req.body.user_id; //teacher id
    const subject = req.params.subject_id;
    // let response = await fetch('http://localhost:5000/users/' + userId);
    // let result = await response.json();
    // let userType;
    // result.forEach(obj => {
    //     userType = obj.user_type;
    // })
    //if (userType == 'teacher') {
    const sql = "INSERT INTO `test` set ?";
    const insertData = {
        test_name: req.body.test_name,
        subject_id: subject,
        date: req.body.test_date,
        is_complete: 0
    }
    dbconfig.query(sql, insertData, async (err, result) => {
        if (err) throw err;
        console.log(result.insertId)
        res.redirect('http://localhost/api/list_student_subject.php?user_id=' + user_id + '&subject_id=' + subject)
        // lastInsertedID = await result.insertId;

        // let subjectStudentList = [];

        // dbconfig.query(
        //     'SELECT u.user_id from users u INNER join assigned_pupil ap on u.user_id = ap.user_id where u.user_type = "student" and ap.subject_id = ?', insertData.subject_id,
        //     function (err, results, fields) {
        //         if (results.length > 0) {
        //             results.forEach(myFunction);
        //             function myFunction(item) {
        //                 subjectStudentList.push([lastInsertedID, item.user_id, null]);
        //             }
        //             console.log(subjectStudentList);
        //             //res.redirect('/users/list_student_subject/' + userId + '/' + insertData.subject_id)
        //             // if (lastInsertedID != 0 && subjectStudentList.length > 0) {
        //             //     let qry = `INSERT INTO mark (test_id, user_id, marks) VALUES ?`;
        //             //     dbconfig.query(qry, [subjectStudentList], function (err, data) {
        //             //         if (err) throw err;
        //             //         console.log("record inserted for marks");
        //             //         console.log(insertData.subject_id);
        //             //         res.redirect('/users/list_student_subject/' + userId + '/' + insertData.subject_id)
        //             //     });
        //             // }
        //             // else {
        //             //     console.log("not working");
        //             // }
        //         }
        //     }
        // );

    });
    //}
}
exports.edit_test = (req, res) => {
    const testId = req.params.test_id;
    dbconfig.query(
        'SELECT * FROM `test` where test_id = ?', testId,
        function (err, results, fields) {
            res.send(results); // results contains rows returned by server
        }
    );
}
exports.update_test = async (req, res) => {
    const userId = req.params.Id;
    let response = await fetch('http://localhost:5000/users/show/' + userId);
    let result = await response.json();


    if (result[0].user_type == 'teacher') {
        const sqlQry = 'UPDATE test SET test_name = ?, date = ?  where test_id = ?';
        let test_name = req.body.test_name;
        let date = req.body.test_date;
        let test_id = req.body.test_id;
        let subject_id = req.body.subject_id;

        dbconfig.query(sqlQry, [test_name, date, test_id], (err, result) => {
            if (err) throw err;
            console.log("1 record updated");
            res.send(JSON.stringify("ok"));
        });
    }
}
exports.upload_csv_grade_pupil = async (req, res) => {
    //add validation for file upload first and have to be there a necessary csv file called 'markcsv.csv'
    const userId = req.params.Id;
    const test_id = req.body.test_id;
    console.log(test_id)
    let response = await fetch('http://localhost:5000/users/show/' + userId);
    let result = await response.json();

    if (result[0].user_type == 'teacher') {
        let filepath = './upload/' + req.body.file;//'./upload/markcsv.csv'
        let filename = filepath;
        //get file
        let stream = fs.createReadStream(filename);
        let csvData = [];
        let test = [];

        //parse using fast-csv module; see in top about fastcsv require
        let csvStream = fastcsv.parse()
            .on("data", function (data) {
                csvData.push(data);
                //test_id.push(csvData[0][0])

            })
            .on("end", function () {
                // remove the first line: header
                // csvData.unshift()
                for (var i = 0; i < csvData.length; i++) {
                    // test1[i] = [];
                    // test1[i][0] = csvData[i][0];
                    // test1[i][1] = top10[i][1];
                    csvData[i][0] = test_id
                    console.log("[0][1]" + csvData[i][0])
                    // Maybe do something similar with test2
                }
                csvData.shift();


                console.log('csv: ', csvData)
                // insert csvdata to database
                let qry = `INSERT INTO mark (test_id, user_id, marks) VALUES ?`;
                dbconfig.query(qry, [csvData], function (err, data) {
                    if (err) throw err;
                    console.log(err || data);
                    console.log("record inserted for marks");
                    console.log('csv test id only : ', csvData[0][0])
                    let qry2 = `UPDATE test SET is_complete = ? where test_id = ?`;
                    dbconfig.query(qry2, [1, csvData[0][0]], function (err, data) {
                        if (err) throw err;
                        console.log(data)
                    });
                });
            });

        stream.pipe(csvStream);
    }
    res.status(200).send('Marks successfully updated')
}

exports.deleteTest = async (req, res) => {
    // const userId = req.params.Id;
    // let response = await fetch('http://localhost:5000/users/' + userId);
    // let result = await response.json();

    const testId = req.params.test_id;
    //const subjectId = req.body.subject_id;
    //if (result[0].user_type == 'teacher') {
    const sql = `DELETE FROM mark WHERE test_id = ?`;
    const sql2 = `DELETE FROM test WHERE test_id = ?`;
    dbconfig.query(
        sql, testId,
        function (err, results, fields) {
            if (err) throw err;
            console.log("1 record is deleted");
            dbconfig.query(
                sql2, testId,
                function (err, results, fields) {
                    if (err) throw err;
                    res.status(200).send("Test deleted successfully")
                    //console.log("1 record is deleted");
                    //res.redirect('/users/list_test_subject/' + userId + '/' + subjectId)
                }
            );
        }
    );
    //}
}
exports.list_student_test = async (req, res) => {
    const userId = req.params.Id;
    let response = await fetch('http://localhost:5000/users/show/' + userId);
    let result = await response.json();

    const test_id = req.params.test_id;

    if (result[0].user_type == 'teacher') {
        dbconfig.query(
            'SELECT u.user_id,u.user_name, u.first_name, u.last_name,t.test_id, t.test_name, mk.marks from users u INNER JOIN mark mk on u.user_id = mk.user_id INNER JOIN test t on t.test_id = mk.test_id where t.test_id = ?', test_id,
            function (err, results, fields) {
                res.send(results); // results contains rows returned by server
            }
        );
    } else {
        //code for deny permission
    }
}
exports.edit_grade_pupil = async (req, res) => {
    const userId = req.params.Id; // teacher id
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();

    if (result[0].user_type == 'teacher') {
        const sqlQry = 'UPDATE mark SET marks = ? where test_id = ? AND user_id = ?';
        let marks = req.body.grade;
        let user_id = req.body.user_id; // student id
        let test_id = req.body.test_id;

        dbconfig.query(sqlQry, [marks, test_id, user_id], (err, result) => {
            if (err) throw err;
            console.log("Record updated");
            res.redirect('/users/list_student_test/' + userId + '/' + test_id)
        });
    }
}

exports.list_student_test_grade = async (req, res) => {
    const userId = req.params.Id;
    let response = await fetch('http://localhost:5000/users/show/' + userId);
    let result = await response.json();

    const test_id = req.params.test_id;

    if (result[0].user_type == 'student') {
        dbconfig.query(
            'Select * from mark where user_id = ? and test_id = ?', [userId, test_id],
            function (err, results, fields) {
                res.send(results); // results contains rows returned by server
            }
        );
    } else {
        //code for deny permission
    }
}


exports.update_grades = async (req, res) => {
    const userId = req.params.Id;
    console.log(userId);
    let response = await fetch('http://localhost:5000/users/show/' + userId);
    let result = await response.json();


    if (result[0].user_type == 'student') {
        const sqlQry = 'UPDATE mark SET marks = ? where user_id = ? and test_id = ?';
        let marks = req.body.marks;
        let user_id = userId;
        let test_id = req.body.test_id;
        // let subject_id = req.body.subject_id;

        dbconfig.query(sqlQry, [marks, user_id, test_id], (err, result) => {
            if (err) throw err;
            console.log("1 record updated");
            console.log(user_id); console.log(test_id);
            res.send(JSON.stringify("ok"));
        });
    }
}