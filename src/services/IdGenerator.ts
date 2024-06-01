import { v4 } from "uuid";

export class IdGenerator {
  gerate = (): string => {
    return v4();
  };
}