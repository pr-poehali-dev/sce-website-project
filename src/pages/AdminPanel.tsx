import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { getCurrentUser, createSCEObject, createPost, getAllUsers, updateUserRole } from "@/lib/storage";
import { ObjectClass, PostCategory, UserRole } from "@/lib/types";
import { Link } from "react-router-dom";

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = React.useState(getCurrentUser());
  const [users, setUsers] = React.useState(getAllUsers());

  React.useEffect(() => {
    // Проверяем, является ли пользователь администратором, если нет - перенаправляем
    const user = getCurrentUser();
    setCurrentUser(user);
    if (!user || user.role !== UserRole.ADMIN) {
      toast({
        title: "Доступ запрещен",
        description: "У вас нет прав для доступа к этой странице",
        variant: "destructive",
      });
      navigate("/");
    } else {
      setUsers(getAllUsers());
    }
  }, [navigate]);

  // Форма создания объекта
  const [objectNumber, setObjectNumber] = React.useState("");
  const [objectName, setObjectName] = React.useState("");
  const [objectClass, setObjectClass] = React.useState<string>(ObjectClass.SAFE);
  const [objectDescription, setObjectDescription] = React.useState("");
  const [objectContainment, setObjectContainment] = React.useState("");
  const [objectAdditionalInfo, setObjectAdditionalInfo] = React.useState("");

  // Форма создания публикации
  const [postTitle, setPostTitle] = React.useState("");
  const [postContent, setPostContent] = React.useState("");
  const [postCategory, setPostCategory] = React.useState<string>(PostCategory.NEWS);

  const handleCreateObject = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    if (!objectNumber || !objectName || !objectDescription || !objectContainment) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }
    
    const result = createSCEObject(
      objectNumber,
      objectName,
      objectClass,
      objectDescription,
      objectContainment,
      objectAdditionalInfo || undefined
    );
    
    if (result) {
      toast({
        title: "Объект создан",
        description: `SCE-${objectNumber} успешно добавлен в базу данных`,
      });
      
      // Сбрасываем форму
      setObjectNumber("");
      setObjectName("");
      setObjectClass(ObjectClass.SAFE);
      setObjectDescription("");
      setObjectContainment("");
      setObjectAdditionalInfo("");
    } else {
      toast({
        title: "Ошибка",
        description: "Не удалось создать объект",
        variant: "destructive",
      });
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    if (!postTitle || !postContent) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }
    
    const result = createPost(
      postTitle,
      postContent,
      postCategory
    );
    
    if (result) {
      toast({
        title: "Публикация создана",
        description: "Материал успешно добавлен в базу данных",
      });
      
      // Сбрасываем форму
      setPostTitle("");
      setPostContent("");
      setPostCategory(PostCategory.NEWS);
    } else {
      toast({
        title: "Ошибка",
        description: "Не удалось создать публикацию",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    const success = updateUserRole(userId, newRole);
    
    if (success) {
      setUsers(getAllUsers());
      toast({
        title: "Роль обновлена",
        description: "Роль пользователя успешно изменена",
      });
    } else {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить роль пользователя",
        variant: "destructive",
      });
    }
  };

  if (!currentUser || currentUser.role !== UserRole.ADMIN) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Панель администратора</h1>
        </div>

        <Tabs defaultValue="objects">
          <TabsList className="mb-4">
            <TabsTrigger value="objects">Объекты SCE</TabsTrigger>
            <TabsTrigger value="posts">Публикации</TabsTrigger>
            <TabsTrigger value="users">Пользователи</TabsTrigger>
          </TabsList>

          <TabsContent value="objects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Создать новый объект SCE</CardTitle>
                <CardDescription>
                  Добавьте новый объект SCE в базу данных фонда
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateObject} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="object-number">Номер объекта</Label>
                      <Input
                        id="object-number"
                        value={objectNumber}
                        onChange={(e) => setObjectNumber(e.target.value)}
                        placeholder="001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="object-class">Класс объекта</Label>
                      <Select 
                        value={objectClass} 
                        onValueChange={setObjectClass}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите класс" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ObjectClass.SAFE}>Безопасный</SelectItem>
                          <SelectItem value={ObjectClass.EUCLID}>Евклид</SelectItem>
                          <SelectItem value={ObjectClass.KETER}>Кетер</SelectItem>
                          <SelectItem value={ObjectClass.THAUMIEL}>Таумиэль</SelectItem>
                          <SelectItem value={ObjectClass.NEUTRALIZED}>Нейтрализованный</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="object-name">Название объекта</Label>
                    <Input
                      id="object-name"
                      value={objectName}
                      onChange={(e) => setObjectName(e.target.value)}
                      placeholder="Название аномалии"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="object-description">Описание</Label>
                    <Textarea
                      id="object-description"
                      value={objectDescription}
                      onChange={(e) => setObjectDescription(e.target.value)}
                      placeholder="Подробное описание объекта и его аномальных свойств"
                      rows={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="object-containment">Условия содержания</Label>
                    <Textarea
                      id="object-containment"
                      value={objectContainment}
                      onChange={(e) => setObjectContainment(e.target.value)}
                      placeholder="Протоколы и процедуры содержания объекта"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="object-additional-info">Дополнительная информация (необязательно)</Label>
                    <Textarea
                      id="object-additional-info"
                      value={objectAdditionalInfo}
                      onChange={(e) => setObjectAdditionalInfo(e.target.value)}
                      placeholder="История обнаружения, инциденты, примечания"
                      rows={3}
                    />
                  </div>

                  <Button type="submit">Создать объект</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Button variant="outline" asChild>
                  <Link to="/objects">Просмотреть все объекты</Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Создать новый материал</CardTitle>
                <CardDescription>
                  Добавьте новую публикацию в базу данных фонда
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="post-title">Заголовок</Label>
                      <Input
                        id="post-title"
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        placeholder="Заголовок публикации"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="post-category">Категория</Label>
                      <Select 
                        value={postCategory} 
                        onValueChange={setPostCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={PostCategory.NEWS}>Новость</SelectItem>
                          <SelectItem value={PostCategory.RESEARCH}>Исследование</SelectItem>
                          <SelectItem value={PostCategory.REPORT}>Отчет</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="post-content">Содержание</Label>
                    <Textarea
                      id="post-content"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder="Полный текст публикации"
                      rows={8}
                    />
                  </div>

                  <Button type="submit">Опубликовать</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Button variant="outline" asChild>
                  <Link to="/posts">Просмотреть все материалы</Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Управление пользователями</CardTitle>
                <CardDescription>
                  Список зарегистрированных пользователей и управление их ролями
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-sce-border">
                        <th className="px-4 py-2 text-left">Имя пользователя</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Роль</th>
                        <th className="px-4 py-2 text-left">Статус</th>
                        <th className="px-4 py-2 text-left">Дата регистрации</th>
                        <th className="px-4 py-2 text-left">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-sce-border">
                          <td className="px-4 py-2">{user.username}</td>
                          <td className="px-4 py-2">{user.email}</td>
                          <td className="px-4 py-2">{user.role}</td>
                          <td className="px-4 py-2">
                            {user.emailVerified ? (
                              <span className="text-green-600">Подтвержден</span>
                            ) : (
                              <span className="text-red-600">Не подтвержден</span>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            {user.createdAt.toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2">
                            <Select 
                              value={user.role} 
                              onValueChange={(newRole) => handleUpdateUserRole(user.id, newRole as UserRole)}
                              disabled={user.id === currentUser.id}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Изменить роль" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={UserRole.ADMIN}>Администратор</SelectItem>
                                <SelectItem value={UserRole.RESEARCHER}>Исследователь</SelectItem>
                                <SelectItem value={UserRole.READER}>Читатель</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-4 text-center text-sce-muted">
                            Пользователи не найдены
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPanel;