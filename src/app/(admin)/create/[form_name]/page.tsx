import {
  FORMS_DETAILS,
  renderForm,
} from "@/lib/helpers/render-form-dynamically";
import { requireAdmin } from "@/lib/auth/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function CreatePage(
  props: PageProps<"/create/[form_name]">
) {
  try {
    await requireAdmin();
  } catch (error) {
    redirect("/auth/signin");
  }
  const form_name = (await props.params).form_name;
  const formInfo = FORMS_DETAILS.find((m) => m.name == form_name);

  if (!formInfo) {
    notFound();
  }

  return (
    <div>
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg  font-medium text-foreground">
                {formInfo.title}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {formInfo.description}
              </p>
            </div>
            <Link
              href="/dashboard"
              className="hover:underline underline-offset-1"
            >
              Go back
            </Link>
          </div>
        </div>
      </div>
      <div className="py-8">{renderForm(formInfo.name)}</div>
    </div>
  );
}
