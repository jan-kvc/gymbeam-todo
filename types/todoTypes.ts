export type TodoList = {
  id?: string;
  userId?: string;
  name?: string;
  items?: TodoItem[];
};

export type TodoItem = {
  id?: string;
  text?: string;
  completed?: boolean;
  priority?: boolean;
};
