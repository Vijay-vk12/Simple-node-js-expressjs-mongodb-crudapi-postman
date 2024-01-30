const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PrincipalSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  role: Number,
  school: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
      "Please enter a valid email address",
    ],
  },
  phoneNumber: {
    type: String,
    required: true,
    match: [
      /^[6-9]\d{9}$/,
      "Please enter a valid 10-digit phone number starting with 6, 7, 8, or 9",
    ],
  },
  isDeleted: {
    type: Number,
    default: 0,
  },
  age: Number,
  gender: {
    type: String,
  },
  isPartner: {
    type: Boolean,
  },
  cognitoSub: {
    type: String,
  },
  isAdmin: { type: Boolean, default: false },
  isExperienced: { type: Boolean, default: false },
  schoolLocation: String,
});

const studentSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  role: Number,
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
      "Please enter a valid email address",
    ],
  },
  school: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    match: [
      /^[6-9]\d{9}$/,
      "Please enter a valid 10-digit phone number starting with 6, 7, 8, or 9",
    ],
  },
  isDeleted: {
    type: Number,
    default: 0,
  },

  classType: {
    type: Number,
    required: true,
  },
  fatherName: String,
  motherName: String,
  clientId: String,
  cognitoSub: String,
  gender: {
    type: String,
  },
  isPartner: {
    type: Boolean,
  },
  dob: {
    type: Date,
    default: () => Date.now(),
  },
  branch: String,

  alternatePhoneNumber: Number,
  address: {
    dno: String,
    place: String,
    state: String,
  },
  marks: [
    {
      subject: String,
      mark: Number,
      lectureId: {
        type: Schema.Types.ObjectId,
        ref: "Lecturer",
      },
    },
  ],
  GPA: Number,
  isMajor: { type: Boolean, default: false },
  registeredDate: {
    type: Date,
    default: () => Date.now(),
  },
  isTransferedStudent: { type: Boolean, default: false },
  isAthlete: { type: Boolean, default: false },
  isGraduted: { type: Boolean, default: false },
  isPartTime: { type: Boolean, default: false },
  isFullTime: { type: Boolean, default: true },
  isIntern: { type: Boolean, default: false },
  isEmployed: { type: Boolean, default: false },
  isDisciplined: { type: Boolean, default: false },
  isSuspended: { type: Boolean, default: false },
  attendance: Number,
});

const lecturerSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  role: Number,
  school: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
      "Please enter a valid email address",
    ],
  },
  phoneNumber: {
    type: String,
    required: true,
    match: [
      /^[6-9]\d{9}$/,
      "Please enter a valid 10-digit phone number starting with 6, 7, 8, or 9",
    ],
  },
  isDeleted: {
    type: Number,
    default: 0,
  },
  maritalStatus: { type: Boolean, default: false },
  clientId: String,
  gender: {
    type: String,
  },
  isPartner: {
    type: Boolean,
  },
  cognitoSub: String,
  subject: String,
  lecturerId: String,
  age: Number,
  yearsOfExperience: Number,
  isExperienced: { type: Boolean, default: false },
  languagesKnown: [String],
  knownSubjects: [String],
});

lecturerSchema.pre("save", function (next) {
  if (this.isModified("subject") || !this.lectureId) {
    const subjectCode = this.subject.slice(0, 3);
    const number = Math.floor(Math.random() * 10000);
    this.lectureId = generateLectureId(subjectCode, number);
  }
  next();
});

function generateLectureId(subjectCode, number) {
  return `${subjectCode}-${number.toString().padStart(4, "0")}-${
    hash(`${subjectCode}-${number}`) % 10 ** 9
  }`;
}

function hash(str) {
  let hash = 0;
  let chr;
  for (let i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}
const Principal = mongoose.model("Principal", PrincipalSchema, "principals");
const Student = mongoose.model("Student", studentSchema, "principals");
const Lecturer = mongoose.model("Lecturer", lecturerSchema, "principals");

module.exports = { Principal, Student, Lecturer };
