import { useEffect, useRef, useState } from "react";

import "./App.css";
import wsService from "./socket";
import { IUserCalling } from "./types/user.calling.types";

import { Flex, Table } from "antd";
import Loader from "./components/Loader";

import { agentMap } from "./lib/agents";

const USER_NUMBER = "8554887572";

function buildUserDetailsTable(userCallingData: IUserCalling[]) {
  let dataSource = userCallingData.map((userCalling, ind) => {
    return {
      key: ind,
      name: userCalling.userDetails?.name,
      phone: userCalling.userNumber,
      persona: userCalling.userDetails?.personaAssigned,
      agent: agentMap.get(userCalling.agentNumber)?.name || "Unknown",
      callTime: userCalling.timeStamp,
    };
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "User Persona",
      dataIndex: "persona",
      key: "persona",
    },
    {
      title: "Agent",
      dataIndex: "agent",
      key: "agent",
    },
    {
      title: "Time of call",
      dataIndex: "callTime",
      key: "callTime",
    },
  ];

  return <Table dataSource={dataSource} columns={columns} pagination={false} />;
}

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
      {buildUserDetailsTable(userCallingData)}
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
      setMessage(createComponentOutOfUserCallingData(userCallingData, false));
    }
  }, [userCallingData]);

  if (userCallingData === null) {
    return <Loader />;
  }

  return <div className="App">{message}</div>;
}

export default App;
