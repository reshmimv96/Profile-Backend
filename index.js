// server.js
 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
 
app.use(bodyParser.json());
 
// Middleware to allow cross-origin requests (important for React and Node to talk)
app.use(cors());
 
// Middleware to parse JSON requests
app.use(express.json());

// MongoDB Connection
const mongoURI = 'mongodb+srv://reshmivijayan2017:yMmOiOFBBIcVkbx3@cluster0.od8qm.mongodb.net/';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// mongoose.connection.on('error', err => {   console.error('Detailed Error:', err); });

// Schema and Model
const ItemSchema = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
});
const Item = mongoose.model('Item', ItemSchema);



// Routes

  
  app.post('/api/sendmail', async (req, res) => {
    try {
      const newItem = new Item({ email: req.body.formData.email, name: req.body.formData.name, subject: req.body.formData.subject, message: req.body.formData.message });
      await newItem.save();
      res.json(newItem);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }); 

// Create a route to fetch data
app.get("/api/getmail", async (req, res) => {
    try {
      const items = await Item.find(); // Fetch data from the database
      console.log(items);
      res.json(items); // Send the data to the frontend
    } catch (error) {
      res.status(500).send(error.message);
    }
  });


// Create a route to edit data
app.put("/api/update/:id", async (req, res) => {
    try {
        const { id } = req.params; // The ID of the document to editconst
        console.log(id);
        if (!mongoose.Types.ObjectId.isValid(id)) {     console.log("invalid id"); }
        const updateData = req.body; // Data to update, sent in the request body//     
        // const collection = db.collection('items');  // Update the document
        // const result = await Item.findByIdAndUpdate({id}, {updateData},{new: true});

        const { name, email,subject,message} = req.body.formData;
        console.log(req.params.id);

        const updatedItem = await Item.findByIdAndUpdate(

            req.params.id,
            { name, email,subject,message },
            { new: true }
        );
        res.json(updatedItem);

            // if (result.modifiedCount === 1) {    
            //    res.status(200).send({ message: 'Document updated successfully' });  
            //    } 
            //    else {    
            //        res.status(404).send({ message: 'Document not found or no changes made' });   
            //     } 
        }
        catch (error) {
             console.error('Error updating document:', error); 
             res.status(500).send({ message: 'Internal Server Error' }); 
            }
        

  });


  app.delete('/api/delete/:id', async (req, res) => {
    console.log('Delete request received for ID:', req.params.id);
    try {
      const { id } = req.params;
  
      // Validate the ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
  
      // Find and delete the document
      const deletedEmployee = await Item.findByIdAndDelete(id);
      if (!deletedEmployee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      res.status(200).json({ message: 'Employee deleted successfully', data: deletedEmployee });
    } catch (error) {
      console.error('Error deleting employee:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  });
  

// Simple API route to test
// app.post('/api/sendmail', (req, res) => {
//   const {name,subject,emai,message} =req.body.formData;
//   console.log(name);
//   res.json({ message: 'Hello from Node.js Backend!' });
// });
 
// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});