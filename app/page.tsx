import Dashboard from "@/components/dashboard/Dashboard";
import { UserProvider } from "@/components/UserDatabaseIdProvider";
import { getUserDataFromDB } from "@/lib/todosActions";

export default async function Home() {
  const userData = await getUserDataFromDB();

  return (
    <UserProvider>
      <Dashboard userData={userData} />
    </UserProvider>
  );
}
