import { User, SCEObject, Post, UserRole, StoredData, ObjectClass, PostCategory } from "./types";

const STORAGE_KEY = "sce_foundation_data";

const getInitialData = (): StoredData => {
  return {
    users: [],
    objects: [],
    posts: [],
    nextId: 1,
  };
};

export const getStoredData = (): StoredData => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    const initialData = getInitialData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
  
  try {
    const parsedData = JSON.parse(data);
    
    // Convert string dates to Date objects
    if (parsedData.users) {
      parsedData.users = parsedData.users.map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt),
      }));
    }
    
    if (parsedData.objects) {
      parsedData.objects = parsedData.objects.map((obj: any) => ({
        ...obj,
        createdAt: new Date(obj.createdAt),
      }));
    }
    
    if (parsedData.posts) {
      parsedData.posts = parsedData.posts.map((post: any) => ({
        ...post,
        createdAt: new Date(post.createdAt),
      }));
    }
    
    return parsedData;
  } catch (error) {
    console.error("Error parsing stored data:", error);
    const initialData = getInitialData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
};

export const saveStoredData = (data: StoredData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Имитация отправки письма для верификации
export const sendVerificationEmail = (email: string, verificationCode: string): Promise<boolean> => {
  return new Promise((resolve) => {
    console.log(`Sending verification email to ${email} with code ${verificationCode}`);
    // В реальном приложении здесь было бы API для отправки писем
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};

export const createUser = (email: string, username: string, password: string): User | null => {
  const data = getStoredData();
  
  // Проверяем, существует ли пользователь с таким email
  if (data.users.some(user => user.email === email)) {
    return null;
  }
  
  // Первый зарегистрированный пользователь получает роль администратора
  const isFirstUser = data.users.length === 0;
  const role = isFirstUser ? UserRole.ADMIN : UserRole.READER;
  
  const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  const newUser: User = {
    id: `user_${data.nextId++}`,
    email,
    username,
    role,
    emailVerified: isFirstUser, // Для первого пользователя сразу подтверждаем email
    createdAt: new Date(),
  };
  
  // Сохраняем пароль отдельно для безопасности (в реальном приложении был бы хеш)
  localStorage.setItem(`sce_user_password_${newUser.id}`, password);
  
  // Сохраняем код верификации
  if (!isFirstUser) {
    localStorage.setItem(`sce_verification_code_${newUser.id}`, verificationCode);
    sendVerificationEmail(email, verificationCode);
  }
  
  data.users.push(newUser);
  saveStoredData(data);
  
  return newUser;
};

export const verifyEmail = (userId: string, code: string): boolean => {
  const storedCode = localStorage.getItem(`sce_verification_code_${userId}`);
  
  if (storedCode !== code) {
    return false;
  }
  
  const data = getStoredData();
  const user = data.users.find(u => u.id === userId);
  
  if (!user) {
    return false;
  }
  
  user.emailVerified = true;
  saveStoredData(data);
  
  // Удаляем использованный код верификации
  localStorage.removeItem(`sce_verification_code_${userId}`);
  
  return true;
};

export const authenticateUser = (email: string, password: string): User | null => {
  const data = getStoredData();
  const user = data.users.find(u => u.email === email);
  
  if (!user) {
    return null;
  }
  
  const storedPassword = localStorage.getItem(`sce_user_password_${user.id}`);
  if (storedPassword !== password) {
    return null;
  }
  
  return user;
};

export const getCurrentUser = (): User | null => {
  const userId = localStorage.getItem("sce_current_user");
  if (!userId) {
    return null;
  }
  
  const data = getStoredData();
  return data.users.find(u => u.id === userId) || null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem("sce_current_user", user.id);
  } else {
    localStorage.removeItem("sce_current_user");
  }
};

export const createSCEObject = (
  number: string,
  name: string,
  objectClass: string,
  description: string,
  containment: string,
  additionalInfo?: string
): SCEObject | null => {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== UserRole.ADMIN) {
    return null;
  }
  
  const data = getStoredData();
  
  const newObject: SCEObject = {
    id: `object_${data.nextId++}`,
    number,
    name,
    objectClass: objectClass as ObjectClass,
    description,
    containment,
    additionalInfo,
    createdAt: new Date(),
    createdBy: currentUser.id,
  };
  
  data.objects.push(newObject);
  saveStoredData(data);
  
  return newObject;
};

export const createPost = (
  title: string,
  content: string,
  category: string
): Post | null => {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== UserRole.ADMIN) {
    return null;
  }
  
  const data = getStoredData();
  
  const newPost: Post = {
    id: `post_${data.nextId++}`,
    title,
    content,
    category: category as PostCategory,
    createdAt: new Date(),
    createdBy: currentUser.id,
  };
  
  data.posts.push(newPost);
  saveStoredData(data);
  
  return newPost;
};

export const getAllSCEObjects = (): SCEObject[] => {
  const data = getStoredData();
  return data.objects;
};

export const getSCEObjectById = (id: string): SCEObject | undefined => {
  const data = getStoredData();
  return data.objects.find(obj => obj.id === id);
};

export const getAllPosts = (): Post[] => {
  const data = getStoredData();
  return data.posts;
};

export const getPostById = (id: string): Post | undefined => {
  const data = getStoredData();
  return data.posts.find(post => post.id === id);
};

export const updateUserRole = (userId: string, newRole: UserRole): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== UserRole.ADMIN) {
    return false;
  }
  
  const data = getStoredData();
  const userToUpdate = data.users.find(u => u.id === userId);
  
  if (!userToUpdate) {
    return false;
  }
  
  userToUpdate.role = newRole;
  saveStoredData(data);
  
  return true;
};

export const getAllUsers = (): User[] => {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== UserRole.ADMIN) {
    return [];
  }
  
  const data = getStoredData();
  return data.users;
};