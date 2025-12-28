import AppShell from "../../../components/AppShell";
import { Card, Section } from "../../../components/ui";

export default function SettingsPage() {
  return (
    <AppShell
      title="Settings"
      subtitle="Manage your account, profile, notifications, and security."
    >
      <Section title="Profile">
        <Card>
          <div className="cc-formgrid cc-formgrid--two">
            <div className="cc-field">
              <label htmlFor="name">Name</label>
              <input id="name" className="cc-input" placeholder="Your name" />
            </div>
            <div className="cc-field">
              <label htmlFor="title">Title</label>
              <input id="title" className="cc-input" placeholder="e.g. Full-stack engineer" />
            </div>
            <div className="cc-field" style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="bio">Bio</label>
              <textarea id="bio" className="cc-input" rows={3} placeholder="Tell the community about yourself" />
              <p className="cc-formhint">Keep it concise and highlight what you’re building or looking for.</p>
            </div>
            <div className="cc-field">
              <label htmlFor="website">Website</label>
              <input id="website" className="cc-input" placeholder="https://..." />
            </div>
            <div className="cc-field">
              <label htmlFor="github">GitHub</label>
              <input id="github" className="cc-input" placeholder="github.com/you" />
            </div>
          </div>
        </Card>
      </Section>

      <Section title="Account">
        <Card>
          <div className="cc-formgrid cc-formgrid--two">
            <div className="cc-field">
              <label htmlFor="email">Email</label>
              <input id="email" className="cc-input" type="email" placeholder="name@email.com" />
            </div>
            <div className="cc-field">
              <label htmlFor="password">Password</label>
              <input id="password" className="cc-input" type="password" placeholder="••••••••" />
            </div>
          </div>
        </Card>
      </Section>

      <Section title="Notifications">
        <Card>
          <div className="cc-formgrid">
            <label>
              <input type="checkbox" defaultChecked /> Product updates
            </label>
            <label>
              <input type="checkbox" defaultChecked /> Comments and feedback
            </label>
            <label>
              <input type="checkbox" /> Weekly digest
            </label>
          </div>
        </Card>
      </Section>

      <Section title="Security">
        <Card>
          <div className="cc-formgrid">
            <div>
              <strong>Two-factor authentication</strong>
              <p className="cc-formhint">Add a second step to keep your account safe.</p>
            </div>
            <button className="cc-pillbtn cc-pillbtn--primary" type="button">Enable 2FA</button>
          </div>
        </Card>
      </Section>

      <Section title="Danger zone">
        <Card tone="muted">
          <div className="cc-formgrid cc-formgrid--two" style={{ alignItems: "center" }}>
            <div>
              <strong>Delete account</strong>
              <p className="cc-formhint">This cannot be undone. All content will be removed.</p>
            </div>
            <button className="cc-pillbtn" type="button">Delete</button>
          </div>
        </Card>
      </Section>
    </AppShell>
  );
}
