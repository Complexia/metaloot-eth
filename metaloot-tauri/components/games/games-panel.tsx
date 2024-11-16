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
      title: "Agent Town",
      description: "Dive into a world of agents. But behold, each one posesses a wallet and is not afraid to transact!",
      media: "https://eiwzivmnxlmtwrzejwdl.supabase.co/storage/v1/object/public/space-avatars/ai-town.png?t=2024-11-15T17%3A44%3A53.475Z",
      uri: "agent-town://open"
    },
    {
      id: "2",
      title: "Trophy Hunter",
      description: "Hunt Trophies and win.",
      media: "https://eiwzivmnxlmtwrzejwdl.supabase.co/storage/v1/object/public/space-avatars/trophyhunter.png?t=2024-11-15T19%3A42%3A10.002Z",
      uri: "trophyhunter://open"
    },
    {
      id: "3",
      title: "Crazy Jumper",
      description: "Jump like your life depends on it.",
      media: "https://eiwzivmnxlmtwrzejwdl.supabase.co/storage/v1/object/public/space-avatars/crazy-jumper.png?t=2024-11-16T12%3A24%3A07.694Z",
      uri: "crazyjumper://open"
    },
    {
      id: "4",
      title: "Noodle-Quest",
      description: "Embark on an interstellar journey across unexplored noodle quest.",
      media: "https://tzqzzuafkobkhygtccse.supabase.co/storage/v1/object/public/biz_touch/theme/noodleQuest",
      uri: "noodle-quest://open"
    },
    {
      id: "5",
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
