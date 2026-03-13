import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogoutButton } from "@/components/sections/logout-button";

export default function SettingsPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Settings & Personalization</h1>
      <Card className="border-white/10 bg-white/5">
        <CardHeader><CardTitle>Profile Management</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Display name</Label>
            <Input className="bg-white/5" placeholder="Your name" defaultValue="Demo User" />
          </div>
          <div className="space-y-2">
            <Label>Unit preference</Label>
            <Select defaultValue="imperial">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="imperial">Imperial</SelectItem>
                <SelectItem value="metric">Metric</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <LogoutButton />
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-white/10 bg-white/5">
          <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Motivational Tone</Label><Select defaultValue="coach"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="aggressive">Aggressive</SelectItem><SelectItem value="encouraging">Encouraging</SelectItem><SelectItem value="disciplined">Disciplined</SelectItem><SelectItem value="coach">Coach-like</SelectItem><SelectItem value="minimal">Minimal</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Preferred Time</Label><Input type="time" defaultValue="07:30" className="bg-white/5" /></div>
            <Toggle label="Workout reminders" defaultChecked />
            <Toggle label="Nutrition reminders" defaultChecked />
            <Toggle label="Check-in reminders" defaultChecked />
            <Toggle label="Milestone reminders" defaultChecked />
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader><CardTitle>Privacy Controls</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Profile visibility</Label><Select defaultValue="private"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="public">Public</SelectItem><SelectItem value="friends">Friends only</SelectItem><SelectItem value="private">Private</SelectItem></SelectContent></Select></div>
            <Toggle label="Friends can view consistency calendar" defaultChecked />
            <Toggle label="Share weekly recap by default" />
            <Toggle label="Profile discoverable" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Toggle({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-white/10 p-3">
      <span className="text-sm text-zinc-300">{label}</span>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
