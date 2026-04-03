import { ApiKeySection } from "@/components/developer/ApiKeySection";
import { WebhookSection } from "@/components/developer/WebhookSection";

export default function Developer() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Developer</h2>
        <p className="text-muted-foreground">API keys, webhooks, and integrations</p>
      </div>
      <ApiKeySection />
      <WebhookSection />
    </div>
  );
}
