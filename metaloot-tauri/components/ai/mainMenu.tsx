import React from 'react';
import GameCard from '@/components/games/game-card';
import { Game } from '@/components/types';
import AiCard from '../games/ai-card';

// interface GamesPanelProps {
//   games: Game[];
// }



export const AiPanel = () => {

  const games: Game[] = [
    {
      id: "1",
      title: "Iron Man",
      description: "Similar Tony Start But With A Twist .....",
      media: "0x14588644555336",
      uri: "agent-town://open"
    },
    {
      id: "2",
      title: "Blue Lady",
      description: "A Real Estate Agent By Day, An Assassin By Night...",
      media: "0x198888008772352",
      uri: "trophyhunter://open"
    },
    // {
    //   id: "3",
    //   title: "Crazy Jumper",
    //   description: "Jump like your life depends on it.",
    //   media: "https://eiwzivmnxlmtwrzejwdl.supabase.co/storage/v1/object/public/space-avatars/crazy-jumper.png?t=2024-11-16T12%3A24%3A07.694Z",
    //   uri: "crazyjumper://open"
    // },
    // {
    //   id: "4",
    //   title: "Noodle-Quest",
    //   description: "Embark on an interstellar journey across unexplored noodle quest.",
    //   media: "https://tzqzzuafkobkhygtccse.supabase.co/storage/v1/object/public/biz_touch/theme/noodleQuest",
    //   uri: "noodle-quest://open"
    // },
    // {
    //   id: "5",
    //   title: "SamusVSMegaman",
    //   description: "A fast-paced fighting game where Samus and Megaman battle it out.",
    //   media: "https://tzqzzuafkobkhygtccse.supabase.co/storage/v1/object/public/biz_touch/theme/megaMan",
    //   uri: "megaman://open"
    // }
  ];

  // Use sampleGames if no games are provided
  return (
    <div className="flex flex-wrap mx-2">
      {games.map((game) => (
        <div key={game.id} className="w-full sm:w-1/3 md:w-1/3  lg:w-1/3 px-2 mb-4 ">
          <AiCard {...game} />
        </div>
      ))}
    </div>
  );
};
