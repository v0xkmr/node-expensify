const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { expense } = require('./routes/expense');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/expense', expense);

mongoose.connect(`mongodb+srv://vijay:vijay@mongocluster-bjhe8.mongodb.net/exxpense?retryWrites=true`)
    .then(() => { console.log('Connected to MongoDB') })
    .catch((err) => { console.log(err) });

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
