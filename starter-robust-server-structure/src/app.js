const express = require("express");
const app = express();
const flips=require("./data/flips-data");
const counts=require("./data/counts-data")


app.use(express.json())

// TODO: Follow instructions in the checkpoint to implement ths API.

app.use("/counts/:countId", (req, res, next) => {
  const { countId } = req.params;
  const foundCount = counts[countId];

  if (foundCount === undefined) {
    next(`Count id not found: ${countId}`);
  } else {
    res.json({ data: foundCount }); // Return a JSON object, not a number.
  }
});

app.use("/counts",(req,res)=>{
  res.json({data:counts});
});

app.use("/flips/:flipId", (req, res, next) => {
  const { flipId } = req.params;
  const foundFlip = flips.find((flip) => flip.id === Number(flipId));

  if (foundFlip) {
    res.json({ data: foundFlip });
  } else {
    next(`Flip id not found: ${flipId}`);
  }
});


// app.use("/flips",(req,res)=>{
//   res.json({data:flips});
// }) replace with:

   app.get("/flips", (req, res) => {
    res.json({ data: flips });
  });
  
  let lastFlipId = flips.reduce((maxId, flip) => Math.max(maxId, flip.id), 0);

  app.post("/flips", (req, res, next) => {
    const { data: { result } = {} } = req.body;
    if (result) {
    const newFlip = {
      id: ++lastFlipId, // Increment last id then assign as the current ID
      result,
    };
    flips.push(newFlip);
    counts[result] = counts[result] + 1; // Increment the counts
    // res.json({ data: newFlip });
    res.status(201).json({ data: newFlip });
  } else {
       res.sendStatus(400);
     }
  });


// Not found handler
app.use((req, res, next) => {
  next(`Not found: ${request.originalUrl}`)
})


// Error handler
app.use((error, request, response, next) => {
  console.error(error);
  response.send(error);
});

module.exports = app;
