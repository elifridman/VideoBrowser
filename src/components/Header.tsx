import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";

type Genre = { id: number; name: string };

type HeaderProps = {
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    selectedYear: number | null;
    setSelectedYear: (val: number | null) => void;
    selectedGenreId: number[];
    setSelectedGenreId: (val: number[]) => void;
    years: number[];
    genres: Genre[];
}
const Header: React.FC<HeaderProps> = ({ searchTerm, setSearchTerm, selectedYear, setSelectedYear, selectedGenreId, setSelectedGenreId, years, genres }) => {

    // Helper to add/remove IDs from the array
    const handleGenreToggle = (id: number) => {
        if (selectedGenreId.includes(id)) {
            setSelectedGenreId(selectedGenreId.filter((itemId) => itemId !== id));
        } else {
            setSelectedGenreId([...selectedGenreId, id]);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-zinc-100 py-6 px-4 shadow-sm">
            <div className="container mx-auto max-w-5xl">
                <h1 className="text-3xl font-bold text-center mb-6 tracking-tight text-zinc-900">
                    Video Browser
                </h1>

                {/* filter section */}
                <div className="flex flex-wrap items-center justify-center gap-4">

                    {/* 1. SEARCH INPUT */}
                    <div className="w-full sm:w-72">
                        <Input
                            placeholder="Search Video..."
                            // Explicitly setting h-11 and ensuring no extra margins
                            className="h-11 w-full bg-white border-zinc-200 focus-visible:ring-1"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* 2. YEAR SELECT */}
                    <div className="w-full sm:w-44">
                        <Select
                            value={selectedYear?.toString() || "all"}
                            onValueChange={(v) => setSelectedYear(v === "all" ? null : parseInt(v))}
                        >
                            {/* The secret: h-11, min-h-0, and leading-none to kill internal line-height gaps */}
                            <SelectTrigger className="h-11 w-full border-zinc-200 bg-white px-3 flex items-center justify-between min-h-0 leading-none focus:ring-1">
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Years</SelectItem>
                                {years.map((year) => (
                                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 3. GENRE DROPDOWN */}
                    <div className="w-full sm:w-44">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    // Matching h-11 exactly, flex items-center ensures the text is centered
                                    className="h-11 w-full justify-between font-normal border-zinc-200 bg-white px-3 flex items-center min-h-0 leading-none hover:bg-zinc-50"
                                >
                                    <span className="truncate">
                                        {selectedGenreId.length === 0
                                            ? "Genre"
                                            : `${selectedGenreId.length} Selected`}
                                    </span>
                                    <ChevronDown className="h-4 w-4 opacity-50 ml-2 flex-shrink-0" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 max-h-60 overflow-y-auto">
                                {genres.map((genre) => (
                                    <DropdownMenuCheckboxItem
                                        key={genre.id}
                                        checked={selectedGenreId.includes(genre.id)}
                                        onCheckedChange={() => handleGenreToggle(genre.id)}
                                    >
                                        {genre.name}
                                    </DropdownMenuCheckboxItem>
                                ))}
                                {selectedGenreId.length > 0 && (
                                    <>
                                        <Separator className="my-1" />
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-center text-xs h-8 text-red-500 hover:text-red-600"
                                            onClick={() => setSelectedGenreId([])}
                                        >
                                            Clear Filters
                                        </Button>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;