import Interface from "@/components/interface";
import { UserProvider } from '../components/context/UserContext';
export default function Home() {
  return (
    <UserProvider>
      <Interface />
    </UserProvider>
  );
}
