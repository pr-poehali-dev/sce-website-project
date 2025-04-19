import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAllSCEObjects, getAllPosts } from "@/lib/storage";
import ObjectCard from "@/components/ObjectCard";
import PostCard from "@/components/PostCard";

const Index: React.FC = () => {
  const objects = getAllSCEObjects().slice(0, 3);
  const posts = getAllPosts().slice(0, 3);

  return (
    <Layout>
      <section className="mb-12">
        <div className="relative bg-sce-card rounded-lg overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-sce-primary/90 to-sce-secondary/80"></div>
          <div className="relative z-10 px-6 py-12 md:py-24 md:px-12 text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              SCE Foundation
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl">
              Secure. Control. Explore. Мы обеспечиваем безопасность человечества через 
              обнаружение, сдерживание и изучение аномальных явлений.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link to="/objects">Объекты SCE</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white hover:bg-white/20" asChild>
                <Link to="/about">Узнать больше</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Последние объекты SCE</h2>
          <Link to="/objects" className="text-sce-primary hover:underline">
            Смотреть все →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {objects.length > 0 ? (
            objects.map((object) => (
              <ObjectCard key={object.id} object={object} />
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="py-8 text-center">
                <p className="text-sce-muted mb-4">Объекты SCE ещё не добавлены</p>
                <Button variant="outline" asChild>
                  <Link to="/admin">Добавить объект</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Последние публикации</h2>
          <Link to="/posts" className="text-sce-primary hover:underline">
            Смотреть все →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="py-8 text-center">
                <p className="text-sce-muted mb-4">Публикации ещё не добавлены</p>
                <Button variant="outline" asChild>
                  <Link to="/admin">Добавить публикацию</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Index;