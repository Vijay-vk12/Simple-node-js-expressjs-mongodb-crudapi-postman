const express = require("express");
const db = require("./db.js");
const { Principal, Student, Lecturer } = require("./model.js");

const app = express();
app.use(express.json());

function generateRandomString(length = 30) {
  const characters = "0123456789abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
console.log(generateRandomString());
app.post("/principalSignup", async (req, res) => {
  const email = req.body.email;
  const gender = req.body.gender;
  let op;
  try {
    if (gender === "male") {
      op = true;
    } else {
      op = false;
    }
    const emailExists = await Principal.findOne({ email });
    if (emailExists) {
      res.status(404).json({ msg: "user already exists" });
    }
    const signup = await new Principal({
      name: req.body.name,
      role: 1,
      school: req.body.school,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      age: req.body.age,
      gender: req.body.gender,
      isPartner: op,
      cognitoSub: generateRandomString(),
      schoolLocation: req.body.schoolLocation,
    });

    const result = await signup.save();
    res
      .status(200)
      .json({ message: "Data  stored Successfully", data: result });
  } catch (error) {
    console.log(error.message);
    res.status(404).json(error);
  }
});

app.post("/studentSignup", async (req, res) => {
  const email = req.body.email;
  const gender = req.body.gender;
  const school = req.body.school;
  let op;
  try {
    if (gender === "male") {
      op = true;
    } else {
      op = false;
    }

    const signup = await new Student({
      name: req.body.name,
      role: 3,
      email: req.body.email,
      school: req.body.school,
      phoneNumber: req.body.phoneNumber,
      classType: req.body.classType,
      fatherName: req.body.fatherName,
      motherName: req.body.motherName,
      gender: req.body.gender,
      isPartner: op,
      dob: req.body.dob,
      cognitoSub: generateRandomString(),
      branch: req.body.branch,
      alternatePhoneNumber: req.body.alternatePhoneNumber,
      address: req.body.address,
      marks: req.body.marks,
      GPA: req.body.GPA,
      isMajor: req.body.isMajor,
      registeredDate: req.body.registeredDate,
      isTransferedStudent: req.body.isTransferedStudent,
      isAthlete: req.body.isAthlete,
      isGraduted: req.body.isGraduted,
      isPartTime: req.body.isPartTime,
      isFullTime: req.body.isFullTime,
      isIntern: req.body.isIntern,
      isEmployed: req.body.isEmployed,
      isDisciplined: req.body.isDisciplined,
      isSuspended: req.body.isSuspended,
      attendance: req.body.attendance,
    });
    const principal = await Principal.findOne({ role: 1, school });

    if (principal) {
      const principalCognitoSub = principal.cognitoSub;
      signup.clientId = principalCognitoSub;
    }
    const emailExists = await Student.findOne({ email });
    if (emailExists) {
      res.status(404).json({ msg: "user already exists" });
    }
    await signup.save();
    res.status(200).json({ message: "Data stored successfully", data: signup });
  } catch (e) {
    console.log(e.message);
    res.status(404).json(e);
  }
});

app.post("/lecturerSignup", async (req, res) => {
  const email = req.body.email;
  const gender = req.body.gender;
  const school = req.body.school;
  let op;
  try {
    if (gender === "male") {
      op = true;
    } else {
      op = false;
    }

    const emailExists = await Lecturer.findOne({ email });
    if (emailExists) {
      res.status(404).json({ msg: "user already exists" });
    }
    const signup = await new Lecturer({
      name: req.body.name,
      role: 2,
      school: req.body.school,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      age: req.body.age,
      gender: req.body.gender,
      isPartner: op,
      cognitoSub: generateRandomString(),
      maritalStatus: req.body.maritalStatus,
      subject: req.body.subject,
      age: req.body.age,
      yearsOfExperience: req.body.yearsOfExperience,
      isExperienced: req.body.isExperienced,
      languagesKnown: req.body.languagesKnown,
      knownSubjects: req.body.knownSubjects,
    });
    const principal = await Principal.findOne({ role: 1, school });
    console.log("principal", principal);
    if (principal) {
      const principalCognitoSub = principal.cognitoSub;
      signup.clientId = principalCognitoSub;
    }

    const result = await signup.save();
    res
      .status(200)
      .json({ message: "Data  stored Successfully", data: result });
  } catch (e) {
    console.log(e.message);
    res.status(404).json(e);
  }
});
app.get("/pagination", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;
  try {
    const result = await Principal.find({ isDeleted: 0 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    if (result.length === 0) {
      res.status(400).json({ msg: "page Not found" });
    }
    res.status(200).json({ count: result.length, data: result });
  } catch (e) {
    res.status(400).json(e);
  }
});

app.get("/userget", async (req, res) => {
  const role = req.body.role;
  const isPartner = req.body.isPartner;
  try {
    let result;
    if (isPartner === true || isPartner === false) {
      result = await Principal.find({
        role: role,
        isDeleted: 0,
        isPartner: isPartner,
      });
    } else {
      result = await Principal.find({
        role: role,
        isDeleted: 0,
      });
    }

    res.status(200).json({ count: result.length, data: result });
  } catch (e) {
    res.status(400).json(e);
  }
});
app.get("/particularuserget", async (req, res) => {
  const email = req.body.email;
  // const role = req.body.role;

  try {
    const result = await Principal.findOne({
      email: email,
      isDeleted: 0,
    });
    res.status(200).json({ count: result.length, data: result });
  } catch (e) {
    res.status(400).json(e);
  }
});

// app.get("/usersIdentity", async (req, res) => {
//   try {
//     var result = await Principal.aggregate([
//       {
//         $match: { school: "KR School" },
//       },
//       {
//         $group: {
//           _id: "$role",
//           data: {
//             $push: {
//               name: "$name",
//             },
//           },
//           noOfCanditates: { $sum: 1 },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           role: {
//             $switch: {
//               branches: [
//                 { case: { $eq: ["$_id", 1] }, then: "Principal" },
//                 { case: { $eq: ["$_id", 2] }, then: "Lecturers" },
//                 { case: { $eq: ["$_id", 3] }, then: "Students" },
//               ],
//               default: "Unknown",
//             },
//           },
//           data: 1,
//           noOfCanditates: 1,
//         },
//       },
//     ]);
//     res.json(result);
//   } catch (error) {
//     console.log(error.message);
//   }
// });

app.get("/details", async (req, res) => {
  try {
    const result = await Principal.aggregate([
      {
        $project: {
          _id: 0,
          name: "$name",
          email: "$email",
          role: {
            $cond: {
              if: { $eq: ["$role", 1] },
              then: "Principal",
              else: {
                $cond: {
                  if: { $eq: ["$role", 2] },
                  then: "Lecturer",
                  else: "Student",
                },
              },
            },
          },
        },
      },
    ]);
    res.json(result);
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/schoolWise", async (req, res) => {
  try {
    const result = await Principal.aggregate([
      { $match: { isDeleted: 0 } },
      {
        $group: {
          _id: "$school",
          principals: {
            $push: {
              $cond: {
                if: { $eq: ["$role", 1] },
                then: {
                  name: "$name",
                  email: "$email",
                  gender: "$gender",
                },
                else: null,
              },
            },
          },
          lecturers: {
            $push: {
              $cond: {
                if: { $eq: ["$role", 2] },
                then: {
                  name: "$name",
                  email: "$email",
                  subject: "$subject",
                  languages: "$languagesKnown",
                },
                else: null,
              },
            },
          },
          students: {
            $push: {
              $cond: {
                if: { $eq: ["$role", 3] },
                then: {
                  name: "$name",
                  email: "$email",
                  phoneNumber: "$phoneNumber",
                  classType: "$classType",
                  branch: "$branch",
                  cgpa: "$GPA",
                  gender: "$gender",
                },
                else: null,
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          principals: {
            $filter: {
              input: "$principals",
              as: "principal",
              cond: { $ne: ["$$principal", null] },
            },
          },
          students: {
            $filter: {
              input: "$students",
              as: "student",
              cond: { $ne: ["$$student", null] },
            },
          },
          lecturers: {
            $filter: {
              input: "$lecturers",
              as: "lecturer",
              cond: { $ne: ["$$lecturer", null] },
            },
          },
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/Count", async (req, res) => {
  try {
    const result = await Principal.aggregate([
      { $match: { isDeleted: 0 } },
      {
        $group: {
          _id: "$school",
          totalPrincipals: {
            $sum: {
              $cond: [{ $eq: ["$role", 1] }, 1, 0],
            },
          },
          totalLecturers: {
            $sum: {
              $cond: [{ $eq: ["$role", 2] }, 1, 0],
            },
          },
          totalStudents: {
            $sum: {
              $cond: [{ $eq: ["$role", 3] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          totalPrincipals: 1,
          totalLecturers: 1,
          totalStudents: 1,
        },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/students/byclassType", async (req, res) => {
  try {
    const result = await Student.aggregate([
      {
        $match: { classType: { $ne: null }, isDeleted: 0 },
      },
      {
        $group: {
          _id: "$classType",
          students: {
            $push: {
              name: "$name",
              gender: "$gender",
              GPA: "$GPA",
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          students: {
            $filter: {
              input: "$students",
              as: "student",
              cond: { $ne: ["$$student.name", null] },
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(result);
  } catch (e) {
    console.log(e.message);
  }
});

app.get("/lecturers/experienced", async (req, res) => {
  try {
    const result = await Principal.aggregate([
      {
        $match: {
          yearsOfExperience: { $gt: 5 },
          isDeleted: 0,
        },
      },
      {
        $group: {
          _id: null,
          experiencedLecturers: {
            $push: {
              name: "$name",
              email: "$email",
              yearsOfExperience: "$yearsOfExperience",
              subject: "$subject",
              knownSubjects: "$knownSubjects",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          experiencedLecturers: 1,
        },
      },
    ]);
    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ message: "Internal server error" });
  }
});

app.get("/students/highscore", async (req, res) => {
  try {
    const result = await Student.aggregate([
      {
        $match: {
          GPA: { $gt: 8.5 },
          classType: 10,
          isDeleted: 0,
        },
      },
      {
        $group: {
          _id: null,
          highScoreStudents: {
            $push: {
              name: "$name",
              email: "$email",
              GPA: "$GPA",
              marks: { mark: "$marks.mark", subject: "$marks.subject" },
              attendance: "$attendance",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          highScoreStudents: 1,
        },
      },
    ]);
    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ message: "Internal server error" });
  }
});

app.get("/students/topper", async (req, res) => {
  try {
    const result = await Student.aggregate([
      {
        $match: {
          GPA: { $gt: 8.5 },
          classType: 10,
          isDeleted: 0,
        },
      },
      {
        $sort: {
          GPA: -1,
          attendance: -1,
        },
      },
      {
        $limit: 1,
      },
      {
        $project: {
          _id: 0,
          name: 1,
          email: 1,
          GPA: 1,
          subjectMarks: {
            $map: {
              input: "$marks",
              as: "mark",
              in: {
                subject: "$$mark.subject",
                mark: "$$mark.mark",
              },
            },
          },
          attendance: 1,
        },
      },
    ]);
    res.status(200).json(result);
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ message: "Internal server error" });
  }
});
app.put("/collections", async (req, res) => {
  const studentsData = await Principal.aggregate([
    {
      $match: {
        role: 3,
      },
    },
    {
      $lookup: {
        from: "principals",
        localField: "_id",
        foreignField: "_id",
        as: "students",
      },
    },
    {
      $unwind: "$students",
    },
    {
      $merge: {
        into: "students_collection",
      },
    },
  ]);

  const lecturersData = await Principal.aggregate([
    {
      $match: {
        role: 2,
      },
    },
    {
      $lookup: {
        from: "principals",
        localField: "_id",
        foreignField: "_id",
        as: "lecturers",
      },
    },
    {
      $unwind: "$lecturers",
    },
    {
      $merge: {
        into: "lecturers_collection",
      },
    },
  ]);

  const principalsData = await Principal.aggregate([
    {
      $match: {
        role: 1,
      },
    },
    {
      $merge: {
        into: "principals_collection",
      },
    },
  ]);

  res.json({ message: "created Succesfully" });
});

app.get("/minorStudents", async (req, res) => {
  const studentsWithMinor = await Student.aggregate([
    {
      $match: {
        isMajor: false,
        isDeleted: 0,
      },
    },
  ]);

  res.status(200).json(studentsWithMinor);
});
app.put("/updateLectureIdforLecturer", async (req, res) => {
  try {
    const lecturersToUpdate = await Lecturer.find({
      subject: { $exists: true, $ne: null },
      lecturerId: { $exists: false },
    });

    for (const lecturer of lecturersToUpdate) {
      try {
        await Lecturer.updateOne(
          { _id: lecturer._id },
          {
            $set: {
              lecturerId: `${lecturer.subject.toLowerCase()}_${lecturer._id}`,
            },
          }
        );
      } catch (updateError) {
        console.error("Error updating lecturerId:", updateError.message);
      }
    }

    console.log("LecturerIds updated successfully!");
    res.status(200).json({ message: "LecturerIds updated successfully!" });
  } catch (error) {
    console.error("Error updating lecturerIds:", error.message);
    res.status(400).json({ error: error.message });
  }
});

app.put("/updateLectureIdsforStudents", async (req, res) => {
  try {
    const students = await Student.find({
      role: 3,
      "marks.lectureId": { $exists: false },
    });
    for (const student of students) {
      //console.log(student);
      if (!student.classType) {
        console.error(`classType is required for student ${student._id}`);
        continue;
      }

      for (const mark of student.marks) {
        //console.log(mark);
        const lecturer = await Lecturer.findOne({
          role: 2,
          subject: mark.subject,
          school: student.school,
        });
        mark.lectureId = lecturer ? lecturer._id : null;
      }

      await student.save();
    }

    res
      .status(200)
      .json({ message: "LectureIds updated successfully for students" });
  } catch (error) {
    console.error(error.message);
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/lecturesHandlingStudents", async (req, res) => {
  try {
    const result = await Student.aggregate([
      {
        $unwind: "$marks",
        $match: { isDeleted: 0 },
      },
      {
        $lookup: {
          from: "principals",
          localField: "marks.lectureId",
          foreignField: "_id",
          as: "lecturer",
        },
      },
      {
        $unwind: "$lecturer",
      },
      {
        $group: {
          _id: "$lecturer.name",
          lectureName: { $first: "$lecturer.name" },
          subject: { $first: "$marks.subject" },
          school: { $first: "$school" },
          students: {
            $push: {
              studentName: "$name",
              mark: "$marks.mark",
              GPA: "$GPA",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          lectureName: 1,
          subject: 1,
          school: 1,
          students: 1,
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/studentsWithLecturers", async (req, res) => {
  try {
    const result = await Student.aggregate([
      {
        $unwind: "$marks",
        $match: { isDeleted: 0 },
      },
      {
        $lookup: {
          from: "principals",
          localField: "marks.lectureId",
          foreignField: "_id",
          as: "lecturer",
        },
      },
      {
        $unwind: "$lecturer",
      },
      {
        $group: {
          _id: {
            studentName: "$name",
            school: "$school",
            subject: "$marks.subject",
            lecturer: "$lecturer.name",
          },
          marks: { $first: "$marks.mark" },
          GPA: { $first: "$GPA" },
        },
      },
      {
        $group: {
          _id: {
            studentName: "$_id.studentName",
            school: "$_id.school",
          },
          studentDetails: {
            $first: {
              studentName: "$_id.studentName",
              school: "$_id.school",
            },
          },
          subjects: {
            $push: {
              subject: "$_id.subject",
              marks: "$marks",
              lecturer: "$_id.lecturer",
            },
          },
          GPA: { $first: "$GPA" },
        },
      },
      {
        $project: {
          _id: 0,
          studentName: "$studentDetails.studentName",
          school: "$studentDetails.school",
          subjects: 1,
          GPA: 1,
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/deleteuser", async (req, res) => {
  try {
    const id = req.body.id;
    const result = await Principal.deleteOne({ _id: id });
    console.log(result);
    res
      .status(200)
      .json({ success: true, msg: "Deleted Successfully", result });
  } catch (error) {
    console.log(error.message);
    res.status(404).json(error);
  }
});

app.listen(6000, () => {
  console.log("server running on port 6000");
});
