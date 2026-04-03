import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Webhook } from "lucide-react";

interface WebhookItem {
  id: string;
  url: string;
  events: string[];
  createdAt: string;
}

const availableEvents = ["screenshot.completed", "screenshot.failed", "usage.limit_reached"];

export function WebhookSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newUrl, setNewUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const { data: webhooks = [], isLoading } = useQuery<WebhookItem[]>({
    queryKey: ["webhooks"],
    queryFn: () => api("/api/developer/webhooks"),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      api("/api/developer/webhooks", {
        method: "POST",
        body: JSON.stringify({ url: newUrl, events: selectedEvents }),
      }),
    onSuccess: () => {
      setNewUrl("");
      setSelectedEvents([]);
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      toast({ title: "Webhook created" });
    },
    onError: (err: Error) => {
      toast({ variant: "destructive", title: "Failed to create webhook", description: err.message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      api(`/api/developer/webhooks/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      toast({ title: "Webhook deleted" });
    },
  });

  const toggleEvent = (event: string) => {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Webhooks</CardTitle>
        <CardDescription>Receive real-time notifications for API events</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Input
            placeholder="https://your-server.com/webhook"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="max-w-lg"
          />
          <div className="flex flex-wrap gap-2">
            {availableEvents.map((event) => (
              <Button
                key={event}
                variant={selectedEvents.includes(event) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleEvent(event)}
              >
                {event}
              </Button>
            ))}
          </div>
          <Button
            onClick={() => createMutation.mutate()}
            disabled={!newUrl.trim() || selectedEvents.length === 0 || createMutation.isPending}
          >
            <Plus className="mr-1 h-4 w-4" /> Add Webhook
          </Button>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading webhooks…</p>
        ) : webhooks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No webhooks configured.</p>
        ) : (
          <div className="space-y-2">
            {webhooks.map((wh) => (
              <div key={wh.id} className="flex items-center justify-between rounded-md border p-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Webhook className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium truncate">{wh.url}</p>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {wh.events.map((ev) => (
                      <span key={ev} className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteMutation.mutate(wh.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
