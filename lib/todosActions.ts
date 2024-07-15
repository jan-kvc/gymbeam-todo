"use server";

import { TodoItem, User } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function getUserDataFromDB(): Promise<User> {
  const user = await currentUser();
  if (!user) {
    throw new Error("You must be signed in to view your todos");
  }

  const userId = user.id;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users?clerkId=${userId}`,
    {
      next: { tags: ["getUserDataFromDB"] },
      cache: "force-cache",
    }
  );

  const userDataFromDb = await res.json();

  if (userDataFromDb == "Not found" || userDataFromDb.length === 0) {
    const res2 = await fetch(process.env.NEXT_PUBLIC_API_URL + "/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: user.fullName,
        clerkId: userId,
      }),
    });

    const newUserDataFromDb = await res2.json();

    return newUserDataFromDb;
  } else {
    return userDataFromDb[0];
  }
}

export async function addNewListAction(
  prevState: {
    status: string;
    message: string;
  },
  formData: FormData
) {
  const listName = formData.get("name");
  const userId = formData.get("userId");

  if (!listName || userId == "") {
    return {
      status: "error",
      message: "Error adding new list, please try again later",
    };
  }

  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("You must be signed in to add a new list");
    }
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/users/${userId}/lists`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: listName,
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Error adding new list, please try again later");
    }

    revalidateTag("getUserDataFromDB");
    revalidatePath("/");

    return {
      status: "success",
      message: "New list added successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Error adding new list, please try again later",
    };
  }
}

export async function addNewTodoAction(
  prevState: {
    status: string;
    message: string;
  },
  formData: FormData
) {
  const todo = formData.get("todo");
  const userId = formData.get("userId");
  const listId = formData.get("listId");
  const allItems = JSON.parse(formData.get("allItems") as string);

  const allItemsAndNewTodo = [
    ...allItems,
    { text: todo, completed: false, priority: false },
  ];

  if (!todo || userId == "" || listId == "") {
    return {
      status: "error",
      message: "Error adding new todo, please try again later",
    };
  }

  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("You must be signed in to add a new list");
    }
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/users/${userId}/lists/${listId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: allItemsAndNewTodo,
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Error adding new todo, please try again later");
    }

    revalidateTag("getUserDataFromDB");

    return {
      status: "success",
      message: "New todo added successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Error adding new todo, please try again later",
    };
  }
}

export async function deleteTodoAction(
  userId: string,
  todo: TodoItem,
  allItems: TodoItem[],
  listId: string
) {
  const allItemsWithoutDeletedTodo = allItems.filter(
    (item) => item.text !== todo.text
  );

  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("You must be signed in to delete a todo");
    }
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/users/${userId}/lists/${listId}`,

      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: allItemsWithoutDeletedTodo,
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Error deleting todo, please try again later");
    }

    revalidateTag("getUserDataFromDB");

    return {
      status: "success",
      message: "Todo deleted successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Error deleting todo, please try again later",
    };
  }
}

export async function updateTodoAction(
  userId: string,
  newItems: TodoItem[],
  listId: string
) {
  const allItemsWithUpdatedTodo = newItems;

  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("You must be signed in to delete a todo");
    }
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/users/${userId}/lists/${listId}`,

      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: allItemsWithUpdatedTodo,
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Error deleting todo, please try again later");
    }

    revalidateTag("getUserDataFromDB");

    return {
      status: "success",
      message: "Todo deleted successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Error deleting todo, please try again later",
    };
  }
}
