import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="flex gap-6 mb-8">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-white/5 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-1"
          >
            <Github size={20} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-white/5 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-1"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="mailto:priyankakadirvelv@gmail.com"
            className="p-3 rounded-full bg-white/5 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-1"
          >
            <Mail size={20} />
          </a>
        </div>
        
        <p className="text-muted-foreground text-sm text-center">
          © {new Date().getFullYear()} Priyanka K. Built with React & Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
