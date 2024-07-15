import { addNewListAction } from "@/lib/todosActions";
import { TodoList } from "@/types";
import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { LoadingSpinner } from "../icons/LoadingSpinner";
import PlusIcon from "../icons/PlusIcon";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import { useUserDatabaseId } from "../UserDatabaseIdProvider";

export default function AddNewListDialog({
  addNewList,
}: {
  addNewList: (newList: TodoList) => void;
}) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const { userDatabaseId } = useUserDatabaseId();
  const [state, formAction] = useFormState(addNewListAction, {
    status: "",
    message: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (state.status === "success") {
      formRef?.current?.reset();
      toast({
        title: "Success",
        description: state.message,
      });
    } else if (state.status === "error") {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: state.message,
      });
    }
  }, [state]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <PlusIcon className="h-5 w-5" />

          <span className="sr-only">Add New List</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={(e) => {
            return setDialogOpen(false);
          }}
          action={async (formData: FormData) => {
            const listName = formData.get("name") as string;
            if (!listName) {
              return;
            }
            const newList = {
              name: listName,
              todos: [],
            };
            addNewList(newList);

            formData.append("userId", userDatabaseId || "");

            formAction(formData);
          }}
          ref={formRef}
        >
          <DialogHeader>
            <DialogTitle>Add new list</DialogTitle>
            <DialogDescription>
              Name your list and press save to create it.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-4">
            <Input
              id="name"
              defaultValue="New list"
              name="name"
              required
              min={3}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={pending}
                onClick={() => {
                  setDialogOpen(false);
                }}
              >
                {!pending ? (
                  "Save changes"
                ) : (
                  <LoadingSpinner className="h-5 w-5" />
                )}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
