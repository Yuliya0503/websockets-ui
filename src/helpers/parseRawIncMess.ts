import { IIncomingMessage } from '../models/inCommands';

export const parseRawIncommingMessage = (message: string) => {
  try {
    const { data: rawData, ...restMessage } = JSON.parse(message);
    const data = rawData === '' ? rawData : JSON.parse(rawData);
    return {
      ...restMessage,
      data,
    } as IIncomingMessage;
  } catch (error) {
    console.error(error);
    return null;
  }
};
