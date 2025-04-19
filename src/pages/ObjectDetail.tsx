import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSCEObjectById, getCurrentUser } from "@/lib/storage";
import { SCEObject, UserRole } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";

const getClassColor = (objectClass: string) => {
  switch (objectClass) {
    case "SAFE":
      return "bg-green-100 text-green-800";
    case "EUCLID":
      return "bg-yellow-100 text-yellow-800";
    case "KETER":
      return "bg-red-100 text-red-800";
    case "THAUMIEL":
      return "bg-purple-100 text-purple-800";
    case "NEUTRALIZED":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-blue-100 text-blue-800";
  }
};

const ObjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [object, setObject] = React.useState<SCEObject | null>(null);
  const [canView, setCanView] = React.useState(false);

  React.useEffect(() => {
    const user = getCurrentUser();
    
    // Проверяем, имеет ли пользователь права на просмотр объектов
    if (!user) {
      toast({
        title: "Доступ запрещен",
        description: "Вы должны войти в систему для просмотра объектов SCE",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (!user.emailVerified && user.role !== UserRole.ADMIN) {
      toast({
        title: "Доступ запрещен",
        description: "Вы должны подтвердить свой email для доступа к объектам SCE",
        variant: "destructive",
      });
      navigate("/verify-email");
      return;
    }
    
    setCanView(true);
    
    if (id) {
      const foundObject = getSCEObjectById(id);
      if (foundObject) {
        setObject(foundObject);
      } else {
        navigate("/objects");
      }
    }
  }, [id, navigate]);

  if (!canView) {
    return null;
  }

  if (!object) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-48">
          <p className="text-sce-muted">Загрузка объекта...</p>
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
                SCE-{object.number}: {object.name}
              </h1>
              <Badge className={getClassColor(object.objectClass)}>
                {object.objectClass}
              </Badge>
            </div>

            <div className="space-y-6 mt-8">
              <section>
                <h2 className="object-header">Описание</h2>
                <div className="whitespace-pre-line">
                  {object.description}
                </div>
              </section>

              <section>
                <h2 className="object-header">Условия содержания</h2>
                <div className="whitespace-pre-line">
                  {object.containment}
                </div>
              </section>

              {object.additionalInfo && (
                <section>
                  <h2 className="object-header">Дополнительная информация</h2>
                  <div className="whitespace-pre-line">
                    {object.additionalInfo}
                  </div>
                </section>
              )}

              <div className="text-sm text-sce-muted mt-8 pt-4 border-t border-sce-border">
                <p>Документ последний раз обновлен: {object.createdAt.toLocaleDateString()}</p>
                <p>Уровень допуска: 2/SCE</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default ObjectDetail;