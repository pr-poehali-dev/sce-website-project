import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SCEObject } from "@/lib/types";

interface ObjectCardProps {
  object: SCEObject;
}

const getClassColor = (objectClass: string) => {
  switch (objectClass) {
    case "SAFE":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "EUCLID":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "KETER":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "THAUMIEL":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    case "NEUTRALIZED":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    default:
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
  }
};

const ObjectCard: React.FC<ObjectCardProps> = ({ object }) => {
  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg md:text-xl">
            SCE-{object.number}: {object.name}
          </CardTitle>
          <Badge className={getClassColor(object.objectClass)}>
            {object.objectClass}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-sce-muted line-clamp-3">
          {object.description.substring(0, 150)}
          {object.description.length > 150 ? "..." : ""}
        </p>
      </CardContent>
      <CardFooter>
        <Link 
          to={`/objects/${object.id}`}
          className="text-sce-primary hover:underline text-sm font-medium"
        >
          Читать полностью →
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ObjectCard;