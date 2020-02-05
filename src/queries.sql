SELECT jobs.id_job,
         jobs.customer,
        tools.tool_type,
         tools.file_code,
         jobs.tool_serial,
         connections.connection_description,
         connections.connection_type,
         connections.thread_type,
         connections.operation,
         connections.target_torque,
         job_details.measured_torque
         
FROM jobs
INNER JOIN tools
    ON jobs.idtool = tools.id_tool
INNER JOIN connections
    ON tools.id_tool = connections.idtool
INNER JOIN job_details
    ON job_details.idjob = jobs.id_job

