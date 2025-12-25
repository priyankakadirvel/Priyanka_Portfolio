import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ... existing seed logic ...

  app.get(api.chat.history.path, async (req, res) => {
    const history = await storage.getChatHistory();
    res.json(history);
  });

  app.post(api.chat.send.path, async (req, res) => {
    try {
      const { message } = api.chat.send.input.parse(req.body);
      
      // Save user message
      await storage.addChatMessage({
        role: "user",
        content: message,
        timestamp: new Date().toISOString()
      });

      // Simple RAG Context Gathering
      const profile = await storage.getPersonalInfo();
      const skills = await storage.getSkills();
      const projects = await storage.getProjects();
      const experience = await storage.getExperience();
      const education = await storage.getEducation();

      const context = `
        You are Priyanka K. Answer the user's questions in the first person ("I", "my", "me").
        Here is your professional background:
        
        Profile: ${JSON.stringify(profile)}
        Skills: ${JSON.stringify(skills)}
        Projects: ${JSON.stringify(projects)}
        Experience: ${JSON.stringify(experience)}
        Education: ${JSON.stringify(education)}
        
        Guidelines:
        - Be professional yet approachable.
        - Answer in the FIRST PERSON as Priyanka.
        - Use Markdown for clear formatting:
          * Use bold text for emphasis.
          * Use bullet points for lists.
          * Use headings (###) for sections.
          * Ensure clear spacing between paragraphs.
        - Use only the provided context. If asked something not in the context, politely say you don't have that information.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: context },
          { role: "user", content: message }
        ]
      });

      const assistantContent = response.choices[0].message.content || "I'm sorry, I couldn't process that.";

      // Save assistant message
      const assistantMessage = await storage.addChatMessage({
        role: "assistant",
        content: assistantContent,
        timestamp: new Date().toISOString()
      });

      res.json(assistantMessage);
    } catch (err) {
      console.error("Chat error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ... existing routes ...

  // Seed Data
  const seedDatabase = async () => {
    const existingInfo = await storage.getPersonalInfo();
    if (!existingInfo) {
      console.log("Seeding database...");
      
      await storage.createPersonalInfo({
        name: "Priyanka K",
        title: "Data Science Graduate | ML & NLP Enthusiast",
        bio: "Motivated Data Science graduate with hands-on experience in Machine Learning, Deep Learning, NLP, and Generative AI. Proficient in Python, SQL, and modern data frameworks to build scalable predictive models, intelligent analytics pipelines, and insight-driven solutions. Strong focus on real-world problem solving through data engineering, advanced modeling, and business-oriented decision support.",
        email: "priyankakadirvelv@gmail.com",
        phone: "+91 6361057943",
        location: "Bangalore, India",
        socialLinks: {
          linkedin: "https://linkedin.com", // Placeholder
          github: "https://github.com" // Placeholder
        }
      });

      await storage.createSkill({
        category: "Programming Languages",
        items: ["Python", "R", "SQL"]
      });
      await storage.createSkill({
        category: "ML/DL Frameworks",
        items: ["TensorFlow", "PyTorch", "Hugging Face", "Scikit-learn", "Keras"]
      });
      await storage.createSkill({
        category: "Analytics",
        items: ["IoT Analytics", "Big Data Analytics", "Geospatial Analytics", "AWS"]
      });
      await storage.createSkill({
        category: "Visualization",
        items: ["PowerBI", "Matplotlib", "Seaborn", "Excel", "QGIS"]
      });
      await storage.createSkill({
        category: "Databases & Tools",
        items: ["PostgreSQL", "MongoDB", "MySQL"]
      });

      await storage.createExperience({
        title: "NLP Research Intern",
        company: "Central University of Tamil Nadu",
        duration: "Manuscript under review",
        description: "Proposed an adaptive QA evaluation metric by optimizing five scoring measures (BERTScore, BLEU, Entailment, Perplexity, Contrastive Penalty) using Genetic Algorithm and Grey Wolf Optimizer on SQuAD v2.0. Improved alignment with human judgment by 15.7% and achieved 3.3× faster optimization using GWO; implemented the full Python pipeline with Hugging Face."
      });

      await storage.createProject({
        title: "QADS – Question Answering Chatbot for Data Science Learners",
        description: "Built a production-ready Retrieval-Augmented Generation (RAG) chatbot using FastAPI, LangChain, Pinecone, and Cohere embeddings to deliver grounded answers in the Data Science domain. Integrated Groq LLM for low-latency inference with domain-first retrieval and SerpAPI web-search fallback; deployed the system on Render with a modular backend.",
        techStack: ["FastAPI", "LangChain", "Pinecone", "Cohere", "Groq LLM"],
        githubLink: "#"
      });
      await storage.createProject({
        title: "Retail Customer Purchase Behavior Analysis",
        description: "Built an end-to-end retail analytics pipeline using Python, PostgreSQL to analyze customer purchase behavior, revenue trends, discounts, subscriptions, and shipping preferences. Designed an interactive Power BI dashboard with customer segmentation (New, Returning, Loyal), enabling insights into top-performing products, high-value customer groups, and data-driven marketing decisions.",
        techStack: ["Python", "PostgreSQL", "Power BI"],
        githubLink: "#"
      });
      await storage.createProject({
        title: "Credit Card Risk Analysis",
        description: "Built a Logistic Regression–based credit default prediction model using customer demographic, income, and debt features. Performed EDA and model interpretation to identify key risk drivers such as debt-to-income ratio, employment stability, and repayment behavior for data-driven credit decisions.",
        techStack: ["Logistic Regression", "EDA", "Python"],
        githubLink: "#"
      });
      await storage.createProject({
        title: "Autonomous Data Quality Guardian for Enterprises",
        description: "Designed an autonomous, Dockerized data quality monitoring system that ingests multi-source data, evaluates quality metrics, and applies agentic reasoning to trigger automated or human-in-the-loop actions in real time.",
        techStack: ["Docker", "Data Quality", "Agentic Reasoning"],
        githubLink: "#"
      });

      await storage.createEducation({
        degree: "MSc in Data Science",
        school: "Christ University",
        year: "2024 – 2026",
        gpa: "GPA: 3.76 / 4.0"
      });
      await storage.createEducation({
        degree: "BSc in Computer Science and Statistics",
        school: "St. Claret Autonomous College",
        year: "2021 – 2024",
        gpa: "CGPA: 9.1 / 10"
      });

      console.log("Database seeded!");
    }
  };

  // Run seed
  seedDatabase().then(async () => {
    console.log("Updating skills...");
    await storage.clearSkills();
    await storage.createSkill({ category: "Programming & Core Skills", items: ["Python (NumPy, Pandas, Matplotlib, Seaborn)", "SQL (MySQL, PostgreSQL)"] });
    await storage.createSkill({ category: "Data Analysis & Visualization", items: ["Exploratory Data Analysis (EDA)", "Data Cleaning & Preprocessing", "Statistical Analysis", "Feature Engineering", "Data Visualization (Matplotlib, Seaborn, Plotly)", "Excel (Advanced formulas, Pivot Tables)"] });
    await storage.createSkill({ category: "Machine Learning", items: ["Supervised Learning (Regression, Classification)", "Unsupervised Learning (Clustering, Dimensionality Reduction)", "Model Evaluation (Accuracy, Precision, Recall, F1-score, ROC-AUC)", "Scikit-learn", "Hyperparameter Tuning", "Ensemble Learning (Bagging, Boosting, Stacking)"] });
    await storage.createSkill({ category: "Deep Learning & Computer Vision", items: ["Neural Networks (ANN, CNN)", "Transfer Learning (ResNet, MobileNet, ViT, Swin Transformer)", "PyTorch", "TensorFlow / Keras", "Image Classification & Feature Extraction", "Custom Dataset & DataLoader implementation"] });
    await storage.createSkill({ category: "Generative AI & NLP", items: ["Large Language Models (LLMs) – Concepts", "Prompt Engineering", "Retrieval-Augmented Generation (RAG)", "LangChain, LangGraph", "Hugging Face Transformers", "Text Embeddings & Vector Search"] });
    await storage.createSkill({ category: "Backend & API Development", items: ["FastAPI", "REST API Development", "Pydantic Models", "API Integration", "Authentication Basics"] });
    await storage.createSkill({ category: "Databases & Storage", items: ["MongoDB", "SQLite", "Vector Databases (Pinecone – basics)", "Data Modeling"] });
    await storage.createSkill({ category: "Cloud & DevOps", items: ["AWS (EC2, S3 – basics)", "Docker (Containerization)", "Git & GitHub (Version Control)", "CI/CD Basics", "Environment & Dependency Management"] });
    await storage.createSkill({ category: "MLOps & Deployment (Foundational)", items: ["Model Versioning", "Experiment Tracking (concepts)", "Model Deployment (API-based)", "Monitoring & Logging (basic understanding)"] });
    await storage.createSkill({ category: "Tools & Platforms", items: ["Jupyter Notebook", "Google Colab", "VS Code", "Streamlit", "QGIS (Geospatial Analysis – basics)", "Databricks (conceptual exposure)"] });
    await storage.createSkill({ category: "Optimization & Advanced Topics", items: ["Metaheuristic Optimization (MFO, PSO – custom implementation)", "Hybrid Optimization Techniques", "Transformer-based Architectures"] });
    await storage.createSkill({ category: "Soft Technical Strengths", items: ["Technical Documentation", "Research Paper Writing", "Problem Solving", "Debugging & Error Analysis", "Presentation & Explanation of ML Systems"] });
    console.log("Skills updated!");
  }).catch(err => console.error("Error seeding database:", err));

  app.get(api.profile.get.path, async (req, res) => {
    const info = await storage.getPersonalInfo();
    res.json(info || {});
  });

  app.get(api.skills.list.path, async (req, res) => {
    const skills = await storage.getSkills();
    res.json(skills);
  });

  app.get(api.experience.list.path, async (req, res) => {
    const experience = await storage.getExperience();
    res.json(experience);
  });

  app.get(api.projects.list.path, async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get(api.education.list.path, async (req, res) => {
    const education = await storage.getEducation();
    res.json(education);
  });

  app.post(api.contact.submit.path, async (req, res) => {
    // In a real app, this would send an email
    // For now, just log it
    console.log("Contact form submission:", req.body);
    res.json({ success: true, message: "Message received!" });
  });

  return httpServer;
}
