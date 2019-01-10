const express = require('express');
const resolve = require('path').resolve;

const app = express();
app.use(express.static(resolve(__dirname, 'public')));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
