import Sidebar from '@/components/ui/sidebar';
import { GamesPanel } from '@/components/games/games-panel';
import Navbar from '@/components/ui/navbar';



const Interface: React.FC = () => {

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex">
        <div className="w-1/5">
          <Sidebar />
        </div>
        <div className="w-4/5">
          <GamesPanel />
        </div>
      </div>
    </div>
  );
};

export default Interface;
