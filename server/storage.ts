import { personalInfo, skills, experience, projects, education, chatMessages } from "@shared/schema";
import { type PersonalInfo, type Skill, type Experience, type Project, type Education, type ChatMessage, type InsertChatMessage } from "@shared/schema";
import { type InsertPersonalInfo, type InsertSkill, type InsertExperience, type InsertProject, type InsertEducation } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getPersonalInfo(): Promise<PersonalInfo | undefined>;
  createPersonalInfo(info: any): Promise<PersonalInfo>; // Using any for simplicity in seed, ideally InsertPersonalInfo
  getSkills(): Promise<Skill[]>;
  createSkill(skill: any): Promise<Skill>;
  clearSkills(): Promise<void>;
  getExperience(): Promise<Experience[]>;
  createExperience(exp: any): Promise<Experience>;
  getProjects(): Promise<Project[]>;
  createProject(proj: any): Promise<Project>;
  getEducation(): Promise<Education[]>;
  createEducation(edu: any): Promise<Education>;
  getChatHistory(): Promise<ChatMessage[]>;
  addChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class DatabaseStorage implements IStorage {
  async getPersonalInfo(): Promise<PersonalInfo | undefined> {
    const result = await db.select().from(personalInfo).limit(1);
    return result[0];
  }

  async createPersonalInfo(info: any): Promise<PersonalInfo> {
    const [result] = await db.insert(personalInfo).values(info).returning();
    return result;
  }

  async getSkills(): Promise<Skill[]> {
    return await db.select().from(skills);
  }

  async createSkill(skill: any): Promise<Skill> {
    const [result] = await db.insert(skills).values(skill).returning();
    return result;
  }

  async clearSkills(): Promise<void> {
    await db.delete(skills);
  }

  async getExperience(): Promise<Experience[]> {
    return await db.select().from(experience);
  }

  async createExperience(exp: any): Promise<Experience> {
    const [result] = await db.insert(experience).values(exp).returning();
    return result;
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async createProject(proj: any): Promise<Project> {
    const [result] = await db.insert(projects).values(proj).returning();
    return result;
  }

  async getEducation(): Promise<Education[]> {
    return await db.select().from(education);
  }

  async createEducation(edu: any): Promise<Education> {
    const [result] = await db.insert(education).values(edu).returning();
    return result;
  }

  async getChatHistory(): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages);
  }

  async addChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [result] = await db.insert(chatMessages).values(message).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
