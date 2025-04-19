import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllPosts } from "@/lib/storage";
import { Post, PostCategory } from "@/lib/types";
import PostCard from "@/components/PostCard";

const PostsList: React.FC = () => {
  const [posts, setPosts] = React.useState<Post[]>(getAllPosts());
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("ALL");

  const filteredPosts = posts.filter(post => {
    const matchesSearch = (
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesCategory = selectedCategory === "ALL" ? true : post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Материалы SCE Foundation</h1>
          <Card className="w-full md:w-auto">
            <CardContent className="p-4 flex flex-col md:flex-row gap-4">
              <div className="grow">
                <Label htmlFor="search" className="sr-only">Поиск</Label>
                <Input
                  id="search"
                  placeholder="Поиск по публикациям..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-[180px]">
                <Label htmlFor="category-filter" className="sr-only">Фильтр по категории</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Все категории" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Все категории</SelectItem>
                    <SelectItem value={PostCategory.NEWS}>Новости</SelectItem>
                    <SelectItem value={PostCategory.RESEARCH}>Исследования</SelectItem>
                    <SelectItem value={PostCategory.REPORT}>Отчеты</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-sce-muted">
                {posts.length === 0
                  ? "В базе данных пока нет публикаций"
                  : "Публикации с указанными параметрами не найдены"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default PostsList;