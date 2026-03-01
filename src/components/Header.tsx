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
        <header className="sticky top-0 z-[50] w-full bg-white border-b border-zinc-100 py-6 px-4 shadow-sm">
            <div className="container mx-auto max-w-5xl">
                <h1 className="text-3xl font-bold text-center mb-6 tracking-tight text-zinc-900">
                    Video Browser
                </h1>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <div className="w-full sm:w-72">
                        <Input
                            placeholder="Search Video..."
                            className="h-11 w-full bg-white border-zinc-200 focus-visible:ring-1"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="w-full sm:w-44">
                        <Select
                            value={selectedYear?.toString() || "all"}
                            onValueChange={(v) => setSelectedYear(v === "all" ? null : parseInt(v))}
                        >
                            <SelectTrigger className="h-11 w-full border-zinc-200 bg-white px-3 flex items-center justify-between focus:ring-1">
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            {/* position="popper" forces the dropdown to calculate position relative to the window, not the header */}
                            <SelectContent position="popper" className="z-[100] mt-1">
                                <SelectItem value="all">All Years</SelectItem>
                                {years.map((year) => (
                                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="w-full sm:w-44">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="h-11 w-full justify-between font-normal border-zinc-200 bg-white px-3 flex items-center hover:bg-zinc-50"
                                >
                                    <span className="truncate">
                                        {selectedGenreId.length === 0
                                            ? "Genre"
                                            : `${selectedGenreId.length} Selected`}
                                    </span>
                                    <ChevronDown className="h-4 w-4 opacity-50 ml-2 flex-shrink-0" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                sideOffset={5}
                                className="w-56 max-h-80 overflow-y-auto z-[100]"
                            >
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
                                            className="w-full justify-center text-xs h-8 text-red-500 hover:text-red-600 font-medium"
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