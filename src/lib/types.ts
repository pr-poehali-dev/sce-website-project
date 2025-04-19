export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: Date;
}

export enum UserRole {
  ADMIN = "ADMIN",
  RESEARCHER = "RESEARCHER",
  READER = "READER",
}

export interface SCEObject {
  id: string;
  number: string;
  name: string;
  objectClass: ObjectClass;
  description: string;
  containment: string;
  additionalInfo?: string;
  createdAt: Date;
  createdBy: string;
}

export enum ObjectClass {
  SAFE = "SAFE",
  EUCLID = "EUCLID",
  KETER = "KETER",
  THAUMIEL = "THAUMIEL",
  NEUTRALIZED = "NEUTRALIZED",
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: PostCategory;
  createdAt: Date;
  createdBy: string;
}

export enum PostCategory {
  NEWS = "NEWS",
  RESEARCH = "RESEARCH",
  REPORT = "REPORT",
}

export interface StoredData {
  users: User[];
  objects: SCEObject[];
  posts: Post[];
  nextId: number;
}