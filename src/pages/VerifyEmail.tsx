import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { getCurrentUser, verifyEmail, setCurrentUser } from "@/lib/storage";

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const currentUser = getCurrentUser();

  React.useEffect(() => {
    // Если пользователь не авторизован или его email уже подтвержден, перенаправляем на главную
    if (!currentUser || currentUser.emailVerified) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    setLoading(true);
    
    // Проверяем код подтверждения
    setTimeout(() => {
      const isVerified = verifyEmail(currentUser.id, verificationCode);
      
      if (isVerified) {
        // Обновляем данные пользователя в хранилище
        const updatedUser = {...currentUser, emailVerified: true};
        setCurrentUser(updatedUser);
        
        toast({
          title: "Email подтвержден",
          description: "Ваш аккаунт успешно активирован",
        });
        
        navigate("/");
      } else {
        toast({
          title: "Ошибка",
          description: "Неверный код подтверждения",
          variant: "destructive",
        });
      }
      
      setLoading(false);
    }, 1000);
  };

  const handleResendCode = () => {
    toast({
      title: "Код отправлен",
      description: "Новый код подтверждения отправлен на вашу почту",
    });
  };

  if (!currentUser) {
    return null;
  }

  return (
    <Layout>
      <div className="flex justify-center items-center my-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Подтверждение email</CardTitle>
            <CardDescription>
              Введите код, отправленный на адрес {currentUser.email}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verification-code">Код подтверждения</Label>
                <Input
                  id="verification-code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="ABCDEF"
                  required
                />
              </div>
              <p className="text-sm text-sce-muted">
                Не получили код?{" "}
                <button 
                  type="button" 
                  className="text-sce-primary hover:underline"
                  onClick={handleResendCode}
                >
                  Отправить повторно
                </button>
              </p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Проверка..." : "Подтвердить"}
              </Button>
              <Button type="button" variant="outline" className="w-full" asChild>
                <Link to="/">Подтвердить позже</Link>
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default VerifyEmail;