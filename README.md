# DB Instance Toggler

## About
A mini nodeapp to Start/Stop DB on demand as well as setup scheduled instance stop cron.

## Running the app

### Pre-requisites
- Nodejs v10+
- AWS account with sufficient IAM access to perform RDS actions
- Instance id of the target RDS instance and region

### Setting up environment variables
Create a file `.env` on your system and copy the contents of `.env.sample` file in it. Replace values with your actual credentials and region.

### Run the app
After installing nodejs, and adding your AWS secret key and secret id you can run the app locally by:

```
npm install
npm start
```

## Using the app

### APIs

You can hit following routes:
- Start the instance: `localhosts:3000/start?instanceId=your_rds_instance_id`
- Stop the instance: `localhosts:3000/stop?instanceId=your_rds_instance_id`

If you don't pass instanceId in query parameter, the app will take id from env variable.

### Configuring CRON to auto shut RDS instance
This app is using [node-cron](https://www.npmjs.com/package/node-cron) to run db turn off task.
Currently the cron runs in every 2 hours as per the set pattern in `index.js` file.

You can read more about the cron syntax [here](https://www.npmjs.com/package/node-cron#cron-syntax) and update it as per your needs.