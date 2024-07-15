"use client";

import { SignedIn } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { memo, useEffect, useOptimistic, useTransition } from "react";
import { TodoItem as TodoItemType, TodoList, User } from "../../types";
import AddNewListDialog from "../dialogs/AddNewListDialog";
import Footer from "../Footer";
import Header from "../Header";
import { MobileMenuProvider } from "../MobileMenuContext";
import { useUserDatabaseId } from "../UserDatabaseIdProvider";
import ListItem from "./ListItem";
import NewTodoItem from "./NewTodoItem";
import TodoItem from "./TodoItem";

const PriorityTodoItems = memo(function PriorityTodoItems({
  items,
  allItems,
  allLists,
  changeItems,
  startTransition,
  pendingTransition,
}: {
  items: TodoItemType[];
  allItems: TodoItemType[];
  allLists: TodoList[];
  changeItems: (newItems: TodoItemType[]) => void;
  startTransition: (callback: () => Promise<void>) => void;
  pendingTransition: boolean;
}) {
  if (!items || items.length == 0) return null;
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Priority</span>
        <span className="text-sm text-muted-foreground">2 tasks</span>
      </div>

      {items.map((item, index) => (
        <TodoItem
          startTransition={startTransition}
          pendingTransition={pendingTransition}
          key={index}
          todoItem={item}
          allItems={allItems}
          allLists={allLists}
          changeItems={changeItems}
        />
      ))}
    </>
  );
});

const OtherTodoItems = memo(function OtherTodoItems({
  items,
  allItems,
  allLists,
  changeItems,
  startTransition,
  pendingTransition,
}: {
  items: TodoItemType[];
  allItems: TodoItemType[];
  allLists: TodoList[];
  changeItems: (newItems: TodoItemType[]) => void;
  startTransition: (callback: () => Promise<void>) => void;
  pendingTransition: boolean;
}) {
  if (!items || items.length == 0) return null;

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Other</span>
        <span className="text-sm text-muted-foreground">2 tasks</span>
      </div>
      {items.map((item, index) => (
        <TodoItem
          startTransition={startTransition}
          pendingTransition={pendingTransition}
          key={index}
          todoItem={item}
          allItems={allItems}
          allLists={allLists}
          changeItems={changeItems}
        />
      ))}
    </>
  );
});

const TodoLists = memo(function TodoLists({
  lists,
  addNewList,
}: {
  lists: TodoList[];
  addNewList: (newList: TodoList) => void;
}) {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Todo Lists</h2>
        <AddNewListDialog addNewList={addNewList} />
      </div>
      <div className="grid gap-2">
        {lists.map(
          (list, index) =>
            list.name && (
              <ListItem
                key={index}
                name={list.name}
                count={list.items?.length || 0}
              />
            )
        )}
      </div>
    </>
  );
});

const TodoItems = memo(function TodoItems({
  items,
  lists,
  currentListName,
}: {
  items: TodoItemType[];
  lists: TodoList[];
  currentListName: string;
}) {
  const [pendingTransition, startTransition] = useTransition();

  const [optimisticItems, changeItems] = useOptimistic<
    TodoItemType[],
    TodoItemType[]
  >(items, (state, newItems) => [...newItems]);

  const priorityItems = optimisticItems.filter((item) => item.priority);
  const _otherItems = optimisticItems.filter((item) => !item.priority);

  const [otherItems, addNewTodo] = useOptimistic<TodoItemType[], TodoItemType>(
    _otherItems,
    (state, newTodo) => {
      return [...state, newTodo];
    }
  );

  return (
    <main className="flex-1 border-r bg-muted/20 p-4 sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{currentListName}</h2>
      </div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Todo Items</h2>
      </div>
      <div className="grid gap-3">
        <NewTodoItem lists={lists} addNewTodo={addNewTodo} allItems={items} />
        <PriorityTodoItems
          startTransition={startTransition}
          pendingTransition={pendingTransition}
          items={priorityItems}
          allItems={items}
          allLists={lists}
          changeItems={changeItems}
        />
        <OtherTodoItems
          startTransition={startTransition}
          pendingTransition={pendingTransition}
          items={otherItems}
          allItems={items}
          allLists={lists}
          changeItems={changeItems}
        />
      </div>
    </main>
  );
});

const CreateFirstList = memo(function CreateFirstList({
  addNewList,
}: {
  addNewList: (newList: TodoList) => void;
}) {
  return (
    <main className="flex-1 flex gap-4 border-r bg-muted/20 p-4 sm:p-6">
      <div className="flex flex-row gap-4 items-center h-min">
        <h2 className="text-xl md:text-3xl font-semibold">
          Create your first list here {"-->"}
        </h2>
        <AddNewListDialog addNewList={addNewList} />
      </div>
    </main>
  );
});

export default function Dashboard({ userData }: { userData: User }) {
  const { setUserDatabaseId } = useUserDatabaseId();
  setUserDatabaseId(userData?.id || null);
  const router = useRouter();

  const lists = userData.lists || [];

  const searchParams = useSearchParams();
  const listName = searchParams.get("list");
  const visibleItems =
    lists.find((list) => list.name === listName)?.items || [];

  const [optimisticLists, addNewList] = useOptimistic<TodoList[], TodoList>(
    lists,
    (state, newList) => {
      return [...state, newList];
    }
  );
  useEffect(() => {
    if (!listName && optimisticLists.length > 0) {
      router.replace(`/?list=${encodeURIComponent(optimisticLists[0]?.name!)}`);
    }
  }, [listName, optimisticLists, router]);

  return (
    <MobileMenuProvider>
      <div className="flex flex-col bg-background min-h-screen">
        <SignedIn>
          <Header
            mobileContentInMenu={
              <TodoLists lists={optimisticLists} addNewList={addNewList} />
            }
          />
        </SignedIn>
        <div className="flex w-full flex-grow bg-background">
          <aside className=" hidden sm:block border-r bg-muted/60 p-4 sm:p-6 md:w-64 lg:w-72">
            <TodoLists lists={optimisticLists} addNewList={addNewList} />
          </aside>

          {optimisticLists.length > 0 ? (
            <TodoItems
              items={visibleItems}
              lists={optimisticLists}
              currentListName={listName ?? ""}
            />
          ) : (
            <CreateFirstList addNewList={addNewList} />
          )}
        </div>
        <SignedIn>
          <Footer />
        </SignedIn>
      </div>
    </MobileMenuProvider>
  );
}
