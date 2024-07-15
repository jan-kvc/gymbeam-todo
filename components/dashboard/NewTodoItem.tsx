import { addNewTodoAction } from "@/lib/todosActions";
import { getListIdByListName } from "@/lib/utils";
import { TodoItem, TodoList } from "@/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFormState } from "react-dom";
import EnterIcon from "../icons/EnterIcon";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import { useUserDatabaseId } from "../UserDatabaseIdProvider";

export default function NewTodoItem({
  lists,
  addNewTodo,
  allItems,
}: {
  lists: TodoList[];
  addNewTodo: (todo: TodoItem) => void;
  allItems: TodoItem[];
}) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const { userDatabaseId } = useUserDatabaseId();
  const [state, formAction] = useFormState(addNewTodoAction, {
    status: "",
    message: "",
  });
  const searchParams = useSearchParams();
  const listName = searchParams.get("list");

  const listId = useMemo(
    () => getListIdByListName(lists, listName || ""),
    [lists, listName]
  );

  useEffect(() => {
    if (state.status === "success") {
      toast({
        title: "Success",
        description: state.message,
      });
      setPending(false);
    } else if (state.status === "error") {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: state.message,
      });
      setPending(false);
    }
  }, [state]);

  useEffect(() => {
    if (!pending && inputRef.current) {
      inputRef.current.focus();
    }
  }, [pending]);

  return (
    <form
      onSubmit={async (e) => {
        setPending(true);
      }}
      action={async (formData: FormData) => {
        if (pending) return;

        const todo = formData.get("todo") as string;

        if (!todo) {
          return;
        }

        formRef?.current?.reset();

        addNewTodo({ text: todo, completed: false, priority: false });

        formData.append("userId", userDatabaseId || "");
        formData.append("listId", listId || "");
        formData.append("allItems", JSON.stringify(allItems));

        formAction(formData);
      }}
      ref={formRef}
    >
      <div className="group relative w-full h-16 flex items-center justify-between rounded-md bg-background shadow-sm border border-border">
        <Input
          ref={inputRef}
          autoFocus
          disabled={pending}
          id={"todo"}
          name={"todo"}
          placeholder={"Add new todo"}
          className={"w-full h-full rounded-md p-3 pr-16 pl-8 text-lg"}
        />
        <button
          type="submit"
          disabled={pending}
          className="flex items-center absolute right-4"
        >
          <EnterIcon className="w-8 h-8  text-muted-foreground group-focus-within:text-foreground" />
        </button>
      </div>
    </form>
  );
}
