const express = require('express');
const app = express();

const methodOverride = require('method-override');
const pageRoutes = require('./routes/pageRoutes');
const materialRoutes = require('./routes/MaterialRoutes');

// middlewares
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use('/', pageRoutes);
app.use('/material', materialRoutes);

app.listen(5000, () => console.log(`Server started on port 5000`));