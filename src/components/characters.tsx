"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CharacterCustomizer() {
  // Types
  type Category = 'Hair' | 'Eyes' | 'Skin';
  type CharKey = 'hair' | 'eyes' | 'skin';

  // Track the chosen features
  const [character, setCharacter] = useState<Record<CharKey, string | null>>({
    hair: null,
    eyes: null,
    skin: null,
  });

  // Tabs: categories
  const categories: Category[] = ['Hair', 'Eyes', 'Skin'];

  // Options per category
  const options: Record<Category, string[]> = {
    Hair: ['/hair1.png', '/hair2.png', '/hair3.png', '/hair4.png', '/hair5.png', '/hair6.png', '/hair7.png'],
    Eyes: ['/eyes1.png', '/eyes2.png', '/eyes3.png', '/eyes4.png', '/eyes5.png'],
    Skin: ['/skin1.png', '/skin2.png', '/skin3.png'],
  };

  // Pagination for option grid
  const [page, setPage] = useState(0);
  const itemsPerPage = 6;

  const [activeCategory, setActiveCategory] = useState<Category>('Hair');

  const handleSelect = (cat: Category, option: string) => {
    setCharacter((prev) => ({ ...prev, [cat.toLowerCase() as CharKey]: option }));
  };

  const visibleOptions = options[activeCategory].slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  return (
    <div className="grid grid-cols-2 gap-6 p-6 bg-gray-100 rounded-xl">
      {/* Left Panel: Character Preview */}
      <div className="flex items-center justify-center bg-white rounded-xl shadow-md h-[400px]">
        <div className="relative w-64 h-64 bg-gray-50 border border-gray-300 rounded-lg overflow-hidden">
          {/* Stack layers */}
          {character.skin && <img src={character.skin} alt="skin" className="absolute inset-0" />}
          {character.hair && <img src={character.hair} alt="hair" className="absolute inset-0" />}
          {character.eyes && <img src={character.eyes} alt="eyes" className="absolute inset-0" />}
          {!character.skin && !character.hair && !character.eyes && (
            <div className="flex items-center justify-center h-full text-gray-400">Preview</div>
          )}
        </div>
      </div>

      {/* Right Panel: Options */}
      <div className="flex flex-col bg-white rounded-xl shadow-md p-4">
        {/* Tabs for categories */}
  <Tabs defaultValue="Hair" onValueChange={(val) => { setActiveCategory(val as Category); setPage(0); }}>
          <TabsList className="grid grid-cols-3 mb-4">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
            ))}
          </TabsList>

          {categories.map((cat) => (
            <TabsContent key={cat} value={cat}>
              {/* Options Grid */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {visibleOptions.map((opt: string, i: number) => (
                  <button
                    key={i}
                    className={`h-20 w-20 border rounded-md flex items-center justify-center hover:border-blue-500 ${
                      (character[cat.toLowerCase() as CharKey] === opt) ? 'border-blue-500' : 'border-gray-300'
                    }`}
                    onClick={() => handleSelect(cat, opt)}
                  >
                    <img src={opt} alt={`${cat}-${i}`} className="max-h-full max-w-full" />
                  </button>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  <ChevronLeft />
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setPage((p) =>
                      (p + 1) * itemsPerPage < options[activeCategory].length ? p + 1 : p
                    )
                  }
                  disabled={(page + 1) * itemsPerPage >= options[activeCategory].length}
                >
                  <ChevronRight />
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between mt-4">
          <Button variant="secondary">📷 Retake</Button>
          <Button className="bg-blue-600 text-white">✅ Confirm</Button>
        </div>
      </div>
    </div>
  );
}
