import { TodoList } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getListIdByListName(list: TodoList[], name: string) {
  return list.find((list) => list.name === name)?.id;
}
