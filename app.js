const express = require('express');

const app = express();

const items = [
  { id: 1, name: 'item1' },
  { id: 2, name: 'item2' },
];

const middleware1 = (req, res, next) => {
  console.log("doing stuff in middleware 1")
  next();
};

const middleware2 = (req, res, next) => {
  console.log("doing stuff in middleware 2")
  next();
};

/*
const extractUserName = (req, res, next) => {
  req.userName = req.query.name;
  next();
}
*/

const extractUserName = (req, res, next) => {
  if(req.query.name) {
    req.userName = req.query.name;
    next();
  } else {
    res.status(400).send('You have to specify a name query parameter')
  }
}

const handleError = (err, req, res, next) => {
  console.error(err);
  res.status(500).send('error in server');
};

//app.use(middleware2);
//app.use(middleware1);



app.get('/myroute', middleware1, middleware2, (req, res) => {
  console.log('handling /myroute');
  res.send(items);
});

app.get('/hello', extractUserName, (req, res) => {
  console.log('handling /hello');
  res.send(`Hello, ${req.userName}`);
});

app.get('/syncError', (req, res) => {
  throw new Error('Boom!')
});

app.get('/asyncError', (req, res) => {
  setTimeout(() => {
    throw new Error('Boom! async')
  }, 1000);
})

app.use(handleError);


app.listen(5000, () => console.log('server listening on port 5000'));
