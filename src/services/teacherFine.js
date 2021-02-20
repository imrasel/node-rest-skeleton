const TeacherFine = require('../models/teacherFine');

module.exports.addTeacherFine = async (school, teacherId, late) => {
  
  if (late) {
    if (school.teacherLateFineEnabled) {
      let teacherFine = new TeacherFine({
        amount: school.teacherLateFine,
        type: 'late',
        teacher: teacherId,
        school: school._id,
      });
      await teacherFine.save();
      console.log('teacher late fine added')
      return;
    }
  } 
  if (school.teacherAbsentFineEnabled) {
    let teacherFine = new TeacherFine({
      amount: school.teacherAbsentFine,
      type: 'absent',
      teacher: teacher._id,
      school: school._id,
    });
    await teacherFine.save();
    console.log('teacher late fine added')
    return;
  }

  console.log('teacher fine not added')
};
