const express = require('express');
const router = express.Router();

//Main Menu Routes

router.get('/', (req, res) => {
    res.render('index');

});
router.get('/info', (req, res) => {
    res.render('info');
});

router.get('/log-screen', (req, res) => {
    res.render('log-screen');
});

router.get('/new-job/', (req, res) => {
    res.render('select-nj');
});

router.get('/review/',(req,res)=>{
    res.render('select-review');
});

//Standard Job Routes

router.get('/standard/', (req,res)=>{
    res.render('new-job');
});

router.post('/add', (req, res) => {
    const info = req.body;
    var Tool;
    req.getConnection((err, connection) => {
        const query = connection.query('INSERT INTO tool set ?; SELECT * FROM tool WHERE id_tool = LAST_INSERT_ID()', [info], (err, tool) => {
            if (err) {
                res.json(err);
            }
            console.log(tool[1]);
            res.render('new-connection', {
                data: tool[1]
            });
        })
    })
});

router.get('/standard-review/', async (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM tool', (err, tools) => {
            if (err) {
                res.json(err);
            }

            res.render('review-job', {
                tools
            });
        });
    });
});
router.get('/log-connection/:id', async (req, res) => {
    const { id } = req.params;
    req.getConnection((err,conn)=>{
        conn.query('SELECT * FROM tool_connection WHERE connection_id = ?', id, (err,connection)=>{

            if(err){
                res.json(err);
            }

            res.render('log-connection',{
                connection
            })
        })
    })
    

});

router.post('/api', async (req, res) => {
    console.log('I got a request');
    console.log(req.body);
    const d = req.body;

    
    req.getConnection((err, conn)=>{
        conn.query('UPDATE tool_connection SET ? WHERE connection_id = ?;UPDATE tool_connection SET serviced_on = CURRENT_TIMESTAMP, connection_status = 1 WHERE connection_id = ?', [d,d.connection_id, d.connection_id], (err,row)=>{
            if(err){
                res.json(err);
            }
           res.end();
        })
    })
   




});

router.get('/delete-connection/:id', async (req, res) => {

    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM tool_connection WHERE connection_id = ?', id, (err, rows) => {
            if (err) {
                res.json(err);
            }
            //regresa al URL anterior
            backURL = req.header('Referer') || '/';
            res.redirect(backURL);

        })

    })
    //regresa al URL anterior

});

router.get('/add_connection/:id', (req, res) => {
    const { id } = req.params;
    req.getConnection((err,conn)=>{
        conn.query('SELECT * FROM tool WHERE id_tool = ?', id,(err,tool)=>{
            if(err){
                res.json(err);
            }
            res.render('new-connection',{
                data:tool
            })
        })
    })

});

router.get('/edit-connection/:id', async (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM tool_connection WHERE connection_id = ?', id, (err, connection) => {
            if (err) {
                res.json(err);
            }
            res.render('edit-connections', {
                connection
            });
        })
    })


});

router.post('/update_connection/:id', (req, res) => {
    const { id } = req.params;
    const newConnectionData = req.body;
    console.log(newConnectionData);

    req.getConnection((err, conn) => {
        conn.query('UPDATE tool_connection SET ? WHERE connection_id = ?', [newConnectionData, id], (err, rows) => {
            if (err) {
                res.json(err);
            }
            backURL = req.header('Referer') || '/';
            res.redirect(backURL);

           
        })
    })

});
router.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM tool WHERE id_tool = ?', [id], (err, rows) => {
            res.redirect('/review/');
        })
    })
});
router.get('/print/:id', async (req, res) => {

    const { id } = req.params;
    req.getConnection((err,conn)=>{
        conn.query('SELECT * FROM tool WHERE id_tool = ?; SELECT * FROM tool_connection WHERE tool_ID = ?',[id,id], (err,tool)=>{
            if(err){
                res.json(err);
            }

            res.render('print-job',{
                tool:tool[0],
                connections:tool[1]
            });
        })
    })
    
});

router.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM tool WHERE id_tool = ?', [id], (err, tools) => {
            if (err) {
                res.json(err)
            }
            res.render('edit-job', {
                tool: tools[0]
            });

        })
    })
});

router.post('/update/:id', (req, res) => {
    const { id } = req.params;
    const newDataTool = req.body;
    console.log(newDataTool);
    req.getConnection((err, conn) => {
        conn.query('UPDATE tool set ? WHERE id_tool = ?', [newDataTool, id], (err, rows) => {
            res.redirect('/review/');
        })
    })
});

router.get('/view-connections/:id', async (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM tool_connection WHERE tool_id = ?', id, (err, connections) => {
            if (err) {
                res.json(err);
            }
            res.render('job-connections', {
                connections,id
            })
        })
    })

});

//PPK Job Routes


router.post('/add_connection/:id', (req, res) => {
    const { id } = req.params;
    const connection_data = req.body;
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO tool_connection set ?; UPDATE tool_connection SET tool_id = ? WHERE connection_id = LAST_INSERT_ID(); SELECT * FROM tool WHERE id_tool = ?', [connection_data, id, id], (err, connection) => {
            if (err) {
                res.json(err);
            }

            res.render('new-connection',{
                data: connection[2]
            });
        })
    })

});

router.get('/ppk/', (req, res)=>{
    res.render('ppk-new-job');
})
router.post('/add-ppk/', (req,res)=>{
    const info = req.body;
    var tool;
    req.getConnection((err,conn)=>{
        conn.query('INSERT INTO jobs set ?;SELECT jobs.*,tools.file_code  FROM jobs INNER JOIN tools ON jobs.idtool =tools.id_tool WHERE id_job = LAST_INSERT_ID()',[info], (err, row)=>{
            if(err){
                res.json(err);
            }
            console.log(row[1]);
            res.render('ppk-resume',{
                job: row[1]
            }
            
            );
        })
    })
});
router.get('/ppk-review/', (req,res)=>{
    req.getConnection((err,conn)=>{
        conn.query('SELECT * FROM jobs', (err, jobs)=>{
            if(err){
                res.json(err)
            }
            res.render('ppk-jobs',{
                jobs
            });
        });
    });
});

router.get('/view-ppk-connections/:id',(req,res)=>{
   const {id} = req.params;
    req.getConnection((err,conn) => {
        conn.query('SELECT * FROM connections INNER JOIN jobs ON connections.idtool = jobs.idtool WHERE jobs.id_job = ? ', id, (err,connections)=>{
            if(err){
                res.json(err);
            }

            res.render('job-connections',{
              connections, id  
            });
        } );
    });


});

router.get('/delete-ppk/:id', (req,res)=>{
    const { id } = req.params;
    req.getConnection((err, conn)=>{
        conn.query('DELETE FROM jobs WHERE id_job = ?', id, (err, rows)=>{
            res.redirect('/ppk-review/');
        });
    });
});

router.get('/edit-ppk/:id', (req,res)=>{

    const {id} = req.params;
    req.getConnection((err,conn) =>{
        conn.query('SELECT jobs.*, tools.file_code FROM jobs INNER JOIN tools ON jobs.idtool = tools.id_tool WHERE id_job = ?', id, (err, row)=>{
            if(err){
                res.json(err);
            }
            res.render('ppk-edit',{
                job: row
            })
        });
    });
});



module.exports = router;
