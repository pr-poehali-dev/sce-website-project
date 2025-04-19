import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/lib/types";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface PostCardProps {
  post: Post;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "NEWS":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "RESEARCH":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    case "REPORT":
      return "bg-amber-100 text-amber-800 hover:bg-amber-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const getCategoryName = (category: string) => {
  switch (category) {
    case "NEWS":
      return "Новость";
    case "RESEARCH":
      return "Исследование";
    case "REPORT":
      return "Отчет";
    default:
      return category;
  }
};

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg md:text-xl">
            {post.title}
          </CardTitle>
          <Badge className={getCategoryColor(post.category)}>
            {getCategoryName(post.category)}
          </Badge>
        </div>
        <p className="text-xs text-sce-muted">
          {format(post.createdAt, "d MMMM yyyy", { locale: ru })}
        </p>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-sce-muted line-clamp-3">
          {post.content.substring(0, 150)}
          {post.content.length > 150 ? "..." : ""}
        </p>
      </CardContent>
      <CardFooter>
        <Link 
          to={`/posts/${post.id}`}
          className="text-sce-primary hover:underline text-sm font-medium"
        >
          Читать полностью →
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PostCard;