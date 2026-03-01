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
                <h1 className="text-3xl font-bold text-center mb-6 tracking-tight text-zinc-900">Video Browser</h1>
                <Separator orientation="vertical" className="h-6 hidden md:block" />


                {/* filter section */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                    <div className="w-full sm:w-72">
                        <Input
                            placeholder="Search Video..."
                            className="h-11 bg-white border-zinc-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                     {/* Year Filter */}
                     <Select value={selectedYear?.toString() || "all"} onValueChange={(v) => setSelectedYear(v === "all" ? null : parseInt(v))}>
                            <SelectTrigger className="w-full sm:w-44 h-11 border-zinc-200 bg-white">
                                <SelectValue placeholder="Search by Year..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Years</SelectItem>
                                {years.map((year: number) => (
                                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {/* Genre Filter (Multi-Select) */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full sm:w-44 h-11 justify-between font-normal border-zinc-200 bg-white text-muted-foreground"
                                >
                                    {selectedGenreId.length === 0
                                        ? "Search by Genre..."
                                        : `${selectedGenreId.length} Selected`}
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
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
                                            className="w-full justify-center text-xs h-8"
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
        </header>
    );
};

export default Header;