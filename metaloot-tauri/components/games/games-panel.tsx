import React from 'react';
import GameCard from '@/components/games/game-card';
import { Game } from '@/components/types';

// interface GamesPanelProps {
//   games: Game[];
// }



export const GamesPanel = () => {

  const games: Game[] = [
    {
      id: "1",
      title: "Noodle-Quest",
      description: "Embark on an interstellar journey across unexplored noodle quest.",
      media: "https://tzqzzuafkobkhygtccse.supabase.co/storage/v1/object/public/biz_touch/theme/noodleQuest",
      uri: "noodle-quest://open"
    },
    {
      id: "2",
      title: "SamusVSMegaman",
      description: "A fast-paced fighting game where Samus and Megaman battle it out.",
      media: "https://tzqzzuafkobkhygtccse.supabase.co/storage/v1/object/public/biz_touch/theme/megaMan",
      uri: "megaman://open"
    }
  ];

  // Use sampleGames if no games are provided
  return (
    <div className="flex flex-wrap mx-2">
      {games.map((game) => (
        <div key={game.id} className="w-full sm:w-1/3 md:w-1/3  lg:w-1/3 px-2 mb-4 ">
          <GameCard {...game} />
        </div>
      ))}
    </div>
  );
};
