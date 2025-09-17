import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireAuth } from "@/lib/auth/server";

export default async function SettingsPage() {
  const session = await requireAuth();

  return (
    <div className="">
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-mono font-medium text-foreground">
                Account Settings
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your account preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8">
        <div className="space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={session.user.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  defaultValue={session.user.name || ""}
                />
              </div>

              <Button>Update Profile</Button>
            </CardContent>
          </Card>

          {/* Account Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Password</h3>
                  <p className="text-sm text-muted-foreground">
                    Change your account password
                  </p>
                </div>
                <Button variant="outline">Change Password</Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-destructive rounded-lg">
                <div>
                  <h3 className="font-medium">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
