require('dotenv').config();
const http = require('http');
const AWS = require("aws-sdk");
const { URLSearchParams } = require('url');
const respond = require('./responder');
const cron = require('node-cron');

AWS.config.update({region : 'ap-south-1'});

const rds = new AWS.RDS({ apiVersion: '2014-10-31' });
const port = process.env.PORT || 3000;
const defaultId = process.env.INSANCE_ID;

// scheduling CRON to stop the db in every 3 hours
cron.schedule('* 2 * * *', () => {
  console.log('[CRON JOB]: Execution at ' + new Date());
  toggleInstance(defaultId, 'stop')
    .then(data => console.log('success ', data))
    .catch(err => console.log('error ', err));
});

// create server for on-demand instance stop/start
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  const [path, query] = req.url.split('?');
  const id = new URLSearchParams(query).get('instanceId') || defaultId
  console.log(req.url, 'requested...');

  if(path === '/start') {
    toggleInstance(id, 'start')
      .then(data => respond.ok(res, data))
      .catch(err => respond.error(res, err));
  } else if (path === '/stop') {
    toggleInstance(id, 'stop')
      .then(data => respond.ok(res, data))
      .catch(err => respond.error(res, err));
  } else {
    respond.info(res);
  }
}).listen(port, () => console.log(`server start at port ${port}`));


const toggleInstance = (instanceId, action = 'stop') => new Promise((resolve, reject) => {
  console.log(`attempting to ${action} the db instance [id: ${instanceId}]`)
  if(!instanceId)
    return reject({ message: 'please provide instanceId of database' })
  
  const handler = action === 'stop' ? 'stopDBInstance' : 'startDBInstance' 
  rds[handler]({ DBInstanceIdentifier: instanceId }, (err, data) => {
    console.log(`action completed: ${ err || data }`)
    err ? reject(err) : resolve(data)    
  });
});
  