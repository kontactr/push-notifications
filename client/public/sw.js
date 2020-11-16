// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option
let communicationPort = null;

const urlB64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const getNotificationObject = () => {
  return {
    applicationServerKey:
      "BCAwPxmR7KGn17T1XVVJNXSwJP0zcI5XwqkIterBKXnyggZEHYF_ufYAysYz7ovny_rMKLOWeSRQmp1-tMcWbf0",
    userVisibleOnly: true,
  };
};

const registerToServer = async (subscription) => {
  const SERVER_URL = "http://localhost:4000/pn/save-subscription";
  const response = await fetch(SERVER_URL, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });
  return response.json();
};

self.addEventListener("activate", async () => {
  try {
    const options = getNotificationObject();
    const subscription = await self.registration.pushManager.subscribe(options);
    console.log(subscription, 40);
    await registerToServer(subscription);
  } catch (err) {
    console.log("PUSH REGISTRATION ERROR", err);
  }
});

self.addEventListener("push", function (event) {
  if (event.data) {
    const q = event.data.text();
    console.log("Push event!! ");
    communicationPort && communicationPort.postMessage({ data: q });
  } else {
    console.log("Push event but no data");
  }
});

self.addEventListener("fetch", console.log);

self.addEventListener("message", (event) => {
  //console.log("FIRED", event.ports);
  if (event.data && event.data.type === "INIT_PORT") {
    communicationPort = event.ports[0];
  }
  if (event.data && event.data.type === "SHOW_NOTIFICATION") {
    return event.waitUntil(self.registration.showNotification("Title"));
  }
});
