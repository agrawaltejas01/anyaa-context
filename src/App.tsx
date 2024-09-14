import { useEffect, useRef, useState } from "react";

import "./App.css";
import wsService from "./socket";
import { IUserCalling } from "./types/user.calling.types";

import { Flex, Switch } from "antd";
import Loader from "./components/Loader";

const USER_NUMBER = "08554887572";

function createComponentOutOfUserCallingData(
  userCallingData: IUserCalling[],
  showOnlyUser: boolean = false
): JSX.Element {
  // Sort the data based on the timestamp
  userCallingData = userCallingData.sort((a, b) => {
    let aTime = new Date(a.timeStamp);
    let bTime = new Date(b.timeStamp);
    return aTime.getTime() - bTime.getTime();
  });

  if (showOnlyUser) {
    userCallingData = userCallingData.filter((userCalling) => {
      return userCalling.agentNumber === USER_NUMBER;
    });
  }

  return (
    <Flex flex={1} vertical gap={10} style={{ color: "white" }}>
      {userCallingData.map((userCalling) => {
        return (
          <Flex flex={1} gap={10}>
            <span> User - {userCalling.userNumber} </span>
            <span> Time - {userCalling.timeStamp} </span>
            <span> Agent - {userCalling.agentNumber} </span>
          </Flex>
        );
      })}
    </Flex>
  );
}

function App() {
  const [userCallingData, setUserCallingData] = useState<IUserCalling[] | null>(
    null
  );
  const [message, setMessage] = useState<JSX.Element | null>(null);
  const refresh = useRef(false);

  useEffect(() => {
    console.log("Being called");

    wsService.initialize(USER_NUMBER);

    wsService.addMessageEventListener((event) => {
      console.log("Message received from WS server");

      refresh.current = false;
      let jsonValue = JSON.parse(event.data);
      setUserCallingData(jsonValue as IUserCalling[]);
      refresh.current = true;
    });
  }, []);

  useEffect(() => {
    if (userCallingData && userCallingData.length) {
      setMessage(createComponentOutOfUserCallingData(userCallingData, true));
    }
  }, [userCallingData]);

  if (userCallingData === null) {
    return <Loader />;
  }

  return (
    <div className="App">
      <Switch
        checkedChildren="Show mine"
        unCheckedChildren="Show all"
        defaultChecked
        onChange={(checked) => {
          setMessage(
            createComponentOutOfUserCallingData(userCallingData, checked)
          );
        }}
      />
      <p>{message}</p>
    </div>
  );
}

export default App;
