import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { authenticateUser, setCurrentUser } from "@/lib/storage";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      toast({
        title: "Ошибка",
        description: "Все поля должны быть заполнены",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const user = authenticateUser(email, password);
      
      if (!user) {
        toast({
          title: "Ошибка аутентификации",
          description: "Неверный email или пароль",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      setCurrentUser(user);
      
      toast({
        title: "Успешный вход",
        description: user.role === "ADMIN" 
          ? "Вы вошли как администратор с полным доступом"
          : "Вы успешно вошли в систему",
      });
      
      if (!user.emailVerified && user.role !== "ADMIN") {
        navigate("/verify-email");
      } else {
        navigate("/");
      }
      
      setLoading(false);
    }, 1000);
  };

  return (
    <Layout>
      <div className="flex justify-center items-center my-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Вход в систему</CardTitle>
            <CardDescription>
              Авторизуйтесь для доступа к материалам SCE Foundation
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
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
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Вход..." : "Войти"}
              </Button>
              <p className="text-sm text-center text-sce-muted">
                Нет аккаунта?{" "}
                <Link to="/register" className="text-sce-primary hover:underline">
                  Зарегистрироваться
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;