const express = require('express');
const router = express.Router();




router.post('/add', (req, res) =>{
    const info = req.body;
    req.getConnection((err,connection)=>{
        const query = connection.query('INSERT INTO tool set ?', info, (err,tool) => {
            if(err){
                res.json(err);
            }
            console.log(info);
            res.render('new-connection',{
                data:info
            });
        })
    })
});
  
    
    
  


router.post('/add_connection/:id',async (req,res)=>{
    const {id} = req.params;
    const tool = await Tool.findById(id);
    await Tool.updateOne({_id:id},{$push: {connections:{"description":req.body.description, "connection_number":req.body.connection_number, "thread_type": req.body.thread_type, "operation": req.body.operation, "target_torque":req.body.target_torque}}});
    res.render('new-connection',{
        tool
    });
   console.log(tool.connections);

});

router.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    await Tool.update( {_id : id}, req.body);
    res.redirect('/review');
});

router.get('/', (req,res) => {
    res.render('index');

});
router.get('/info',(req,res)=>{
    res.render('info');
});

router.get('/log-screen', (req,res) => {
    res.render('log-screen');
});

router.get('/new-job/', (req,res)=>{
    res.render('new-job');
});
router.get('/review', async(req,res)=>{
    req.getConnection((err, conn)=>{
        conn.query('SELECT * FROM tool', (err, tools) => {
            if (err){
                res.json(err);
            }
            
            res.render('review-job',{
                tools
            });
        });
    });
});

router.get('/print/:id', async (req,res)=>{

    const {id} = req.params;
    const tool = await Tool.findById(id);
    res.render('print-job',{
        tool
    });
});
router.get('/delete/:id', async (req,res)=>{
    const {id} = req.params;
    await Tool.remove({_id: id});
    res.redirect('/review');
});

router.get('/edit/:id',  (req,res) =>{
    const {id}  = req.params;
      req.getConnection((err,conn)=>{
         conn.query('SELECT * FROM tool WHERE id_tool = ?',[id], (err,tools)=>{
            if(err){
                res.json(err)
            }
             res.render('edit-job',{
                 tool: tools[0]
             });
            
         }) 
      })
});

router.get('/view-connections/:id', async (req,res)=>{
    const {id} = req.params;
    const tool = await Tool.findById(id);
    
    res.render('job-connections',{
        tool
    });

});

router.get('/log-connection/:id', async (req,res)=>{
    const {id} = req.params;
    const tool = await Tool.find({"connections._id": id},{connections:{$elemMatch: {_id: id}}});
    console.log(tool);
    res.render('log-connection', {
        tool
        });
    
});

router.post('/api', async (req,res)=>{
    console.log('I got a request');
    console.log(req.body);
    const d = req.body
    await Tool.updateOne({_id: d.tool_id, "connections._id":d.connection_id},{$set: {"connections.$.measured_torque": d.max_torque,"connections.$.serviced_on": new Date(), "connections.$.connection_status":true}})


    res.json({
        status: 'success',
        latitude: d.max_torque,
        
    });

}); 

router.get('/delete-connection/:id', async (req,res)=>{
    
    const {id} = req.params;
    await Tool.updateOne({}, {$pull:{connections:{_id:id}}});
    //regresa al URL anterior
    backURL=req.header('Referer') || '/';
    res.redirect(backURL);
    
});

router.get('/add_connection/:id', async (req,res)=>{
    const {id} = req.params;
    const tool = await Tool.findById(id);
    res.render('new-connection',{
        tool
    });

});

router.get('/edit-connection/:id', async (req,res)=>{
    const {id} = req.params;
    const tool = await Tool.find({"connections._id": id},{connections:{$elemMatch: {_id: id}}});
    console.log(tool);
    res.render('edit-connections', {
        tool
        });
});

router.post('/update-connection', (req,res)=>{
    
});

module.exports = router;
