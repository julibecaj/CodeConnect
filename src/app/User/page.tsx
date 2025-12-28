import Link from "next/link";
import AppShell from "../../../components/AppShell";
import { Avatar, Card, EmptyState, Section, Tabs } from "../../../components/ui";

const posts = [
  { title: "Building a realtime presence API", date: "Dec 20", reads: "1.2k reads" },
  { title: "How I structure monorepos for speed", date: "Dec 14", reads: "980 reads" },
];

const projects = [
  { title: "CodeConnect UI Kit", stack: "Next.js · TypeScript", status: "Published" },
  { title: "Docs automation", stack: "MDX · CI", status: "Draft" },
];

export default function User() {
  return (
    <AppShell
      title="Your profile"
      subtitle="Show what you build, share what you learn, and invite collaborators."
      action={
        <div style={{ display: "flex", gap: 10 }}>
          <Link className="cc-pillbtn" href="/Settings">Settings</Link>
          <Link className="cc-pillbtn cc-pillbtn--primary" href="/Projects">New project</Link>
        </div>
      }
    >
      <Card>
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <Avatar name="Alex Developer" size={72} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <h2 className="cc-section__title" style={{ fontSize: 22 }}>
              Alex Developer
            </h2>
            <p className="cc-section__desc">Full-stack engineer · Loves DX, docs, and developer communities.</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className="cc-tag"><span className="cc-dot" />Open to collabs</span>
              <span className="cc-tag">Web</span>
              <span className="cc-tag">AI</span>
              <span className="cc-tag">Systems</span>
            </div>
          </div>
        </div>
      </Card>

      <Section title="Profile overview">
        <div className="cc-grid cc-grid--three">
          <Card title="Followers" tone="muted"><strong>248</strong> community members</Card>
          <Card title="Posts" tone="muted"><strong>12</strong> tutorials & write-ups</Card>
          <Card title="Projects" tone="muted"><strong>6</strong> shipped builds</Card>
        </div>
      </Section>

      <Section title="Content">
        <Tabs
          tabs={[
            {
              id: "posts",
              label: "Posts",
              content: (
                <Card>
                  <ul className="cc-list">
                    {posts.map((post) => (
                      <li key={post.title} className="cc-list__item">
                        <div className="cc-list__meta">
                          <span className="cc-list__title">{post.title}</span>
                          <span className="cc-list__sub">{post.date} · {post.reads}</span>
                        </div>
                        <Link className="cc-auth__link" href="#">Edit</Link>
                      </li>
                    ))}
                  </ul>
                </Card>
              ),
            },
            {
              id: "projects",
              label: "Projects",
              content: (
                <Card>
                  <ul className="cc-list">
                    {projects.map((proj) => (
                      <li key={proj.title} className="cc-list__item">
                        <div className="cc-list__meta">
                          <span className="cc-list__title">{proj.title}</span>
                          <span className="cc-list__sub">{proj.stack}</span>
                        </div>
                        <span className="cc-tag">
                          <span className="cc-dot" />
                          {proj.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ),
            },
            {
              id: "about",
              label: "About",
              content: (
                <Card>
                  <p className="cc-section__desc">
                    I’m building CodeConnect to make sharing and learning as fast as shipping code. Ping me for
                    collabs around developer tools, docs, or real-time systems.
                  </p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <Link className="cc-pillbtn" href="#">Portfolio</Link>
                    <Link className="cc-pillbtn" href="#">GitHub</Link>
                    <Link className="cc-pillbtn" href="#">LinkedIn</Link>
                  </div>
                </Card>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Activity">
        <Card>
          <EmptyState
            title="No recent activity"
            description="When you publish posts or projects, they’ll show up here."
            action={<Link className="cc-pillbtn cc-pillbtn--primary" href="/Projects">Start a project</Link>}
          />
        </Card>
      </Section>
    </AppShell>
  );
}
