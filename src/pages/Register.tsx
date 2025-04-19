import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { createUser, setCurrentUser } from "@/lib/storage";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!email || !username || !password) {
      toast({
        title: "Ошибка",
        description: "Все поля должны быть заполнены",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Ошибка",
        description: "Пароли не совпадают",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Simulate email verification
    setTimeout(() => {
      const user = createUser(email, username, password);
      
      if (!user) {
        toast({
          title: "Ошибка",
          description: "Пользователь с таким email уже существует",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      setCurrentUser(user);
      
      if (user.emailVerified) {
        toast({
          title: "Регистрация успешна",
          description: "Вы зарегистрированы как администратор с полным доступом",
        });
        navigate("/");
      } else {
        toast({
          title: "Регистрация успешна",
          description: "На вашу почту отправлено письмо для подтверждения аккаунта",
        });
        navigate("/verify-email");
      }
      
      setLoading(false);
    }, 1500);
  };

  return (
    <Layout>
      <div className="flex justify-center items-center my-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Регистрация</CardTitle>
            <CardDescription>
              Создайте аккаунт для доступа к материалам SCE Foundation
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <Alert variant="default" className="bg-sce-card border-sce-primary">
                <AlertDescription>
                  Первый зарегистрированный пользователь автоматически получает права администратора
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@sce.org"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Имя пользователя</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Исследователь"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Подтвердите пароль</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="********"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Регистрация..." : "Зарегистрироваться"}
              </Button>
              <p className="text-sm text-center text-sce-muted">
                Уже есть аккаунт?{" "}
                <Link to="/login" className="text-sce-primary hover:underline">
                  Войти
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default Register;