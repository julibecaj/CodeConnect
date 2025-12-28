import Link from "next/link";
import AppShell from "../../../components/AppShell";
import { Card, EmptyState, Section } from "../../../components/ui";

const projects = [
  { title: "Realtime Presence API", stack: "Next.js · Edge · Redis", status: "Published" },
  { title: "AI Pairing Assistant", stack: "React · LangChain", status: "In review" },
  { title: "Design Tokens Sync", stack: "Figma · CI · TS", status: "Draft" },
];

export default function ProjectsPage() {
  return (
    <AppShell
      title="Projects"
      subtitle="Ship small, share fast. Create a new project or update drafts."
      action={<Link className="cc-pillbtn cc-pillbtn--primary" href="#">New project</Link>}
    >
      <Section title="Filters" description="Narrow by status or stack.">
        <div className="cc-grid cc-grid--three">
          <Card tone="muted">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="cc-pillbtn cc-pillbtn--primary" type="button">All</button>
              <button className="cc-pillbtn" type="button">Published</button>
              <button className="cc-pillbtn" type="button">Drafts</button>
              <button className="cc-pillbtn" type="button">In review</button>
            </div>
          </Card>
          <Card tone="muted">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="cc-pillbtn" type="button">Web</button>
              <button className="cc-pillbtn" type="button">AI</button>
              <button className="cc-pillbtn" type="button">Systems</button>
              <button className="cc-pillbtn" type="button">DX</button>
            </div>
          </Card>
          <Card tone="muted">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="cc-pillbtn" type="button">Sort: Latest</button>
              <button className="cc-pillbtn" type="button">Sort: Popular</button>
            </div>
          </Card>
        </div>
      </Section>

      <Section title="Your projects">
        <div className="cc-grid cc-grid--two">
          {projects.map((proj) => (
            <Card
              key={proj.title}
              title={proj.title}
              action={<span className="cc-tag"><span className="cc-dot" />{proj.status}</span>}
            >
              <p className="cc-section__desc">{proj.stack}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <Link className="cc-pillbtn" href="#">View</Link>
                <Link className="cc-pillbtn" href="#">Edit</Link>
              </div>
            </Card>
          ))}
        </div>

        <Card>
          <EmptyState
            title="Want to add more?"
            description="Create a new project card and share it with the community."
            action={<Link className="cc-pillbtn cc-pillbtn--primary" href="#">Create project</Link>}
          />
        </Card>
      </Section>
    </AppShell>
  );
}
