import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAuth } from "@/lib/auth/server";
import { DeleteAccountButton } from "@/components/settings-components/delete-account-button";
import { ThemeToggler } from "@/components/settings-components/theme-toggler";
import { UpdateProfileForm } from "@/components/settings-components/update-profile-form";

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
          <UpdateProfileForm user={session.user} />

          <ThemeToggler />

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
                <DeleteAccountButton />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
