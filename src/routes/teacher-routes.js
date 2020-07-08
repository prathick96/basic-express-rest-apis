const express = require("express");
const teachers = require("../models/teacher-data");

const teacherRouter = express.Router();

var idgen = 100;

for (let index = 0; index < teachers.length; index++) {
  teachers[index].id = idgen;
  idgen++;
}

teacherRouter
  // get all teachers and students
  .get("/", (req, res) => {
    res.status(200).json({
      data: teachers
    });
  })
  // add new teacher and student details
  .post("/", (req, res) => {
    if (req.body.firstname && req.body.lastname) {
      const allTeacher = teachers;
      const newTeacher = {
        ...allTeacher,
        ...req.body
      };
      teachers.push(newTeacher);
      res.status(200).json({
        message: "Teacher with student details added Successfully",
        data: req.body
      });
    } else {
      res.status(400).json({
        message: "Invaild Teacher details"
      });
    }
  })

  /**
   *  Teacher resource
   */
  //get all teacher details only
  .get("/teacheronly", (req, res) => {
    const requiredTeacher = teachers.filter(each => delete each.student);
    if (requiredTeacher) {
      res.status(200).json({
        data: teachers
      });
    } else {
      res.status(400).json({
        message: "bad request"
      });
    }
  })
  // get teacher details by id
  .get("/:id", (req, res) => {
    const { id } = req.params;
    const teacherId = parseInt(id);
    const requiredTeacher = teachers.find(each => each.id === teacherId);
    delete requiredTeacher.student;
    if (requiredTeacher) {
      res.status(200).json({ data: requiredTeacher });
    } else {
      res.status(400).send("Teacher unavailable");
    }
  })
  // delete teacher and student by ID
  .delete("/:id", (req, res) => {
    const { id } = req.params;
    const teacherId = parseInt(id);
    let requiredTeacherindex;
    for (let index = 0; index < teachers.length; index++) {
      if (teachers[index].id === teacherId) {
        requiredTeacherindex = index;
        break;
      }
    }
    if (typeof requiredTeacherindex !== "undefined") {
      teachers.splice(requiredTeacherindex, 1);
      res.status(200).json({
        message: "Teacher details deleted"
      });
    } else {
      res.status(404).json({
        message: "Invalid Teacher ID"
      });
    }
  })
  //update teacher details
  .put("/:id", (req, res) => {
    const { id } = req.params;
    const teacherId = parseInt(id);
    let requiredTeacherindex;
    for (let index = 0; index < teachers.length; index++) {
      if (teachers[index].id === teacherId) {
        requiredTeacherindex = index;
        break;
      }
    }
    delete requiredTeacherindex.student;
    if (typeof requiredTeacherindex !== "undefined") {
      const original = teachers[requiredTeacherindex];
      const newTeacher = {
        ...original,
        ...req.body
      };
      teachers.splice(requiredTeacherindex, 1, newTeacher);
      res.status(200).json({
        message: "Teacher details updated",
        data: newTeacher
      });
    } else {
      req.status(404).json({
        message: "Invalid Teacher ID"
      });
    }
  })
  /**
   * Student resource
   */
  //get student details for teacher id
  .get("/:id/students", (req, res) => {
    const { id } = req.params;
    const teacherId = parseInt(id);
    const requiredStudents = teachers.find(each => each.id === teacherId);
    if (requiredStudents) {
      res.status(200).json({ data: requiredStudents.student });
    } else {
      res.status(400).send("Teacher unavailable");
    }
  })
  // get student by id
  .get("/:tid/students/:sid", (req, res) => {
    const { tid } = req.params;
    const { sid } = req.params;
    const teacherId = parseInt(tid);
    const studentId = parseInt(sid);
    const requiredStudents = teachers.find(each => each.id === teacherId);
    for (var i = 1; i < requiredStudents.student.length; i++) {
      if (requiredStudents.student[i].id === studentId) {
        const studentById = requiredStudents.student[i];
        if (studentById) {
          res.status(200).json({ data: studentById });
        } else {
          res.status(400).send("Teacher unavailable");
        }
      }
    }
  })
  // delete student by id
  .delete("/:tid/students/:sid", (req, res) => {
    const { tid } = req.params;
    const { sid } = req.params;
    const teacherId = parseInt(tid);
    const studentId = parseInt(sid);
    const requiredStudents = teachers.find(each => each.id === teacherId);
    let requiredStudentindex;
    for (let i = 0; i < requiredStudents.student.length; i++) {
      if (requiredStudents.student[i].id === studentId) {
        requiredStudentindex = i;
        break;
      }
    }
    if (typeof requiredStudentindex !== "undefined") {
      for (let index = 0; index < teachers.length; index++) {
        if (teachers[index].id === teacherId) {
          for (let i = 0; i < teachers[index].student.length; i++) {
            if (teachers[index].student[i].id === studentId) {
              teachers[index].student.splice(requiredStudentindex, 1);
              res.status(200).json({
                message: "Student details deleted"
              });
            }
          }
        }
      }
    } else {
      res.status(404).json({
        message: "Invalid Teacher/Student ID"
      });
    }
  })
  // Add new student by id
  .post("/:tid/students", (req, res) => {
    const { tid } = req.params;
    const teacherId = parseInt(tid);
    // const requiredStudents = teachers.find(each => each.id === teacherId);
    const newStudent = {
      ...req.body
    };

    for (let index = 0; index < teachers.length; index++) {
      if (teachers[index].id === teacherId) {
        teachers[index].student.push(newStudent);
        res.status(200).json({
          message: "Student details added Successfully",
          data: req.body
        });
      } else {
        res.status(400).json({
          message: "invalid data"
        });
      }
    }
  })
  // Update student details by student id
  .put("/:tid/students/:sid", (req, res) => {
    const { tid } = req.params;
    const { sid } = req.params;
    const teacherId = parseInt(tid);
    const studentId = parseInt(sid);
    const requiredStudents = teachers.find(each => each.id === teacherId);
    let requiredStudentindex;
    for (let i = 0; i < requiredStudents.student.length; i++) {
      if (requiredStudents.student[i].id === studentId) {
        requiredStudentindex = i;
        break;
      }
    }
    if (typeof requiredStudentindex !== "undefined") {
      for (let index = 0; index < teachers.length; index++) {
        if (teachers[index].id === teacherId) {
          for (let i = 0; i < teachers[index].student.length; i++) {
            const original = teachers[index].student[requiredStudentindex];
            const newTeacher = {
              ...original,
              ...req.body
            };
            teachers[index].student.splice(requiredStudentindex, 1, newTeacher);
            res.status(200).json({
              message: "Student details updated",
              data: newTeacher
            });
          }
        }
      }
    } else {
      res.status(404).json({
        message: "Invalid Teacher/Student ID"
      });
    }
  });

module.exports = teacherRouter;
