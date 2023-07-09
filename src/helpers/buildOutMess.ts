import { EOutCommands } from '../models/commands';
import { OutData } from '../models/out'

export const buildOutMessage = (type: EOutCommands, data: OutData) => {
  return ({
    type,
    data: (JSON.stringify(data)),
    id: 0,
  })
}