"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"

export function ServiceFilters() {
    return (
        <Card className="p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="grid grid-cols-2 md:flex md:flex-row gap-2">
                    <Select>
                        <SelectTrigger className="w-full md:w-[120px]">
                            <SelectValue placeholder="Puntuación" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">1+ Stars</SelectItem>
                            <SelectItem value="2">2+ Stars</SelectItem>
                            <SelectItem value="3">3+ Stars</SelectItem>
                            <SelectItem value="4">4+ Stars</SelectItem>
                            <SelectItem value="5">5 Stars</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="w-full md:w-[180px] text-xs md:text-sm">
                            <SelectValue placeholder="Cercanía" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">Solo ubicación exacta</SelectItem>
                            <SelectItem value="5">A 5 km de distancia</SelectItem>
                            <SelectItem value="10">A 10 km de distancia</SelectItem>
                            <SelectItem value="15">A 15 km de distancia</SelectItem>
                            <SelectItem value="25">A 25 km de distancia</SelectItem>
                            <SelectItem value="35">A 35 km de distancia</SelectItem>
                            <SelectItem value="50">A 50 km de distancia</SelectItem>
                            <SelectItem value="100">A 100 km de distancia</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="w-full md:w-[150px]">
                            <SelectValue placeholder="Precio" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="economico">Económico</SelectItem>
                            <SelectItem value="calidad-precio">Calidad/Precio</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Fecha de publicación" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="24-hours">Últimas 24 horas</SelectItem>
                            <SelectItem value="3-days">Últimos 3 días</SelectItem>
                            <SelectItem value="7-days">Últimos 7 días</SelectItem>
                            <SelectItem value="14-days">Últimos 14 días</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </Card>
    )
}
