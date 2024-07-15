import { TodoList } from "./todoTypes";

export type User = {
  id?: string;
  clerkId?: string;
  name?: string;
  lists?: TodoList[];
};
