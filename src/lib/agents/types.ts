export type AgentId =
  | "career-strategist"
  | "application-writer"
  | "learning-coach"
  | "portfolio-reviewer"
  | "interview-coach";

export type AgentInfo = {
  id: AgentId;
  nombre: string;
  descripcion: string;
  prompt: string;
};
