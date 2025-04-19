import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound: React.FC = () => {
  return (
    <Layout>
      <div className="flex justify-center items-center py-12">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-12 pb-12">
            <h1 className="text-6xl font-bold text-sce-primary mb-6">404</h1>
            <h2 className="text-2xl font-semibold mb-4">Страница не найдена</h2>
            <p className="text-sce-muted mb-8">
              Запрашиваемый вами документ не найден в базе данных SCE Foundation.
            </p>
            <div className="space-y-4">
              <div className="bg-sce-background/50 border border-sce-border p-4 rounded-md font-mono text-sm">
                <p>Ошибка: Доступ ограничен или файл удален</p>
                <p>Код ошибки: SCE-404-DOCUMENT-NOT-FOUND</p>
              </div>
              <Button className="w-full" asChild>
                <Link to="/">Вернуться на главную</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NotFound;