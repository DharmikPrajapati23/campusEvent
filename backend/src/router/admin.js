const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const Webinar = require('../model/webinar');
const User = require('../model/register');
const Query = require('../model/query');

const adminRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage }).fields([
  { name: 'image', maxCount: 1 },
  { name: 'expert_image', maxCount: 1 }
]);

const SECRET_KEY = "Dharmik";

// Add Webinar POST route
adminRouter.post('/addwebinar', upload, async (req, res) => {
  try {
    const {
      title,
      beginning_date,
      end_date,
      venue,
      mode,
      expert,
      expert_experience,
      duration,
      price,
      description,
      part1,
      part2,
      part3,
      specialref,
      discount,
      secret_key
    } = req.body;

    if (secret_key !== SECRET_KEY) {
      return res.status(401).json({ error: 'Unauthorized: Invalid secret key' });
    }

    const newWebinar = new Webinar({
      title,
      beginning_date,
      end_date,
      venue,
      mode,
      expert,
      expert_experience,
      duration,
      price,
      description,
      part1,
      part2,
      part3,
      specialref,
      discount,
      image: {
        data: req.files['image'][0].buffer,
        contentType: req.files['image'][0].mimetype
      },
      expert_image: {
        data: req.files['expert_image'][0].buffer,
        contentType: req.files['expert_image'][0].mimetype
      }
    });

    await newWebinar.save();
    res.status(201).json({ message: 'Webinar added successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add webinar.' });
  }
});



// Display All Webinar
adminRouter.get('/webinar', async (req, res) => {
  try {
    const webinars = await Webinar.find({}); // exclude large binary data for listing
    res.status(200).json(webinars);
  } catch (error) {
    console.error('Error fetching webinars:', error);
    res.status(500).json({ error: 'Failed to fetch webinars' });
  }
});


// GET: All webinar speakers (only specific fields)
adminRouter.get('/speakers', async (req, res) => {
  try {
    // Fetch all webinars
    const webinars = await Webinar.find({})
      .select('expert expert_experience expert_image') // Select only the required fields
      .exec(); // Explicitly execute the query

    res.status(200).json(webinars);
  } catch (err) {
    console.error('Error fetching speakers:', err);
    res.status(500).json({ error: 'Failed to fetch speaker data' });
  }
});



// GET: All webinar Agenda (only specific fields)
adminRouter.get('/agenda', async (req, res) => {
  try {
    // Fetch all webinars
    const webinars = await Webinar.find({})
      .select('title part1 part2 part3')
      .exec(); 

    res.status(200).json(webinars);
  } catch (err) {
    console.error('Error fetching agenda:', err);
    res.status(500).json({ error: 'Failed to fetch Agenda data' });
  }
});


// GET: All webinar Seminar (only specific fields)
adminRouter.get('/seminar', async (req, res) => {
  try {
    // Fetch all webinars
    const webinars = await Webinar.find({})
      .select('title expert beginning_date end_date duration venue mode price image') // Select only the required fields
      .exec(); // Explicitly execute the query

    // const webinars = await Webinar.find()
    console.log(webinars)
      

    res.status(200).json(webinars);
  } catch (err) {
    console.error('Error fetching Seminar:', err);
    res.status(500).json({ error: 'Failed to fetch Seminar data' });
  }
});



//Edit Webinar
adminRouter.put('/editwebinar/:id', upload, async (req, res) => {
  try {
    const {
      title,
      beginning_date,
      end_date,
      venue,
      mode,
      expert,
      expert_experience,
      duration,
      price,
      description,
      part1,
      part2,
      part3,
      specialref,
      discount,
      secret_key
    } = req.body;

    if (secret_key !== SECRET_KEY) {
      return res.status(401).json({ error: 'Unauthorized: Invalid secret key' });
    }

    const webinarId = req.params.id;

    const updateData = {
      title,
      beginning_date,
      end_date,
      venue,
      mode,
      expert,
      expert_experience,
      duration,
      price,
      description,
      part1,
      part2,
      part3,
      specialref,
      discount
    };

    if (req.files['image']) {
      updateData.image = {
        data: req.files['image'][0].buffer,
        contentType: req.files['image'][0].mimetype
      };
    }

    if (req.files['expert_image']) {
      updateData.expert_image = {
        data: req.files['expert_image'][0].buffer,
        contentType: req.files['expert_image'][0].mimetype
      };
    }

    const updatedWebinar = await Webinar.findByIdAndUpdate(webinarId, updateData, { new: true });

    if (!updatedWebinar) {
      return res.status(404).json({ error: 'Webinar not found' });
    }

    res.status(200).json({ message: 'Webinar updated successfully', updatedWebinar });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update webinar.' });
  }
});


