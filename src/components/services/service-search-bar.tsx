"use client"
import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Crosshair } from "lucide-react"
import { getColombianCities } from "@/lib/colombian-cities"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type ServiceSearchBarProps = {
  onSearch: (searchTerm: string, location: string) => void
}

const cities = getColombianCities();
const currentLocationLabel = "Mi ubicación actual";

export function ServiceSearchBar({ onSearch }: ServiceSearchBarProps) {
  const [location, setLocation] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const locationInputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const updateSuggestions = (value: string) => {
    let filteredSuggestions: string[];
    if (value) {
      filteredSuggestions = cities
        .filter((city) => city.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 9);
    } else {
      filteredSuggestions = cities.slice(0, 9);
    }

    // Add "Mi ubicación actual" only if the search doesn't contradict it
    if (currentLocationLabel.toLowerCase().includes(value.toLowerCase())) {
      setSuggestions([currentLocationLabel, ...filteredSuggestions]);
    } else {
      setSuggestions(filteredSuggestions);
    }

    setShowSuggestions(true)
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocation(value)
    updateSuggestions(value);
  }

  const handleSuggestionClick = (city: string) => {
    if (city === currentLocationLabel) {
      // Logic to get current location can be implemented here
      // For now, we'll just set it in the input
      setLocation("Mi ubicación actual")
    } else {
      setLocation(city)
    }
    setShowSuggestions(false)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const searchTerm = formData.get("search") as string
    const locationTerm = location
    onSearch(searchTerm, locationTerm)
    setShowSuggestions(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-background/80 md:bg-card md:border md:shadow-sm rounded-lg flex flex-col md:flex-row items-center gap-2 w-full max-w-3xl mx-auto"
    >
      <div className="relative flex-grow w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          name="search"
          placeholder="What service do you need?"
          className="pl-10 h-12 text-base rounded-lg md:rounded-r-none md:border-0 md:focus-visible:ring-0 md:focus-visible:ring-offset-0"
        />
      </div>
      <div className="hidden md:block w-[1px] h-6 bg-border"></div>
      <div className="relative flex-grow w-full" ref={locationInputRef}>
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          name="location"
          placeholder="Ciudad, región..."
          className="pl-10 h-12 text-base rounded-lg md:rounded-none md:border-0 md:focus-visible:ring-0 md:focus-visible:ring-offset-0"
          value={location}
          onChange={handleLocationChange}
          onFocus={() => updateSuggestions(location)}
          autoComplete="off"
        />
        {showSuggestions && suggestions.length > 0 && (
          <Card className="absolute z-[60] w-full mt-1 max-h-60 overflow-y-auto shadow-lg border-2">
            <ul>
              {suggestions.map((city, index) => (
                <li key={index}>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 hover:bg-accent flex items-center gap-2"
                    onClick={() => handleSuggestionClick(city)}
                  >
                    {city === currentLocationLabel ? (
                      <Crosshair className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{city}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
      <Button type="submit" size="lg" className="w-full md:w-auto md:h-12 md:rounded-l-none">
        <span className="hidden md:block">Buscar expertos</span>
        <Search className="h-5 w-5 md:hidden" />
      </Button>
    </form>
  )
}
