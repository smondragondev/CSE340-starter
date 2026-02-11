const pool = require('../database/');


/* *****************************
*   Register new appointment
* *************************** */
async function registerAppointment(
    account_id, inv_id,appointment_phone_number,
    appointment_email,appointment_message){
        try{
            const sql = `
                INSERT INTO public.appointment(
                    account_id, inv_id, appointment_phone_number,
                    appointment_email, appointment_message)
                    VALUES ($1, $2, $3, $4, $5)
                    RETURNING *
            `;
            return await pool.query(sql,
                [   
                    account_id,
                    inv_id,
                    appointment_phone_number,
                    appointment_email,
                    appointment_message
                ]
            )
        } catch (error){
            return error.message;
        }
}

module.exports = {
    registerAppointment
}