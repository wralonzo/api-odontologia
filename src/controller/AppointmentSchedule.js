import Appointment from "../model/Appointment.js";
import Schedule from "../model/Schedule.js";
import Patient from "../model/Patient.js";

const sequelize = Appointment.sequelize;

export const registerAppointment = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { appointment_datetime, reason, notes, patient_id, user_id } =
      req.body;
    const existingPatient = await sequelize.query(
      "SELECT COUNT(*) AS count FROM patient WHERE id = :patient_id AND status = true",
      {
        replacements: { patient_id },
        type: sequelize.QueryTypes.SELECT,
        transaction,
      }
    );
    if (existingPatient[0].count === 0) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "Patient does not exist or is not active." });
    }
    const data = await Appointment.create({
      appointment_datetime,
      reason,
      notes,
      patient_id,
      user_id,
      code_id: '',
    });
    const schudle = await Schedule.create({
      date: appointment_datetime,
      appointment_id: data.id,
    });
    await transaction.commit();
    res
      .status(201)
      .json({ message: "Appointment and schedule created successfully." });
  } catch (error) {
    await transaction.rollback();
    console.error("Error registering appointment and schedule.", error);
    res.status(500).send("Internal Server Error.");
  }
};

export const updateAppointment = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id, appointment_datetime, reason, notes, state } = req.body;
    const existingAppointment = await sequelize.query(
      "SELECT COUNT(*) AS count, status FROM appointment WHERE id = :id",
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
        transaction: transaction,
      }
    );
    if (existingAppointment[0].count === 0) {
      await transaction.rollback();
      return res.status(404).json({ message: "Appointment does not exist." });
    }
    if (!existingAppointment[0].status) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Appointment has already been logically deleted." });
    }
    await Appointment.update(
      { id, appointment_datetime, reason, notes, state },
      {
        where: { id: id } // Condición where necesaria
      }
    );
    if (state != 'PROGRAMADA') {
      await Schedule.update({ status: false }, { where: { appointment_id: id } });
    }

    await transaction.commit();
    res.json({ message: "Appointment and schedule updated successfully." });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating appointment and schedule.", error);
    res.status(500).send("Internal Server Error.");
  }
};

export const deleteLogicallyAppointment = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { appointment_id } = req.body;
    const existingAppointment = await sequelize.query(
      "SELECT COUNT(*) AS count, status FROM appointment WHERE id = :appointment_id",
      {
        replacements: { appointment_id },
        type: sequelize.QueryTypes.SELECT,
        transaction,
      }
    );
    if (existingAppointment[0].count === 0) {
      await transaction.rollback();
      return res.status(404).json({ message: "Appointment does not exist." });
    }
    if (!existingAppointment[0].status) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Appointment has already been logically deleted." });
    }

    await Appointment.update({ status: false }, { where: { id: appointment_id } });
    await Schedule.update({ status: false }, { where: { appointment_id: appointment_id } });
    await transaction.commit();
    res.status(200).json({
      message: "Appointment and schedule logically deleted successfully.",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error logically deleting appointment and schedule.", error);
    res.status(500).send("Internal Server Error.");
  }
};

export const appointmentList = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const numericLimit = parseInt(limit, 10);
    const numericPage = parseInt(page, 10);
    const offset = (numericPage - 1) * numericLimit;
    const { count, rows: appointments } = await Appointment.findAndCountAll({
      where: { status: true },
      limit: numericLimit,
      offset,
      include: [{ model: Patient, attributes: ["id", "full_name"] }],
    });
    const totalAppointments = count;
    const totalPages = Math.ceil(totalAppointments / numericLimit);
    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found." });
    }
    res.json({
      totalAppointments,
      totalPages,
      currentPage: numericPage,
      appointments,
    });
  } catch (error) {
    console.error("Error when displaying the list of appointments", error);
    res.status(500).send("Internal Server Error.");
  }
};

export const scheduleList = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const queryString = `
      SELECT 
          s.id AS schedule_id,
          s.date AS schedule_date,
          a.id AS appointment_id,
          a.appointment_datetime,
          a.reason,
          a.notes,
          p.full_name AS patient_name,
          a.state AS appointment_status
      FROM 
          schedule s
      JOIN 
          appointment a ON s.appointment_id = a.id
      JOIN 
          patient p ON a.patient_id = p.id
      WHERE 
          a.user_id = :userId 
          AND s.status = 1     
          AND a.state = 'PROGRAMADA';`;
    const schedules = await sequelize.query(
      queryString,
      {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    if (!schedules || schedules.length === 0) {
      return res.status(404).json({ message: "No schedules found." });
    }

    console.log(schedules);
    const formattedSchedules = schedules.map((schedule) => ({
      schedule_id: schedule.schedule_id,
      schedule_date: schedule.schedule_date,
      appointment_id: schedule.appointment_id,
      appointment_datetime: schedule.appointment_datetime,
      reason: schedule.reason,
      notes: schedule.notes,
      patient_name: schedule.patient_name,
      appointment_status: schedule.appointment_status,
    }));
    res.json({
      schedules: formattedSchedules,
    });
  } catch (error) {
    console.error("Error when displaying the list of schedules", error);
    res.status(500).send("Internal Server Error.");
  }
};
