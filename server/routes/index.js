const app = require("../app");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const webpush = require("web-push");

const dummyDb = { subscription: null }; //dummy in memory store

app.use(cors());
app.use(bodyParser.json());

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname + "/../templates/index.html"));
});

const saveToDatabase = async (subscription) => {
  // Since this is a demo app, I am going to save this in a dummy in memory store. Do not do this in your apps.
  // Here you should be writing your db logic to save it.
  dummyDb.subscription = subscription;
};
// The new /save-subscription endpoint
app.post("/pn/save-subscription", async (req, res) => {
  const subscription = req.body;
  await saveToDatabase(subscription); //Method to save the subscription to Database
  res.json({ message: "success" });
});

//function to send the notification to the subscribed device
const sendNotification = (subscription, dataToSend) => {
  const vapidKeys = {
    subject: "mailto:ch.email.456@gmail.com",
    publicKey:
      "BCAwPxmR7KGn17T1XVVJNXSwJP0zcI5XwqkIterBKXnyggZEHYF_ufYAysYz7ovny_rMKLOWeSRQmp1-tMcWbf0",
    privateKey: "P-y6TM_S_s0Pf4LDqPgeE9P9AXdd1K4MC5i5SfjjdDg",
  };

  webpush.setVapidDetails(
    vapidKeys.subject,
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );
  webpush.sendNotification(subscription, dataToSend);
};

//route to test send notification
app.post("/pn/send-notification", (req, res) => {
  const subscription = dummyDb.subscription; //get subscription from your databse here.
  const message = "Hello World";
  sendNotification(subscription, message);
  res.json({ message: "message sent" });
});
