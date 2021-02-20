const moment = require('moment');

const HttpError =  require('../utils/httpError.response');
const Section = require('../models/section');
const School = require('../models/school');
const Teacher = require('../models/teacher');
const Registration = require('../models/registration');
const StudentAttendance = require('../models/studentAttendance');
const TeacherAttendance = require('../models/teacherAttendance');
const { sendSms } = require('./smsService');
const { getAcademicYearBySchool } = require('../repositories/academicYearRepository');
const { addTeacherFine } = require('./teacherFine');

module.exports.studentAttendanceDevice = async (res, next, student) => {
  let date = new Date();
  let registration;
  let school
  try {
    registration = await Registration.findOne({ student: student._id });
    school = await School.findById(student.school);
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  let inTime = moment().format('YYYY-MM-DD h:mm:ss a');

  // // return;
  let academicYear = await getAcademicYearBySchool(student.school);

  if (!academicYear) {
    const error = new HttpError('No academic year found for the school', 500);
    return next(error);
  }

  const existingAttendance = await StudentAttendance.findOne({ academicYear: academicYear._id, registration: registration._id, date: moment().format('YYYY-MM-DD')});

  if (existingAttendance) {
    const error = new HttpError('Attendance already taken', 403);
    return next(error);
  }

  let section = await Section.findById(student.section);

  let late = false;
  if (section.inTime) {
    let sectionInTime = moment(section.inTime, 'h:mm a');
    let nowTime = moment(new Date())
    if (nowTime.isAfter(sectionInTime)) {
      late = true;
    }
  }

  const attendance = StudentAttendance({
    class: student.class,
    section: student.section,
    academicYear: academicYear._id,
    date: moment(date).format('YYYY-MM-DD'),
    inTime,
    late,
    present: true,
    registration: registration._id,
    school: student.school,
    student: student._id,
  });

  //sms data
  if (school.smsEnabled) {
    if (student.fatherPhone) {
      let smsContent = moment().format('Do MMMM YYYY') + ': ' + student.firstName + ' ' + student.lastName + ' attends school today at  '  + moment(new Date()).format('h:mm:ss a') + ' - ' + school.name;
      sendSms(student.fatherPhone, smsContent);
    }
  }
  
  try {
    await attendance.save();
    
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  res.status(201).json({error: false, data: [], message: 'Success' });
};

module.exports.teacherAttendanceDevice = async (res, next, teacher) => {
  let date = new Date();
  let school;
  try {
    school = await School.findById(teacher.school);
    if (!school) {
      const error = new HttpError('No school found', 500);
      return next(error);
    }
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  let inTime = moment().format('YYYY-MM-DD h:mm:ss a');

  // // return;
  let academicYear = await getAcademicYearBySchool(teacher.school);

  if (!academicYear) {
    const error = new HttpError('No academic year found for the school', 500);
    return next(error);
  }

  const existingAttendance = await TeacherAttendance.findOne({teacher: teacher._id, date: moment().format('YYYY-MM-DD')});

  if (existingAttendance) {
    const error = new HttpError('Attendance already taken', 403);
    return next(error);
  }

  let late = false;
  if (teacher.inTime) {
    let teacherInTime = moment(teacher.inTime, 'h:mm a');
    let nowTime = moment(new Date())
    if (nowTime.isAfter(teacherInTime)) {
      late = true;
    }
  }

  const attendance = TeacherAttendance({
    academicYear: academicYear._id,
    date: moment(date).format('YYYY-MM-DD'),
    inTime,
    late,
    present: true,
    school: teacher.school,
    teacher: teacher._id,
  });

  
  try {
    await attendance.save();
    if (attendance.late) {
      await addTeacherFine(school, teacher._id, late);
    }
    
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  res.status(201).json({error: false, data: [], message: 'Success' });
};