// Delete Webinar
adminRouter.delete('/deletewebinar/:id', async (req, res) => {
  try {
    const { secret_key } = req.body;

    if (secret_key !== SECRET_KEY) {
      return res.status(401).json({ error: 'Unauthorized: Invalid secret key' });
    }

    const webinarId = req.params.id;
    const deletedWebinar = await Webinar.findByIdAndDelete(webinarId);

    if (!deletedWebinar) {
      return res.status(404).json({ error: 'Webinar not found' });
    }

    res.status(200).json({ message: 'Webinar deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete webinar.' });
  }
});


// POST: Add a new query
adminRouter.post('/query', async (req, res) => {
  try {
    const { name, mail, message } = req.body;

    // Basic validation
    if (!name || !mail || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newQuery = new Query({ name, mail, message });
    await newQuery.save();

    res.status(201).json({ success: true, message: 'Query submitted successfully.' });
  } catch (err) {
    console.error('Error saving query:', err);
    res.status(500).json({ error: 'Failed to submit query.' });
  }
});



//++++++++++++++++++++++++++++++++++++++++
//For Event
adminRouter.get('/getevent', async (req, res) => {
  try {
    // Fetch all webinars
    const data = await Webinar.find({})
      .select('price specialref title discount') // Select only the required fields
      .exec(); // Explicitly execute the query

    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching Seminar:', err);
    res.status(500).json({ error: 'Failed to fetch Seminar data' });
  }
});
//++++++++++++++++++++++++++++++++++++++++




adminRouter.get('/user', async (req, res) => {
  try {
    // Fetch all webinars
    const webinars = await Webinar.find({})
      .select('eventName  firstName lastName mobileNo email') // Select only the required fields
      .exec(); // Explicitly execute the query

    res.status(200).json(webinars);
  } catch (err) {
    console.error('Error fetching Users:', err);
    res.status(500).json({ error: 'Failed to fetch User data' });
  }
});


// Required libraries
const XLSX = require("xlsx");
const fs = require("fs");


adminRouter.get("/download-user-event-excel", async (req, res) => {
  try {
    const allUsers = await User.find({});

    // Group users by event name
    const eventGroups = {};
    allUsers.forEach(user => {
      const event = user.eventName?.trim() || "Unknown_Event";

      if (!eventGroups[event]) {
        eventGroups[event] = [];
      }

      eventGroups[event].push({
        Event: event,
        Name: `${user.firstName} ${user.lastName}`,
        Mobile: user.mobileNo,
        Email: user.email,
        RegisteredAt: new Date(user.createdAt).toLocaleString()
      });
    });

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    Object.entries(eventGroups).forEach(([eventName, users]) => {
      // Sanitize sheet name (Excel restricts some characters)
      const safeSheetName = eventName.replace(/[/\\?*[\]:]/g, "_").slice(0, 31); // Excel sheet name max length = 31

      const worksheet = XLSX.utils.json_to_sheet(users);
      XLSX.utils.book_append_sheet(workbook, worksheet, safeSheetName);
    });

    // Generate the Excel buffer
    const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Set headers for download
    res.setHeader("Content-Disposition", "attachment; filename=eventwise_users.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    res.send(excelBuffer);
  } catch (err) {
    console.error("Failed to create Excel:", err);
    res.status(500).json({ error: "Failed to generate Excel file" });
  }
});





// adminRouter.get("/download-user-event-excel", async (req, res) => {
//   try {
//     const allUsers = await UserData.find({});

//     // Group users by event name
//     const eventGroups = {};
//     allUsers.forEach(user => {
//       const event = user.eventName || "Unknown Event";
//       if (!eventGroups[event]) eventGroups[event] = [];

//       eventGroups[event].push({
//         Event: user.eventName,
//         Name: `${user.firstName} ${user.lastName}`,
//         Mobile: user.mobileNo,
//         Email: user.email,
//         // Referral: user.referalCodeUserEnter || "",
//         // GeneratedCode: user.referalcodeUserGenerated || "",
//         RegisteredAt: new Date(user.createdAt).toLocaleString()
//       });
//     });

//     // Create a workbook in memory
//     const workbook = XLSX.utils.book_new();
//     for (const event in eventGroups) {
//       const worksheet = XLSX.utils.json_to_sheet(eventGroups[event]);
//       XLSX.utils.book_append_sheet(workbook, worksheet, event);
//     }

//     // Write the workbook to buffer
//     const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

//     // Set headers to prompt download
//     res.setHeader("Content-Disposition", "attachment; filename=eventwise_users.xlsx");
//     res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

//     res.send(excelBuffer);
//   } catch (err) {
//     console.error("Failed to create Excel:", err);
//     res.status(500).json({ error: "Failed to generate Excel file" });
//   }
// });



module.exports = adminRouter;