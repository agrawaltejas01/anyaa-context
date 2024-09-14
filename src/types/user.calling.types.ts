export interface IUserCalling {
  userNumber: string;
  timeStamp: string;
  agentNumber: string;
  userDetails: {
    phone: string;
    name: string;
    personaAssigned: string;
    id: string;
  } | null;
}
