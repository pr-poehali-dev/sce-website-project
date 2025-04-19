import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllSCEObjects } from "@/lib/storage";
import { SCEObject, ObjectClass } from "@/lib/types";
import ObjectCard from "@/components/ObjectCard";

const ObjectsList: React.FC = () => {
  const [objects, setObjects] = React.useState<SCEObject[]>(getAllSCEObjects());
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedClass, setSelectedClass] = React.useState<string>("ALL");

  const filteredObjects = objects.filter(object => {
    const matchesSearch = (
      object.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      object.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      object.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesClass = selectedClass === "ALL" ? true : object.objectClass === selectedClass;
    
    return matchesSearch && matchesClass;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Объекты SCE</h1>
          <Card className="w-full md:w-auto">
            <CardContent className="p-4 flex flex-col md:flex-row gap-4">
              <div className="grow">
                <Label htmlFor="search" className="sr-only">Поиск</Label>
                <Input
                  id="search"
                  placeholder="Поиск по объектам..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-[180px]">
                <Label htmlFor="class-filter" className="sr-only">Фильтр по классу</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Все классы" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Все классы</SelectItem>
                    <SelectItem value={ObjectClass.SAFE}>Безопасный</SelectItem>
                    <SelectItem value={ObjectClass.EUCLID}>Евклид</SelectItem>
                    <SelectItem value={ObjectClass.KETER}>Кетер</SelectItem>
                    <SelectItem value={ObjectClass.THAUMIEL}>Таумиэль</SelectItem>
                    <SelectItem value={ObjectClass.NEUTRALIZED}>Нейтрализованный</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {filteredObjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredObjects.map((object) => (
              <ObjectCard key={object.id} object={object} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-sce-muted">
                {objects.length === 0
                  ? "В базе данных пока нет объектов SCE"
                  : "Объекты с указанными параметрами не найдены"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ObjectsList;