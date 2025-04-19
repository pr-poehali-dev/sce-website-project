import React from "react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { getCurrentUser, setCurrentUser } from "@/lib/storage";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [currentUser, setCurrentUserState] = React.useState<User | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    setCurrentUserState(getCurrentUser());
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserState(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-sce-background">
      <header className="bg-sce-card shadow-md">
        <div className="container mx-auto py-4 px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img
                src="/placeholder.svg"
                alt="SCE Logo"
                className="w-12 h-12 mr-4"
              />
              <div>
                <h1 className="sce-logo">SCE Foundation</h1>
                <p className="text-sce-muted text-sm">Secure. Control. Explore.</p>
              </div>
            </div>
            <nav className="flex flex-wrap gap-4 justify-center">
              <Link to="/" className="text-sce-accent hover:text-sce-primary font-medium">
                Главная
              </Link>
              <Link to="/objects" className="text-sce-accent hover:text-sce-primary font-medium">
                Объекты SCE
              </Link>
              <Link to="/posts" className="text-sce-accent hover:text-sce-primary font-medium">
                Материалы
              </Link>
              <Link to="/about" className="text-sce-accent hover:text-sce-primary font-medium">
                О нас
              </Link>
              {currentUser?.role === "ADMIN" && (
                <Link to="/admin" className="text-sce-accent hover:text-sce-primary font-medium">
                  Панель администратора
                </Link>
              )}
            </nav>
            <div className="mt-4 md:mt-0 flex gap-2">
              {currentUser ? (
                <>
                  <span className="text-sce-muted text-sm mr-2">
                    {currentUser.username} ({currentUser.role})
                    {!currentUser.emailVerified && currentUser.role !== "ADMIN" && (
                      <span className="text-red-500 ml-1">(Не подтвержден)</span>
                    )}
                  </span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Выйти
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/login">Войти</Link>
                  </Button>
                  <Button variant="default" size="sm" asChild>
                    <Link to="/register">Регистрация</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <Separator />
      <main className="flex-grow container mx-auto py-8 px-6">
        {children}
      </main>
      <Separator />
      <footer className="bg-sce-secondary text-white py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">SCE Foundation</h3>
              <p className="text-sm text-gray-300">
                Организация, занимающаяся задержанием аномалий, исследованием и контролем.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Ссылки</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-sm text-gray-300 hover:text-white">
                    Главная
                  </Link>
                </li>
                <li>
                  <Link to="/objects" className="text-sm text-gray-300 hover:text-white">
                    Объекты SCE
                  </Link>
                </li>
                <li>
                  <Link to="/posts" className="text-sm text-gray-300 hover:text-white">
                    Материалы
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-sm text-gray-300 hover:text-white">
                    О нас
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Юридическая информация</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className="text-sm text-gray-300 hover:text-white">
                    Политика конфиденциальности
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm text-gray-300 hover:text-white">
                    Условия использования
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} SCE Foundation. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;