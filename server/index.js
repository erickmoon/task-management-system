const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = 5001;

app.use(bodyParser.json());
app.use(cors());

// Database connection
const sequelize = new Sequelize('task_management', 'admin', 'pass', {
  host: 'localhost',
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: true,
      trustServerCertificate: true, // if using self-signed certificates
    }
  }
});

// Define Task model
const Task = sequelize.define('Task', {
  issue: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  assignee: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  complainantEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  trackingNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true
});

// Define SMTPSettings model
const SMTPSettings = sequelize.define('SMTPSettings', {
  host: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  port: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelize.sync();

// Route to get SMTP settings
app.get('/smtp-settings', async (req, res) => {
  try {
    const settings = await SMTPSettings.findOne();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// Route to save SMTP settings
app.post('/smtp-settings', async (req, res) => {
  const { host, port, user, password } = req.body;
  try {
    let settings = await SMTPSettings.findOne();
    if (settings) {
      settings.host = host;
      settings.port = port;
      settings.user = user;
      settings.password = password;
      await settings.save();
    } else {
      settings = await SMTPSettings.create({ host, port, user, password });
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// Route to log a task
app.post('/tasks', async (req, res) => {
  const { issue, category, assignee, complainantEmail } = req.body;
  const trackingNumber = Math.floor(Math.random() * 1000000);

  try {
    const task = await Task.create({
      issue,
      category,
      assignee,
      complainantEmail,
      trackingNumber,
    });

    const settings = await SMTPSettings.findOne();

    if (settings) {
      const transporter = nodemailer.createTransport({
        host: settings.host,
        port: settings.port,
        auth: {
          user: settings.user,
          pass: settings.password,
        },
      });

      const mailOptions = {
        from: settings.user,
        to: complainantEmail,
        subject: 'New Task Logged',
        text: `A new task has been logged: ${issue}\nTracking Number: ${trackingNumber}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).send(error.toString());
        }
        res.status(200).send({ message: 'Task logged successfully and email sent', trackingNumber });
      });
    } else {
      res.status(500).send('SMTP settings not configured');
    }
  } catch (error) {
    console.error('Error logging task:', error);
    res.status(500).send(error.toString());
  }
});

// Route to fetch all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// Route to delete a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.destroy({ where: { id: req.params.id } });
    res.status(200).send('Task deleted successfully');
  } catch (error) {
    res.status(500).send(error.toString());
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
