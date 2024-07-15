import { deleteTodoAction, updateTodoAction } from "@/lib/todosActions";
import { cn, getListIdByListName } from "@/lib/utils";
import type { TodoItem, TodoList } from "@/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import CheckIcon from "../icons/CheckIcon";
import EditIcon from "../icons/EditIcon";
import TrashIcon from "../icons/TrashIcon";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import { useUserDatabaseId } from "../UserDatabaseIdProvider";

export default function TodoItem({
  todoItem,
  allItems,
  allLists,
  changeItems,
  pendingTransition,
  startTransition,
}: {
  todoItem: TodoItem;
  allItems: TodoItem[];
  allLists: TodoList[];
  changeItems: (newItems: TodoItem[]) => void;
  pendingTransition: boolean;
  startTransition: (callback: () => Promise<void>) => void;
}) {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const listName = searchParams.get("list");
  const { userDatabaseId } = useUserDatabaseId();
  const listId = useMemo(
    () => getListIdByListName(allLists, listName || ""),
    [allLists, listName]
  );
  const [isEditing, setIsEditing] = useState(false);

  const [newTodo, setNewTodo] = useState(todoItem);

  useEffect(() => {
    setNewTodo(todoItem);
  }, [todoItem, isEditing]);

  if (!todoItem) return null;

  async function handleDelete() {
    const itemsWithDeletedTodo = allItems.filter(
      (item) => item.text !== todoItem.text
    );

    changeItems([...itemsWithDeletedTodo]);

    const state = await deleteTodoAction(
      userDatabaseId!,
      todoItem,
      allItems,
      listId!
    );
    if (state.status === "success") {
      toast({
        title: "Success",
        description: "Todo deleted successfully",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error occurred",
        description: "Error deleting todo, please try again later",
      });
    }
  }

  async function handleEdit() {
    setIsEditing(false);

    const editedItems = allItems.map((item) =>
      item.text === todoItem.text ? newTodo : item
    );
    changeItems([...editedItems]);

    const state = await updateTodoAction(userDatabaseId!, editedItems, listId!);
    if (state.status === "success") {
      toast({
        title: "Success",
        description: "Todo edited successfully",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error occurred",
        description: "Error editing todo, please try again later",
      });
    }
  }

  async function handleComplete() {
    const editedItems = allItems.map((item) =>
      item.text === todoItem.text
        ? {
            ...item,
            completed: !item.completed,
          }
        : item
    );

    changeItems([...editedItems]);

    const state = await updateTodoAction(userDatabaseId!, editedItems, listId!);
    if (state.status === "success") {
      toast({
        title: "Success",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error occurred",
      });
    }
  }

  async function handlePriorityChange() {
    const editedItems = allItems.map((item) =>
      item.text === todoItem.text
        ? {
            ...item,
            priority: !item.priority,
          }
        : item
    );

    changeItems([...editedItems]);

    const state = await updateTodoAction(userDatabaseId!, editedItems, listId!);
    if (state.status === "success") {
      toast({
        title: "Successfully changed priority",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error occurred while changing priority",
      });
    }
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 justify-between rounded-md bg-background p-3 shadow-sm",
        {
          " border border-transparent hover:border-border": !todoItem.priority,
        },
        { "border-2 border-destructive": todoItem.priority }
      )}
    >
      <div className="flex items-center gap-3 w-full">
        <Checkbox
          id={todoItem.id}
          checked={todoItem.completed}
          disabled={pendingTransition}
          onClick={() => startTransition(async () => handleComplete())}
        />
        <Input
          disabled={!isEditing}
          value={newTodo.text}
          onChange={(e) =>
            setNewTodo({
              ...newTodo,
              text: e.target.value,
            })
          }
          // htmlFor={todoItem.id}
          className={cn("text-md font-medium disabled:opacity-100", {
            "line-through": todoItem.completed,
            "border-none": !isEditing,
          })}
        />
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="outline">tags</Badge>
        <Button
          disabled={pendingTransition}
          size="icon"
          variant="ghost"
          onClick={() => startTransition(async () => handlePriorityChange())}
        >
          <div className=" text-primary rounded-full w-5 h-5 flex items-center justify-center font-bold text-2xl">
            !
          </div>
          <span className="sr-only">Change priority</span>
        </Button>
        <Button
          disabled={pendingTransition}
          size="icon"
          variant="ghost"
          onClick={() => {
            return isEditing
              ? startTransition(async () => handleEdit())
              : setIsEditing(!isEditing);
          }}
        >
          {isEditing ? (
            <CheckIcon className="h-6 w-6" />
          ) : (
            <EditIcon className="h-4 w-4" />
          )}
          <span className="sr-only">
            {isEditing ? "confirm edit" : "edit item"}
          </span>
        </Button>

        <Button
          disabled={pendingTransition}
          size="icon"
          variant="ghost"
          onClick={() => startTransition(async () => handleDelete())}
        >
          <TrashIcon className="h-4 w-4" />
          <span className="sr-only">Delete item</span>
        </Button>
      </div>
    </div>
  );
}
