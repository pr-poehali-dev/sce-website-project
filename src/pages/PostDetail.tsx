import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPostById, getCurrentUser } from "@/lib/storage";
import { Post, UserRole } from "@/lib/types";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { toast } from "@/components/ui/use-toast";

const getCategoryColor = (category: string) => {
  switch (category) {
    case "NEWS":
      return "bg-blue-100 text-blue-800";
    case "RESEARCH":
      return "bg-purple-100 text-purple-800";
    case "REPORT":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-gray-100 text-gray-800";
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

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = React.useState<Post | null>(null);
  const [canView, setCanView] = React.useState(false);

  React.useEffect(() => {
    const user = getCurrentUser();
    
    // Проверяем, имеет ли пользователь права на просмотр публикаций
    if (!user) {
      toast({
        title: "Доступ запрещен",
        description: "Вы должны войти в систему для просмотра материалов SCE",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (!user.emailVerified && user.role !== UserRole.ADMIN) {
      toast({
        title: "Доступ запрещен",
        description: "Вы должны подтвердить свой email для доступа к материалам SCE",
        variant: "destructive",
      });
      navigate("/verify-email");
      return;
    }
    
    setCanView(true);
    
    if (id) {
      const foundPost = getPostById(id);
      if (foundPost) {
        setPost(foundPost);
      } else {
        navigate("/posts");
      }
    }
  }, [id, navigate]);

  if (!canView) {
    return null;
  }

  if (!post) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-48">
          <p className="text-sce-muted">Загрузка публикации...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="object-container">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl md:text-3xl font-bold">
                {post.title}
              </h1>
              <Badge className={getCategoryColor(post.category)}>
                {getCategoryName(post.category)}
              </Badge>
            </div>
            
            <p className="text-sce-muted mb-8">
              {format(post.createdAt, "d MMMM yyyy", { locale: ru })}
            </p>

            <div className="prose prose-sce max-w-none">
              <div className="whitespace-pre-line">
                {post.content}
              </div>
            </div>

            <div className="text-sm text-sce-muted mt-8 pt-4 border-t border-sce-border">
              <p>Документ последний раз обновлен: {post.createdAt.toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default PostDetail;