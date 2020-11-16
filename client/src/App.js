import { Button, notification } from "antd";
import "./App.css";
import "antd/dist/antd.css";

const serviceCheck = () => {
  if (!navigator.serviceWorker) {
    return false;
  }
  if (!window.PushManager) {
    return false;
  }
  return true;
};

const isDocumentVisible = () => {
  return !document.hidden;
};

const handleNotification = (data, sw) => {
  const doc = isDocumentVisible();
  if (doc) {
    console.log(data);
  } else {
    sw.postMessage({
      type: "SHOW_NOTIFICATION",
      data: data,
    });
  }
};

const registerServiceWorker = async () => {
  const swRegistration = await navigator.serviceWorker.register("sw.js", {
    scope: "http://localhost:3000/pn-cloud-messaging-push-scope",
  });
  if (swRegistration) {
    swRegistration.addEventListener("updatefound", () => {
      if (swRegistration.installing) {
        const channel = new MessageChannel();

        swRegistration.installing.addEventListener("statechange", (ev) => {
          const currentState = ev.target.state;
          if (currentState === "activated") {
            swRegistration.active.postMessage(
              {
                type: "INIT_PORT",
              },
              [channel.port2]
            );
            channel.port1.onmessage = (event) => {
              handleNotification(event.data, swRegistration.active);
            };
          }
        });
      }
    });
  }

  return swRegistration;
};

const notificationPermissionCheck = async () => {
  const permission = await window.Notification.requestPermission();
  if (permission !== "granted") {
    return undefined;
  }
  return permission;
};

const notificationSetup = async (e) => {
  const isServicesAvailable = serviceCheck();
  if (isServicesAvailable) {
    const permission = await notificationPermissionCheck();

    if (!permission) {
      notification.open({
        key: "Notification",
        message: "Notification Permission Rejected",
        description: "description.",
      });
    } else {
      const serviceWorker = await registerServiceWorker();

      if (!serviceWorker) {
        console.log("PROBLEM IN SERVICE WORKER");
      }
    }
  }
};

const sendNotification = async () => {
  const SERVER_URL = "http://localhost:4000/pn/send-notification";
  const response = await fetch(SERVER_URL, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

function App(props) {
  return [
    <Button onClick={notificationSetup}>Notification</Button>,
    <Button onClick={sendNotification}>Send Notification</Button>,
  ];
}

export default App;
